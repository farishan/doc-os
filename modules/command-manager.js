/* WIP */
import { processManager } from "./process-manager"

const stringToKey = k => String(k).replace(' ', '_')

const commandManager = {
  commandsByKey: {},
  get: function (k) {
    return this.commandsByKey[stringToKey(k)]
  },
  set: function (k, v) {
    console.log(v, typeof v)
    this.commandsByKey[stringToKey(k)] = v
    console.log(this.commandsByKey)
  },
  has: function (k) {
    return this.commandsByKey[stringToKey(k)] ? true : false
  },
  execute: function (k) {
    if (!this.has(k)) return
    processManager.add(this.get(k))
  }
}

export { commandManager }