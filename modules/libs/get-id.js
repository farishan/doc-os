import { getRandomString } from "./get-random-string"

export const MAX_INT = 9007199254740991
export const MAX_INT_MOD = -3

let id = 0
let string = getRandomString()

export function getId() {
  if (id > MAX_INT + MAX_INT_MOD) {
    id = 0
    string = getRandomString()
  }

  return ++id + string
}
