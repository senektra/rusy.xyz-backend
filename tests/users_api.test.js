import { describe, test, after, beforeEach } from 'node:test'
import assert from 'node:assert'
import supertest from 'supertest'
import config from '../utils/config.js'
import mongoose from 'mongoose'
import app from '../app.js'
import usersHelper from './helpers/users_helper.js'
import { userError } from '../utils/errors.js'

const api = supertest.agent(app)

const doBeforeEach = (startWithTestUsers) => {
  return async () => {
    await usersHelper.deleteAll()
    if (startWithTestUsers) await usersHelper.addTestUsers()
  }
}

const doAfter = () => {
  mongoose.connection.close()
}

describe('Should create webmaster from config', () => {
  test('when no webmaster user exists in db', async () => {
    const users = await usersHelper.usersInDb()
    assert.strictEqual(users.length, 1)
    assert.strictEqual(users[0].username, 'webmaster')
  })

  after(async () => {
    await usersHelper.deleteAll()
  })
})

describe('GET requests at /api/users', () => {
  beforeEach(doBeforeEach(true))

  test('return all users', async () => {
    const response = await api.get('/api/users').expect(200)
    assert.strictEqual(response.body.length, usersHelper.usersToAdd.length)
  })

  test('return user by id', async () => {
    const users = await usersHelper.usersInDb()
    const user = users[0]
    const response = await api.get(`/api/users/${user.id}`).expect(200)
    assert.strictEqual(response.body.username, user.username)
  })

  test('return 404 if user not found', async () => {
    const response = await api
      .get('/api/users/662e9c32578995ddb4518709')
      .expect(404)
    assert.strictEqual(response.body.message, userError.notFound.message)
  })

  test('return 400 CastError if provided bad id', async () => {
    const response = await api.get('/api/users/123456789012').expect(400)
    assert.strictEqual(response.body.name, 'CastError')
  })
})

describe('POST requests at /api/users/login', () => {
  beforeEach(doBeforeEach(true))

  test('return 200 if user logged in and provides token', async () => {
    const userLogin = {
      username: config.webmaster.username,
      password: config.webmaster.password,
    }
    const response = await api
      .post('/api/users/login')
      .send(userLogin)
      .expect(200)
    assert.ok(response.body.token)
  })

  test('return 400 if username is missing', async () => {
    const userLogin = { password: 'password' }
    const response = await api
      .post('/api/users/login')
      .send(userLogin)
      .expect(400)
    assert.strictEqual(response.body.message, userError.noUsername.message)
  })

  test('return 400 if password is missing', async () => {
    const userLogin = { username: 'username' }
    const response = await api
      .post('/api/users/login')
      .send(userLogin)
      .expect(400)
    assert.strictEqual(response.body.message, userError.noPassword.message)
  })
})

after(doAfter)
