const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
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
    response.status(400).end()
    return
  }
  if (!blog.likes) {
    blog.likes = 0
  }
  const blogDoc = new Blog(blog)
  try {
    const savedBlog = await blogDoc.save()
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
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter