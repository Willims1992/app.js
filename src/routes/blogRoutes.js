const express = require('express');
const { createBlog, updateBlog, deleteBlog, getBlogs, getBlogById } = require('../controllers/blogController');
const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateUser, createBlog);
router.put('/:id', authenticateUser, updateBlog);
router.delete('/:id', authenticateUser, deleteBlog);
router.get('/', getBlogs);
router.get('/:id', getBlogById);

module.exports = router;