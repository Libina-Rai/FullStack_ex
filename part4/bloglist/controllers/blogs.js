const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs.map(blog => {
    return {
      id: blog._id.toString(),
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: blog.user 
    };
  }));
});

blogsRouter.post('/', async (req, res) => {
   const { title, url, author, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'title or url missing' });
  }

  // Extract token from Authorization header
  const authorization = req.get('authorization');
  const token = authorization && authorization.startsWith('Bearer ')
    ? authorization.replace('Bearer ', '')
    : null;

  if (!token) {
    return res.status(401).json({ error: 'token missing' });
  }

  // Verify token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  } catch {
    return res.status(401).json({ error: 'token invalid' });
  }

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' });
  }

  // Find the user based on token id
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(400).json({ error: 'no users found to assign as creator' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id  
  });
  const savedBlog = await blog.save();

  // Add blog reference to user.blogs
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 });
  res.status(201).json(populatedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await Blog.findByIdAndDelete(id);
  res.status(204).end();
});

blogsRouter.put('/:id', async (req, res) => {
  const { likes } = req.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { likes },
    { new: true }
  );
  res.json(updatedBlog);
});

module.exports = blogsRouter;
