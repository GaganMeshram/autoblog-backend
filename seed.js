const mongoose = require('mongoose');
const Post = require('./models/post'); // Make sure to import the Post model
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

// Create an array of sample posts to insert
const samplePosts = [
  {
    title: "First Blog Post",
    image: "https://via.placeholder.com/500",
    description: "This is the description of the first post.",
    content: "This is the full content of the first post.",
    createdAt: new Date()
  },
  {
    title: "Second Blog Post",
    image: "https://via.placeholder.com/500",
    description: "This is the description of the second post.",
    content: "This is the full content of the second post.",
    createdAt: new Date()
  }
];

// Insert sample posts into the database
const seedDatabase = async () => {
  await Post.deleteMany(); // Optional: Clear the posts collection first
  await Post.insertMany(samplePosts);
  console.log('Sample posts inserted!');
  mongoose.connection.close();
};

// Run the seed function
seedDatabase();
