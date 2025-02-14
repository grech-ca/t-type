import { ArgumentType } from "../enums";
import { ArgumentNames } from "../types";

export function mergeArgumentNames(base: ArgumentNames, head: ArgumentNames) {
  for (const type in head) {
    base[type as ArgumentType].push(...head[type as ArgumentType])
  }
}
