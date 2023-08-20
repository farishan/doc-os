'use strict'

import { DockUI } from './dock.ui'
import { getInstance as getHardware } from '../../hardware'
import { getInstance as getSoftwareManager } from '../../software-manager'
import { getInstance as getGUI } from '../../graphical-user-interface'

const ui = getGUI()
const hardware = getHardware()
const softwareManager = getSoftwareManager()

const NAMESPACE = 'Dock'

function Dock() {
  const self = this

  /* this.name is required */
  this.name = NAMESPACE

  softwareManager.addEventListener('install', () => {
    this.refresh()
  })

  this.ui = new DockUI(ui.getTheme())
  ui.addThemeListener(theme => self.ui.setTheme(theme))

  hardware.addListener(NAMESPACE, 'mousedown', e => {
    if (
      e.target !== self.ui.getMenuElement()
      && e.target !== self.ui.getMenuTrigger()
      && e.target instanceof HTMLButtonElement === false
    ) {
      self.ui.closeMenu()
    }
  })

  this.refresh = () => {
    self.ui.clear()
    /* @todo add desktop namespace */
    softwareManager.getAllExcepts([NAMESPACE, 'Desktop']).forEach(function (app) {
      const $trigger = document.createElement('button')
      $trigger.innerHTML = app.name
      $trigger.onclick = () => app.start()
      self.ui.addToMenu($trigger)
    })
  }

  this.start = () => {
    this.ui.render()
    this.refresh()
  }

  this.stop = () => {
    this.ui.destroy()
  }
}

export { NAMESPACE, Dock }