import getId from "./getId"

const objectManager = {
    storage: {},
    setStorage: function (storage) {
        this.storage = storage
    },
    register: function (key, value) {
        if (this.storage[key]) throw Error('Key already used.')

        this.storage[key] = value
    },
    create: function (data, key) {
        const id = getId()
        if (this.storage[id]) throw Error('ID collision detected!')

        if (key) {
            if (!this.storage[key]) throw Error('Unknown storage part: ' + key)
            this.storage[key][id] = data
        }

        this.storage[id] = data
        return id
    }
}

export default objectManager