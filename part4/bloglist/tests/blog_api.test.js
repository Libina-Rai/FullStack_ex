const { test, describe, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)
const assert = require("node:assert");

  const initialBlogs = [
      { title: 'Blog 1', author: 'Author 1', url: 'url1', likes: 5 },
      { title: 'Blog 2', author: 'Author 2', url: 'url2', likes: 8 }
    ]
  
    // Clear the database and add initial blogs before each test
  describe('GET /api/blogs', () => {
    let userId
    beforeEach(async () => {
      await Blog.deleteMany({})
      await User.deleteMany({})

      // create test user
      const newUser = { username: 'testuser', name: 'Test User', password: 'testpass' }
      const userResponse = await api.post('/api/users').send(newUser)
      userId = userResponse.body.id

      // add blogs with user field
      const blogObjects = initialBlogs.map(blog => ({ ...blog, user: userId }))
      await Blog.insertMany(blogObjects)
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

//post test with authentication 
describe('POST /api/blogs', () => {
  let token
  let userId

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'testpass'
  }
  const userResponse = await api.post('/api/users').send(newUser)
  userId = userResponse.body.id

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'testpass'
    })

  token = loginResponse.body.token
})

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newblog.com',
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 1)
  })

  test('if likes property is missing, it defaults to 0', async () => {
    const newBlogWithoutLikes = {
      title: 'Blog without likes',
      author: 'Author X',
      url: 'http://nolikes.com'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithoutLikes)
      .expect(201)

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
    .set('Authorization', `Bearer ${token}`)
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
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('adding blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized blog',
    author: 'Libina',
    url: 'http://example.com',
    likes: 3
  }

  await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
})
})

//delete tests
describe('DELETE /api/blogs', () => {
  let token
  let userId
  let blogId

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = { username: 'testuser', name: 'Test User', password: 'testpass' }
    const userResponse = await api.post('/api/users').send(newUser)
    userId = userResponse.body.id

    const loginResponse = await api.post('/api/login').send({
      username: 'testuser',
      password: 'testpass'
    })
    token = loginResponse.body.token

    // add a blog with this user
    const newBlog = { title: 'Blog to delete', author: 'Author Delete', url: 'http://delete.com', likes: 5, user: userId }
    const savedBlog = await Blog.create(newBlog)
    blogId = savedBlog.id
  })

  test('a blog can be deleted', async () => {
    await api
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204); 
    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, 0)
  });
});

//update tests
describe('PUT /api/blogs/:id', () => {
  let blogId

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const newUser = { username: 'testuser', name: 'Test User', password: 'testpass' }
    const userResponse = await api.post('/api/users').send(newUser)
    const userId = userResponse.body.id

    const newBlog = { 
      title: 'Blog to update', 
      author: 'Author Update', 
      url: 'http://update.com', 
      likes: 5, 
      user: userId 
    }
    const savedBlog = await Blog.create(newBlog)
    blogId = savedBlog.id
  })

  test('updating likes of a blog', async () => {
    const blogsAtStart = await Blog.find({});
    const blogToUpdate = blogsAtStart[0];
    const updatedData = { likes: blogToUpdate.likes + 1 };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200);

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);
  });
});

  after(async () => {
    await mongoose.connection.close()
  })
