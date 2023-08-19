define(['UI'], (UI) => {
    const ui = UI.getInstance()

    function WindowCreator() {
        this.name = 'Window Creator'

        this.start = () => {
            ui.createWindow({ name: this.name, resizeable: true, draggable: true })

            /* Window creator */
            const $create = document.createElement('button')
            $create.innerHTML = 'create window'
            $create.onclick = () => {
                ui.createWindow({ draggable: true, resizeable: true })
            }

            ui.setWindowContent(this.name, $create)
        }
    }

    return WindowCreator
})