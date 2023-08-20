
import { Observable } from "./observable"

const observable = new Observable()

function LoopEngine() {
  let handle = null;
  let shouldRun = false;

  const loop = () => {
    this.notify()
    if (shouldRun) handle = requestAnimationFrame(loop)
  }

  this.start = () => {
    if (shouldRun) return
    shouldRun = true
    handle = requestAnimationFrame(loop)
  }

  this.stop = () => {
    shouldRun = false
    cancelAnimationFrame(handle)
  }
}

/* facades */
LoopEngine.prototype.notify = observable.notify.bind(observable)
LoopEngine.prototype.observe = observable.observe.bind(observable)
LoopEngine.prototype.unobserve = observable.unobserve.bind(observable)
LoopEngine.prototype.getObserver = observable.getObserver.bind(observable)
LoopEngine.prototype.hasObserver = observable.hasObserver.bind(observable)
LoopEngine.prototype.getObservers = observable.getObservers.bind(observable)

const loopEngine = new LoopEngine()
export { LoopEngine, loopEngine }
