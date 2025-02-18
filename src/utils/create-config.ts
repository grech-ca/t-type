import fs from 'fs'
import {factory, SyntaxKind, NodeFlags, createPrinter} from 'typescript'
import path from 'path'
import { logger } from './logger';
import { TenixConfig } from '../types/config';
import { createImportNode } from './create-import-node';
import { locateProjectRoot } from './locate-project-root';
import { CONFIG_FILENAME, MODULE_NAME } from './constants';

export async function createConfig(config: Partial<TenixConfig>) {
  const projectRoot = locateProjectRoot()
  
  if (!projectRoot) {
    logger.error('Could not locate .git')
    process.exit(1)
  }

  const configPath = path.join(projectRoot, CONFIG_FILENAME)

  const importNode = createImportNode(MODULE_NAME, 'TenixConfig')

  const configNode = factory.createExportDefault(
    factory.createSatisfiesExpression(
      factory.createObjectLiteralExpression(
        Object.entries(config).map(([key, value]) => factory.createPropertyAssignment(
          key,
          factory.createStringLiteral(value)
        )),
        true,
      ),
      factory.createTypeReferenceNode('TenixConfig')
    )
  )

  const sourceFile = factory.createSourceFile(
    [
      importNode,
      configNode
    ],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  )

  const printer = createPrinter({ omitTrailingSemicolon: true })
  const content = printer.printFile(sourceFile)

  fs.writeFileSync(configPath, content)

  logger.info(`The config file was successfully created at ${configPath}`)
  process.exit(0)
}
