import { FileSystemObject } from "./FileSystemObject"
import { CREATE_DIRECTORY, NAMESPACE } from "./constants"
import { getInstance as getEventManager } from "../event-manager"

const eventManager = getEventManager()

function DirectoryManager() {
  this.create = function (options = {}) {
    const data = {
      ...new FileSystemObject({ type: 'directory', ...options }),
      data: new Map(),
    }
    eventManager.dispatch(NAMESPACE, CREATE_DIRECTORY, data)
    return data
  }

  this.createSystemDirectory = function (name) {
    return {
      ...new FileSystemObject({ type: 'directory' }),
      path: '/' + name + '/',
      name,
      data: new Map(),
      isSystemFile: true
    }
  }

  this.addListener = (namespace, directory, fn) => {
    eventManager.add(`${NAMESPACE}_dir`, `${namespace}_${directory}`, fn)
  }

  return this
}

let instance = new DirectoryManager()
const getInstance = () => {
  if (!instance) instance = new DirectoryManager()
  return instance
}

export { DirectoryManager, getInstance }
