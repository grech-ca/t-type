import { Namespace } from "../types";

export function flattenNamespace(namespace: Namespace, prefix?: string): Record<string, string> {
  let flattened: Record<string, string> = {}

  for (const key in namespace) {
    const namespaceOrMessage = namespace[key]
    
    const newKey = prefix ? `${prefix}.${key}` : key

    if (typeof namespaceOrMessage === 'string') {
      flattened[newKey] = namespaceOrMessage
      continue
    }

    flattened = {
      ...flattened,
      ...flattenNamespace(namespaceOrMessage, newKey)
    }
  }

  return flattened
}
