import { CustomWindow } from "./CustomWindow"

const BODY = document.body

function WindowManager(eventManager, themeManager) {
  const self = this
  const windowByName = {}

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
    if (!customWindow) throw Error('Unknown customWindow', customWindow)
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

    eventManager.addListener(customWindow.id, 'mousemove', dragAndResize)
    eventManager.addListener(customWindow.id, 'mouseup', () => {
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
      theme: themeManager.getTheme(),
      ...args
    }

    /* Definition */
    const customWindow = new CustomWindow(options, themeManager)

    if (windowByName[customWindow.name]) return;

    windowByName[customWindow.name] = customWindow

    /* [side-effects] Init listener for window */
    eventManager.setListener(customWindow.id)

    if (options.draggable || options.resizeable) {
      initWindowInteraction(customWindow, options)
    }

    /* Also remove custom window's listeners when the element destroyed */
    customWindow.addEventListener('close', function () {
      self.destroyWindow(customWindow.name)
    })

    BODY.appendChild(customWindow.$window)
    customWindow.finalize()

    return customWindow
  }

  this.destroyWindow = function (name) {
    const customWindow = windowByName[name]

    /* side-effects */
    eventManager.removeListener(customWindow.id)

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

  this.notify = (theme) => {
    /* assumes all windows have `setTheme` method */
    for (let [, v] of Object.entries(windowByName)) {
      v.setTheme(theme)
    }
  }

}

export { WindowManager }