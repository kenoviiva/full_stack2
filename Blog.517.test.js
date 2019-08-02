import App from './App'
import React from 'react'
import { render, waitForElement } from '@testing-library/react'
jest.mock('./services/blogs')

describe('<App />', () => {
  test('verifies that when the user is logged in, the blog posts are rendered to the page', async () => {

    const user = {
      username: 'tester',
      token: '1231231214',
      name: 'Ronald McDonald'
    }

    localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

    let component = render(
      <App />
    )

    await waitForElement(
      () => component.getByText('blogs')
    )

    const blogs = component.container.querySelectorAll('.blogStyle')
    expect(blogs.length).toBe(6)
  })
})
