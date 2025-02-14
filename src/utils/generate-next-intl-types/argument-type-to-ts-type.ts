import * as ts from 'typescript'
import { ArgumentType } from "../../enums";

export function argumentTypeToTsType(argumentType: ArgumentType) {
  let token: ts.TypeNode

  switch (argumentType) {
    case ArgumentType.String:
      token = ts.factory.createToken(ts.SyntaxKind.StringKeyword)
      break
    case ArgumentType.Number:
      token = ts.factory.createToken(ts.SyntaxKind.NumberKeyword)
      break
    case ArgumentType.Rich:
      token = ts.factory.createFunctionTypeNode(
        undefined,
        [
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            'chunks',
            undefined,
            ts.factory.createTypeReferenceNode('ReactNode')
          )
        ],
        ts.factory.createTypeReferenceNode('ReactNode')
      )
      break
    case ArgumentType.Markup:
      token = ts.factory.createFunctionTypeNode(
        undefined,
        [
          ts.factory.createParameterDeclaration(
            undefined,
            undefined,
            'chunks',
            undefined,
            ts.factory.createTypeReferenceNode('string')
          )
        ],
        ts.factory.createTypeReferenceNode('string')
      )
      break
  }

  return token
}
