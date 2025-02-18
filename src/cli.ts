#!/usr/bin/env node

import packageJson from '../package.json'
import yargsCli from 'yargs'
import { generateMessageFormatTypes } from './commands/generate-messageformat-types'
import { setup } from './commands/setup';
import { resolveConfig } from './utils/resolve-config';

yargsCli
  .scriptName('tenix')
  .usage('$0 <cmd> [args]')
  .command(
    ['setup'],
    'Setup config',
    {},
    setup,
  )
  .command<{source: string; output: string}>(
    ['generate', 'gen'],
    'Generates types for localization',
    y => {
      y.option('source', {
        // require: true,
        description: 'Path to translations json'
      })

      y.option('output', {
        // require: true,
        description: 'Path to generate types'
      })

      return y
    },
    async ({source, output}) => {
      const config = await resolveConfig()

      generateMessageFormatTypes({
        source: source ?? config.source,
        output: output ?? config.output,
      })
    }
  )
  .version(packageJson.version)
  .help()
  .argv

