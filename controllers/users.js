const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (!body.password) {
    return response.status(400).send({ error: 'Missing password!' })
  }
  if (body.password.length < 3) {
    return response.status(400).send({ error: 'Password should be at least 3 characters long' })
  }
  try {
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(body.password, salt)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()
    response.json(savedUser.toJSON())

  }
  catch (exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user: 0, id: 0 })
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter