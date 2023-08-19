import guiManager from "../gui/guiManager"

const logRenderer = {
    init: function(logManager) {
        const namespace = 'log'

        this.logManager = logManager

        guiManager.register(namespace)
        const { render } = guiManager.use(namespace)
        this.guiRender = render.bind(this)
    },
    render: function() {
        const logMap = this.logManager.get()
        const logIds = Object.keys(logMap)

        logIds.forEach(logId => {
            this.guiRender({
                key: 'text',
                value: `${logMap[logId].created_at} ${logMap[logId].value}`
            })
        });
    }
}

export default logRenderer