const Exercise = require('../models/Exercise');

// @desc    Preuzmi sve vežbe iz baze
// @route   GET /api/exercises
exports.getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({});
    res.status(200).json({ success: true, count: exercises.length, data: exercises });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};