/* WIP */
import parseLineCommand from "./parse-line-command"

function CommandLineInterface() {
  this.debug = false
  this.functionMap = {}
  this.register = function (key, value) {
    this.functionMap[key] = value
  }
  this.execute = function (...args) {
    if (args.length === 2) {
      this.executeByKey(args[0], args[1])
    } else {
      this.executeLineCommand(args[0])
    }
  }
  this.executeByKey = function (key, payload) {
    if (this.debug) console.log(`[${performance.now().toFixed(2)}] executing: ${key}`)
    if (!this.functionMap[key]) throw Error('Unknown function: ' + key)

    return this.functionMap[key](payload)
  }

  /**
   *
   * @param {string} lineCommand string command to execute
   */
  this.executeLineCommand = function (lineCommand) {
    const args = parseLineCommand(lineCommand)
    const functionKey = args[0]
    if (!this.functionMap[functionKey]) throw Error('Invalid line command: ' + functionKey)

    this.executeByKey(functionKey, args[1])
  }

  this.executeLater = function (key, delay) {
    const self = this
    setTimeout(() => {
      self.execute(key)
    }, delay)
  }

  return this
}

let instance = new CommandLineInterface()
const getInstance = () => {
  if (!instance) instance = new CommandLineInterface()
  return instance
}

export { CommandLineInterface, getInstance }