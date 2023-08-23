/**
 * Create a simple game scene.
 * This is an easy way to show something to the player,
 * generic html-related, not specific game/os-related.
 * @param {HTMLElement} child
 * @returns styled `HTMLDivElement`
 * @example```
 * import createScene from './path/to/create-scene'
 * const sceneContent = document.createElement('div')
 * sceneContent.innerText = 'hello world'
 * const scene = createScene(sceneContent)
 * document.body.append(scene)
 * ```
 */
export default function createScene(child) {
  const scene = document.createElement('div')

  scene.style.width = '100%'
  scene.style.height = '100%'
  scene.style.display = 'flex'
  scene.style.position = 'fixed'
  scene.style.alignItems = 'center'
  scene.style.justifyContent = 'center'

  scene.appendChild(child)

  return scene
}
