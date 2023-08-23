import createScene from "./modules/create-scene"
import { getInstance } from "./modules/operating-system"

const os = getInstance()

/* A. Auto Boot */
// os.boot()

/* B. Manual Boot */
const $boot = document.createElement('button')
$boot.innerHTML = 'click me to boot the OS'
$boot.onclick = () => {
  os.boot()
  $boot.remove()
}
const bootingScene = createScene($boot)
document.body.appendChild(bootingScene)
