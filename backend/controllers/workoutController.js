const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');

// @desc    Sačuvaj završen trening (Samo odrađene serije)
// @route   POST /api/workouts
exports.createWorkout = async (req, res) => {
  try {
    const { user, title, duration, exercises } = req.body;

    if (!user) {
      return res.status(401).json({ success: false, error: 'Morate biti ulogovani da biste sačuvali trening.' });
    }

    // Prolazimo kroz vežbe i filtriramo samo odrađene serije
    const formattedExercises = [];

    for (const ex of exercises) {
      // Filtriramo samo serije koje imaju done: true
      const doneSets = ex.sets
        .filter(s => s.done === true)
        .map(s => ({
          weight: Number(s.weight) || 0,
          reps: Number(s.reps) || 0
        }));

      // Ako vežba ima bar jednu odrađenu seriju, ubacujemo je u trening
      if (doneSets.length > 0) {
        try {
          const foundEx = await Exercise.findById(ex.exercise);
          formattedExercises.push({
            exercise: ex.exercise || null,
            name: foundEx ? foundEx.name : (ex.name || 'Kastom Vežba'),
            sets: doneSets
          });
        } catch (err) {
          formattedExercises.push({
            exercise: ex.exercise || null,
            name: ex.name || 'Kastom Vežba',
            sets: doneSets
          });
        }
      }
    }

    if (formattedExercises.length === 0) {
      return res.status(400).json({ success: false, error: 'Nemate nijednu odrađenu (otkačenu) seriju na treningu.' });
    }

    const workout = await Workout.create({
      user,
      title: title || `Trening - ${duration}`,
      duration,
      exercises: formattedExercises
    });

    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Preuzmi sve treninge ulogovanog korisnika za Istoriju
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
      (e) => e.exercise && e.exercise.toString() === exerciseId
    );

    res.status(200).json({ success: true, data: targetExercise ? targetExercise.sets : null });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};