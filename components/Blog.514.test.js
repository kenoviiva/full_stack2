import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

test(`verifies that if the like button of a component is pressed twice, the event handler function passed in the component's props is called twice`, () => {
  const blogi = {
    title: 'Fullstack programming is easy!',
    author: 'Matti Luukkainen',
    likes: 12
  }

  const mockHandler = jest.fn()

  const component = render(
    <SimpleBlog blog={blogi} onClick={mockHandler} />
  )

  const button = component.container.querySelector('button')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})