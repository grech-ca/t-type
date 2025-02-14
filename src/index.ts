#!/usr/bin/env node

import packageJson from '../package.json'
import yargsCli from 'yargs'
import { generateMessageFormatTypes } from './commands/generate-messageformat-types'

yargsCli
  .scriptName('t-type')
  .usage('$0 <cmd> [args]')
  .command<{mainLocalePath: string; output: string}>(
    ['generate', 'gen'],
    'Generates types for localization',
    y => {
      y.option('main-locale-path', {
        require: true,
        description: 'Path to translations json'
      })

      y.option('output', {
        require: true,
        description: 'Path to generate types'
      })

      return y
    },
    ({mainLocalePath, output}) => {
      generateMessageFormatTypes({
        mainLocalePath,
        output,
      })
    }
  )
  .version(packageJson.version)
  .help()
  .argv

