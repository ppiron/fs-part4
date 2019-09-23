const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog
    .findById(request.params.id)
    .then(returnedBlog => {
      if (returnedBlog) {
        response.json(returnedBlog.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(savedBlog => {
      response.status(201).json(savedBlog.toJSON())
    })
    .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
  const changedBlog = request.body
  Blog
    .findByIdAndUpdate(request.params.id, changedBlog, { new: true })
    .then(updatedBlog => {
      if (updatedBlog) {
        response.json(updatedBlog.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.delete('/:id', (request, response, next) => {
  Blog
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = blogsRouter