function WindowHeader(args) {
  const options = {
    name: '',
    onmousedown: () => { },
    onclose: () => { },
    ...args,
  }

  this.$element = document.createElement('div')

  if (options.draggable) this.$element.style.cursor = 'grab'
  else this.$element.style.cursor = 'auto'
  this.$element.style.borderBottom = `${options.style.borderWidth}px ${options.style.borderStyle}`
  this.$element.style.padding = options.style.padding + 'px'

  const $closeButton = document.createElement('button')
  $closeButton.style.marginRight = options.style.padding + 'px'
  $closeButton.innerHTML = '&#x2715'
  this.$element.appendChild($closeButton)

  this.$element.innerHTML += options.name

  this.$element.onmousedown = e => {
    options.onmousedown()

    if (options.draggable) {
      this.$element.style.cursor = 'grabbing'
    }
  }

  this.$element.onmouseup = e => {
    if (e.target.innerText === "✕") {
      options.onclose()
      return
    }

    if (options.draggable) {
      this.$element.style.cursor = 'grab'
    }
  }

  return this
}

export { WindowHeader }
