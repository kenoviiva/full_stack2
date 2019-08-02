import React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

afterEach(cleanup)

test(' verify that by default only the name and author of the blog post is shown. Also verify that when the blog post is clicked, the other information of the blog post become visible', () => {
  const blogs = [
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      user: {
        name: 'Matti Sakarias Luukkainen',
        id: 666,
      },
      __v: 0
    }
  ]

  const mockHandler = jest.fn()

  let component = render(
    blogs.map(blog =>
      <Blog key={blog._id} blog={blog} onDelete={mockHandler} />
    )
  )

  expect(component.container).toHaveTextContent(
    'Type wars'
  )
  expect(component.container).toHaveTextContent(
    'Robert C. Martin'
  )
  expect(component.container).not.toHaveTextContent(
    'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
  )
  expect(component.container).not.toHaveTextContent(
    'likes'
  )
  expect(component.container).not.toHaveTextContent(
    '5a422bc61b54a676234d17fc'
  )

  const div = component.container.querySelector('.blogStyle')

  fireEvent.click(div)


  const loginbutton = component.container.querySelector('button')
  expect(loginbutton).toBeDefined()

  expect(component.container).toHaveTextContent(
    'likes'
  )

  const likebuttons = component.container.querySelectorAll('button')
  expect(likebuttons.length).toBe(1) //like button but no delete

  expect(component.container).toHaveTextContent('http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html')
  expect(component.container).toHaveTextContent('2 likes')
  expect(component.container).toHaveTextContent('added by Matti Sakarias Luukkainen')
})

