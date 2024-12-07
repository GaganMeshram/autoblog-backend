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
  "The Future of Work: Remote vs. In-Office Jobs",
  "How to Manage Stress and Improve Mental Health",
  "Exploring the World of Virtual Reality and Its Applications",
  "Top 10 Cities for Digital Nomads in 2024",
  "How to Create a Morning Routine for Success",
  "The Impact of 5G Technology on the Internet of Things",
  "Why Emotional Intelligence is Key to Leadership Success",
  "How to Stay Productive While Working From Home",
  "The Power of Podcasts: Why You Should Start One Today",
  "How to Grow Your Instagram Following Organically",
  "The Benefits of Practicing Gratitude Every Day",
  "The Importance of Cybersecurity in 2024",
  "Exploring the Benefits of Yoga for Mental and Physical Health",
  "How to Manage Your Time Effectively in the Digital Age",
  "The Future of Education: How Technology is Changing Classrooms",
  "How to Create a Balanced Work-Life Routine",
  "The Benefits of Meditation and Mindfulness",
  "How to Write Compelling Content for Your Website",
  "The Rise of Influencer Marketing in 2024",
  "How to Use Data Analytics to Drive Business Decisions",
  "The Importance of Networking in Career Growth",
  "How to Start an E-commerce Business from Scratch",
  "The Role of Artificial Intelligence in Digital Transformation",
  "Why You Should Invest in Real Estate in 2024",
  "The Science of Happiness: How to Boost Your Mood",
  "How to Stay Fit Without Going to the Gym",
  "How to Build an Effective Email Marketing Campaign",
  "The Best Tools for Project Management in 2024",
  "The Power of Positive Thinking for Success",
  "How to Break Bad Habits and Build Healthy Ones",
  "Why Sustainability is Crucial for the Future of Business",
  "How to Create a Productive Workspace at Home",
  "The Benefits of Learning a New Language",
  "How to Overcome Procrastination and Get Things Done",
  "The Rise of Remote Work and Digital Nomadism",
  "How to Manage Your Finances and Build Wealth",
  "The Impact of Artificial Intelligence on Job Markets",
  "How to Launch a Successful Podcast in 2024",
  "The Best Strategies for Growing Your YouTube Channel",
  "How to Build a Thriving Online Community",
  "The Role of Augmented Reality in Modern Business",
  "How to Use AI to Improve Customer Experience",
  "The Importance of Emotional Resilience in Business",
  "How to Build a Successful Online Course",
  "The Future of Cryptocurrency and Blockchain Technology",
  "Why Content Marketing is Key to Business Growth",
  "How to Stay Motivated During Difficult Times",
  "The Benefits of Journaling for Personal Growth",
  "How to Create Engaging Social Media Content",
  "The Power of Collaboration in Business Success",
  "Why Health and Wellness Should Be Your Top Priority",
  "How to Effectively Manage Your Personal Brand Online",
  "The Benefits of Outsourcing for Small Businesses",
  "How to Improve Your SEO and Rank Higher in Google",
  "The Importance of Customer Feedback for Business Growth",
  "How to Build an Effective Sales Funnel for Your Business",
  "The Role of Data Privacy in the Digital Age",
  "Why Every Entrepreneur Needs a Mentor",
  "How to Become a Successful Freelancer in 2024",
  "The Future of Smart Homes and IoT Devices",
  "How to Create an Effective Content Strategy",
  "The Best Productivity Tools for Entrepreneurs",
  "How to Turn Your Passion into a Profitable Business",
  "The Rise of Artificial Intelligence in Marketing",
  "How to Improve Your Public Speaking Skills",
  "The Best Social Media Platforms for Business in 2024",
  "How to Build a Successful Affiliate Marketing Strategy",
  "The Importance of Building a Personal Finance Plan",
  "Why You Should Invest in Your Personal Development",
  "How to Use Google Analytics to Track Your Website Performance",
  "The Power of Networking for Entrepreneurs",
  "How to Write Engaging Blog Posts That Drive Traffic",
  "The Best Strategies for Building Customer Loyalty",
  "How to Start a Subscription Box Business",
  "The Importance of Diversifying Your Income Streams",
  "How to Create a Successful Crowdfunding Campaign",
  "The Benefits of Outsourcing Content Creation",
  "How to Start a Virtual Assistant Business",
  "Why You Should Consider Passive Income Streams",
  "The Best Ways to Promote Your Business on Instagram",
  "How to Create a Killer Resume and Land Your Dream Job",
  "The Future of Augmented Reality in Marketing",
  "How to Build a Personal Brand on LinkedIn",
  "Why Influencer Marketing is Crucial for Brand Growth",
  "How to Build an Effective Online Portfolio",
  "The Importance of Personal Branding in the Digital Age",
  "How to Create an Effective YouTube Marketing Strategy",
  "The Best Tools for Online Collaboration and Communication",
  "How to Optimize Your Website for Better User Experience",
  "The Importance of Employee Engagement for Business Success",
  "How to Use Webinars to Grow Your Audience",
  "The Benefits of a Digital Detox for Mental Health",
  "How to Launch a Successful Online Store",
  "The Role of AI in Content Creation and Marketing",
  "How to Use Social Media Analytics to Improve Your Strategy",
  "The Best Strategies for Building an Online Business",
  "How to Create a Killer Marketing Plan for 2024",
  "The Future of Voice Search and SEO",
  "Why Data-Driven Marketing is the Key to Success",
  "How to Turn Your Blog into a Profitable Business",
  "The Power of Video Marketing in 2024",
  "How to Build a Strong Brand Identity",
  "The Best Strategies for Building an E-commerce Brand",
  "How to Get More Traffic to Your Website",
  "The Importance of Time Management for Entrepreneurs",
  "How to Create a Successful Brand Story",
  "The Rise of AI in the Art World",
  "How to Build a Business Around Your Passion",
  "The Best Tips for Writing an Engaging Newsletter",
  "Why Freelancing is the Future of Work",
  "How to Build an Effective Marketing Automation System",
  "The Importance of Cyber Hygiene in 2024",
  "How to Leverage User-Generated Content for Marketing",
  "The Best Practices for Running Facebook Ads",
  "How to Build an Engaged Email Subscriber List",
  "Why Employee Wellbeing Should Be a Priority for Companies",
  "How to Write a Compelling Case Study",
  "The Rise of 3D Printing in Manufacturing",
  "How to Build an Impactful Corporate Social Responsibility Strategy",
  "Why Innovation is Key to Business Success",
  "How to Create a High-Converting Landing Page",
  "The Future of Digital Advertising",
  "How to Build an Influential Thought Leadership Brand",
  "The Best Strategies for Managing a Remote Team",
  "How to Effectively Use Retargeting Ads",
  "The Importance of Building an Authentic Brand",
  "How to Create a Successful Mobile App",
  "Why Micro-Influencers Are the Future of Marketing",
  "How to Use AI to Enhance Your Marketing Strategy",
  "The Best Tips for Running Google Ads",
  "How to Start a Coaching Business",
  "The Rise of Sustainability in the Food Industry",
  "How to Use Influencers for Product Launches",
  "Why You Should Care About Climate Change in Business",
  "How to Leverage LinkedIn for Business Growth",
  "The Future of Social Media Marketing",
  "How to Build a Scalable Online Business",
  "The Importance of Authenticity in Marketing",
  "How to Create a Content Calendar for Your Business",
  "The Rise of Subscription Services in 2024",
  "How to Use Data Visualization to Improve Your Business Decisions",
  "The Best Tips for Building an E-commerce Website",
  "Why Personal Finance Education is Key to Success",
  "How to Improve Your Brand’s Online Reputation",
  "The Importance of Diversity and Inclusion in the Workplace",
  "How to Build a Customer-Centric Business",
  "The Rise of Telemedicine and Its Impact on Healthcare",
  "How to Use AI to Create Better Customer Service",
  "The Benefits of Being a Digital Nomad",
  "How to Turn Your Side Hustle into a Full-Time Business",
  "The Future of Online Shopping: Trends to Watch",
  "How to Start an Online Coaching Program",
  "Why Building a Community Around Your Brand is Important",
  "How to Improve Your Sales Skills for 2024",
  "The Benefits of Podcasting for Business Growth",
  "How to Write a High-Converting Product Description",
  "The Importance of Personal Health and Fitness for Entrepreneurs",
  "How to Leverage Influencers for Product Launches",
  "The Future of Artificial Intelligence in Marketing",
  "How to Create a Winning Content Marketing Strategy",
  "The Best Digital Tools for Entrepreneurs",
  "How to Start a Business with Little to No Money",
  "The Rise of Artificial Intelligence in Healthcare",
  "How to Build a Digital Product That Sells",
  "Why Customer Retention is Crucial for Business Success",
  "How to Optimize Your E-commerce Website for Conversions",
  "The Benefits of Running a Crowdsourced Campaign",
  "How to Create a Social Media Content Strategy for 2024",
  "Why Every Business Should Focus on Customer Experience",
  "How to Create a Business That Solves a Problem",
  "The Rise of Subscription-Based Services",
  "How to Create a Digital Marketing Campaign That Works",
  "Why Every Entrepreneur Needs a Business Plan",
  "How to Monetize Your Blog in 2024",
  "The Power of Networking in Digital Marketing",
  "How to Make Your Website Mobile-Friendly",
  "The Benefits of Influencer Partnerships for Small Businesses",
  "How to Build a Successful Freelance Career",
  "The Best Strategies for Increasing Online Sales",
  "How to Use AI to Improve Your Content Strategy",
  "The Importance of Personal Branding in 2024",
  "How to Create Engaging YouTube Videos",
  "Why You Should Start a Podcast in 2024",
  "How to Build a Business Around Your Expertise",
  "The Future of Data Privacy Laws",
  "How to Create an Effective Influencer Marketing Campaign"
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
  }, 60 * 60 * 1000); // 5 minutes interval
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
