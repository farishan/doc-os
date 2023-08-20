import { getInstance as getGUI } from "../graphical-user-interface"
import { getInstance as getFS } from "../file-system"

const fs = getFS()
const ui = getGUI()

function FileManager(os) {
  const self = this
  this.name = 'File Manager'

  this.currentPath = '/'

  this.getHead = () => {
    const $head = document.createElement('div')
    $head.style.marginBottom = '8px'

    /* Create file */
    const $createFileButton = document.createElement('button')
    $createFileButton.innerHTML = 'create file'
    $createFileButton.onclick = () => {
      const file = fs.createFile({
        name: null,
        path: this.currentPath
      })

      fs.addToStorage(file)

      this.reload()
    }
    $head.appendChild($createFileButton)

    /* Create directory */
    const $createDirectory = document.createElement('button')
    $createDirectory.innerHTML = 'create directory'
    $createDirectory.onclick = () => {
      const directory = fs.createDirectory({
        name: null,
        path: this.currentPath
      })

      fs.addToStorage(directory)

      this.reload()
    }
    $head.appendChild($createDirectory)

    /* Back button and breadcrumb */
    const $back = document.createElement('button')
    $back.innerHTML = 'back'
    $back.onclick = () => {
      this.currentPath = fs.getParentPath(this.currentPath)

      this.reload()
    }
    const $path = document.createElement('p')
    $path.innerHTML = this.currentPath
    $head.appendChild($back)
    $head.appendChild($path)

    return $head
  }

  this.getBody = () => {
    const $body = document.createElement('div')
    const $table = this.generateTable()
    $body.appendChild($table)

    return $body
  }

  this.getRoot = () => {
    const $root = document.createElement('div')
    const $head = this.getHead()
    const $body = this.getBody()

    $root.appendChild($head)
    $root.appendChild($body)

    return $root
  }

  this.reload = () => {
    const $root = this.getRoot()
    ui.setWindowContent(this.name, $root)
  }

  this.openDirectory = (directory) => {
    this.currentPath = directory.path
    this.reload()
  }

  function createTd() {
    const td = document.createElement('td')
    td.style.border = '1px solid'
    td.style.padding = '4px'
    return td
  }

  function createTh(text) {
    const th = document.createElement('th')
    th.style.border = '1px solid'
    th.style.padding = '4px'
    th.innerHTML = text
    return th
  }

  this.generateTable = () => {
    const data = fs.getWithPath(this.currentPath)
    const $table = document.createElement('table')
    $table.style.borderCollapse = 'collapse'
    $table.style.width = '100%'

    const $thead = document.createElement('thead')
    const $tr = document.createElement('tr')
    $tr.appendChild(createTh('ID'))
    $tr.appendChild(createTh('Name'))
    $tr.appendChild(createTh('Type'))
    $tr.appendChild(createTh('Size'))
    $thead.appendChild($tr)
    $table.appendChild($thead)

    const $tbody = document.createElement('tbody')
    $table.appendChild($tbody)

    let dragged

    data.forEach(d => {
      const tr = document.createElement('tr')

      if (!d.isSystemFile) {
        tr.draggable = true

        tr.ondragstart = () => dragged = d
      }

      tr.ondragenter = e => {
        tr.style.backgroundColor = 'yellow'
      }

      tr.ondragleave = e => {
        tr.style.backgroundColor = 'initial'
      }

      /* enable drop */
      tr.ondragover = e => e.preventDefault()
      tr.ondrop = () => {
        tr.style.backgroundColor = 'initial'

        /* Prevent dropping in itself */
        if (!dragged.path.includes(d.path)) {
          fs.move(dragged, d)
          this.reload()
        }
      }

      tr.onmousedown = function (e) {
        // check if right click
        if (e.button === 2) {
          tr.style.backgroundColor = '#666'
          setTimeout(() => {
            tr.style.backgroundColor = 'initial'
          }, 200);
        } else {
          tr.style.backgroundColor = '#666'
        }
      }
      tr.onmouseup = function (e) {
        tr.style.backgroundColor = 'initial'
      }

      const tdId = createTd()
      const tdType = createTd()
      const tdName = createTd()
      const tdSize = createTd()

      tr.oncontextmenu = function (e) {
        e.preventDefault()

        const $contextMenus = []

        const $open = document.createElement('button')
        $open.innerHTML = 'Open'
        $open.onclick = () => {
          if (d.type === 'file') {
            os.run('File Reader', d)
          } else if (d.type === 'directory') {
            self.openDirectory(d)
          }
        }
        $contextMenus.push($open)

        if (!fs.isSystemFile(d)) {
          const $rename = document.createElement('button')
          $rename.innerHTML = 'Rename'
          const handleSubmit = (e) => {
            const newData = fs.rename(d, e.target.innerHTML)
            tdName.contentEditable = false
            fs.set(d.id, newData)
          }
          $rename.onclick = () => {
            tdName.contentEditable = true
            tdName.focus()

            setTimeout(() => {
              const range = document.createRange();
              range.selectNodeContents(tdName)
              var sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            }, 50)

            tdName.onkeydown = e => {
              if (e.key === 'Enter') {
                e.target.blur()
              }
            }
            tdName.onblur = e => handleSubmit(e)
          }
          $contextMenus.push($rename)

          const $delete = document.createElement('button')
          $delete.innerHTML = 'Delete'
          $delete.onclick = () => {
            fs.delete(d)
            self.reload()
          }
          $contextMenus.push($delete)
        }

        ui.showContextMenu(e.clientX, e.clientY, $contextMenus)
      }

      tr.ondblclick = () => {
        if (d.type === 'file') {
          /* @todo @fixme */
          os.run('File Reader', d)
        } else if (d.type === 'directory') {
          self.openDirectory(d)
        }
      }

      tdId.innerHTML = d.id
      tdType.innerHTML = d.type
      tdName.innerHTML = d.isSystemFile ? '.' + d.name : d.name
      tdSize.innerHTML = d.size

      tr.appendChild(tdId)
      tr.appendChild(tdName)
      tr.appendChild(tdType)
      tr.appendChild(tdSize)

      $tbody.appendChild(tr)
    });

    return $table
  }

  fs.addListener('file-manager.app', payload => {
    if (!payload) return
    if (!payload.event || !payload.data) return

    this.reload()
  })

  this.start = () => {
    ui.createWindow({ name: this.name, resizeable: true, draggable: true, initialWidth: 300 })
    this.reload()
  }
}

export { FileManager }
