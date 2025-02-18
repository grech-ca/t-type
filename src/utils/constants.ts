import * as t from 'typescript'

export const Identifiers = {
  PlainTranslationKey: t.factory.createIdentifier('PlainTranslationKey'),
  TranslationKeyParams: t.factory.createIdentifier('TranslationKeyParams'),
  ParameterizedTranslationKey: t.factory.createIdentifier('ParameterizedTranslationKey'),
  TranslateFn: t.factory.createIdentifier('TranslateFn'),
  UseTranslations: t.factory.createIdentifier('UseTranslations'),
  NSKeys: t.factory.createIdentifier('NSKeys'),
  NamespaceKeys: t.factory.createIdentifier('NamespaceKeys'),
  NestedKeyOf: t.factory.createIdentifier('NestedKeyOf'),
  AllTranslationKey: t.factory.createIdentifier('AllTranslationKey'),
  RichTranslationKey: t.factory.createIdentifier('RichTranslationKey'),
  RichTranslationKeyParams: t.factory.createIdentifier('RichTranslationKeyParams')
} as const

export const MODULE_NAME = 'tenix'

export const CONFIG_FILENAME = `${MODULE_NAME}.config.ts` as const
