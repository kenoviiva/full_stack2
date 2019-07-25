const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })

/////////////////////////////////////////////
//  const users = await User.find({})
//  blogs.forEach(b => b.user = users[0].id)
//  blogs.forEach(b => b.save())
//////////////////////////////////////////////

  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog.toJSON())
      } else {
        response.status(404).end()
      }
    } catch(exception) {
      next(exception)
    }
})

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!request.token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
    })

    if(blog.title===undefined) response.status(400).end()
    if(blog.url===undefined) response.status(400).end()
    if(blog.likes === undefined) blog.likes=0

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {
      next(exception)
    }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    if ( blog.user.toString() != user.id.toString() ) {
      return response.status(401).json({ error: 'only creator can delete' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
      next(exception)
    }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  if(blog.title===undefined) response.status(400).end()
  if(blog.url===undefined) response.status(400).end()
  if(blog.likes === undefined) blog.likes=0
  
  try {
    updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog.toJSON())
    }
    catch(exception) {
      next(exception)
    }
})

module.exports = blogsRouter