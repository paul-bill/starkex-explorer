import { ApiServer } from './api/ApiServer'
import { createFrontendMiddleware } from './api/middleware/FrontendMiddleware'
import { createFrontendRouter } from './api/routers/FrontendRouter'
import { createStatusRouter } from './api/routers/StatusRouter'
import { Config } from './config'
import { Logger } from './tools/Logger'

export class Application {
  start: () => Promise<void>

  constructor(config: Config) {
    /* - - - - - TOOLS - - - - - */

    const logger = new Logger(config.logger)

    /* - - - - - API - - - - - */

    const apiServer = new ApiServer(config.port, logger, {
      routers: [createStatusRouter(), createFrontendRouter()],
      middleware: [createFrontendMiddleware()],
    })

    /* - - - - - START - - - - - */

    this.start = async () => {
      logger.for(this).info('Starting')

      await apiServer.listen()

      logger.for(this).info('Started')
    }
  }
}