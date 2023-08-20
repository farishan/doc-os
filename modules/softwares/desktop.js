import { getInstance as getGUI } from "../graphical-user-interface"
import { getInstance as getFS, CREATE_FILE, CREATE_DIRECTORY, MOVE, DELETE } from "../file-system"

const fs = getFS()
const ui = getGUI()

const NAMESPACE = 'Desktop'

function Desktop(os) {
  const self = this

  /* this.name is required */
  this.name = NAMESPACE

  this.path = '/desktop/'

  this.iconDomMap = {}

  const $desktop = document.createElement('div')
  $desktop.id = '$desktop'
  $desktop.style.position = 'fixed'
  $desktop.style.left = 0
  $desktop.style.top = 0
  $desktop.style.width = '100vw'
  $desktop.style.height = '100vh'
  $desktop.oncontextmenu = e => {
    e.preventDefault()

    const $createFile = document.createElement('button')
    $createFile.innerHTML = 'Create file'
    $createFile.onclick = () => {
      const file = fs.createFile({
        name: null,
        path: this.path
      })

      fs.addToStorage(file)
    }

    const $closeAllWindow = document.createElement('button')
    $closeAllWindow.innerHTML = 'Close All Window'
    $closeAllWindow.onclick = function () {
      ui.closeAllWindow()
    }

    const $contextMenus = [
      $closeAllWindow,
      $createFile,
    ]

    ui.showContextMenu(e.clientX, e.clientY, $contextMenus)
  }

  const desktopDirectory = fs.createSystemDirectory('desktop')
  fs.addToStorage(desktopDirectory)

  fs.listenToDirectory(desktopDirectory, (objects) => {
    $desktop.innerHTML = ''
    objects.forEach(object => {
      renderIcon(object)
    });
  })

  function renderIcon(data) {
    const $d = document.createElement('div')
    $d.innerHTML = JSON.stringify(data)
    $d.style.background = '#222'
    $d.style.maxWidth = '100px'
    $d.style.maxHeight = '100px'
    $d.style.overflow = 'auto'

    const $icon = ui.createIcon(data.id, $d, data.type)
    if (data.type === 'file') {
      $icon.ondblclick = () => {
        /* @todo handle other app */
        os.run('File Reader', data)
      }

      $icon.oncontextmenu = (e) => {
        e.preventDefault()
        e.stopPropagation()

        ui.destroyContextMenu()

        const $contextMenus = []

        const $open = document.createElement('button')
        $open.innerHTML = 'Open'
        $open.onclick = () => {
          /* @todo handle run another software */
          os.run('File Reader', data)
        }
        $contextMenus.push($open)

        ui.showContextMenu(e.clientX, e.clientY, $contextMenus)
      }
    }
    self.iconDomMap[data.id] = $icon

    $desktop.appendChild($icon)
  }

  fs.addListener('desktop.app', payload => {
    if (!payload) return
    if (!payload.event || !payload.data) return

    if (payload.event === CREATE_FILE) {
      if (payload.data.path !== this.path) return

      renderIcon(payload.data)
    }
    else if (payload.event === CREATE_DIRECTORY) {
      if (!payload.data.path) return
      if (payload.data.path.startsWith(this.path) === false) return
      if ((payload.data.path.match(/\//g) || []).length !== 3) return

      renderIcon(payload.data)
    }
    // else if (payload.event === MOVE) {
    //     if (!payload.data.toBeMoved || !payload.data.target) return

    //     console.log(payload)

    //     let shouldRender = false;
    //     let shouldDelete = false;

    //     /* Check to be moved */
    //     if (payload.data.toBeMoved.path === this.path) {
    //         console.log('should delete file')
    //         shouldRender = true
    //     } else if (payload.data.toBeMoved.path.startsWith(this.path) && (payload.data.toBeMoved.path.match(/\//g) || []).length === 3) {
    //         console.log('should delete directory')
    //         shouldRender = true
    //     }

    //     if (shouldRender) {
    //         shouldRender = false
    //         renderIcon(payload.data.target)
    //     }

    //     /* Check target */
    //     if (payload.data.target.path === this.path) {
    //         shouldDelete = true
    //     } else if (payload.data.target.path.startsWith(this.path) && (payload.data.target.path.match(/\//g) || []).length === 3) {
    //         shouldDelete = true
    //     }

    //     if (shouldDelete) {
    //         shouldDelete = false
    //         // this.iconDomMap[payload.data.toBeMoved.id].remove()
    //     }
    // }
    else if (payload.event === DELETE) {
      if (!payload.data.path) return
      if (payload.data.path === this.path || (
        payload.data.path.startsWith(this.path)
        && (payload.data.path.match(/\//g) || []).length === 3
      )) {
        this.iconDomMap[payload.data.id].remove()
      }
    }
  })

  this.start = () => {
    document.body.appendChild($desktop)
  }
}

export { NAMESPACE, Desktop }
