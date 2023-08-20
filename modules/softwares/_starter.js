import { getInstance } from '../graphical-user-interface'

const ui = getInstance()

function MyApp() {
  /* `this.name` is required */
  this.name = 'My App'

  this.getContent = function () {
    const $content = document.createElement('div')
    $content.textContent = 'My App'
    return $content
  }

  this.start = () => {
    const customWindow = ui.createWindow({ name: this.name, resizeable: true, draggable: true })

    ui.sendToTop(customWindow)

    const $content = this.getContent()

    ui.setWindowContent(this.name, $content)
  }
}

export { MyApp }
