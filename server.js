require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// MongoDB Blog Schema and Model
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});
const Blog = mongoose.model('Blog', blogSchema);

// Blog Ideas
const blogIdeas = [
  "The Future of Artificial Intelligence in Healthcare",
  "How to Improve Your Digital Marketing Strategy in 2024",
  "The Importance of Sustainable Fashion and Eco-Friendly Brands",
  "10 Tips for Building a Successful Remote Team",
  "How to Start a Blog and Make Money Online",
  "The Rise of Electric Vehicles: What You Need to Know",
  "How Blockchain Technology is Revolutionizing Finance",
  "A Guide to the Best Online Learning Platforms in 2024",
  "The Benefits of Minimalism in Daily Life",
  "How to Build Your Personal Brand on Social Media",
];

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
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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
  let topicIndex = 0;

  setInterval(async () => {
    const topic = blogIdeas[topicIndex];
    console.log(`Generating blog for topic: "${topic}"`);

    const content = await generateBlog(topic);
    if (content) {
      const newBlog = new Blog({ title: topic, content });
      await newBlog.save();
      console.log(`Blog saved for topic: "${topic}"`);
    }

    topicIndex = (topicIndex + 1) % blogIdeas.length;
  }, 1 * 60 * 1000); // 5 minutes interval
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
