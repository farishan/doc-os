/* WIP */
import parseLineCommand from "./parse-line-command"

const commandLineInterface = {
  debug: false,
  functionMap: {},
  register: function (key, value) {
    this.functionMap[key] = value
  },
  execute: function (...args) {
    if (args.length === 2) {
      this.executeByKey(args[0], args[1])
    } else {
      this.executeLineCommand(args[0])
    }
  },
  executeByKey: function (key, payload) {
    if (this.debug) console.log(`[${performance.now().toFixed(2)}] executing: ${key}`)
    if (!this.functionMap[key]) throw Error('Unknown function: ' + key)

    return this.functionMap[key](payload)
  },
  /**
   *
   * @param {string} lineCommand string command to execute
   */
  executeLineCommand: function (lineCommand) {
    const args = parseLineCommand(lineCommand)
    // const args = payload.split(' ')
    const functionKey = args[0]
    if (!this.functionMap[functionKey]) throw Error('Invalid line command: ' + functionKey)

    this.executeByKey(functionKey, args[1])
  },
  executeLater: function (key, delay) {
    const self = this
    setTimeout(() => {
      self.execute(key)
    }, delay)
  }
}

export default commandLineInterface