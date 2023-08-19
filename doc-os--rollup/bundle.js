let shouldLog = false;

const logger = {
    switch: function (state) { shouldLog = state; },
    log: function (...args) {
        if (shouldLog) console.log(`[${performance.now().toFixed(2)}]`, ...args);
    }
};

function parseLineCommand(lineCommand) {
    const characters = lineCommand.split('');

    const words = [];
    let word = '';
    let shouldSkipSpace = true;

    /*
        flow:
              - shouldSkipSpace = true
            h - add to word
              - push to word. reset word
            " - shouldSkipSpace = false, skip
            h - push to word
              - push to word
            a - push to word
            " - shouldSkipSpace = true, skip
    */

    characters.forEach(character => {
        if (shouldSkipSpace && character === ' ') {
            words.push(word);
            word = '';
        } else if (shouldSkipSpace && character === '"') {
            shouldSkipSpace = false;
        } else if (shouldSkipSpace === false && character === '"') {
            shouldSkipSpace = true;
        } else {
            word += character;
        }
    });
    /* last word push */
    words.push(word);
    word = '';

    return words
}

const functionManager = {
    debug: false,
    functionMap: {},
    init: function () { },
    register: function (key, value) {
        this.functionMap[key] = value;
    },
    execute: function (...args) {
        if (args.length === 2) {
            this.executeByKey(args[0], args[1]);
        } else {
            this.executeLineCommand(args[0]);
        }
    },
    executeByKey: function (key, payload) {
        if (this.debug) console.log(`[${performance.now().toFixed(2)}] executing: ${key}`);
        if (!this.functionMap[key]) throw Error('Unknown function: ' + key)

        return this.functionMap[key](payload)
    },
    /**
     *
     * @param {string} lineCommand string command to execute
     */
    executeLineCommand: function (lineCommand) {
        const args = parseLineCommand(lineCommand);
        // const args = payload.split(' ')
        const functionKey = args[0];
        if (!this.functionMap[functionKey]) throw Error('Invalid line command: ' + functionKey)

        this.executeByKey(functionKey, args[1]);
    },
    executeLater: function (key, delay) {
        const self = this;
        setTimeout(() => {
            self.execute(key);
        }, delay);
    }
};

const storage = {};

/**
 * get unique id
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
 */
const getId = () => {
    let array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    let str = '';
    for (let i = 0; i < array.length; i++) {
        str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
    }
    return str
};

function StorageManager(storage = {}) {
    const self = this;
    const storageManager = this;
    this.storage = storage;

    /* Helper function for save any data to any storage */
    function set(target, key, value) {
        if (target[key]) throw Error('Key collision detected!')

        target[key] = value;
        return key
    }

    /* Basic set function, with auto ID assign */
    this.set = function (data) {
        const id = getId();
        if (self.storage[id]) throw Error('ID collision detected!')

        set(self.storage, id, data);

        return id
    };

    /* Basic get function */
    this.get = function (key) {
        return this.storage[key]
    };

    /**
     * register space for a name
     * @param {string} namespace
     */
    this.register = function (namespace) {
        if (this.storage[namespace]) console.warn('Namespace already registered! ' + namespace);

        this.storage[namespace] = {};
        return self.use(namespace)
    };

    /* Use a named space in storage */
    this.use = function (namespace) {
        return {
            set: function (data) {

                const id = data.id || getId();
                set(storageManager.storage[namespace], id, data);
            },
            get: function (key) {
                if (key) {
                    return self.storage[namespace][key]
                }

                return self.storage[namespace]
            }
        }
    };

    return this
}

/**
 * Log manager, needs a storage manager to store logs
 * @param {*} storageManager storage manager instance
 */
function LogManager(storageManager) {
    if (!storageManager) throw Error('LogManager needs storageManager')

    const NAMESPACE = 'LogManager';
    const { set, get } = storageManager.register(NAMESPACE);

    /* Methods */
    this.log = function (value) {
        /* Creating log object */
        const log = {
            id: `log_${getId()}`,
            created_at: new Date().toISOString(),
            value
        };

        set(log);
    };

    this.get = function () {
        return get()
    };

    /* Method Registration */
    functionManager.register('log', this.log);
}

const guiManager = {
    root: document.body,
    spaceMap: {},
    render: function (payload, namespace) {
        let element;

        if (payload.key === 'text') {
            const text = document.createElement('p');
            text.innerText = payload.value;

            element = text;


        } else if (payload.key === 'button') {
            const button = document.createElement('button');
            button.innerText = payload.value;
            if (payload.props && payload.props.onclick) {
                button.onclick = payload.props.onclick;
            }

            element = button;
        }

        if (element) {
            if (namespace && this.spaceMap[namespace]) {
                this.spaceMap[namespace].appendChild(element);
            } else {
                this.root.appendChild(element);
            }
        }

        return this
    },
    register: function (namespace) {
        this.spaceMap[namespace] = document.createElement('div');
        this.root.appendChild(this.spaceMap[namespace]);
        return this
    },
    use: function (namespace) {
        const self = this;
        return {
            render: function (payload) {
                self.render(payload, namespace);
            }
        }
    }
};

functionManager.register('render', guiManager.render.bind(guiManager));

const logRenderer = {
    init: function(logManager) {
        const namespace = 'log';

        this.logManager = logManager;

        guiManager.register(namespace);
        const { render } = guiManager.use(namespace);
        this.guiRender = render.bind(this);
    },
    render: function() {
        const logMap = this.logManager.get();
        const logIds = Object.keys(logMap);

        logIds.forEach(logId => {
            this.guiRender({
                key: 'text',
                value: `${logMap[logId].created_at} ${logMap[logId].value}`
            });
        });
    }
};

function OperatingSystem() {
    const self = this;

    this.boot = function () {
        /* Install DocOS features */
        const storageManager = new StorageManager(storage);

        /* Log system needs storage system to store logs */
        const logManager = new LogManager(storageManager);

        logger.log(Object.keys(functionManager.functionMap));

        self.execute('log "os booting..."');

        /* booting functions goes here... */
        self.execute('log "hello world"');

        self.execute('render', {
            key: 'text',
            value: 'Hello, World!'
        });

        logRenderer.init(logManager);
        logRenderer.render();

        self.execute('render', {
            key: 'button',
            value: 'shut down',
            props: {
                onclick: function () {
                    os.execute('shutdown');

                    document.body.innerHTML = '';

                    const $boot = document.createElement('button');
                    $boot.innerHTML = 'boot';
                    $boot.onclick = () => {
                        os.execute('boot');
                        $boot.remove();
                    };
                    document.body.appendChild($boot);
                }
            }
        });
        /* booting funcition end */

        self.execute('log "os booted."');
    };

    this.shutdown = function () {
        console.log('shutdown');
        document.body.innerHTML = '';
    };

    /* Command Registration */
    functionManager.register('boot', this.boot);
    functionManager.register('shutdown', this.shutdown);

    return this
}

/* Facade/proxy? */
OperatingSystem.prototype.execute = functionManager.execute.bind(functionManager);
OperatingSystem.prototype.executeLater = functionManager.executeLater.bind(functionManager);

const os = new OperatingSystem();

function renderBootButton(os) {
    const $boot = document.createElement('button');
    $boot.innerHTML = 'boot';
    $boot.onclick = () => {
        os.execute('boot');
        $boot.remove();
    };
    document.body.appendChild($boot);
}

const CONFIG = {
    debug: true,
    autoboot: true,
    should_test_shutdown: false
};

logger.switch(CONFIG.debug);
logger.log(`Hello from main.js`);
logger.log(CONFIG);

if (CONFIG.autoboot) {
    os.execute('boot');

    /* Shutdown test */
    if (CONFIG.should_test_shutdown) {
        os.executeLater('shutdown', 1000);
    }
} else {
    logger.log('Rendering "boot" button...');
    renderBootButton(os);
    logger.log('"boot" button rendered.');
}
//# sourceMappingURL=bundle.js.map
