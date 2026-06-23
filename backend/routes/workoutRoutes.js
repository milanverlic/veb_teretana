const express = require('express');
const router = express.Router();
const { getWorkouts, createWorkout } = require('../controllers/workoutController');

// Povezujemo rute sa funkcijama
router.route('/')
  .get(getWorkouts)
  .post(createWorkout);

module.exports = router;
// @desc    Preuzmi poslednji rezultat za specifičnu vežbu ulogovanog korisnika
// @route   GET /api/workouts/previous/:userId/:exerciseId
router.get('/previous/:userId/:exerciseId', async (req, res) => {
  try {
    const { userId, exerciseId } = req.params;
    
    // Tražimo poslednji završeni trening ovog korisnika koji sadrži ovu vežbu
    const lastWorkout = await Workout.findOne({
      user: userId,
      'exercises.exercise': exerciseId
    }).sort({ createdAt: -1 }); // Sortiramo od najnovijeg

    if (!lastWorkout) {
      return res.status(200).json({ success: true, data: null });
    }

    // Izvlačimo serije za tu konkretnu vežbu
    const targetExercise = lastWorkout.exercises.find(e => e.exercise.toString() === exerciseId);
    
    res.status(200).json({ success: true, data: targetExercise.sets });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});