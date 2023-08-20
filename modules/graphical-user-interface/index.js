/**
 * features:
 * - theme switching
 * - custom context menu
 * - customWindow management
 * - icon management?
 */

'use strict';

import { IconManager } from "./IconManager";
import { WindowManager } from "./WindowManager";
import { ContextMenuManager } from "./ContextMenuManager";
import { getInstance as getThemeManager } from "./ThemeManager";

const iconManager = new IconManager()
const themeManager = getThemeManager()
const windowManager = new WindowManager()
const contextMenuManager = new ContextMenuManager()

function GraphicalUserInterface() {
  this.init = () => {
    this.setTheme('dark')
    contextMenuManager.init()
  }

  return this
}

/* facades */
GraphicalUserInterface.prototype.getTheme = themeManager.getTheme.bind(themeManager)
GraphicalUserInterface.prototype.createIcon = iconManager.createIcon.bind(iconManager)
GraphicalUserInterface.prototype.sendToTop = windowManager.sendToTop.bind(windowManager)
GraphicalUserInterface.prototype.createWindow = windowManager.createWindow.bind(windowManager)
GraphicalUserInterface.prototype.addThemeListener = themeManager.addListener.bind(themeManager)
GraphicalUserInterface.prototype.closeAllWindow = windowManager.closeAllWindow.bind(windowManager)
GraphicalUserInterface.prototype.setWindowContent = windowManager.setWindowContent.bind(windowManager)
GraphicalUserInterface.prototype.showContextMenu = contextMenuManager.showContextMenu.bind(contextMenuManager)
GraphicalUserInterface.prototype.setTheme = (newTheme) => themeManager.setTheme(newTheme, (theme) => {
  /* Side effects */
  windowManager.notify(theme)
})

let instance = new GraphicalUserInterface()
const getInstance = () => {
  if (!instance) instance = new GraphicalUserInterface()
  return instance
}

export { GraphicalUserInterface, getInstance }
