import { getInstance } from "./modules/operating-system"

const os = getInstance()

/* A. Auto Boot */
os.boot()

/* B. Manual Boot */
// const $boot = document.createElement('button')
// $boot.innerHTML = 'boot'
// $boot.onclick = () => {
//     os.boot()
//     $boot.remove()
// }
// document.body.appendChild($boot)
