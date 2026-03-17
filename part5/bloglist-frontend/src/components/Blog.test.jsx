import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest' 
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Learning React',
    author: 'Alex Johnson',
    url: 'http://example.com',
    likes: 15,
    user: { name: 'Alex Johnson' }
  }

  render(
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleRemove={() => {}}
    />
  )

  // visible
  expect(screen.getByText('Learning React')).toBeInTheDocument()
  expect(screen.getByText('Alex Johnson')).toBeInTheDocument()

  // hidden
  expect(screen.queryByText('http://example.com')).toBeNull()
  expect(screen.queryByText('likes 15')).toBeNull()
})

// show details after clicking "view"
test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Learning React',
    author: 'Alex Johnson',
    url: 'http://example.com',
    likes: 15,
    user: { name: 'Alex Johnson' }
  }

  render(
    <Blog
      blog={blog}
      handleLike={() => {}}
      handleRemove={() => {}}
    />
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton) // click to show details

  // After clicking, URL and likes should be visible
  expect(screen.getByText('http://example.com')).toBeInTheDocument()
  expect(screen.getByText('likes 15')).toBeInTheDocument()
})
