import { hardware } from "../hardware";

const BODY = document.body

function ContextMenuManager(themeManager) {
  const self = this
  this.$contextMenu = undefined;
  this.$contextMenus = [];
  this.getContextMenu = () => { }

  this.showContextMenu = function (x, y, content) {
    const $menu = document.createElement('div')
    $menu.style.border = '1px solid'
    $menu.style.padding = '8px'
    $menu.style.position = 'absolute'
    $menu.style.zIndex = 9
    $menu.style.left = x + 'px'
    $menu.style.top = y + 'px'

    try {
      $menu.style.backgroundColor = themeManager.getTheme().style.body.backgroundColor
    } catch (error) {
      console.error(error)
    }

    $menu.onclick = () => this.destroyContextMenu()
    $menu.oncontextmenu = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }

    if (content) {
      content.forEach(element => {
        element.style.display = 'block'
        $menu.appendChild(element)
      });
    } else {
      this.$contextMenus.forEach(element => {
        $menu.appendChild(element)
      });
    }

    this.$contextMenu = $menu

    BODY.appendChild(this.$contextMenu)
  }

  this.moveContextMenu = function (x, y) {
    this.$contextMenu.style.left = x + 'px'
    this.$contextMenu.style.top = y + 'px'
  }

  this.destroyContextMenu = function () {
    if (!this.$contextMenu) return
    this.$contextMenu.remove()
    this.$contextMenu = undefined
  }

  this.addToContextMenu = function (dom) {
    dom.style.display = 'block'
    this.$contextMenus.push(dom)
  }

  this.initEventListeners = function () {
    hardware.addListener('UI', 'contextmenu', e => {
      e.preventDefault()

      this.getContextMenu(e.target)

      if (this.$contextMenu) {
        this.moveContextMenu(e.clientX, e.clientY)
        return
      }

      this.showContextMenu(e.clientX, e.clientY)
    })

    hardware.addListener('UI', 'mousedown', e => {
      if (!this.$contextMenu || e.target === this.$contextMenu) return
      if (this.$contextMenu.contains(e.target)) return
      this.destroyContextMenu()
    })
  }

}

export { ContextMenuManager }