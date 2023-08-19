/**
 * features:
 * - theme switching
 * - custom context menu
 * - customWindow management
 * - event management
 * - icon management?
 */

'use strict';

import { ContextMenuManager } from "./ContextMenuManager";
import { EventManager } from "./EventManager";
import { IconManager } from "./IconManager";
import { ThemeManager } from "./ThemeManager";
import { WindowManager } from "./WindowManager";

let instance;

function GraphicalUserInterface() {
  const self = this

  const eventManager = new EventManager(self)
  const themeManager = new ThemeManager(self)
  const windowManager = new WindowManager(eventManager, themeManager)
  const contextMenuManager = new ContextMenuManager(themeManager)
  const iconManager = new IconManager(eventManager)

  this.themeListeners = []

  this.setWindowContent = (...args) => windowManager.setWindowContent(...args)
  this.sendToTop = (...args) => windowManager.sendToTop(...args)
  this.createWindow = (...args) => windowManager.createWindow(...args)
  this.createIcon = (id, dom) => iconManager.createIcon(id, dom)
  this.getTheme = () => themeManager.getTheme()
  this.showContextMenu = (...args) => contextMenuManager.showContextMenu(...args)
  this.setTheme = (newTheme) => themeManager.setTheme(newTheme, (theme) => {
    /* Side effects */
    windowManager.notify(theme)
  })
  this.addThemeListener = (cb) => themeManager.addListener(cb)
  this.closeAllWindow = () => windowManager.closeAllWindow()

  this.init = () => {
    this.setTheme('dark')

    eventManager.init()
    contextMenuManager.initEventListeners()
  }

  return this
}

const getInstance = () => {
  if (!instance) instance = new GraphicalUserInterface()
  return instance
}

export { GraphicalUserInterface, getInstance }
