const TYPE_FILE = 'file'
const TYPE_FOLDER = 'folder'
const TYPE_APP = 'app'

import { getInstance as getHardware } from "../hardware"

const hardware = getHardware()
const eventScopesByKey = {
  mousemove: 'mousemove',
  mouseup: 'mouseup'
}

function IconManager() {
  this.createIcon = function (id, dom, type) {
    let isMouseDown = false
    let isDragging = false
    let startPoint = { x: 0, y: 0 }
    let distance = { x: 0, y: 0 }

    const rootDOM = document.createElement('div')
    const iconDOM = document.createElement('span')

    if (type === TYPE_FILE) iconDOM.innerHTML = '&#128196;'
    else if (type === TYPE_FOLDER) iconDOM.innerHTML = '&#128193;'
    else if (type === TYPE_APP) iconDOM.innerHTML = '&#9670;'

    rootDOM.append(iconDOM)
    rootDOM.appendChild(dom)
    rootDOM.style.top = 0
    rootDOM.style.left = 0
    rootDOM.style.cursor = 'grab'
    rootDOM.style.userSelect = 'none'
    rootDOM.style.border = '1px solid'
    rootDOM.style.position = 'absolute'

    rootDOM.onmousedown = ev => {
      isMouseDown = true

      startPoint.x = ev.clientX
      startPoint.y = ev.clientY
      distance.x = Math.abs(startPoint.x - rootDOM.offsetLeft)
      distance.y = Math.abs(startPoint.y - rootDOM.offsetTop)

      rootDOM.style.cursor = 'grabbing'
    }
    hardware.addListener(id, eventScopesByKey.mousemove, ev => {
      if (!isMouseDown) return
      isDragging = true

      rootDOM.style.left = (ev.clientX - distance.x) + 'px'
      rootDOM.style.top = (ev.clientY - distance.y) + 'px'
    })
    hardware.addListener(id, eventScopesByKey.mouseup, () => {
      isMouseDown = false
      isDragging = false

      rootDOM.style.cursor = 'grab'
    })

    return rootDOM
  }
}

export { IconManager }