import { themeMap } from "./theme"

const HEAD = document.head
const BODY = document.body

function ThemeManager() {
  let theme = null
  this.themeListeners = []

  function generateStyleDOM(theme) {
    const style = document.createElement('style')

    for (let [selector, selectorValue] of Object.entries(theme.style)) {
      if (selector === 'body') {
        for (let [prop, propValue] of Object.entries(selectorValue)) {
          BODY.style[prop] = propValue
        }
      }
      else if (selector === 'button') {
        let buttonStyle = ''
        for (let [prop, propValue] of Object.entries(selectorValue)) {
          buttonStyle += `${toKebabCase(prop)}: ${propValue}; `
        }
        style.innerHTML += `button { ${buttonStyle} }`
      }
    }

    return style
  }

  this.getTheme = () => theme

  this.setTheme = function (newTheme, callback) {
    if (!newTheme) throw Error('Unknown newTheme', newTheme)

    /* allow theme to be a key of themeMap instead of a theme object */
    if (typeof newTheme === 'string' && themeMap[newTheme]) {
      this.setTheme(themeMap[newTheme])
      return
    }

    /* remove existing theme style */
    if (theme !== null) HEAD.removeChild(theme.$style)

    /* generate style from theme */
    const style = generateStyleDOM(newTheme)

    /* finally, set new theme */
    theme = { ...newTheme, $style: style }
    HEAD.appendChild(style)

    this.notify(theme)

    if (callback) callback(theme)
  }

  this.addListener = (fn) => {
    this.themeListeners.push(fn)
  }

  this.notify = (theme) => {
    this.themeListeners.forEach(fn => fn(theme))
  }

  this.setTheme('dark')
}

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

let instance = new ThemeManager()
const getInstance = () => {
  if (!instance) instance = new ThemeManager()
  return instance
}

export { ThemeManager, getInstance }
