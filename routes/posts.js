const express = require('express');
const Post = require('../models/post');
const router = express.Router();

// Route to get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

// Route to get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error });
  }
});

module.exports = router;
