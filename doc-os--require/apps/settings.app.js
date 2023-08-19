define(['UI'], (UI) => {
    const ui = UI.getInstance()

    function Settings() {
        this.name = 'Settings'

        this.getContent = function () {
            const $content = document.createElement('div')

            const $darkTheme = document.createElement('button')
            $darkTheme.onclick = function () {
                ui.setTheme('dark')
            }
            $darkTheme.innerHTML = 'Change to Dark Theme'
            $content.appendChild($darkTheme)

            const $lightTheme = document.createElement('button')
            $lightTheme.onclick = function () {
                ui.setTheme('light')
            }
            $lightTheme.innerHTML = 'Change to Light Theme'
            $content.appendChild($lightTheme)

            return $content
        }

        this.start = () => {
            const customWindow = ui.createWindow({ name: this.name, resizeable: true, draggable: true })

            ui.sendToTop(customWindow)

            const $content = this.getContent()

            ui.setWindowContent(this.name, $content)
        }
    }

    return Settings
})