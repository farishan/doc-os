/* @todo add icon gui
<!-- file &#128196; -->
<!-- folder &#128193; -->
<!-- app &#9670; -->
*/

function IconManager(eventManager) {
  this.createIcon = function (id, dom) {
    eventManager.setListener(id)

    let isMouseDown = false
    let isDragging = false
    let startPoint = { x: 0, y: 0 }
    let distance = { x: 0, y: 0 }

    const $icon = document.createElement('div')
    $icon.appendChild(dom)
    $icon.style.border = '1px solid'
    $icon.style.position = 'absolute'
    $icon.style.left = 0
    $icon.style.top = 0
    $icon.style.cursor = 'grab'
    $icon.style.userSelect = 'none'

    $icon.onmousedown = ev => {
      isMouseDown = true

      startPoint.x = ev.clientX
      startPoint.y = ev.clientY
      distance.x = Math.abs(startPoint.x - $icon.offsetLeft)
      distance.y = Math.abs(startPoint.y - $icon.offsetTop)

      $icon.style.cursor = 'grabbing'
    }
    eventManager.addListener(id, 'mousemove', ev => {
      if (!isMouseDown) return
      isDragging = true

      $icon.style.left = (ev.clientX - distance.x) + 'px'
      $icon.style.top = (ev.clientY - distance.y) + 'px'
    })
    eventManager.addListener(id, 'mouseup', () => {
      isMouseDown = false
      isDragging = false

      $icon.style.cursor = 'grab'
    })

    return $icon
  }
}

export { IconManager }