import express from 'express'
import * as Sentry from '@sentry/node'
import config from './utils/config.js'
import mongoose from 'mongoose'
import middleware from './utils/middleware.js'

mongoose.connect(config.mongodbUri)

// Use morgan logger for requests
app.use(middleware.morganLogger)

const app = express()
app.use(express.json())
app.use(cors())

if (config.live) {
  Sentry.init(config.SentryOptions(app))
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
}

// app.use('/api/blogs', blogsRouter)

if (config.live)
  app.use(Sentry.Handlers.errorHandler())

app.use(middleware.nonApiErrorHandler)
app.use(middleware.errorHandler)

export default app