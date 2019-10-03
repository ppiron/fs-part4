const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', '-blogs')
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const returnedBlog = await Blog.findById(request.params.id)
    if (returnedBlog) {
      response.json(returnedBlog.toJSON())
    } else {
      response.status(404).end()
    }
  }
  catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const blog = request.body
  if (!blog.title && !blog.url) {
    return response.status(400).end()
  }
  if (!blog.likes) {
    blog.likes = 0
  }
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blogDoc = new Blog({
      ...blog,
      user: user._id
    })
    const savedBlog = await blogDoc.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog.toJSON())
  }
  catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const changedBlog = request.body
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, changedBlog, { new: true })
    if (updatedBlog) {
      response.json(updatedBlog.toJSON())
    } else {
      response.status(404).end()
    }
  }
  catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)
    const blog = await Blog.findById(request.params.id)
    if (user._id.toString() === blog.user.toString()) {
      await blog.remove()
      response.status(204).end()
    } else {
      response.status(401).send({ error: 'Unauthorized' })
    }
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter