const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// @desc    Sačuvaj završen trening
// @route   POST /api/workouts
exports.createWorkout = async (req, res) => {
  try {
    const { user, duration, exercises } = req.body;

    if (!user) {
      return res.status(401).json({ success: false, error: 'Morate biti ulogovani da biste sačuvali trening.' });
    }

    // Mapiramo i izvlačimo nazive vežbi iz baze kako bismo zadovoljili staru Mongoose validaciju
    const formattedExercises = await Promise.all(
      exercises.map(async (ex) => {
        const foundEx = await Exercise.findById(ex.exercise);
        return {
          exercise: ex.exercise,
          name: foundEx ? foundEx.name : 'Kastom Vežba', // Automatski puni exercises.X.name
          sets: ex.sets
        };
      })
    );

    const workout = await Workout.create({
      user,
      title: `Trening - ${duration}`, // Automatski puni naslov
      duration,
      exercises: formattedExercises
    });

    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Preuzmi sve treninge ulogovanog korisnika za Istoriju
// @route   GET /api/workouts/user/:userId
exports.getUserWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.params.userId })
      .populate('exercises.exercise')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Preuzmi prethodne serije za specifičnu vežbu korisnika
// @route   GET /api/workouts/previous/:userId/:exerciseId
exports.getPreviousExerciseInfo = async (req, res) => {
  try {
    const { userId, exerciseId } = req.params;

    const lastWorkout = await Workout.findOne({
      user: userId,
      'exercises.exercise': exerciseId
    }).sort({ createdAt: -1 });

    if (!lastWorkout) {
      return res.status(200).json({ success: true, data: null });
    }

    const targetExercise = lastWorkout.exercises.find(
      (e) => e.exercise.toString() === exerciseId
    );

    res.status(200).json({ success: true, data: targetExercise ? targetExercise.sets : null });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};