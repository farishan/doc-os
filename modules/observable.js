export function Observable() {
  const observersByKey = {}
  this.getObserver = (key) => observersByKey[key]
  this.observe = (key, fn) => observersByKey[key] = fn
  this.unobserve = (key) => delete observersByKey[key]
  this.hasObserver = (key) => observersByKey[key] ? true : false
  this.getObservers = () => Object.keys(observersByKey).map(k => observersByKey[k])
  this.notify = (message) => {
    const observers = this.getObservers()
    for (let index = 0; index < observers.length; index++) {
      const o = observers[index];
      o(message)
    }
  }
}
