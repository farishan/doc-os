import functionManager from "../../modules/functionManager";

const guiManager = {
    root: document.body,
    spaceMap: {},
    render: function (payload, namespace) {
        let element;

        if (payload.key === 'text') {
            const text = document.createElement('p')
            text.innerText = payload.value

            element = text;


        } else if (payload.key === 'button') {
            const button = document.createElement('button')
            button.innerText = payload.value
            if (payload.props && payload.props.onclick) {
                button.onclick = payload.props.onclick
            }

            element = button;
        }

        if (element) {
            if (namespace && this.spaceMap[namespace]) {
                this.spaceMap[namespace].appendChild(element)
            } else {
                this.root.appendChild(element)
            }
        }

        return this
    },
    register: function (namespace) {
        this.spaceMap[namespace] = document.createElement('div')
        this.root.appendChild(this.spaceMap[namespace])
        return this
    },
    use: function (namespace) {
        const self = this
        return {
            render: function (payload) {
                self.render(payload, namespace)
            }
        }
    }
}

functionManager.register('render', guiManager.render.bind(guiManager))

export default guiManager