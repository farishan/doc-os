define(['hardware.manager/hardware.manager', 'software.manager/software.manager', 'UI', './dock.ui.js'], (hardware, SoftwareManager, UI, UI_Dock) => {
    const ui = UI.getInstance()

    function Dock() {
        const self = this
        this.name = 'Dock'

        const softwareManager = SoftwareManager.getInstance()

        softwareManager.addEventListener('install', () => {
            this.refresh()
        })

        this.ui = new UI_Dock(ui.getTheme())
        ui.addThemeListener(theme => self.ui.setTheme(theme))

        hardware.addListener('Dock', 'mousedown', e => {
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
            softwareManager.getAllExcepts(['Dock', 'Desktop']).forEach(function (app) {
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

    return Dock
})