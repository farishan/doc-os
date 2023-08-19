import getId from "../../modules/getId"

function StorageManager(storage = {}) {
    const self = this
    const storageManager = this
    this.storage = storage

    /* Helper function for save any data to any storage */
    function set(target, key, value) {
        if (target[key]) throw Error('Key collision detected!')

        target[key] = value
        return key
    }

    /* Basic set function, with auto ID assign */
    this.set = function (data) {
        const id = getId()
        if (self.storage[id]) throw Error('ID collision detected!')

        set(self.storage, id, data)

        return id
    }

    /* Basic get function */
    this.get = function (key) {
        return this.storage[key]
    }

    /**
     * register space for a name
     * @param {string} namespace
     */
    this.register = function (namespace) {
        if (this.storage[namespace]) console.warn('Namespace already registered! ' + namespace)

        this.storage[namespace] = {}
        return self.use(namespace)
    }

    /* Use a named space in storage */
    this.use = function (namespace) {
        return {
            set: function (data) {

                const id = data.id || getId()
                set(storageManager.storage[namespace], id, data)
            },
            get: function (key) {
                if (key) {
                    return self.storage[namespace][key]
                }

                return self.storage[namespace]
            }
        }
    }

    return this
}

export default StorageManager