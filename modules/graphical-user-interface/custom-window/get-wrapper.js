export function getWrapper({ minWidth, minHeight, options, extraSize }) {
  const dom = document.createElement('div')
  dom.style.minWidth = this.minWidth - options.style.padding * 2 + 'px'
  dom.style.minHeight = this.minHeight - options.style.padding * 2 + 'px'
  dom.style.width = this.minWidth + extraSize - options.style.padding * 2 + 'px'
  dom.style.height = this.minHeight + extraSize - options.style.padding * 2 + 'px'
  dom.style.position = 'absolute'
  dom.style.border = `${options.style.borderWidth}px ${options.style.borderStyle}`
  dom.style.overflow = 'hidden'

  return dom
}