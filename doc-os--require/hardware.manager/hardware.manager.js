define(() => {
    function Hardware() {
        this.listener = {
            mousedown: {},
            mousemove: {},
            mouseup: {},
            mouseenter: {},
            mouseleave: {},
            contextmenu: {},

            keydown: {},
            keyup: {},

            resize: {}
        }
    }

    /**
     * @param {String} id event listener unique id
     * @param {String} event e.g. mousedown, keyup, etc.
     * @param {Function} cb event callback
     */
    Hardware.prototype.addListener = function (id, event, cb) {
        if (!event || !id || !cb) throw Error('Invalid arguments.', { event, id, cb })
        if (!this.listener[event]) throw Error('Unknown event.', event)

        this.listener[event][id] = cb
        window.addEventListener(event, cb)
    }

    /**
     * @param {String} id event listener unique id
     * @param {String} event e.g. mousedown, keyup, etc.
     */
    Hardware.prototype.removeListener = function (id, event) {
        if (!event || !id) throw Error('Invalid arguments.', { event, id })
        if (!this.listener[event]) throw Error('Unknown event.', event)
        if (!this.listener[event][id]) throw Error(`No ${event} listener with this id: ${id}`)

        window.removeEventListener(event, this.listener[event][id])
        delete this.listener[event][id]
    }

    return new Hardware()
})