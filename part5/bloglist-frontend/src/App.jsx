import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/logins'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }

    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
    const user = await loginService.login({ username, password })
    setUser(user)
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    blogService.setToken(user.token)
    setUsername('')
    setPassword('')
  } catch (error) {
    console.log('Login failed:', error.response?.data || error.message)
    
    // Make sure notification is an object with message + type
    setNotification({
      message: 'Wrong username or password',
      type: 'error'
    })

    setTimeout(() => setNotification(null), 5000)
  }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(returnedBlog))

      setNotification({ message: `a new blog ${returnedBlog.title} added`, type: 'success' })

      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch {
      setNotification({ message: 'failed to add blog', type: 'error' })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  if(user === null) {
    return (
      <div>
        <h2>Login to application</h2>
        <br/>
        <Notification message={notification?.message} type={notification?.type} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type='text'
              value={username}
              onChange={({ target }) => setUsername(target.value)} 
            />
          </div>
          <div>
            password
            <input
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={notification?.message} type={notification?.type} />

      <p>{user.name} is logged in <button onClick={handleLogout}>logout</button></p>

      <BlogForm createBlog={addBlog} />

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
