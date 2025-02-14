import { MessageFormatElement, TYPE } from "@formatjs/icu-messageformat-parser";

import {ArgumentType} from '../enums'
import { mergeArgumentNames } from "./merge-argument-names";
import { ArgumentNames } from "../types";

export function extractArguments(elements: MessageFormatElement[]): ArgumentNames {
  const args: ArgumentNames = {
    [ArgumentType.String]: [],
    [ArgumentType.Number]: [],
    [ArgumentType.Rich]: [],
    [ArgumentType.Markup]: []
  }

  for (const element of elements) {
    if (element.type === TYPE.literal) continue

    if (element.type === TYPE.tag) {
      args[ArgumentType.Rich].push(element.value)

      const nestedArguments = extractArguments(element.children)
      mergeArgumentNames(args, nestedArguments)
      continue
    }

    if (element.type === TYPE.select) {
      for (const option in element.options) {
        const value = element.options[option]

        const nestedArguments = extractArguments(value.value)
        mergeArgumentNames(args, nestedArguments)
      }
      continue
    }

    if (element.type === TYPE.argument) {
      args[ArgumentType.String].push(element.value)
      continue
    }

    if (element.type === TYPE.number) {
      args[ArgumentType.Number].push(element.value)
      continue
    }
  }

  return args
}
