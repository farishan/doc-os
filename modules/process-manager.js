/* WIP */
/**
 * @method `add`
 * @method `run`
 * @method `log`
 */
function ProcessManager() {
  let processMap = {}

  this.add = function (name, fn) {
    processMap[name] = fn
  }

  this.run = function () {
    for (let [k, v] of Object.entries(processMap)) {
      v()
      delete processMap[k]
    }
  }

  this.log = function () {
    console.info(processMap)
  }
}

export { ProcessManager }

/* test */
// const pm = new ProcessManager()
// pm.add('process1', () => {
//   console.info('test')
// })
// pm.log()
// pm.run()
// pm.log()
