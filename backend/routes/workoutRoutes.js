const express = require('express');
const router = express.Router();
const { 
  createWorkout, 
  getUserWorkouts, 
  getPreviousExerciseInfo 
} = require('../controllers/workoutController');

router.post('/', createWorkout);
router.get('/user/:userId', getUserWorkouts);
router.get('/previous/:userId/:exerciseId', getPreviousExerciseInfo);

module.exports = router;