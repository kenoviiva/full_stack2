import React, { useState } from 'react'
import blogService from '../services/blogs'

//seuraavassa testissä pitäisi testata id eikä vain nimi
const testUser = (blog) => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)

    console.log(JSON.stringify(user)+' '+JSON.stringify(blog.user))

    return (user.name===blog.user.name)
  }
  return false
}

const ilikeu = async (event,blog) => {
  event.preventDefault()
  const blogNew = {
    user: blog.user.id,
    likes: blog.likes+1,
    author: blog.author,
    title: blog.title,
    url: blog.url
  }
  try {
    await blogService.update(blog.id, blogNew)
    blog.likes++
  } catch (exception) {
    window.confirm('Error, try again!')
  }
}

const More = ({ blog, moreinfo, onDelete }) => {
  if(moreinfo) return (
    <div>
      {blog.url}<br></br>
      {blog.likes} likes <button onClick={(event) => ilikeu(event,blog)}>like</button><br></br>
      added by {blog.user.name}
      {testUser(blog) ? <div><button onClick={(event) => onDelete(blog.id, event)}>delete</button></div> : null}
    </div>
  )
  return null
}

const Blog = ({ blog, onDelete }) => {
  const [moreinfo, setMore]= useState( false )

  return (
    <div>
      <div className='blogStyle' onClick={() => { setMore(!moreinfo) }}>
        {blog.title} {blog.author}
        <More blog={blog} moreinfo={moreinfo} onDelete={onDelete}/>
      </div>
    </div>
  )
}

export default Blog
