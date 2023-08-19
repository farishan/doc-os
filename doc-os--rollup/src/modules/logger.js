let shouldLog = false

const logger = {
    switch: function (state) { shouldLog = state },
    log: function (...args) {
        if (shouldLog) console.log(`[${performance.now().toFixed(2)}]`, ...args)
    }
}

export default logger