const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost } = require('../controllers/postController');

// Standardne rute za povlačenje i kreiranje objava
router.get('/', getPosts);
router.post('/', createPost);

// Ruta za lajkovanje objave preko ID-ja
router.put('/:id/like', likePost);

module.exports = router;