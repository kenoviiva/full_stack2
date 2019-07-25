const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response) => {

    const users = await User.find({}).populate('blogs', { likes: 0, user: 0 })

    response.json(users.map(u => u.toJSON()))
  })

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if(body.password === undefined) {
        return response.status(400).json({ error: 'password required' })
    }
    if(body.password.length<3) {
        return response.status(400).json({ error: 'password must be at least 3 characters' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

//    console.log('pw='+passwordHash)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
//    console.log('user='+user.toJSON())

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter