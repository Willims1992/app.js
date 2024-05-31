const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { connectToDatabase } = require('./db');
const { authenticateUser } = require('./src/middleware/authMiddleware');
const { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('./src/controllers/blogController');
const { signUp, signIn } = require('./src/controllers/authController');
const authRoutes = require('./src/routes/authRoutes');
const blogRoutes = require('./src/routes/blogRoutes');

// Middleware
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    console.log("Connected to MongoDB");

    app.get('/', (req, res) => {
      res.send('Blog api');
  });
  

    // User routes
    app.use('/users', authRoutes);
    app.use('/blogs', blogRoutes);

    // Protected routes (require authentication)
    app.use(authenticateUser);

    // Blog routes
    app.get('/blogs', getBlogs);
    app.get('/blogs/:id', getBlogById);
    app.post('/blogs', createBlog);
    app.put('/blogs/:id', updateBlog);
    app.delete('/blogs/:id', deleteBlog);

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
