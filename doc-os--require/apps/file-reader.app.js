define(['UI'], (UI) => {
    const ui = UI.getInstance()

    function CustomFileReader() {
        this.name = 'File Reader'
        this.file = undefined

        this.getContent = function () {
            if (!this.file) {
                const $open = document.createElement('button')
                $open.onclick = function () {
                    ui.createWindow({ name: 'file prompt', resizeable: true, draggable: true })
                }
                $open.innerHTML = 'Open File'
                return $open
            } else {
                const $content = document.createElement('div')
                $content.style.wordBreak = 'break-all'
                $content.style.userSelect = 'text'
                $content.oncontextmenu = e => e.stopPropagation()
                $content.innerHTML = JSON.stringify(this.file)
                return $content
            }
        }

        this.start = (file) => {
            if (file) this.file = file
            const customWindow = ui.createWindow({ name: this.name, resizeable: true, draggable: true })

            ui.sendToTop(customWindow)

            const $content = this.getContent()

            ui.setWindowContent(this.name, $content)
        }
    }

    return CustomFileReader
})