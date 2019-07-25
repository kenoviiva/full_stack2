const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)
const listHelper = require('../utils/list_helper')

test('4.8: blogs are returned as json', async () => {
    const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('4.8: there are six blogs', async () => {
  const response = await api.get('/api/blogs')  
  expect(response.body.length).toBe(6)
})

test('4.9: .id is defined', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog =>
    expect(blog.id).toBeDefined())
})

test('4.10: test post', async () => {
    const resp = await api.get('/api/blogs')
    const initialLength = resp.body.length

    const newBlog = {
        title: "The Cruelty of Trump’s Poverty Policy",
        author: "David A. Super",
        url: "https://www.nytimes.com/2019/07/24/opinion/trump-poverty-policy.html",
        likes: 8593,    
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    const body = response.body
    const finalLength = body.length

    expect(finalLength).toBe(initialLength + 1)
  
    const contents = body.map(n => n.title)
    expect(contents).toContain(
      'The Cruelty of Trump’s Poverty Policy'
    )

    const trump = body.filter(x => x.author === "David A. Super")
    const cmd = '/api/blogs/'+trump[0].id
    await api.delete(cmd)
  })

  test('4.11: test likes', async () => {

    const newBlog = {
        title: "The Cruelty of Trump’s Poverty Policy",
        author: "David A. Super",
        url: "https://www.nytimes.com/2019/07/24/opinion/trump-poverty-policy.html"   
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    const trump = response.body.filter(x => x.author === "David A. Super")
    expect(trump[0].likes).toBe(0)

    const cmd = '/api/blogs/'+trump[0].id
    await api.delete(cmd)
    
  })

  test('4.12: test title and url missing', async () => {

    const newBlog = {
//        title: "The Cruelty of Trump’s Poverty Policy",
        author: "David A. Super",
        url: "https://www.nytimes.com/2019/07/24/opinion/trump-poverty-policy.html",
        likes: 8593,    
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  
      const test2Blog = {
        title: "The Cruelty of Trump’s Poverty Policy",
        author: "David A. Super",
//        url: "https://www.nytimes.com/2019/07/24/opinion/trump-poverty-policy.html",
        likes: 8593,    
      }
          
      await api
      .post('/api/blogs')
      .send(test2Blog)
      .expect(400)
  })

  test('4.13: test delete', async () => {
    const newBlog = {
        title: "The Cruelty of Trump’s Poverty Policy",
        author: "David A. Super",
        url: "https://www.nytimes.com/2019/07/24/opinion/trump-poverty-policy.html",
        likes: 8593,    
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
    const body = response.body
  
    const trump = body.filter(x => x.author === "David A. Super")
    const cmd = '/api/blogs/'+trump[0].id
    await api.delete(cmd)
    .expect(204)
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', name: 'Administrator', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username missing or password < 3', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: '',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    expect(result.body.error).toContain('User validation failed')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)

    newUser.username = 'Hemuli'
    newUser.password = '12'
    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed')

    const uAtE = await listHelper.usersInDb()
    expect(uAtE.length).toBe(usersAtStart.length)
  })
})

  afterAll(() => {
  mongoose.connection.close()
})