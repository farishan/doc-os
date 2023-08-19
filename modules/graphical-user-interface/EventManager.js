import { hardware } from "../hardware"

function EventManager() {
  const listener = {}

  this.setListener = (id) => {
    listener[id] = {}
  }

  this.addListener = function (id, key, fn) {
    listener[id][key] = fn
  }

  this.removeListener = function (id) {
    delete listener[id]
  }

  this.init = () => {
    hardware.addListener('UI', 'mousemove', e => {
      for (let [, v] of Object.entries(listener)) {
        if (v['mousemove']) v['mousemove'](e)
      }
    })

    hardware.addListener('UI', 'mouseup', e => {
      for (let [, v] of Object.entries(listener)) {
        if (v['mouseup']) v['mouseup'](e)
      }
    })
  }
}

export { EventManager }