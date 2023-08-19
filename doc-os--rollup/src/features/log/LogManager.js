import functionManager from "../../modules/functionManager"
import getId from "../../modules/getId"

/**
 * Log manager, needs a storage manager to store logs
 * @param {*} storageManager storage manager instance
 */
function LogManager(storageManager) {
    if (!storageManager) throw Error('LogManager needs storageManager')

    const NAMESPACE = 'LogManager'
    const { set, get } = storageManager.register(NAMESPACE)

    /* Methods */
    this.log = function (value) {
        /* Creating log object */
        const log = {
            id: `log_${getId()}`,
            created_at: new Date().toISOString(),
            value
        }

        set(log)
    }

    this.get = function () {
        return get()
    }

    /* Method Registration */
    functionManager.register('log', this.log)
}

export default LogManager