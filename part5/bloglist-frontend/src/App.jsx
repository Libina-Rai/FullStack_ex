import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/logins'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    setUser(user)
    blogService.setToken(user.token) // ensure axios calls use token
  }

    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
  event.preventDefault()

  try {
    const user = await loginService.login({
      username,
      password
    })

    setUser(user)
    window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
    blogService.setToken(user.token) // ensure axios calls use token
    setUsername('')
    setPassword('')
  } catch (exception) {
    console.log('wrong credentials', exception)
  }
}

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null) // remove token from axios calls
  }

  const addBlog = async (blogObject) => {
  const returnedBlog = await blogService.create(blogObject)
  setBlogs(blogs.concat(returnedBlog))
}

  if(user === null) {
    return (
      <div>
        <h2>Login to application</h2>
        <br/>
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

  // BLOG LIST (shown when user IS logged in)
  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} is logged in <button onClick={handleLogout}>logout</button></p>

      <BlogForm createBlog={addBlog} />

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App