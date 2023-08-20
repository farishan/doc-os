export function getBackground() {
  const dom = document.createElement('div')
  dom.style.position = 'absolute'
  dom.style.left = 0
  dom.style.top = 0
  dom.style.right = 0
  dom.style.bottom = 0
  dom.style.zIndex = -1
  dom.style.opacity = 0.9
  return dom
}
