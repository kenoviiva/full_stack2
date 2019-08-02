import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import WriteBlogForm from './components/WriteBlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import  { useField } from './hooks'

const normalStyle = {
  color: 'green',
  background: 'lightgrey',
  fontSize: 20,
  borderstyle: 'solid',
  borderradius: 5,
  padding: 10,
  marginbottom: 10
}

const warningStyle = {
  color: 'red',
  background: 'lightgrey',
  fontSize: 20,
  borderstyle: 'solid',
  borderradius: 5,
  padding: 10,
  marginbottom: 10
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [blogFormVisible, setblogFormVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [messageStyle, setStyle] = useState(normalStyle)
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
  const username = useField('text')
  const password = useField('text')


  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        initialBlogs.sort(function(a, b) {return b.likes - a.likes})
        setBlogs(initialBlogs)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    console.log(username.value + ' ' + password.value)
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      username.reset()
      password.reset()
    } catch (exception) {
      setStyle(warningStyle)
      setErrorMessage('Wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handlePost = async (event) => {
    event.preventDefault()

    try {
      const newblog = {
        title: title.value,
        author: author.value,
        url: url.value,
        likes: 0,
        user: user._id
      }

      const resp = await blogService.create(newblog)
      const bloglist = blogs.concat(resp)
      bloglist.sort(function(a, b) {return b.likes - a.likes})
      setBlogs( bloglist )

      setStyle(normalStyle)
      setErrorMessage(title.value + ' by ' + author.value + ' added')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      title.reset()
      author.reset()
      url.reset()
    } catch (exception) {
      setStyle(warningStyle)
      setErrorMessage('Problem in create blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogAppUser')
      blogService.setToken(null)
      setUser(null)
      username.reset()
      password.reset()
    } catch (exception) {
      setStyle(warningStyle)
      setErrorMessage('Crash in logout')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input { ...{ type:username.type, value:username.value, onChange:username.onChange }}
        />
      </div>
      <div>
        password
        <input { ...{ type:password.type, value:password.value, onChange:password.onChange }}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => {
    const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
    const showWhenVisible = { display: blogFormVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setblogFormVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
          <WriteBlogForm
            handlePost={handlePost}
            title={title}
            author={author}
            url={url}
          />
          <button onClick={() => setblogFormVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const deleteBlog = async (id, e) => {
    console.log('in deleteBlog() '+id)

    // Avoid bubbling to edit
    e.stopPropagation()

    const bloglist = blogs.filter(blog => blog.id === id)
    const blog = bloglist[0]

    const result = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if(result===false) return

    try {
      await blogService.exterminate(blog.id)

    } catch (exception) {
      window.confirm('Error, try again!')
    }

    setBlogs( blogs.filter(blog => blog.id !== id))
  }

  if (user === null) {
    return (
      <div>

        <h2>Log in to application</h2>

        <Notification message={errorMessage} style={messageStyle}/>

        { loginForm() }

      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} style={messageStyle}/>
      <div>
        <p>{user.name} logged in <button onClick={(event) => handleLogout(event)}>logout</button></p>

        { blogForm() }
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} onDelete={deleteBlog} />
        )}

      </div> </div>
  )
}

export default App
