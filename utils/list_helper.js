var _ = require('lodash')
const User = require('../models/user')

const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    if(blogs===undefined) return 0
    var count = 0
    blogs.forEach(blog => { count = count + blog.likes })
    return count
  }
  
  const favoriteBlog = (blogs) => {
    const likes = blogs.map(blog => blog.likes)

    let popular = 0;
    likes.forEach(count => count>popular ? popular = count : popular)

    const favblog = blogs.filter(blog => blog.likes===popular)
    return favblog[0]
  }

  const mostBlogs = (blogs) => {
    const authors = blogs.map(blog => blog.author)
//    console.log(authors)
    const unique = _.uniq(authors)
//    console.log(unique) //authors only once

    const blogcount=[];
    unique.forEach(author => blogcount.push(0)) //initialize array
//    console.log(blogcount)
    let index=0;
    unique.forEach(author => {
        blogs.forEach(blog => blog.author===author ? blogcount[index]++ : null)
        index++
    })
//    console.log(blogcount) //blog count of authors

    let mostblogs=0
    blogcount.forEach(x => x>mostblogs ? mostblogs=x : null)
        
    index = _.indexOf(blogcount,mostblogs)

    const mysolution =
    {
        author: unique[index],
        blogs: blogcount[index]
    }
//    console.log(mysolution)
    return mysolution
  }

  const mostLikes = (blogs) => {
    const authors = blogs.map(blog => blog.author)
//    console.log(authors)
    const unique = _.uniq(authors)
//    console.log(unique) //authors only once

    const bloglikes=[];
    unique.forEach(author => bloglikes.push(0)) //initialize array
//    console.log(bloglikes)
    let index=0;
    unique.forEach(author => {
        blogs.forEach(blog => blog.author===author ? bloglikes[index]+=blog.likes : null)
        index++
    })
//    console.log(bloglikes) //likes count of authors

    let mostlikes=0
    bloglikes.forEach(x => x>mostlikes ? mostlikes=x : null)
        
    index = _.indexOf(bloglikes,mostlikes)

    const mysolution =
    {
        author: unique[index],
        likes: bloglikes[index]
    }
//    console.log(mysolution)
    return mysolution
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

  module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, usersInDb
  }