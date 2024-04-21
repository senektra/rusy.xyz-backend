import express from 'express'
import * as Sentry from '@sentry/node'
import config from './utils/config.js'

const app = express()

if (config.live) {
  Sentry.init(config.SentryOptions(app))
  app.use(Sentry.Handlers.requestHandler())
  app.use(Sentry.Handlers.tracingHandler())
}

if (config.live)
  app.use(Sentry.Handlers.errorHandler())

export default app