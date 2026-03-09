const { test, describe, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const app = require('../app')
const api = supertest(app)
const assert = require("node:assert");

  const initialBlogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'url1', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'url2', likes: 8 }
    ]
  describe('GET /api/blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObject = new Blog(initialBlogs[0]);
    await blogObject.save();
    blogObject = new Blog(initialBlogs[1]);
    await blogObject.save();
  })

  test('blogs are returned as JSON and have correct length', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
     assert.strictEqual(response.body.length, initialBlogs.length);
  })

  after(async () => {
  await mongoose.connection.close()
  })
})

