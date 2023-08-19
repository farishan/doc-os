import logger from '../modules/logger'
import functionManager from '../modules/functionManager'

import storage from './storage/storage'
import StorageManager from './storage/StorageManager'

import LogManager from './log/LogManager'
import logRenderer from './log/logRenderer'

function OperatingSystem() {
    const self = this

    this.boot = function () {
        /* Install DocOS features */
        const storageManager = new StorageManager(storage)

        /* Log system needs storage system to store logs */
        const logManager = new LogManager(storageManager)

        logger.log(Object.keys(functionManager.functionMap))

        self.execute('log "os booting..."')

        /* booting functions goes here... */
        self.execute('log "hello world"')

        self.execute('render', {
            key: 'text',
            value: 'Hello, World!'
        })

        logRenderer.init(logManager)
        logRenderer.render()

        self.execute('render', {
            key: 'button',
            value: 'shut down',
            props: {
                onclick: function () {
                    os.execute('shutdown')

                    document.body.innerHTML = ''

                    const $boot = document.createElement('button')
                    $boot.innerHTML = 'boot'
                    $boot.onclick = () => {
                        os.execute('boot')
                        $boot.remove()
                    }
                    document.body.appendChild($boot)
                }
            }
        })
        /* booting funcition end */

        self.execute('log "os booted."')
    }

    this.shutdown = function () {
        console.log('shutdown')
        document.body.innerHTML = ''
    }

    /* Command Registration */
    functionManager.register('boot', this.boot)
    functionManager.register('shutdown', this.shutdown)

    return this
}

/* Facade/proxy? */
OperatingSystem.prototype.execute = functionManager.execute.bind(functionManager)
OperatingSystem.prototype.executeLater = functionManager.executeLater.bind(functionManager)

const os = new OperatingSystem()

export default os