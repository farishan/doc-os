function EventManager() {
  const eventsByKey = {
    // 'event_key': () => {}
  }

  const eventsByScope = {
    // 'scope': {
    //   'event_key': () => {}
    // }
  }

  /**
   * @method `on`
   * @param {string} key
   * @param {Function} fn
   */
  this.on = (key, fn) => eventsByKey[key] = fn

  /**
   * @method `off`
   * @param {string} key
   */
  this.off = (key) => delete eventsByKey[key]

  /**
   * @method `get`
   * @param {string} scope
   * @param {string} key - _optional_
   */
  this.get = (scope, key) => {
    if (!eventsByScope[scope]) this.set(scope)
    return key ? eventsByScope[scope][key] : eventsByScope[scope]
  }

  /**
   * @method `set`
   * @param {string} scope
   */
  this.set = (scope) => eventsByScope[scope] = {}

  /**
   * @method `isset`
   * @param {string} scope
   */
  this.isset = (scope) => eventsByScope[scope] ? true : false

  /**
   * @method `add`
   * @param {string} scope
   * @param {string} key
   * @param {Function} fn
   */
  this.add = (scope, key, fn) => {
    if (!eventsByScope[scope]) this.set(scope)
    eventsByScope[scope][key] = fn
  }

  /**
   * @method `remove`
   * @param {string} scope
   * @param {string} key
   */
  this.remove = (scope, key) => {
    if (!eventsByScope[scope]) this.set(scope)

    if (key) delete eventsByScope[scope][key]
    else delete eventsByScope[scope]
  }

  /**
   * check if a scope has event with provided key
   * @param {string} scope
   * @param {string} key
   * @returns boolean
   */
  this.has = (scope, key) => eventsByScope[scope] && eventsByScope[scope][key] ? true : false

  this.dispatch = (scope, event, data) => {
    for (let index = 0; index < Object.keys(eventsByScope[scope]).length; index++) {
      const key = Object.keys(eventsByScope[scope])[index];
      eventsByScope[scope][key]({ event, data })
    }
  }

  return this
}

let instance = new EventManager()
const getInstance = () => {
  if (!instance) instance = new EventManager()
  return instance
}

export { EventManager, getInstance }
