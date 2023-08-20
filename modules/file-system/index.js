import { storage } from "../storage"
import { FileSystemObject } from "./FileSystemObject"
import { getInstance as getEventManager } from '../event-manager'
import { getInstance as getDirectoryManager } from "./directory-manager"
import { MOVE, CREATE_DIRECTORY, CREATE_FILE, ADD_TO_STORAGE, DELETE, NAMESPACE, TYPE_DIRECTORY, TYPE_FILE } from './constants'

const eventManager = getEventManager()
const directoryManager = getDirectoryManager()

eventManager.set(NAMESPACE)
function dispatch(event, data) {
  eventManager.dispatch(NAMESPACE, event, data)
  return data
}

function CustomFileSystem() {
  this.read = (d) => console.info(d)
  this.isSystemFile = (d) => d.isSystemFile
  this.addListener = (k, v) => eventManager.add(NAMESPACE, k, v)

  this.createFile = function (options = {}) {
    return dispatch(CREATE_FILE, new FileSystemObject({
      type: 'file',
      ...options
    }))
  }

  this.getParentPath = (path) => {
    const splitted = path.split('/')
    splitted.pop()
    if (splitted.length > 1) splitted.pop()

    return splitted.join('/') + '/'
  }

  this.rename = function (d, newName) {
    d.name = newName
    return d
  }

  this.addToStorage = function (object = {}) {
    storage.add(object.path, dispatch(ADD_TO_STORAGE, object))
  }

  this.move = function (toBeMoved, target) {
    if (target.type !== TYPE_DIRECTORY || toBeMoved === target) return

    if (toBeMoved.type === TYPE_FILE) {
      target.data.set(toBeMoved.id, { ...toBeMoved, path: target.path })
      storage.deletePathData(toBeMoved.path, toBeMoved.id)
    } else {
      storage.bulkModify(toBeMoved.path, target.path)
    }

    return dispatch(MOVE, { toBeMoved, target })
  }

  this.delete = function (object = {}) {
    storage.delete(dispatch(DELETE, object))
  }

  /* Initialize storage root directory */
  storage.add('/', {
    ...new FileSystemObject({ type: 'directory' }),
    path: '/',
    name: 'root',
    data: new Map(),
    isSystemFile: true
  })
}

/* facades */
CustomFileSystem.prototype.get = storage.get.bind(storage)
CustomFileSystem.prototype.set = storage.set.bind(storage)
CustomFileSystem.prototype.getWithPath = storage.getWithPath.bind(storage)
CustomFileSystem.prototype.createDirectory = directoryManager.create.bind(directoryManager)
CustomFileSystem.prototype.createSystemDirectory = directoryManager.createSystemDirectory.bind(directoryManager)
CustomFileSystem.prototype.listenToDirectory = directoryManager.addListener.bind(directoryManager)

let instance = new CustomFileSystem()
const getInstance = () => {
  if (!instance) instance = new CustomFileSystem()
  return instance
}

export { MOVE, DELETE, CREATE_FILE, CREATE_DIRECTORY, ADD_TO_STORAGE }
export { CustomFileSystem, getInstance }

/* @todo add test */
// const fs = new CustomFileSystem()
// const f = fs.createFile()
// const d = fs.createDirectory()
// fs.read(f)
// fs.read(d)
// fs.addToDirectory(f, d)
// fs.read(d)