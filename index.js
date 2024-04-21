import config from './util/config.js'
import logger from './util/logger.js'
import app from './app.js'

app.listen(config.port, () => {
  logger.info('Server listening on port', config.port)
})