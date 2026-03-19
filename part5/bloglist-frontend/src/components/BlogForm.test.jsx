import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, describe, vi } from 'vitest'
import BlogForm from './BlogForm'
import '@testing-library/jest-dom'

describe('BlogForm', () => {
  test('calls event handler with correct details when a new blog is created', async () => {
    const createBlogMock = vi.fn()  // mock function to track calls
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlogMock} />)
    
    // Select input fields
    const titleInput = screen.getByPlaceholderText('title')
    const authorInput = screen.getByPlaceholderText('author')
    const urlInput = screen.getByPlaceholderText('url')
    const submitButton = screen.getByText('create')

    // Simulate user typing
    await user.type(titleInput, 'Testing Blog')
    await user.type(authorInput, 'Liza Tamang')
    await user.type(urlInput, 'http://example.com')

    // Simulate form submission
    await user.click(submitButton)

    // Check that mock function was called once
    expect(createBlogMock).toHaveBeenCalledTimes(1)

    // Check the argument of the function
    expect(createBlogMock).toHaveBeenCalledWith({
      title: 'Testing Blog',
      author: 'Liza Tamang',
      url: 'http://example.com'
    })
  })
})
