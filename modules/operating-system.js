'use strict';

import { Terminal } from "./softwares/terminal";
import { Settings as SettingsApp } from "./softwares/settings";
import { getInstance as getGUI } from "./graphical-user-interface";
import { getInstance as getSoftwareManager } from "./software-manager";
import { FileManager as FileManagerApp } from "./softwares/file-manager";
import { NAMESPACE as NAMESPACE_DOCK, Dock } from "./softwares/dock/dock";
import { CustomFileReader as FileReaderApp } from "./softwares/file-reader";
import { NAMESPACE as NAMESPACE_DESKTOP, Desktop } from "./softwares/desktop";
import { WindowCreator as WindowCreatorApp } from "./softwares/window-creator";

const ui = getGUI()
const softwareManager = getSoftwareManager()

function OperatingSystem() {
  this.boot = () => {
    ui.init()

    /* Install default softwares */
    this.install(new Dock())
    this.install(new SettingsApp())
    this.install(new FileReaderApp())
    this.install(new Desktop(instance))
    this.install(new WindowCreatorApp())
    this.install(new FileManagerApp(instance))
    this.install(new Terminal())

    /* Run default softwares */
    this.run(NAMESPACE_DOCK)
    this.run(NAMESPACE_DESKTOP)
  }
}

/* facades */
OperatingSystem.prototype.get = softwareManager.get.bind(softwareManager)
OperatingSystem.prototype.install = softwareManager.install.bind(softwareManager)
OperatingSystem.prototype.run = softwareManager.run.bind(softwareManager)

let instance = new OperatingSystem()
const getInstance = () => {
  if (!instance) instance = new OperatingSystem()
  return instance
}

export { OperatingSystem, getInstance }
