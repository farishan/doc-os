import { loopEngine } from "./loop-engine"
import { storage } from "./storage"

/* WIP */
/**
 * @method `add`
 * @method `run`
 * @method `log`
 */
function ProcessManager() {
  let processMap = {}

  let tick = 0
  loopEngine.observe('process-manager', () => {
    ++tick
    this.run()
    storage.write('tick', tick)
  })
  loopEngine.start()
  setTimeout(() => {
    loopEngine.stop()
    console.log(storage.read('tick'))
  }, 1000)

  this.add = function (name, fn) {
    processMap[name] = fn
  }

  this.run = function () {
    for (let [k, v] of Object.entries(processMap)) {
      console.log(v)
      v()
      delete processMap[k]
    }
  }

  this.log = function () {
    console.info(processMap)
  }
}

const processManager = new ProcessManager()

export { ProcessManager, processManager }

/* test */
// const pm = new ProcessManager()
// pm.add('process1', () => {
//   console.info('test')
// })
// pm.log()
// pm.run()
// pm.log()
