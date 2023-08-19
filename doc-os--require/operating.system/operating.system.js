define(
    ['software.manager/software.manager', 'UI', 'apps/settings.app', 'apps/file-manager.app', 'apps/window-creator.app', 'apps/file-reader.app', 'apps/dock.app', 'apps/desktop.app'],
    function (SoftwareManager, UI, SettingsApp, FileManagerApp, WindowCreatorApp, FileReaderApp, Dock, Desktop) {
        let instance

        function OperatingSystem() {
            this.ui = UI.getInstance()
            this.softwareManager = SoftwareManager.getInstance()
        }

        OperatingSystem.prototype.boot = function () {
            this.ui.init()

            /* Install default softwares */
            this.softwareManager.install(new Dock())
            this.softwareManager.install(new SettingsApp())
            this.softwareManager.install(new FileManagerApp(instance))
            this.softwareManager.install(new WindowCreatorApp())
            this.softwareManager.install(new FileReaderApp())
            this.softwareManager.install(new Desktop(instance))

            /* Run default softwares */
            this.softwareManager.get('Dock').start()
            this.softwareManager.get('Desktop').start()
        }

        OperatingSystem.prototype.run = function (appKey, payload) {
            this.softwareManager.run(appKey, payload)
        }

        return {
            OperatingSystem,
            getInstance: () => {
                if (!instance) instance = new OperatingSystem()
                return instance
            }
        }
    })