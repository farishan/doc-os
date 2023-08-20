import { MAX_INT, MAX_INT_MOD } from "./constants"
import { getRandomString } from "./get-random-string"

let id = 0
let string = getRandomString()

export function getId() {
  if (id > MAX_INT + MAX_INT_MOD) {
    id = 0
    string = getRandomString()
  }

  return ++id + string
}
