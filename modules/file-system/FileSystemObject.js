import { DEFAULT_SIZE } from "./constants"
import { getId } from "./get-id"

function FileSystemObject(options = {}) {
  this.size = DEFAULT_SIZE
  this.type = options.type || 'file'

  this.id = this.type.slice(0, 1) + getId()
  this.name = options.name || this.type

  this.path = this.type === 'directory' ?
    options.path + this.id + '/'
    : options.path

  return this
}

export { FileSystemObject }
