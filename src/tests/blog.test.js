const request = require('supertest');
const app = require('./app');
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Blog Endpoints', () => {
    let token;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        const user = await User.create({ firstName: 'Wilson', lastName: 'Junior', email: 'willsjuniorutopia@gmail.com', password: 'password' });
        token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Blog.deleteMany();
    });

    it('should create a new blog', async () => {
        const response = await request(app)
            .post('/blogs')
            .set('Authorization', token)
            .send({ title: 'Test Blog', description: 'Description', tags: ['test'], body: 'Body' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('blog');
    });

    it('should update a blog', async () => {
        const blog = await Blog.create({ title: 'Test Blog', description: 'Description', tags: ['test'], body: 'Body' });
        const response = await request(app)
            .put(`/blogs/${blog._id}`)
            .set('Authorization', token)
            .send({ title: 'Updated Blog' });
        expect(response.status).toBe(200);
        expect(response.body.blog.title).toBe('Updated Blog');
    });

    it('should delete a blog', async () => {
        const blog = await Blog.create({ title: 'Test Blog', description: 'Description', tags: ['test'], body: 'Body' });
        const response = await request(app)
            .delete(`/blogs/${blog._id}`)
            .set('Authorization', token);
        expect(response.status).toBe(200);
    });

    it('should get all blogs', async () => {
        await Blog.create({ title: 'Test Blog 1', description: 'Description', tags: ['test'], body: 'Body' });
        await Blog.create({ title: 'Test Blog 2', description: 'Description', tags: ['test'], body: 'Body' });
        const response = await request(app)
            .get('/blogs');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it('should get a blog by id', async () => {
        const blog = await Blog.create({ title: 'Test Blog', description: 'Description', tags: ['test'], body: 'Body' });
        const response = await request(app)
            .get(`/blogs/${blog._id}`);
        expect(response.status).toBe(200);
        expect(response.body.title).toBe('Test Blog');
    });
});
