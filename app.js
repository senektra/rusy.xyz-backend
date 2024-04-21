import express from 'express'
import * as Sentry from '@sentry/node'
import cors from 'cors'
import config from './utils/config.js'
import mongoose from 'mongoose'
import middleware from './utils/middleware.js'
import blogsRouter from './controllers/blogs.js'

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

app.use('/api/blogs', blogsRouter)

if (config.live) app.use(Sentry.Handlers.errorHandler())

app.use(middleware.nonApiErrorHandler)
app.use(middleware.errorHandler)

export default app
