import express from 'express'
import bcrypt from 'bcrypt'
import 'express-async-errors'
import * as Sentry from '@sentry/node'
import cors from 'cors'
import config from './utils/config.js'
import mongoose from 'mongoose'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import User from './models/user.js'

mongoose.connect(config.mongodbUri)

const app = express()

app.use(middleware.morganLogger)
app.use(express.json())
app.use(cors())

if (config.live) {
  Sentry.init(config.SentryOptions(app))
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
}

// Check if webmaster user exists
const webmaster = await User.findOne({ username: config.webmaster.username })
if (!webmaster) {
  logger.warn('No webmaster user found, creating one')
  const passwordHash = bcrypt.hashSync(
    config.webmaster.password,
    config.saltRounds,
  )
  const user = new User({ username: config.webmaster.username, passwordHash })
  await user.save()
  logger.info('Webmaster user created')
}

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

if (config.live) app.use(Sentry.Handlers.errorHandler())

app.use(middleware.nonApiErrorHandler)
app.use(middleware.errorHandler)

export default app
