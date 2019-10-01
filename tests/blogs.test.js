const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Blog = require('../models/blog')
const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('a blog can be added', async () => {
  const newBlog = {
    title: 'A random blog',
    author: 'Cecco Angioljuri',
    url: 'http://pippo.com',
    likes: 100
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(initialBlogs.length + 1)

  const authors = response.body.map(r => r.author)
  expect(authors).toContain('Cecco Angioljuri')

})

test('default number of likes is 0', async () => {
  const newBlog = {
    title: 'A random blog',
    author: 'Cecco Angioljuri',
    url: 'http://pippo.com',
  }
  const savedBlog = await api
    .post('/api/blogs')
    .send(newBlog)
  expect(savedBlog.body.likes).toBe(0)
})

test('posted blogs must have title and url', async () => {
  const newBlog = {
    author: 'Cecco Angioljuri',
    like: 100
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('returns the correct number of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(6)
})

test('each blog has an id property', async () => {
  const response = await api.get('/api/blogs')
  const ids = response.body.map(blog => blog.id)
  ids.forEach(id => {
    expect(id).toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})