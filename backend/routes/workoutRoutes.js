const express = require('express');
const router = express.Router();
const { getWorkouts, createWorkout } = require('../controllers/workoutController');

// Povezujemo rute sa funkcijama
router.route('/')
  .get(getWorkouts)
  .post(createWorkout);

module.exports = router;