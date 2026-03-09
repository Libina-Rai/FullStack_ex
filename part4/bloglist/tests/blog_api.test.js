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

  test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs').expect(200)
  response.body.forEach(blog => {
    assert.ok(blog.id)                // must exist
    assert.strictEqual(blog._id, undefined)  // _id should not exist
  })
})
})

describe('POST /api/blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newblog.com',
      likes: 10
    }

    // POST the new blog
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Check that total number of blogs increased
    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlogWithoutLikes = {
      title: 'Blog without likes',
      author: 'Author X',
      url: 'http://nolikes.com'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Check likes default
    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is rejected with 400', async () => {
  const newBlog = {
    author: 'Author X',
    url: 'http://example.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('blog without url is rejected with 400', async () => {
  const newBlog = {
    title: 'Missing URL',
    author: 'Author Y',
    likes: 3
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

  after(async () => {
    await mongoose.connection.close()
  })
})



