import { test, describe, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import app from '../app.js'
import blogsHelper from './helpers/blogs_helper.js'
import mongoose from 'mongoose'

const api = supertest.agent(app)

const doBeforeEach = async () => {
  await blogsHelper.deleteMockBlogs()
  await blogsHelper.insertMockBlogs()
}

describe('GET requests at /api/blogs', () => {
  beforeEach(doBeforeEach)

  test('should retrieve blogs as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('should retrieve all blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
  })

  test('should expect the first blog to have a title of "Blog 1"', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body[0].title, 'Blog 1')
  })
})

describe('POST requests at /api/blogs', () => {
  beforeEach(doBeforeEach)

  test('should create a new blog', async () => {
    const response = await api
      .post('/api/blogs')
      .send(blogsHelper.mockedBlogs[0])
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, 'Blog 1')
  })
})

after(async () => {
  await blogsHelper.deleteMockBlogs()
  mongoose.connection.close()
})
