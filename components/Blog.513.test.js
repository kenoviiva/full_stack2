import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import SimpleBlog from './SimpleBlog'

afterEach(cleanup)

test('verify that the component renders the title, author and amount of likes for the blog post', () => {
  const blogi = {
    title: 'Fullstack programming is easy!',
    author: 'Matti Luukkainen',
    likes: 12
  }

  const mockHandler = jest.fn()

  const component = render(
    <SimpleBlog blog={blogi} onClick={mockHandler} />
  )

  expect(component.container).toHaveTextContent(
    'Fullstack programming is easy!'
  )
  expect(component.container).toHaveTextContent(
    'Matti Luukkainen'
  )
  const div = component.container.querySelector('.blogi')
  expect(div).toHaveTextContent('blog has 12 likes')

})