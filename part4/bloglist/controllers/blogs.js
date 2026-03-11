const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware'); // import the middleware

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

blogsRouter.post('/', userExtractor, async (req, res) => {
   const { title, url, author, likes } = req.body;
    const user = req.user; // directly from middleware

  if (!title || !url) {
    return res.status(400).json({ error: 'title or url missing' });
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

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user; // directly from middleware
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' });
  }

  // Only the creator can delete
  if (blog.user.toString() !== user._id.toString()) {
  return res.status(401).json({ error: 'unauthorized: only creator can delete' });
  }

  await Blog.findByIdAndDelete(req.params.id);
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
