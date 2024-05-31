const Blog = require('../models/Blog');

const createBlog = async (req, res) => {
    try {
        const { title, description, tags, body } = req.body;
        const author = req.userId;
        const newBlog = new Blog({ title, description, author, tags, body });
        await newBlog.save();
        res.status(201).json({ message: "Blog created successfully", blog: newBlog });
    } catch (error) {
        console.error("Error creating blog:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tags, body } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(id, { title, description, tags, body }, { new: true });
        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ state: 'published' });
        res.status(200).json(blogs);
    } catch (error) {
        console.error("Error getting blogs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id).populate('author', 'firstName lastName');
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        blog.readCount += 1;
        await blog.save();
        res.status(200).json(blog);
    } catch (error) {
        console.error("Error getting blog:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createBlog, updateBlog, deleteBlog, getBlogs, getBlogById };
