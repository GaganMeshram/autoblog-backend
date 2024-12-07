require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// MongoDB Blog Schema and Model
const blogSchema = new mongoose.Schema({
  title: { type: String, unique: true }, // Ensure unique titles
  content: String,
  createdAt: { type: Date, default: Date.now },
});
const Blog = mongoose.model('Blog', blogSchema);

// Blog Ideas
const blogIdeas = require('./blogs') // Import the blogs array from blogs.js
console.log(blogIdeas)

// Initialize Express
const app = express();
const port = process.env.PORT || 5000;

const allowedOrigins = [
  'https://autoblog-frontend.vercel.app',
  'http://localhost:3000', // Add your local frontend origin
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'], // Add other HTTP methods if necessary
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY); // Use your actual API key
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Function to generate blog content using the AI model
async function generateBlog(topic) {
  const prompt = `Create a blog about: ${topic}`;
  try {
    const result = await model.generateContent(prompt);
    const blogContent = result.response.text().trim();
    return blogContent;
  } catch (error) {
    console.error('Error generating blog:', error);
    return null;
  }
}

// Function to schedule blog generation
function scheduleBlogGeneration() {
  const usedTopics = new Set();

  setInterval(async () => {
    // Find the first unused topic
    const unusedTopic = blogIdeas.find((topic) => !usedTopics.has(topic));

    if (!unusedTopic) {
      console.log('No more unused topics. Stopping blog generation.');
      return; // Stop if all topics have been used
    }

    console.log(`Generating blog for topic: "${unusedTopic}"`);

    try {
      // Check if a blog with the same title already exists
      const existingBlog = await Blog.findOne({ title: unusedTopic });
      if (existingBlog) {
        console.log(`Blog for topic "${unusedTopic}" already exists. Skipping.`);
        usedTopics.add(unusedTopic); // Mark topic as used
        return;
      }

      const content = await generateBlog(unusedTopic);
      if (content) {
        const newBlog = new Blog({ title: unusedTopic, content });
        await newBlog.save();
        console.log(`Blog saved for topic: "${unusedTopic}"`);
        usedTopics.add(unusedTopic); // Mark topic as used
      }
    } catch (error) {
      console.error(`Error while processing topic "${unusedTopic}":`, error);
    }
  }, 1 * 60 * 1000); // 1 hour interval
}

// API Routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id; // Extract the 'id' from the URL
    const post = await Blog.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new Blog({ title, content });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Start Blog Generation and Server
scheduleBlogGeneration();
app.listen(port, () => console.log(`Server running on port ${port}`));
