const Exercise = require('../models/Exercise');

// @desc    Preuzmi sve vežbe iz baze (SORTIRANO: Najnovije kastom vežbe idu prve)
// @route   GET /api/exercises
exports.getExercises = async (req, res) => {
  try {
    // Sortiramo po 'createdAt' unazad (-1) tako da se nove kreirane vežbe odmah vide na vrhu
    const exercises = await Exercise.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: exercises.length, data: exercises });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Preuzmi jednu vežbu po ID-ju
// @route   GET /api/exercises/:id
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ success: false, error: 'Vežba nije pronađena.' });
    }
    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Nevalidan ID vežbe.' });
  }
};

// @desc    Kreiraj novu kastom vežbu
// @route   POST /api/exercises
exports.createExercise = async (req, res) => {
  try {
    const { name, category, description, imageUrl, userId } = req.body;

    const exerciseExists = await Exercise.findOne({ name });
    if (exerciseExists) {
      return res.status(400).json({ success: false, error: 'Vežba sa tim nazivom već postoji.' });
    }

    // Mapiramo prosleđeni userId na polje 'user' u MongoDB bazi
    const exercise = await Exercise.create({
      name,
      category,
      description,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=500&auto=format&fit=crop',
      user: userId || null
    });

    res.status(201).json({ success: true, data: exercise });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Obriši kastom vežbu
// @route   DELETE /api/exercises/:id
exports.deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ success: false, error: 'Vežba nije pronađena.' });
    }

    if (!exercise.user) {
      return res.status(403).json({ success: false, error: 'Sistemske vežbe ne mogu biti obrisane.' });
    }

    await exercise.deleteOne();
    res.status(200).json({ success: true, message: 'Vežba uspešno obrisana.' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};