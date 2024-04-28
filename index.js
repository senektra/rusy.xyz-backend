import config from './utils/config.js'
import logger from './utils/logger.js'
import app from './app.js'

app.listen(config.port, () => {
  logger.info('Server listening on port', config.port)
})
