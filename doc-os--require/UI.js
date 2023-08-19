define(['hardware.manager/hardware.manager', 'UI_Window'], (hardware, UI_Window) => {
    'use strict';

    let instance;

    function UI() {
        const self = this
        const windowByName = {}

        const darkTheme = {
            name: 'dark',
            backgroundColor: '#222222',
            borderWidth: 1, //px
            borderStyle: 'solid',
            style: {
                body: {
                    backgroundColor: '#222222',
                    color: '#ffffff',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
                },
                button: {
                    cursor: 'pointer',
                },
            }
        }

        const lightTheme = {
            name: 'light',
            backgroundColor: '#ffffff',
            borderWidth: 1, //px
            borderStyle: 'solid',
            style: {
                body: {
                    backgroundColor: '#ffffff',
                    color: '#222222',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
                },
                button: {
                    cursor: 'pointer',
                },
            }
        }

        const themeMap = {
            dark: darkTheme,
            light: lightTheme
        }

        this.theme = null
        this.listener = {}
        this.$contextMenu = undefined;
        this.$contextMenus = [];
        this.getContextMenu = () => { }

        this.showContextMenu = function (x, y, content) {
            const $menu = document.createElement('div')
            $menu.style.border = '1px solid'
            $menu.style.padding = '8px'
            $menu.style.position = 'absolute'
            $menu.style.zIndex = 9
            $menu.style.left = x + 'px'
            $menu.style.top = y + 'px'

            $menu.style.backgroundColor = self.theme.style.body.backgroundColor

            $menu.onclick = () => this.destroyContextMenu()
            $menu.oncontextmenu = (e) => {
                e.preventDefault()
                e.stopPropagation()
            }

            if (content) {
                content.forEach(element => {
                    element.style.display = 'block'
                    $menu.appendChild(element)
                });
            } else {
                this.$contextMenus.forEach(element => {
                    $menu.appendChild(element)
                });
            }

            this.$contextMenu = $menu

            document.body.appendChild(this.$contextMenu)
        }

        this.moveContextMenu = function (x, y) {
            this.$contextMenu.style.left = x + 'px'
            this.$contextMenu.style.top = y + 'px'
        }

        this.destroyContextMenu = function () {
            if (!this.$contextMenu) return
            this.$contextMenu.remove()
            this.$contextMenu = undefined
        }

        this.addToContextMenu = function (dom) {
            dom.style.display = 'block'
            this.$contextMenus.push(dom)
        }

        this.sendToTop = function (customWindow) {
            if (!customWindow) return

            /* Decrease all windows zIndex,
            increase clicked window's zIndex */
            for (let [, v] of Object.entries(windowByName)) {
                const parsed = parseInt(v.$window.style.zIndex)
                if (parsed > 1) v.$window.style.zIndex = parsed - 1
            }

            customWindow.$window.style.zIndex = 5
        }

        function initWindowInteraction(customWindow, options = {}) {
            const $window = customWindow.$window
            const $wrapper = customWindow.$wrapper
            $window.style.position = 'absolute'

            const { resizeable, draggable, style = { padding: 16 } } = options

            let startPoint = { x: 0, y: 0 }
            let distance = { x: 0, y: 0 }
            let startDimension = { w: 0, h: 0 }
            let isMouseDown = false
            let isResizing = false
            let isDragging = false
            let resizePoint = ''

            const prepareForInteraction = ev => {
                isMouseDown = true

                self.sendToTop(customWindow)

                startPoint.x = ev.clientX
                startPoint.y = ev.clientY
                startDimension.w = $window.offsetWidth
                startDimension.h = $window.offsetHeight
                distance.x = Math.abs(startPoint.x - $window.offsetLeft)
                distance.y = Math.abs(startPoint.y - $window.offsetTop)
                resizePoint = customWindow.getClickedResizer(ev.clientX, ev.clientY)
            }

            const getProperCursor = ev => {
                if (isResizing || isDragging) return

                const n = ev.clientY > $window.offsetTop
                    && ev.clientY < $window.offsetTop + customWindow.cursorThreshold,
                    e = ev.clientX < $window.offsetLeft + $window.offsetWidth
                        && ev.clientX > $window.offsetLeft + $window.offsetWidth - customWindow.cursorThreshold,
                    s = ev.clientY < $window.offsetTop + $window.offsetHeight
                        && ev.clientY > $window.offsetTop + $window.offsetHeight - customWindow.cursorThreshold,
                    w = ev.clientX > $window.offsetLeft
                        && ev.clientX < $window.offsetLeft + customWindow.cursorThreshold

                if ((n && w) || (s && e)) {
                    $window.style.cursor = 'nwse-resize'
                    return
                } else if ((n && e) || (s && w)) {
                    $window.style.cursor = 'nesw-resize'
                    return
                } else if (e || w) {
                    $window.style.cursor = 'col-resize'
                    return
                } else if (n || s) {
                    $window.style.cursor = 'row-resize'
                    return
                }
                $window.style.cursor = 'auto'
            }

            /* warning: this function below called on every mousemove on window */
            const dragAndResize = e => {
                if (!isMouseDown) return

                if (customWindow.isHeaderMousedown) {
                    if (!draggable) return

                    $window.style.left = (e.clientX - distance.x) + 'px'
                    $window.style.top = (e.clientY - distance.y) + 'px'
                } else {
                    if (!resizeable) return

                    if (resizePoint.includes('e')) {
                        $window.style.width = (startDimension.w - (startPoint.x - e.clientX)) + 'px'
                        $wrapper.style.width = (startDimension.w - (startPoint.x - e.clientX)) - customWindow.padding * 2 + 'px'
                    } else if (resizePoint.includes('w')) {
                        if (e.clientX - distance.x < startPoint.x + startDimension.w - style.padding * 2 - customWindow.cursorThreshold) {
                            if ((startDimension.w + (startPoint.x - e.clientX)) - customWindow.minWidth > 0) {
                                $window.style.left = (e.clientX - distance.x) + 'px'
                                $window.style.width = (startDimension.w + (startPoint.x - e.clientX)) + 'px'
                                $wrapper.style.width = (startDimension.w + (startPoint.x - e.clientX)) - customWindow.padding * 2 + 'px'
                            }
                        }
                    }

                    if (resizePoint.includes('s')) {
                        $window.style.height = (startDimension.h - (startPoint.y - e.clientY)) + 'px'
                        $wrapper.style.height = (startDimension.h - (startPoint.y - e.clientY)) - customWindow.padding * 2 + 'px'
                    } else if (resizePoint.includes('n')) {
                        if (e.clientY - distance.y < startPoint.y + startDimension.h - style.padding * 2 - customWindow.cursorThreshold) {
                            if ((startDimension.h + (startPoint.y - e.clientY)) - customWindow.minHeight > 0) {
                                $window.style.top = (e.clientY - distance.y) + 'px'
                                $window.style.height = (startDimension.h + (startPoint.y - e.clientY)) + 'px'
                                $wrapper.style.height = (startDimension.h + (startPoint.y - e.clientY)) - customWindow.padding * 2 + 'px'
                            }
                        }
                    }

                    customWindow.body.$element.style.maxHeight = $wrapper.offsetHeight - customWindow.header.$element.offsetHeight + 'px'
                }
            }

            $window.onmousedown = prepareForInteraction
            if (resizeable) $window.onmousemove = getProperCursor

            /* add custom window's listener to UI manager window event listeners */
            self.addEventListener(customWindow.id, 'mousemove', dragAndResize)
            self.addEventListener(customWindow.id, 'mouseup', () => {
                isMouseDown = false
                isResizing = false
                isDragging = false
                customWindow.isHeaderMousedown = false
            })
        }

        /**
         *
         * @param {Object} args
         * draggable, resizeable,
         * style.padding, style.borderWidth, style.borderStyle
         * @returns
         */
        this.createWindow = function (args) {
            const options = {
                draggable: false,
                resizeable: false,
                theme: self.theme,
                ...args
            }

            /* Definition */
            const customWindow = new UI_Window(options)

            if (windowByName[customWindow.name]) return;

            windowByName[customWindow.name] = customWindow

            /* Init listener for window */
            self.listener[customWindow.id] = {}

            if (options.draggable || options.resizeable) {
                initWindowInteraction(customWindow, options)
            }

            /* Also remove custom window's listeners when the element destroyed */
            customWindow.addEventListener('close', function () {
                self.destroyWindow(customWindow.name)
            })

            document.body.appendChild(customWindow.$window)
            customWindow.finalize()

            return customWindow
        }

        this.destroyWindow = function (name) {
            const customWindow = windowByName[name]

            delete self.listener[customWindow.id]
            delete windowByName[name]
        }

        this.closeAllWindow = function () {
            for (let [, v] of Object.entries(windowByName)) {
                v.$window.remove()
                this.destroyWindow(v.name)
            }
        }

        this.isWindowOpened = function (name) {
            return windowByName[name] !== undefined
        }

        this.setWindowContent = function (name, element) {
            const customWindow = windowByName[name]
            if (customWindow) customWindow.setContent(element)
        }

        this.createIcon = function (id, dom) {
            self.listener[id] = {}

            let isMouseDown = false
            let isDragging = false
            let startPoint = { x: 0, y: 0 }
            let distance = { x: 0, y: 0 }

            const $icon = document.createElement('div')
            $icon.appendChild(dom)
            $icon.style.border = '1px solid'
            $icon.style.position = 'absolute'
            $icon.style.left = 0
            $icon.style.top = 0
            $icon.style.cursor = 'grab'
            $icon.style.userSelect = 'none'

            $icon.onmousedown = ev => {
                isMouseDown = true

                startPoint.x = ev.clientX
                startPoint.y = ev.clientY
                distance.x = Math.abs(startPoint.x - $icon.offsetLeft)
                distance.y = Math.abs(startPoint.y - $icon.offsetTop)

                $icon.style.cursor = 'grabbing'
            }
            self.addEventListener(id, 'mousemove', ev => {
                if (!isMouseDown) return
                isDragging = true

                $icon.style.left = (ev.clientX - distance.x) + 'px'
                $icon.style.top = (ev.clientY - distance.y) + 'px'
            })
            self.addEventListener(id, 'mouseup', () => {
                isMouseDown = false
                isDragging = false

                $icon.style.cursor = 'grab'
            })

            return $icon
        }

        this.addEventListener = function (id, key, fn) {
            this.listener[id][key] = fn
        }

        function initEventListeners() {
            hardware.addListener('UI', 'mousemove', e => {
                for (let [, v] of Object.entries(self.listener)) {
                    if (v['mousemove']) v['mousemove'](e)
                }
            })

            hardware.addListener('UI', 'mouseup', e => {
                for (let [, v] of Object.entries(self.listener)) {
                    if (v['mouseup']) v['mouseup'](e)
                }
            })

            hardware.addListener('UI', 'contextmenu', e => {
                e.preventDefault()

                self.getContextMenu(e.target)

                if (self.$contextMenu) {
                    self.moveContextMenu(e.clientX, e.clientY)
                    return
                }

                self.showContextMenu(e.clientX, e.clientY)
            })

            hardware.addListener('UI', 'mousedown', e => {
                if (!self.$contextMenu || e.target === self.$contextMenu) return
                if (self.$contextMenu.contains(e.target)) return
                self.destroyContextMenu()
            })
        }

        this.getTheme = function () {
            return this.theme
        }

        this.themeListeners = []

        this.addThemeListener = function (cb) {
            this.themeListeners.push(cb)
        }

        this.setTheme = function (theme) {
            if (typeof theme === 'string' && themeMap[theme]) {
                this.setTheme(themeMap[theme])
                return
            }

            if (self.theme !== null) document.head.removeChild(self.theme.$style)

            const style = document.createElement('style')

            function toKebabCase(str) {
                return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
            }

            for (let [selector, selectorValue] of Object.entries(theme.style)) {
                if (selector === 'body') {
                    for (let [prop, propValue] of Object.entries(selectorValue)) {
                        document.body.style[prop] = propValue
                    }
                }
                else if (selector === 'button') {
                    let buttonStyle = ''
                    for (let [prop, propValue] of Object.entries(selectorValue)) {
                        buttonStyle += `${toKebabCase(prop)}: ${propValue}; `
                    }
                    style.innerHTML += `button { ${buttonStyle} }`
                }
            }

            theme.$style = style

            self.theme = theme
            document.head.appendChild(style)

            /* Side effects */
            this.themeListeners.forEach(fn => fn(theme))

            for (let [, v] of Object.entries(windowByName)) {
                v.setTheme(self.theme)
            }
        }

        this.init = () => {
            this.setTheme(darkTheme)

            initEventListeners()
        }

        return this
    }

    return {
        UI,
        getInstance: () => {
            if (!instance) {
                instance = new UI()
            }
            return instance
        }
    }
})