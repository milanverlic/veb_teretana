const Post = require('../models/Post');
const Workout = require('../models/Workout');

// @desc    Kreiraj objavu u zajednici
// @route   POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { userId, description, workoutId } = req.body;

    if (!userId || !description || !workoutId) {
      return res.status(400).json({ success: false, error: 'Sva polja su obavezna.' });
    }

    // Pronalazimo trening koji korisnik želi da podeli
    const workout = await Workout.findById(workoutId).populate('exercises.exercise');
    if (!workout) {
      return res.status(404).json({ success: false, error: 'Trening nije pronađen.' });
    }

    // Pakujemo trening u šablon za zajednicu
    const workoutTemplate = {
      duration: workout.duration,
      exercises: workout.exercises.map(ex => ({
        exerciseId: ex.exercise ? ex.exercise._id : null,
        name: ex.exercise ? ex.exercise.name : ex.name,
        category: ex.exercise ? ex.exercise.category : 'Kastom',
        sets: ex.sets.map(s => ({ weight: s.weight, reps: s.reps }))
      }))
    };

    const post = await Post.create({
      user: userId,
      description,
      workoutTemplate
    });

    const populatedPost = await Post.findById(post._id).populate('user', 'name');

    res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Preuzmi sve objave za zajednicu
// @route   GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};