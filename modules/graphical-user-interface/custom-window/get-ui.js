export function getUI({
  minWidth,
  minHeight,
  options,
  extraSize,
}) {
  const rootDOM = document.createElement('div')
  /* Styles */
  rootDOM.style.padding = options.style.padding + 'px'
  rootDOM.style.boxSizing = 'border-box'
  rootDOM.style.userSelect = 'none'
  rootDOM.style.minWidth = minWidth + 'px'
  rootDOM.style.minHeight = minHeight + 'px'

  rootDOM.style.width = options.initialWidth
    ? options.initialWidth + extraSize + 'px'
    : minWidth + extraSize + 'px'
  rootDOM.style.height = minHeight + extraSize + 'px'

  /* Interaction */
  rootDOM.oncontextmenu = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  return rootDOM
}
