const express = require('express')
const mongoose = require('mongoose')
require("dotenv").config();

const blogsRouter = require('./controllers/blogs')

const app = express()

//mongodb connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err))

app.use(express.json())

// Routes
app.use('/api/blogs', blogsRouter);

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})