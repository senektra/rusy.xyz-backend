import morgan from 'morgan'
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import logger from './logger.js'
import 'dotenv/config'

const defaultPort = 3001

const config = {
  SentryOptions: (app) => ({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      nodeProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  }),
  env: process.env.NODE_ENV,
  live: process.env.NODE_ENV === 'production',
  mongodbUri:
    process.env.NODE_ENV === 'testing'
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI_PROD,
  port: process.env.PORT,
  morganTokens: [
    { type: 'body', func: (req, _res) => JSON.stringify(req.body) },
  ],
  morganFormat:
    ':method :url :status :res[content-length] - :response-time ms :body',
  saltRounds: 10,
}

config.morganTokens.forEach((token) => {
  morgan.token(token.type, token.func)
})

if (config.port === undefined) {
  config.port = defaultPort
  logger.warn('No port set in environment, defaulting to', config.port)
}

if (config.mongodbUri === undefined) {
  logger.error('No URI set for MongoDB database, aborting')
  process.exit(1)
}

export default config
