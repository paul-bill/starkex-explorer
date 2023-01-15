import { config as dotenv } from 'dotenv'

import { Config } from '../Config'
import { getProductionConfig } from './config.production'

export function getStagingConfig(): Config {
  dotenv()
  return {
    ...getProductionConfig(),
    name: 'StarkexExplorer/Staging',
  }
}