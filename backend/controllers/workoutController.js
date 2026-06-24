const Workout = require('../models/Workout');
const mongoose = require('mongoose');

// @desc    Kreiraj novi trening i sačuvaj u bazu
// @route   POST /api/workouts
exports.createWorkout = async (req, res) => {
  try {
    const { userId, title, duration, exercises } = req.body;

    // 1. Izvlačenje čistog string ID-ja bez obzira da li je stigao objekat ili string
    let rawUserId = userId;
    if (userId && typeof userId === 'object') {
      rawUserId = userId.id || userId._id;
    }

    // 2. Provera validnosti ObjectId-ja
    if (!rawUserId || rawUserId === 'null' || rawUserId === 'undefined' || !mongoose.Types.ObjectId.isValid(rawUserId.toString())) {
      return res.status(401).json({ 
        success: false, 
        error: 'Morate biti ulogovani sa validnim nalogom da biste sačuvali trening.' 
      });
    }

    // Prebacujemo ga u čist Mongoose ObjectId da model ne bi pravio problem
    const cleanUserId = new mongoose.Types.ObjectId(rawUserId.toString());

    if (!exercises || exercises.length === 0) {
      return res.status(400).json({ success: false, error: 'Trening mora sadržati barem jednu vežbu.' });
    }

    // 3. Kreiranje zapisa tačno po tvom modelu zalepljenom maločas
    const newWorkout = await Workout.create({
      user: cleanUserId,
      title: title || 'Trening Snage',
      duration: String(duration || '0'), // Osiguravamo da je string
      exercises: exercises.map(ex => ({
        exercise: new mongoose.Types.ObjectId(ex.exercise.toString()),
        name: ex.name || 'Vežba',
        sets: ex.sets.map(s => ({
          weight: Number(s.weight),
          reps: Number(s.reps)
        }))
      }))
    });

    console.log('✅ Trening uspešno upisan u MongoDB Atlas:', newWorkout._id);
    return res.status(201).json({ success: true, data: newWorkout });

  } catch (error) {
    console.error('❌ Greška pri kreiranju treninga na backendu:', error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Preuzmi sve treninge za određenog korisnika
// @route   GET /api/workouts/user/:userId
exports.getUserWorkouts = async (req, res) => {
  try {
    let { userId } = req.params;

    if (!userId || userId === 'null' || userId === 'undefined' || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json({ success: true, data: [] });
    }

    const workouts = await Workout.find({ user: new mongoose.Types.ObjectId(userId) })
      .populate('exercises.exercise') // Popunjavamo preko ispravnog polja 'exercise' iz tvog modela
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: workouts });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Preuzmi poslednje serije/kilograme za specifičnu vežbu korisnika
// @route   GET /api/workouts/previous/:userId/:exerciseId
exports.getPreviousExerciseInfo = async (req, res) => {
  try {
    const { userId, exerciseId } = req.params;

    if (!userId || userId === 'null' || exerciseId === 'null' || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(200).json({ success: true, data: null });
    }

    const lastWorkout = await Workout.findOne({
      user: new mongoose.Types.ObjectId(userId),
      'exercises.exercise': new mongoose.Types.ObjectId(exerciseId)
    }).sort({ createdAt: -1 });

    if (!lastWorkout) {
      return res.status(200).json({ success: true, data: null });
    }

    const specificExercise = lastWorkout.exercises.find(
      ex => ex.exercise.toString() === exerciseId.toString()
    );

    return res.status(200).json({
      success: true,
      data: specificExercise ? specificExercise.sets : null
    });
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};