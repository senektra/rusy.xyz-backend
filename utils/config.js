import morgan from 'morgan'
import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import logger from './logger.js'
import 'dotenv/config'

const defaultPort = 3001
const ENV = process.env.NODE_ENV

const config = {
  // Server general
  port: process.env.PORT,
  // Environment
  env: ENV,
  live: ENV === 'production',
  // Webmaster
  webmaster: {
    username: process.env.WEBMASTER_USERNAME,
    password: process.env.WEBMASTER_PASSWORD,
  },
  // MongoDB
  mongodbUri:
    ENV === 'testing'
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI_PROD,
  // Sentry
  SentryOptions: (app) => ({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  }),
  // Morgan
  morganTokens: [
    { type: 'body', func: (req, _res) => JSON.stringify(req.body) },
  ],
  morganFormat:
    ':method :url :status :res[content-length] - :response-time ms :body',
  // JWT
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
