define(() => {
    'use strict';

    function UI_WindowHeader(args) {
        const options = {
            name: '',
            onmousedown: () => { },
            onclose: () => { },
            ...args,
        }

        this.$element = document.createElement('div')

        if (options.draggable) this.$element.style.cursor = 'grab'
        else this.$element.style.cursor = 'auto'
        this.$element.style.borderBottom = `${options.style.borderWidth}px ${options.style.borderStyle}`
        this.$element.style.padding = options.style.padding + 'px'

        const $closeButton = document.createElement('button')
        $closeButton.style.marginRight = options.style.padding + 'px'
        $closeButton.innerHTML = '&#x2715'
        this.$element.appendChild($closeButton)

        this.$element.innerHTML += options.name

        this.$element.onmousedown = e => {
            options.onmousedown()

            if (options.draggable) {
                this.$element.style.cursor = 'grabbing'
            }
        }

        this.$element.onmouseup = e => {
            if (e.target.innerText === "✕") {
                options.onclose()
                return
            }

            if (options.draggable) {
                this.$element.style.cursor = 'grab'
            }
        }

        return this
    }

    function UI_WindowBody(options) {
        this.$element = document.createElement('div')
        this.$element.style.padding = options.style.padding + 'px'
        this.$element.style.overflow = 'auto'
        this.$element.style.cursor = 'auto'
        this.$element.style.boxSizing = 'border-box'
        this.$element.style.height = '100%'

        this.reset = (dom) => {
            this.$element.innerHTML = ''
            this.$element.appendChild(dom)
        }

        return this
    }

    function UI_Window(args) {
        const self = this
        const options = {
            id: Math.random().toString(36).slice(2, 9),
            style: {
                padding: 8,
                borderWidth: 1,
                borderStyle: 'solid'
            },
            theme: {
                style: {
                    body: {
                        backgroundColor: '#222222'
                    }
                }
            },
            ...args
        }

        this.id = options.id
        this.theme = options.theme
        this.name = options.name || this.id
        this.isHeaderMousedown = false
        this.minWidth = 150
        this.minHeight = 150
        const extraSize = 50
        this.padding = options.style.padding

        /**
         * Threshold in pixels for detecting resizer locations and change cursor.
         * - Min: 3
         * - Max: 10
         * - Bigger == easier to spot resizers & cost more CPU task.
         */
        this.cursorThreshold = options.style.padding // px
        this.eventListener = { close: [] }

        /* Definitions */
        this.$window = document.createElement('div')
        this.$background = document.createElement('div')
        this.$wrapper = document.createElement('div')
        this.$wrapper.appendChild(this.$background)
        this.$window.appendChild(this.$wrapper)

        /* Header */
        this.header = new UI_WindowHeader({
            ...options,
            name: this.name,
            onmousedown: () => this.isHeaderMousedown = true,
            onclose: handleClose
        })
        this.$wrapper.appendChild(this.header.$element)

        /* Body */
        this.body = new UI_WindowBody(options)
        this.$wrapper.appendChild(this.body.$element)

        /* Styles */
        this.setTheme(this.theme)
        this.$window.style.padding = options.style.padding + 'px'
        this.$window.style.boxSizing = 'border-box'
        this.$window.style.userSelect = 'none'
        this.$window.style.minWidth = this.minWidth + 'px'
        this.$window.style.minHeight = this.minHeight + 'px'
        if (options.initialWidth) {
            this.$window.style.width = options.initialWidth + extraSize + 'px'
        } else {
            this.$window.style.width = this.minWidth + extraSize + 'px'
        }
        this.$window.style.height = this.minHeight + extraSize + 'px'

        this.$background.style.position = 'absolute'
        this.$background.style.left = 0
        this.$background.style.top = 0
        this.$background.style.right = 0
        this.$background.style.bottom = 0
        this.$background.style.zIndex = -1
        this.$background.style.opacity = 0.9

        this.$wrapper.style.minWidth = this.minWidth - options.style.padding * 2 + 'px'
        this.$wrapper.style.minHeight = this.minHeight - options.style.padding * 2 + 'px'
        this.$wrapper.style.width = this.minWidth + extraSize - options.style.padding * 2 + 'px'
        this.$wrapper.style.height = this.minHeight + extraSize - options.style.padding * 2 + 'px'
        this.$wrapper.style.position = 'absolute'
        this.$wrapper.style.border = `${options.style.borderWidth}px ${options.style.borderStyle}`
        this.$wrapper.style.overflow = 'hidden'

        /* Interaction */
        this.$window.oncontextmenu = e => {
            e.preventDefault()
            e.stopPropagation()
        }

        function handleClose() {
            self.$window.remove()

            self.eventListener.close.forEach(listener => {
                listener()
            });
        }

        return this
    }

    UI_Window.prototype.setTheme = function (theme) {
        this.$background.style.backgroundColor = theme.style.body.backgroundColor
    }

    UI_Window.prototype.addEventListener = function (eventKey, fn) {
        this.eventListener[eventKey].push(fn)
    }

    /**
     * Get selected resizer
     * @param {Event} ev click event
     */
    UI_Window.prototype.getClickedResizer = function (x, y) {
        /* "n" or "north" means, mouse y is below top side and above {top side + cursor threshold} */
        const n = y > this.$window.offsetTop
            && y < this.$window.offsetTop + this.cursorThreshold,
            e = x < this.$window.offsetLeft + this.$window.offsetWidth
                && x > this.$window.offsetLeft + this.$window.offsetWidth - this.cursorThreshold,
            s = y < this.$window.offsetTop + this.$window.offsetHeight
                && y > this.$window.offsetTop + this.$window.offsetHeight - this.cursorThreshold,
            w = x > this.$window.offsetLeft
                && x < this.$window.offsetLeft + this.cursorThreshold

        return s && e ? 'se'
            : s && w ? 'sw'
                : n && e ? 'ne'
                    : n && w ? 'nw'
                        : n ? 'n'
                            : e ? 'e'
                                : s ? 's'
                                    : w ? 'w'
                                        : ''
    }

    UI_Window.prototype.setContent = function (element) {
        this.body.reset(element)
    }

    UI_Window.prototype.finalize = function () {
        this.$wrapper.style.width = this.$window.offsetWidth - this.padding * 2 + 'px'
        this.$wrapper.style.height = this.$window.offsetHeight - this.padding * 2 + 'px'

        this.body.$element.style.maxHeight = this.$wrapper.offsetHeight - this.header.$element.offsetHeight + 'px'
    }

    return UI_Window
})