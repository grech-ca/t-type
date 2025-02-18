import fs from 'fs'
import path from 'path'
import {confirm, input} from '@inquirer/prompts'

import { logger } from '../utils/logger'
import { Namespace } from '../types'
import { TTypeConfig } from '../types/config'
import { createConfig } from '../utils/create-config'

export async function setup() {
  const config: Partial<TTypeConfig> = {}

  const isLocal = await confirm({
    message: 'Is the translations source stored locally?',
    default: true
  })

  if (!isLocal) {
    logger.todo('Implement external source handling')
    process.exit(1)
  }

  const source = await input({
    message: 'Where is the source located?'
  })

  const fullSourcePath = path.resolve(process.cwd(), source)
  const sourceExists = fs.existsSync(fullSourcePath)

  if (!sourceExists) {
    logger.error('The source does not exist')
    process.exit(1)
  }

  const sourceFile = fs.readFileSync(fullSourcePath)
  let namespace: Namespace

  try {
    namespace = JSON.parse(sourceFile.toString())
  } catch (error) {
    logger.error('Could not parse the source. Is it in JSON format?')
    process.exit(1)
  }

  config.source = source

  const isCustomOutput = await confirm({
    message: 'Would you like to specify a custom output path?',
    default: false,
  })

  if (isCustomOutput) {
    config.output = await input({message: 'Please enter the output path'})

  } else {
    logger.todo('Implement default output handling')
  }

  await createConfig(config)
}
