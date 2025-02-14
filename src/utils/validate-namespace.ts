import {JsonValue, Namespace } from "../types";

export function validateNamespace(namespace: JsonValue): namespace is Namespace {
  if (typeof namespace !== 'object' || Array.isArray(namespace) || namespace === null) {
    return false
  }

  for (const key in namespace) {
    const value = namespace[key]

    if (typeof value === 'string') continue

    const isValid = validateNamespace(value)

    if (!isValid) return false
  }

  return true
}
