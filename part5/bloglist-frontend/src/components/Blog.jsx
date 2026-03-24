import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
   return (
    <div className='blog'>
      <div className='blog-summary'>
        <span className="blog-title">{blog.title}</span> 
        <span className="blog-author">{blog.author}</span>
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div className='blog-details'>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={() => handleLike(blog)}>
              like
            </button>
          </div>
          <div>{blog.user?.name}</div>
          {blog.user?.username === user?.username && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog