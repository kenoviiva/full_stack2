import App from './App'
import React from 'react'
import { render, waitForElement, fireEvent, getByText, getByLabelText } from '@testing-library/react'
jest.mock('./services/blogs')

describe('<App />', () => {
  test('if no user logged, notes are not rendered', async () => {

    let component = render(
      <App />
    )
    component.rerender(<App />)

    await waitForElement(
      () => component.getByText('login')
    )

    const username = component.container.querySelector('username')
    expect(username).toBeDefined()
    const password = component.container.querySelector('password')
    expect(password).toBeDefined()
    const loginbutton = component.container.querySelector('button')
    expect(loginbutton).toBeDefined()

    const blogs = component.container.querySelectorAll('.blogStyle')
    expect(blogs.length).toBe(0)
  })
})
