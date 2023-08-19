define(['UI'], (UI) => {
    const ui = UI.getInstance()

    function MyApp() {
        this.name = 'My App'

        this.getContent = function () {
            const $content = document.createElement('div')
            $content.textContent = 'My App'
        }

        this.start = () => {
            const customWindow = ui.createWindow({ name: this.name, resizeable: true, draggable: true })

            ui.sendToTop(customWindow)

            const $content = this.getContent()

            ui.setWindowContent(this.name, $content)
        }
    }

    return MyApp
})