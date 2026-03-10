const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs.map(blog => {
    return {
      id: blog._id.toString(),
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    };
  }));
});

blogsRouter.post('/', async (req, res) => {
   const { title, url, author, likes } = req.body;

  if (!title || !url) {
    return res.status(400).json({ error: 'title or url missing' });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes
  });
  const savedBlog = await blog.save();
  res.status(201).json(savedBlog);
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
