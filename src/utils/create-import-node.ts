import {factory} from 'typescript'

export const createImportNode = (from: string, ...namedImports: string[]) => {
  return factory.createImportDeclaration(
    undefined,
    factory.createImportClause(
      false,
      undefined,
      factory.createNamedImports(namedImports.map(namedImport => factory.createImportSpecifier(false, undefined, factory.createIdentifier(namedImport))))
    ),
    factory.createStringLiteral(from)
  )
}
