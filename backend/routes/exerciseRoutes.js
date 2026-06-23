const express = require('express');
const router = express.Router();
const { getExercises } = require('../controllers/exerciseController');

// Kada neko gađa /api/exercises, pokreni funkciju iz kontrolera
router.get('/', getExercises);

module.exports = router;