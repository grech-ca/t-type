import fs from 'fs'
import os from 'os'
import { logger } from './logger'

const ERROR_MESSAGE = 'Could not find the root of the project'

export const locateProjectRoot = (): string => {
  const segments = process.cwd().split('/')

  for (let i = 0; i < segments.length; i++) {
    const dir = segments.slice(0, segments.length - i).join('/')

    if (dir === os.homedir()) {
      logger.error(ERROR_MESSAGE)
      process.exit(1)
    }

    const files = fs.readdirSync(dir)

    const hasPackageJson = files.includes('package.json')

    if (hasPackageJson) return dir
  }

  logger.error(ERROR_MESSAGE)
  process.exit(1)
}
