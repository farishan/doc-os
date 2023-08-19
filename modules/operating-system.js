'use strict';

import { getInstance as getGUI } from "./graphical-user-interface";
import { getInstance as getSoftwareManager } from "./software-manager";
import { Desktop } from "./softwares/desktop";
import { Dock } from "./softwares/dock/dock";
import { FileManager as FileManagerApp } from "./softwares/file-manager";
import { CustomFileReader as FileReaderApp } from "./softwares/file-reader";
import { Settings as SettingsApp } from "./softwares/settings";
import { WindowCreator as WindowCreatorApp } from "./softwares/window-creator";

let instance

function OperatingSystem() {
  const ui = getGUI()
  const softwareManager = getSoftwareManager()

  this.boot = () => {
    ui.init()

    /* Install default softwares */
    softwareManager.install(new Dock())
    softwareManager.install(new SettingsApp())
    softwareManager.install(new FileManagerApp(instance))
    softwareManager.install(new WindowCreatorApp())
    softwareManager.install(new FileReaderApp())
    softwareManager.install(new Desktop(instance))

    /* Run default softwares */
    softwareManager.get('Dock').start()
    softwareManager.get('Desktop').start()
  }

  this.run = function (appKey, payload) {
    softwareManager.run(appKey, payload)
  }
}

const getInstance = () => {
  if (!instance) instance = new OperatingSystem()
  return instance
}

export { OperatingSystem, getInstance }
