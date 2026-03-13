const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/logins')

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors());

// Routes
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log(err))

module.exports = app
