const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const blogsRouter = require('./controllers/blogs')

const app = express()
app.use(express.json())

// Routes
app.use('/api/blogs', blogsRouter)

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log(err))

module.exports = app
