/* The hardware manager doesn't need an event manager,
but one is necessary to monitor hardware events across modules. */
import { getInstance as getEventManager } from "./event-manager"

const eventManager = getEventManager()

function Hardware() {
  /* window events */
  eventManager.set('resize')
  /* keyboard events */
  eventManager.set('keyup')
  eventManager.set('keydown')
  /* mouse events */
  eventManager.set('mouseup')
  eventManager.set('mousedown')
  eventManager.set('mousemove')
  eventManager.set('mouseenter')
  eventManager.set('mouseleave')
  eventManager.set('contextmenu')
}

/**
* @param {String} id event listener unique id
* @param {String} event e.g. mousedown, keyup, etc.
* @param {Function} cb event callback
*/
Hardware.prototype.addListener = function (id, event, cb) {
  if (!event || !id || !cb) throw Error('Invalid arguments.', { event, id, cb })
  if (!eventManager.isset(event)) throw Error('Unknown event.', event)

  eventManager.add(event, id, cb)
  window.addEventListener(event, cb)
}

/**
* @param {String} id event listener unique id
* @param {String} event e.g. mousedown, keyup, etc.
*/
Hardware.prototype.removeListener = function (id, event) {
  if (!event || !id) throw Error('Invalid arguments.', { event, id })
  if (!eventManager.isset(event)) throw Error('Unknown event.', event)
  if (!eventManager.has(event, id)) throw Error(`No ${event} listener with this id: ${id}`)

  /* remove attached event from window first */
  window.removeEventListener(event, eventManager.get(event, id))
  eventManager.remove(event, id)
}

let instance = new Hardware()
const getInstance = () => {
  if (!instance) instance = new Hardware()
  return instance
}

export { Hardware, getInstance }
