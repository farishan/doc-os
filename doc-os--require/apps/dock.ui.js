define(() => {
    function DockUI(theme) {
        const $element = document.createElement('div')
        $element.style.boxSizing = 'border-box'
        $element.style.position = 'fixed'
        $element.style.zIndex = 9
        $element.style.left = 0
        $element.style.bottom = 0
        $element.style.width = '100%'
        $element.style.padding = '8px'
        $element.style.boxSizing = 'border-box'
        $element.style.borderTop = `${theme.borderWidth}px ${theme.borderStyle}`
        $element.style.backgroundColor = theme.backgroundColor

        /* Layouting */
        const $layout = document.createElement('table')

        const $menuTriggerTd = document.createElement('td')
        $menuTriggerTd.setAttribute('width', '100%')
        const $menuTrigger = document.createElement('button')
        $menuTrigger.innerHTML = 'Menu'
        $menuTriggerTd.appendChild($menuTrigger)
        $layout.appendChild($menuTriggerTd)

        const $clockTd = document.createElement('td')
        const $clock = document.createElement('span')
        const now = new Date()
        $clock.innerHTML = `${now.getHours()}:${now.getMinutes()}`
        $clockTd.appendChild($clock)
        $layout.appendChild($clockTd)

        $element.appendChild($layout)

        /* Post-rendering */
        const $menu = document.createElement('div')
        $menu.style.display = 'none'
        $menu.style.position = 'absolute'
        $menu.style.left = 0
        $menu.style.width = '200px'
        $menu.style.height = '200px'
        $menu.style.padding = '8px'
        $menu.style.borderRight = `${theme.borderWidth}px ${theme.borderStyle}`
        $menu.style.borderTop = `${theme.borderWidth}px ${theme.borderStyle}`
        $menu.style.backgroundColor = theme.backgroundColor

        $element.appendChild($menu)

        /* Wait to get updated $element offsetHeight */
        setTimeout(() => {
            $menu.style.bottom = $element.offsetHeight + 'px'
        }, 200)

        /* Methods */
        /* Theme feature */
        this.setTheme = function (theme) {
            $element.style.backgroundColor = theme.style.body.backgroundColor
            $menu.style.backgroundColor = theme.style.body.backgroundColor
        }

        this.addToMenu = (element) => {
            element.style.display = 'block'
            $menu.appendChild(element)
        }

        this.clear = () => $menu.innerHTML = ''
        this.closeMenu = () => $menu.style.display = 'none'

        $menuTrigger.onclick = () => {
            /* Toggle menu */
            if ($menu.style.display === 'none') $menu.style.display = 'block'
            else if ($menu.style.display === 'block') $menu.style.display = 'none'
        }

        this.getMenuElement = () => $menu
        this.getMenuTrigger = () => $menuTrigger

        this.render = () => document.body.appendChild($element)
        this.destroy = () => $element.remove()
    }

    return DockUI
})