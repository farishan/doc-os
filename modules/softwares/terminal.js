import { getInstance as getCLI } from '../command-line-interface'
import { getInstance as getUI } from '../graphical-user-interface'

const ui = getUI()
const cli = getCLI()

function Terminal() {
  this.name = 'Terminal'
  const logs = []
  const $logs = document.createElement('div')

  cli.register('echo', (payload) => {
    logs.push(payload)
    renderLogs()
  })

  function renderLogs() {
    $logs.innerHTML = ''
    for (let index = logs.length-1; index >= 0; index--) {
      const log = logs[index];
      $logs.innerHTML += `${log}<br>`
    }
  }

  this.getContent = function () {
    const $content = document.createElement('div')
    const input = document.createElement('input')
    input.placeholder = 'echo "hello world"'
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        console.log(input.value)
        cli.execute(input.value)
        input.value = ''
      }
    })

    $content.append(input)
    $content.append($logs)
    return $content
  }

  this.start = () => {
    const customWindow = ui.createWindow({ name: this.name, resizeable: true, draggable: true })

    ui.sendToTop(customWindow)

    const $content = this.getContent()

    ui.setWindowContent(this.name, $content)
  }
}

export { Terminal }
