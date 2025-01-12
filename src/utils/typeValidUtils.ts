import {isCuid} from "cuid"

export function isValidCuid(id: string): boolean {
  return isCuid(id);
}
