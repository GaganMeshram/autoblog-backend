const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  image: String, // Store image URL or path
  description: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
