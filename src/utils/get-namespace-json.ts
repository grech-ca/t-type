import fs from 'fs'
import path from 'path'

import { JsonValue, Namespace } from "../types"
import { validateNamespace } from './validate-namespace'

export function getNamespaceJson(rawPath: string): Namespace {
  // TODO: Validate namespace json
  const jsonPath = path.join(process.cwd(), rawPath)
  
  const fileExists = fs.existsSync(jsonPath)

  if (!fileExists) {
    throw new Error(`The file does not exist at path "${jsonPath}"`)
  }

  let rawJson: string

  try {
    rawJson = fs.readFileSync(jsonPath).toString()
  } catch (error) {
    throw new Error(`Could not read file at path "${jsonPath}": ${error}`)
  }

  let namespace: JsonValue

  try {
    namespace = JSON.parse(rawJson)
  } catch (error) {
    throw new Error(`Could not parse the file at path "${jsonPath}": ${error}`)
  }

  const isValidNamespace = validateNamespace(namespace)
  if (isValidNamespace) return namespace as Namespace

  throw new Error('The namespace is invalid')
}
