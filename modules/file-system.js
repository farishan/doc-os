import { getInstance as getStorage } from "./storage"

let instance

const storage = getStorage()

function CustomFileSystem() {
  const MAX_INT = 9007199254740991
  const MAX_INT_MOD = -3
  const DEFAULT_SIZE = 1

  let id = 0
  let string = getRandomString()

  this.listener = new Map()
  this.directoryListener = {}

  function getRandomString() {
    return Math.random().toString(36).slice(2, 5)
  }

  function getId() {
    if (id > MAX_INT + MAX_INT_MOD) {
      id = 0
      string = getRandomString()
    }

    return ++id + string
  }

  function createFileSystemObject(options = {}) {
    const { type, name, path } = options

    const id = type.slice(0, 1) + getId()

    return {
      id,
      path: type === 'directory' ? path + id + '/' : path,
      type,
      name: name || type,
      size: DEFAULT_SIZE
    }
  }

  this.createFile = function (options = {}) {
    const file = createFileSystemObject({
      type: 'file',
      ...options
    })

    this.listener.forEach((v, k) => {
      v({ event: CustomFileSystem.CREATE_FILE, data: file })
    })

    return file
  }

  this.createDirectory = function (options = {}) {
    const directory = {
      ...createFileSystemObject({ type: 'directory', ...options }),
      data: new Map(),
    }

    this.listener.forEach((v, k) => {
      v({ event: CustomFileSystem.CREATE_DIRECTORY, data: directory })
    })

    return directory
  }

  this.createRootDirectory = function () {
    return {
      ...createFileSystemObject({ type: 'directory' }),
      path: '/',
      name: 'root',
      data: new Map(),
      isSystemFile: true
    }
  }

  this.createSystemDirectory = function (name) {
    return {
      ...createFileSystemObject({ type: 'directory' }),
      path: '/' + name + '/',
      name,
      data: new Map(),
      isSystemFile: true
    }
  }

  this.getParentPath = (path) => {
    const splitted = path.split('/')
    splitted.pop()
    if (splitted.length > 1) splitted.pop()

    return splitted.join('/') + '/'
  }

  this.isSystemFile = (d) => {
    return d.isSystemFile
  }

  this.addListener = (k, v) => {
    this.listener.set(k, v)
  }

  this.listenToDirectory = (directory, fn) => {
    if (!this.directoryListener[directory.id]) {
      this.directoryListener[directory.id] = []
    } else {
      this.directoryListener[directory.id].push(fn)
    }
  }

  this.rename = function (d, newName) {
    d.name = newName
    return d
  }

  this.read = function (d) {
    console.info(d)
  }

  this.addToStorage = function (object = {}) {
    storage.add(object.path, object)

    this.listener.forEach((v, k) => {
      v({ event: CustomFileSystem.ADD_TO_STORAGE, data: object })
    })
  }

  this.move = function (toBeMoved, target) {
    if (target.type !== 'directory') return

    if (toBeMoved.type === 'file') {
      target.data.set(toBeMoved.id, toBeMoved)
      storage.deletePathData(toBeMoved.path, toBeMoved.id)
    } else {
      storage.bulkModify(toBeMoved.path, target.path)
    }

    this.listener.forEach((v, k) => {
      v({ event: CustomFileSystem.MOVE, data: { toBeMoved, target } })
    })
  }

  this.set = function (k, v) {
    storage.set(k, v)
  }

  this.get = function (path) {
    return storage.get(path)
  }

  this.delete = function (object = {}) {
    this.listener.forEach((v, k) => {
      v({ event: CustomFileSystem.DELETE, data: object })
    })

    storage.delete(object)
  }

  /* Initialize storage root directory */
  const rootDirectory = this.createRootDirectory()
  storage.add('/', rootDirectory)
}

CustomFileSystem.ADD_TO_STORAGE = 'addToStorage'
CustomFileSystem.CREATE_FILE = 'createFile'
CustomFileSystem.CREATE_DIRECTORY = 'createDirectory'
CustomFileSystem.DELETE = 'delete'
CustomFileSystem.MOVE = 'move'

const getInstance = () => {
  if (!instance) instance = new CustomFileSystem()
  return instance
}

export const MOVE = CustomFileSystem.MOVE
export const DELETE = CustomFileSystem.DELETE
export const CREATE_FILE = CustomFileSystem.CREATE_FILE
export const CREATE_DIRECTORY = CustomFileSystem.CREATE_DIRECTORY
export const ADD_TO_STORAGE = CustomFileSystem.ADD_TO_STORAGE

export { CustomFileSystem, getInstance }

/* @todo add test */
// const fs = new CustomFileSystem()
// const f = fs.createFile()
// const d = fs.createDirectory()
// fs.read(f)
// fs.read(d)
// fs.addToDirectory(f, d)
// fs.read(d)