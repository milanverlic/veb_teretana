const Post = require('../models/Post');
const mongoose = require('mongoose');

// @desc    Preuzmi sve objave iz zajednice sa ugrađenim username-om
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username name') // Izvlači @username i name iz User kolekcije
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    console.error('Greška pri učitavanju objava:', error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Kreiraj novu objavu u zajednici
// @route   POST /api/posts
const createPost = async (req, res) => {
  try {
    const { userId, description, workoutId } = req.body;

    if (!userId || !description.trim()) {
      return res.status(400).json({ success: false, error: 'Korisnik i opis su obavezni.' });
    }

    // Kreiramo novu objavu
    const newPost = await Post.create({
      user: userId,
      description,
      workout: workoutId || null,
      likes: []
    });

    // Odmah naseljavamo podatke o korisniku kako bi se na frontendu odmah video ispravan username
    const populatedPost = await Post.findById(newPost._id).populate('user', 'username name');

    return res.status(201).json({ success: true, data: populatedPost });
  } catch (error) {
    console.error('Greška pri kreiranju objave:', error.message);
    return res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Lajkuj ili ukloni lajk sa objave (Atomic operacija)
// @route   PUT /api/posts/:id/like
const likePost = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: 'Validan korisnički ID je obavezan.' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Objava nije pronađena.' });
    }

    // Provera da li je korisnik već lajkovao objavu
    const vecLajkovano = post.likes && post.likes.includes(userId.toString());

    let updatedPost;
    if (vecLajkovano) {
      // Ako je već lajkovano -> Ukloni lajk (Unlike)
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId.toString() } },
        { new: true }
      ).populate('user', 'username name');
    } else {
      // Ako nije lajkovano -> Dodaj lajk
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId.toString() } },
        { new: true }
      ).populate('user', 'username name');
    }

    return res.status(200).json({ success: true, data: updatedPost });
  } catch (error) {
    console.error('Greška pri lajkovanju na backendu:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Eksportujemo funkcije sa TAČNIM nazivima koje server.js uvozi
module.exports = {
  getPosts,
  createPost,
  likePost
};