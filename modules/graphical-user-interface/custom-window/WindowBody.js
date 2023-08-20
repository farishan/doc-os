function WindowBody(options) {
  this.$element = document.createElement('div')
  this.$element.style.padding = options.style.padding + 'px'
  this.$element.style.overflow = 'auto'
  this.$element.style.cursor = 'auto'
  this.$element.style.boxSizing = 'border-box'
  this.$element.style.height = '100%'

  this.reset = (dom) => {
    if (!dom) return
    this.$element.innerHTML = ''
    this.$element.appendChild(dom)
  }

  return this
}

export { WindowBody }
