const Workout = require('../models/Workout');

// @desc    Uzmi sve treninge
// @route   GET /api/workouts
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().populate('user', 'name email');
    res.status(200).json({ success: true, count: workouts.length, data: workouts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Kreiraj novi trening
// @route   POST /api/workouts
exports.createWorkout = async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};