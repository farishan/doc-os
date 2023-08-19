define(() => {
    let instance

    function Storage() {
        let size = 0
        const data = new Map()

        this.add = function (k, v) {
            if (!k || !v) throw Error('Invalid arguments.')

            if (v.size) size += v.size

            if (!data.has(k)) {
                data.set(k, v)
            } else {
                const pathObject = data.get(k)

                if (pathObject.data/** k is a directory with data prop */) {
                    if (pathObject.size && v.size) pathObject.size += v.size
                    pathObject.data.set(v.id, v)
                }
            }
        }

        this.get = function (path) {
            if (!path) throw Error('Invalid path.', path)

            let result = new Map()

            /* Get directories */
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

            /* Get files */
            const pathObject = data.get(path)
            if (pathObject) {
                if (pathObject.data) {
                    pathObject.data.forEach(d => result.set(d.id, d))
                }
            }

            return result
        }

        this.deletePathData = (path, key) => {
            return data.get(path).data.delete(key)
        }

        this.getSize = function () {
            return size
        }

        this.set = function (k, v) {
            data.set(k, v)
        }

        this.bulkModify = function (parameter, modifier) {
            data.forEach((v, k) => {
                if (k.startsWith(parameter)) {
                    v.path = modifier + k.substring(1)
                    data.set(v.path, v)
                    data.delete(k)
                }
            })
        }

        this.deleteByPath = function (path) {
            data.delete(path)
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

        this.log = () => {
            console.info(data)
        }
    }

    return {
        Storage,
        getInstance: () => {
            if (!instance) {
                instance = new Storage()
            }
            return instance
        }
    }
})