define(() => {
    let instance

    function SoftwareManager() {
        this.accessKey = 'software'
        this.software = new Map()
        this.listener = {
            install: []
        }
    }

    SoftwareManager.prototype.install = function (software) {
        if (!software) throw Error('Undefined software.')
        if (!software.name) throw Error('Software name is required.')
        if (!software.start) throw Error('Software start function is required.')

        this.software.set(software.name, software)

        this.listener.install.forEach(fn => {
            fn()
        });
    }

    SoftwareManager.prototype.getAllExcepts = function (filter) {
        let softwares = []
        for (const [key, value] of this.software) {
            if (!filter.includes(key)) softwares.push(value)
        }
        return softwares
    }

    SoftwareManager.prototype.getAllExcept = function (name) {
        let softwares = []
        for (const [key, value] of this.software) {
            if (key !== name) softwares.push(value)
        }
        return softwares
    }

    SoftwareManager.prototype.get = function (name) {
        if (!name || !this.software.get(name)) throw Error('Unknown software.')
        return this.software.get(name)
    }

    SoftwareManager.prototype.run = function (key, payload) {
        this.software.get(key).start(payload)
    }

    SoftwareManager.prototype.addEventListener = function (event, cb) {
        if (!this.listener[event]) throw Error('Unknown event.', event)

        this.listener[event].push(cb)
    }

    return {
        SoftwareManager,
        getInstance: () => {
            if (!instance) {
                instance = new SoftwareManager()
            }
            return instance
        }
    }
})