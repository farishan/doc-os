import { getInstance as getGUI } from "../graphical-user-interface"

const ui = getGUI()

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

export { WindowCreator }
