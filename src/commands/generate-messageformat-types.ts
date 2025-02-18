import { MessageFormatElement, parse } from "@formatjs/icu-messageformat-parser"
import { flattenNamespace, getNamespaceJson, extractArguments, generateNextIntlTypes } from "../utils"
import { ArgumentType } from "../enums"

type GenerateMessageFormatTypesParams = {
  source: string
  output?: string
}

// TODO: Handle multi-file locales
// TODO: Generate types for markup texts
// TODO: Handle key type in t-function returned from the (use|get)Translations function with a namespace passed

export async function generateMessageFormatTypes({source, output}: GenerateMessageFormatTypesParams) {
  const namespace = getNamespaceJson(source)

  const plainTranslationKeys: string[] = []
  const translationKeyParams: Record<string, Record<string, Exclude<ArgumentType, ArgumentType.Rich>>> = {}
  const richTranslationKeyParams: Record<string, Record<string, ArgumentType>> = {}

  const flatNamespace = flattenNamespace(namespace)

  for (const key in flatNamespace) {
    const message = flatNamespace[key]

    const formatElements: MessageFormatElement[] = []

    try {
      formatElements.push(...parse(message))
    } catch {
      throw new Error(`Message ${key} has invalid syntax`)
    }

    const args = extractArguments(formatElements)

    if (args.Rich.length) {
      richTranslationKeyParams[key] = Object.fromEntries(Object.entries(args).map(([type, keys]) => keys.map(key => [key, type])).flat())
    } else if (args.String.length + args.Number.length) {
      translationKeyParams[key] = Object.fromEntries(Object.entries(args).map(([type, keys]) => keys.map(key => [key, type])).flat())
    } else {
      plainTranslationKeys.push(key)
    }
  }

  generateNextIntlTypes({output, plainTranslationKeys, translationKeyParams, richTranslationKeyParams})
}
