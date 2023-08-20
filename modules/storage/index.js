function CustomStorage() {
  const data = new Map()
  let size = 0

  this.add = function (k, v) {
    if (!k || !v) throw Error('Invalid arguments.', { k, v })

    if (v.size) size += v.size

    if (!data.has(k)) {
      data.set(k, v)
    } else {
      const pathObject = data.get(k)

      if (!pathObject.data) return

      /** pathObject is a directory with data prop */
      if (pathObject.size && v.size) pathObject.size += v.size
      pathObject.data.set(v.id, v)
    }
  }

  this.getDirectories = (path, result) => {
    data.forEach((v, k) => {
      if (path === '/') {
        /* is root.
        return directory with path like this: "/dir/" (two slashes) */
        if ((k.match(/\//g) || []).length === 2) result.set(k, v)
      } else {
        if (k !== path && k.startsWith(path)) {
          /* return directory with path like this: "dir/" (one slash) */
          if ((k.replace(path, '').match(/\//g) || []).length === 1) {
            result.set(k, v)
          }
        }
      }
    })
  }

  this.getFiles = (path, result) => {
    const pathObject = data.get(path)
    if (!pathObject) return
    if (!pathObject.data) return
    pathObject.data.forEach(d => result.set(d.id, d))
  }

  this.get = (k) => data.get(k)

  this.getWithPath = function (path) {
    if (!path) throw Error('Invalid path.', path)

    let result = new Map()
    this.getDirectories(path, result)
    this.getFiles(path, result)

    return result
  }

  this.deletePathData = (path, key) => data.get(path).data.delete(key)
  this.getSize = () => size
  this.set = (k, v) => data.set(k, v)
  this.deleteByPath = (path) => data.delete(path)

  this.bulkModify = function (parameter, modifier) {
    data.forEach((v, k) => {
      if (!k.startsWith(parameter)) return

      v.path = modifier + k.substring(1)
      data.set(v.path, v)
      data.delete(k)
    })
  }

  this.delete = function (object) {
    if (object.type === 'directory') {
      data.delete(object.path)
    } else {
      const pathObject = data.get(object.path)
      if (pathObject.size && object.size) pathObject.size -= object.size
      pathObject.data.delete(object.id)
    }
  }

  this.log = () => console.info(data)

  /* aliases */
  this.write = this.set.bind(this)
  this.read = this.get.bind(this)
}


const storage = new CustomStorage()
export { CustomStorage, storage }
