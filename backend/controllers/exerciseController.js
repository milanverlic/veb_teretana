const Exercise = require('../models/Exercise');
const User = require('../models/User');

// @desc    Preuzmi sve vežbe (Globalne + Privatne za korisnika)
exports.getExercises = async (req, res) => {
  try {
    const { userId } = req.query;

    let query = { user: null };

    if (userId && userId !== 'null' && userId !== 'undefined') {
      query = {
        $or: [
          { user: null },
          { user: userId }
        ]
      };
    }

    const exercises = await Exercise.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: exercises });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Dodaj novu vežbu
exports.createExercise = async (req, res) => {
  try {
    const { name, category, description, image, userId } = req.body;

    let exerciseUser = null;
    let finalImage = image;

    if (userId) {
      const user = await User.findById(userId);
      
      // Ako NIJE admin nalog, brišemo sliku (samo admin može da je unese) i vezujemo vežbu za njega
      if (!user || user.email !== 'verlicmilan@gmail.com') {
        exerciseUser = userId;
        finalImage = undefined; // Običan korisnik dobija default sliku iz modela
      }
    } else {
      // Ako uopšte nema userId, za svaki slučaj ne dozvoljavamo kastom sliku
      finalImage = undefined;
    }

    const newExercise = await Exercise.create({
      name,
      category,
      description: description || 'Nema opisa.', // Vraćeno polje da ne puca validacija baze
      image: finalImage || undefined,
      user: exerciseUser
    });

    res.status(201).json({ success: true, data: newExercise });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};