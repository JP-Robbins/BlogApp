const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
mongoose.set('bufferTimeoutMS', 30000)
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlog[0])
  await blogObject.save()
  blogObject = new Blog(initialBlog[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlog.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const author = response.body.map((r) => r.author)

  expect(author).toContain('Edsger W. Dijkstra')
})

test('a valid blog post can be added', async () => {
  const newPost = {
    title: 'How to blow up a Djnago server in 30 seconds',
    author: 'JP Robbins',
    url: 'http://www.myNonexsistantWebsite.com',
    likes: 20,
    __v: 0,
  }

  await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const title = response.body.map((r) => r.title)

  expect(response.body).toHaveLength(initialBlog.length + 1)
  expect(title).toContain('How to blow up a Djnago server in 30 seconds')
}, 10000)

test('blog post without parameters is not added', async () => {
  const newPost = {
    author: 'JP Robbins',
    url: 'http://www.myNonexsistantWebsite.com',
  }

  await api.post('/api/blogs').send(newPost).expect(400)

  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlog.length)
})

afterAll(async () => {
  await mongoose.connection.close()
})
