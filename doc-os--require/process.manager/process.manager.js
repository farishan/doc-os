define(function () {
    function ProcessManager() {
        let processMap = {}

        this.add = function (name, fn) {
            processMap[name] = fn
        }

        this.run = function () {
            for (let [k, v] of Object.entries(processMap)) {
                v()
                delete processMap[k]
            }
        }

        this.log = function () {
            console.info(processMap)
        }
    }

    return ProcessManager
})
