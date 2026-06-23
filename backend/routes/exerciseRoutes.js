const express = require('express');
const router = express.Router();
const { 
  getExercises, 
  getExerciseById, 
  createExercise, 
  deleteExercise 
} = require('../controllers/exerciseController');

// Standardno mapiranje ruta - čisto i bez greške
router.get('/', getExercises);
router.post('/', createExercise);
router.get('/:id', getExerciseById);
router.delete('/:id', deleteExercise);

module.exports = router;