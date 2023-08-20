'use strict';

import { getUI } from "./get-ui";
import { getId } from "../../libs/get-id";
import { WindowBody } from "./WindowBody";
import { getWrapper } from "./get-wrapper";
import { WindowHeader } from "./WindowHeader";
import { getBackground } from "./get-background";
import { getClickedResizer } from "./get-clicked-resizer";

function CustomWindow(args, themeManager) {
  const self = this
  const options = {
    id: getId(),
    style: {
      padding: 8,
      borderWidth: 1,
      borderStyle: 'solid'
    },
    ...args
  }

  themeManager.addListener((theme) => {
    this.$background.style.backgroundColor = theme.style.body.backgroundColor
  })

  this.id = options.id
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
  this.$window = getUI({
    minWidth: this.minWidth,
    minHeight: this.minHeight,
    options,
    extraSize
  })
  this.$background = getBackground()
  this.$wrapper = getWrapper({
    minWidth: this.minWidth,
    minHeight: this.minHeight,
    options,
    extraSize
  })
  this.$wrapper.appendChild(this.$background)
  this.$window.appendChild(this.$wrapper)

  this.$background.style.backgroundColor = themeManager.getTheme().style.body.backgroundColor

  /* Header */
  this.header = new WindowHeader({
    ...options,
    name: this.name,
    onmousedown: () => this.isHeaderMousedown = true,
    onclose: handleClose
  })
  this.$wrapper.appendChild(this.header.$element)

  /* Body */
  this.body = new WindowBody(options)
  this.$wrapper.appendChild(this.body.$element)

  function handleClose() {
    self.$window.remove()

    self.eventListener.close.forEach(listener => {
      listener()
    });
  }

  return this
}

CustomWindow.prototype.addEventListener = function (eventKey, fn) {
  this.eventListener[eventKey].push(fn)
}

CustomWindow.prototype.getClickedResizer = function (x, y) {
  return getClickedResizer(this.$window, this.cursorThreshold, x, y)
}

CustomWindow.prototype.setContent = function (element) {
  this.body.reset(element)
}

CustomWindow.prototype.finalize = function () {
  this.$wrapper.style.width = this.$window.offsetWidth - this.padding * 2 + 'px'
  this.$wrapper.style.height = this.$window.offsetHeight - this.padding * 2 + 'px'

  this.body.$element.style.maxHeight = this.$wrapper.offsetHeight - this.header.$element.offsetHeight + 'px'
}

export { CustomWindow }
