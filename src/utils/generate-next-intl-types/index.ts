import fs from 'fs'
import path from 'path'
import {factory, SyntaxKind, NodeFlags, createPrinter} from 'typescript'
import { ArgumentType } from '../../enums'
import { argumentTypeToTsType } from './argument-type-to-ts-type'
import {Identifiers} from './identifiers'
import { createImportNode } from '../create-import-node'

export type GenerateNextIntlTypesParams = {
  output?: string
  plainTranslationKeys: string[]
  translationKeyParams: Record<string, Record<string, Exclude<ArgumentType, ArgumentType.Rich>>>
  richTranslationKeyParams: Record<string, Record<string, ArgumentType>>
}

export async function generateNextIntlTypes({output, plainTranslationKeys, translationKeyParams, richTranslationKeyParams}: GenerateNextIntlTypesParams) {
  const DEFAULT_PATH = path.join(__dirname, 'generated/next-intl.ts')

  const importNextIntlUtilsTypeNode = createImportNode('next-intl', 'NestedKeyOf', 'NamespaceKeys')
  const importReactTypesTypeNode = createImportNode('react', 'ReactNode')

  const namespaceKeysTypeNode = factory.createTypeAliasDeclaration(
    undefined,
    Identifiers.NSKeys,
    undefined,
    factory.createTypeReferenceNode(
      'NamespaceKeys',
      [
        factory.createTypeReferenceNode('IntlMessages'),
        factory.createTypeReferenceNode('NestedKeyOf', [
          factory.createTypeReferenceNode('IntlMessages')
        ])
      ]
    )
  )

  const plainTranslationKeysTypeNode = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    Identifiers.PlainTranslationKey,
    undefined,
    factory.createUnionTypeNode(plainTranslationKeys.map(key => factory.createLiteralTypeNode(factory.createStringLiteral(key))))
  )

  const translationKeyParamsTypeNode = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    Identifiers.TranslationKeyParams,
    undefined,
    factory.createTypeLiteralNode(Object.entries(translationKeyParams).map(([key, valuesObject]) => {
      const valuesNode = factory.createTypeLiteralNode(Object.entries(valuesObject).map(([property, propertyType]) => (
        factory.createPropertySignature(
          undefined,
          property,
          undefined,
          argumentTypeToTsType(propertyType)
        )
      )))

      return factory.createPropertySignature(
        undefined,
        factory.createStringLiteral(key),
        undefined,
        valuesNode,
      )
    })),
  )

  const translationKeyTypeNode = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    Identifiers.ParameterizedTranslationKey,
    undefined,
    factory.createTypeOperatorNode(
      SyntaxKind.KeyOfKeyword,
      factory.createTypeReferenceNode(Identifiers.TranslationKeyParams)
    )
  )

  const richTranslationKeyParamsTypeNode = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    Identifiers.RichTranslationKeyParams,
    undefined,
    factory.createTypeLiteralNode(Object.entries(richTranslationKeyParams).map(([key, valuesObject]) => {
      const valuesNode = factory.createTypeLiteralNode(Object.entries(valuesObject).map(([property, propertyType]) => (
        factory.createPropertySignature(
          undefined,
          property,
          undefined,
          argumentTypeToTsType(propertyType)
        )
      )))

      return factory.createPropertySignature(
        undefined,
        factory.createStringLiteral(key),
        undefined,
        valuesNode,
      )
    })),
  )

  const richTranslationKeyTypeNode = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    Identifiers.RichTranslationKey,
    undefined,
    factory.createTypeOperatorNode(
      SyntaxKind.KeyOfKeyword,
      factory.createTypeReferenceNode(Identifiers.RichTranslationKeyParams)
    )
  )

  const conditionalTypeNode = factory.createConditionalTypeNode(
    factory.createTypeReferenceNode('K'),
    factory.createTemplateLiteralType(
      factory.createTemplateHead(""),
      [
        factory.createTemplateLiteralTypeSpan(
          factory.createTypeReferenceNode("N"),
          factory.createTemplateMiddle("."),
        ),
        factory.createTemplateLiteralTypeSpan(
          factory.createInferTypeNode(
            factory.createTypeParameterDeclaration(undefined, factory.createIdentifier("Rest"))
          ),
          factory.createTemplateTail("")
        )
      ]
    ),
    factory.createTypeReferenceNode(factory.createIdentifier("Rest")),
    factory.createTypeReferenceNode(factory.createIdentifier("K"))
  )

  const translateFnTypeNode = factory.createTypeAliasDeclaration(
    [factory.createModifier(SyntaxKind.ExportKeyword)],
    Identifiers.TranslateFn,
    [
      factory.createTypeParameterDeclaration(
        [],
        factory.createIdentifier('N'),
        factory.createTypeReferenceNode(Identifiers.NSKeys),
        factory.createToken(SyntaxKind.NeverKeyword),
      )
    ],
    factory.createIntersectionTypeNode([
      factory.createTypeLiteralNode([
        factory.createCallSignature(
          [
            factory.createTypeParameterDeclaration(
              undefined,
              "K",
              factory.createTypeReferenceNode(Identifiers.ParameterizedTranslationKey)
            )
          ],
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              factory.createIdentifier("key"),
              undefined,
              conditionalTypeNode,
            ),
            factory.createParameterDeclaration(
              undefined,
              undefined,
              factory.createIdentifier("values"),
              undefined,
              factory.createIndexedAccessTypeNode(
                factory.createTypeReferenceNode(Identifiers.TranslationKeyParams),
                factory.createTypeReferenceNode("K")
              )
            )
          ],
          factory.createTypeReferenceNode("string")
        ),
        factory.createCallSignature(
          [
            factory.createTypeParameterDeclaration(
              undefined,
              "K",
              factory.createTypeReferenceNode(Identifiers.PlainTranslationKey),
            )
          ],
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              factory.createIdentifier("key"),
              undefined,
              conditionalTypeNode
            )
          ],
          factory.createTypeReferenceNode("string")
        ),
      ]),
      factory.createTypeLiteralNode([
        factory.createMethodSignature(
          undefined,
          'rich',
          undefined,
          [
            factory.createTypeParameterDeclaration(undefined, 'K', factory.createTypeReferenceNode(Identifiers.RichTranslationKey)),
          ],
          [
            factory.createParameterDeclaration(
              undefined,
              undefined,
              'key',
              undefined,
              conditionalTypeNode,
            ),
            factory.createParameterDeclaration(
              undefined,
              undefined,
              factory.createIdentifier("values"),
              undefined,
              factory.createIndexedAccessTypeNode(
                factory.createTypeReferenceNode(Identifiers.RichTranslationKeyParams),
                factory.createTypeReferenceNode("K")
              )
            )
          ],
          factory.createTypeReferenceNode('ReactNode')
        )
      ])
    ])
  )

  const useTranslationsTypeNode = factory.createTypeAliasDeclaration(
    [factory.createToken(SyntaxKind.ExportKeyword)],
    Identifiers.UseTranslations,
    undefined,
    factory.createTypeLiteralNode([
      factory.createCallSignature(undefined, [], factory.createTypeReferenceNode(Identifiers.TranslateFn)),
      factory.createCallSignature(
        [
          factory.createTypeParameterDeclaration(
            undefined,
            factory.createIdentifier('N'),
            factory.createTypeReferenceNode(Identifiers.NSKeys),
          ),
        ],
        [
          factory.createParameterDeclaration(
            undefined,
            undefined,
            factory.createIdentifier('namespace'),
            undefined,
            factory.createTypeReferenceNode('N')
          )
        ],
        factory.createTypeReferenceNode(
          Identifiers.TranslateFn,
          [factory.createTypeReferenceNode('N')]
        )
      )
    ])
  )

  const sourceFile = factory.createSourceFile(
    [
      importNextIntlUtilsTypeNode,
      importReactTypesTypeNode,
      namespaceKeysTypeNode,
      plainTranslationKeysTypeNode,
      translationKeyParamsTypeNode,
      translationKeyTypeNode,
      richTranslationKeyTypeNode,
      richTranslationKeyParamsTypeNode,
      translateFnTypeNode,
      useTranslationsTypeNode,
    ],
    factory.createToken(SyntaxKind.EndOfFileToken),
    NodeFlags.None,
  )

  const printer = createPrinter()
  const content = printer.printFile(sourceFile)

  const destination = output ? path.join(process.cwd(), output) : DEFAULT_PATH

  fs.mkdirSync(path.dirname(destination), {recursive: true})
  fs.writeFileSync(destination, content)

  console.log('Generated types at', destination)
}
