(() => {
  // modules/create-scene.js
  function createScene(child) {
    const scene = document.createElement("div");
    scene.style.width = "100%";
    scene.style.height = "100%";
    scene.style.display = "flex";
    scene.style.position = "fixed";
    scene.style.alignItems = "center";
    scene.style.justifyContent = "center";
    scene.appendChild(child);
    return scene;
  }

  // modules/command-line-interface/parse-line-command.js
  function parseLineCommand(lineCommand) {
    const characters = lineCommand.split("");
    const words = [];
    let word = "";
    let shouldSkipSpace = true;
    characters.forEach((character) => {
      if (shouldSkipSpace && character === " ") {
        words.push(word);
        word = "";
      } else if (shouldSkipSpace && character === '"') {
        shouldSkipSpace = false;
      } else if (shouldSkipSpace === false && character === '"') {
        shouldSkipSpace = true;
      } else {
        word += character;
      }
    });
    words.push(word);
    word = "";
    return words;
  }
  var parse_line_command_default = parseLineCommand;

  // modules/command-line-interface/index.js
  function CommandLineInterface() {
    this.debug = false;
    this.functionMap = {};
    this.register = function(key, value) {
      this.functionMap[key] = value;
    };
    this.execute = function(...args) {
      if (args.length === 2) {
        this.executeByKey(args[0], args[1]);
      } else {
        this.executeLineCommand(args[0]);
      }
    };
    this.executeByKey = function(key, payload) {
      if (this.debug)
        console.log(`[${performance.now().toFixed(2)}] executing: ${key}`);
      if (!this.functionMap[key])
        throw Error("Unknown function: " + key);
      return this.functionMap[key](payload);
    };
    this.executeLineCommand = function(lineCommand) {
      const args = parse_line_command_default(lineCommand);
      const functionKey = args[0];
      if (!this.functionMap[functionKey])
        throw Error("Invalid line command: " + functionKey);
      this.executeByKey(functionKey, args[1]);
    };
    this.executeLater = function(key, delay) {
      const self = this;
      setTimeout(() => {
        self.execute(key);
      }, delay);
    };
    return this;
  }
  var instance = new CommandLineInterface();
  var getInstance = () => {
    if (!instance)
      instance = new CommandLineInterface();
    return instance;
  };

  // modules/event-manager/index.js
  function EventManager() {
    const eventsByKey = {
      // 'event_key': () => {}
    };
    const eventsByScope = {
      // 'scope': {
      //   'event_key': () => {}
      // }
    };
    this.on = (key, fn) => eventsByKey[key] = fn;
    this.off = (key) => delete eventsByKey[key];
    this.get = (scope, key) => {
      if (!eventsByScope[scope])
        this.set(scope);
      return key ? eventsByScope[scope][key] : eventsByScope[scope];
    };
    this.set = (scope) => eventsByScope[scope] = {};
    this.isset = (scope) => eventsByScope[scope] ? true : false;
    this.add = (scope, key, fn) => {
      if (!eventsByScope[scope])
        this.set(scope);
      eventsByScope[scope][key] = fn;
    };
    this.remove = (scope, key) => {
      if (!eventsByScope[scope])
        this.set(scope);
      if (key)
        delete eventsByScope[scope][key];
      else
        delete eventsByScope[scope];
    };
    this.has = (scope, key) => eventsByScope[scope] && eventsByScope[scope][key] ? true : false;
    this.dispatch = (scope, event, data) => {
      for (let index = 0; index < Object.keys(eventsByScope[scope]).length; index++) {
        const key = Object.keys(eventsByScope[scope])[index];
        eventsByScope[scope][key]({ event, data });
      }
    };
    return this;
  }
  var instance2 = new EventManager();
  var getInstance2 = () => {
    if (!instance2)
      instance2 = new EventManager();
    return instance2;
  };

  // modules/hardware.js
  var eventManager = getInstance2();
  function Hardware() {
    eventManager.set("resize");
    eventManager.set("keyup");
    eventManager.set("keydown");
    eventManager.set("mouseup");
    eventManager.set("mousedown");
    eventManager.set("mousemove");
    eventManager.set("mouseenter");
    eventManager.set("mouseleave");
    eventManager.set("contextmenu");
  }
  Hardware.prototype.addListener = function(id2, event, cb) {
    if (!event || !id2 || !cb)
      throw Error("Invalid arguments.", { event, id: id2, cb });
    if (!eventManager.isset(event))
      throw Error("Unknown event.", event);
    eventManager.add(event, id2, cb);
    window.addEventListener(event, cb);
  };
  Hardware.prototype.removeListener = function(id2, event) {
    if (!event || !id2)
      throw Error("Invalid arguments.", { event, id: id2 });
    if (!eventManager.isset(event))
      throw Error("Unknown event.", event);
    if (!eventManager.has(event, id2))
      throw Error(`No ${event} listener with this id: ${id2}`);
    window.removeEventListener(event, eventManager.get(event, id2));
    eventManager.remove(event, id2);
  };
  var instance3 = new Hardware();
  var getInstance3 = () => {
    if (!instance3)
      instance3 = new Hardware();
    return instance3;
  };

  // modules/graphical-user-interface/IconManager.js
  var TYPE_FILE = "file";
  var TYPE_FOLDER = "folder";
  var TYPE_APP = "app";
  var hardware = getInstance3();
  var eventScopesByKey = {
    mousemove: "mousemove",
    mouseup: "mouseup"
  };
  function IconManager() {
    this.createIcon = function(id2, dom, type) {
      let isMouseDown = false;
      let isDragging = false;
      let startPoint = { x: 0, y: 0 };
      let distance = { x: 0, y: 0 };
      const rootDOM = document.createElement("div");
      const iconDOM = document.createElement("span");
      if (type === TYPE_FILE)
        iconDOM.innerHTML = "&#128196;";
      else if (type === TYPE_FOLDER)
        iconDOM.innerHTML = "&#128193;";
      else if (type === TYPE_APP)
        iconDOM.innerHTML = "&#9670;";
      rootDOM.append(iconDOM);
      rootDOM.appendChild(dom);
      rootDOM.style.top = 0;
      rootDOM.style.left = 0;
      rootDOM.style.cursor = "grab";
      rootDOM.style.userSelect = "none";
      rootDOM.style.border = "1px solid";
      rootDOM.style.position = "absolute";
      rootDOM.onmousedown = (ev) => {
        isMouseDown = true;
        startPoint.x = ev.clientX;
        startPoint.y = ev.clientY;
        distance.x = Math.abs(startPoint.x - rootDOM.offsetLeft);
        distance.y = Math.abs(startPoint.y - rootDOM.offsetTop);
        rootDOM.style.cursor = "grabbing";
      };
      hardware.addListener(id2, eventScopesByKey.mousemove, (ev) => {
        if (!isMouseDown)
          return;
        isDragging = true;
        rootDOM.style.left = ev.clientX - distance.x + "px";
        rootDOM.style.top = ev.clientY - distance.y + "px";
      });
      hardware.addListener(id2, eventScopesByKey.mouseup, () => {
        isMouseDown = false;
        isDragging = false;
        rootDOM.style.cursor = "grab";
      });
      return rootDOM;
    };
  }

  // modules/graphical-user-interface/custom-window/get-ui.js
  function getUI({
    minWidth,
    minHeight,
    options,
    extraSize
  }) {
    const rootDOM = document.createElement("div");
    rootDOM.style.padding = options.style.padding + "px";
    rootDOM.style.boxSizing = "border-box";
    rootDOM.style.userSelect = "none";
    rootDOM.style.minWidth = minWidth + "px";
    rootDOM.style.minHeight = minHeight + "px";
    rootDOM.style.width = options.initialWidth ? options.initialWidth + extraSize + "px" : minWidth + extraSize + "px";
    rootDOM.style.height = minHeight + extraSize + "px";
    rootDOM.oncontextmenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
    return rootDOM;
  }

  // modules/libs/get-random-string.js
  function getRandomString() {
    return Math.random().toString(36).slice(2, 5);
  }

  // modules/libs/get-id.js
  var MAX_INT = 9007199254740991;
  var MAX_INT_MOD = -3;
  var id = 0;
  var string = getRandomString();
  function getId() {
    if (id > MAX_INT + MAX_INT_MOD) {
      id = 0;
      string = getRandomString();
    }
    return ++id + string;
  }

  // modules/graphical-user-interface/custom-window/WindowBody.js
  function WindowBody(options) {
    this.$element = document.createElement("div");
    this.$element.style.padding = options.style.padding + "px";
    this.$element.style.overflow = "auto";
    this.$element.style.cursor = "auto";
    this.$element.style.boxSizing = "border-box";
    this.$element.style.height = "100%";
    this.reset = (dom) => {
      if (!dom)
        return;
      this.$element.innerHTML = "";
      this.$element.appendChild(dom);
    };
    return this;
  }

  // modules/graphical-user-interface/custom-window/get-wrapper.js
  function getWrapper({ minWidth, minHeight, options, extraSize }) {
    const dom = document.createElement("div");
    dom.style.minWidth = this.minWidth - options.style.padding * 2 + "px";
    dom.style.minHeight = this.minHeight - options.style.padding * 2 + "px";
    dom.style.width = this.minWidth + extraSize - options.style.padding * 2 + "px";
    dom.style.height = this.minHeight + extraSize - options.style.padding * 2 + "px";
    dom.style.position = "absolute";
    dom.style.border = `${options.style.borderWidth}px ${options.style.borderStyle}`;
    dom.style.overflow = "hidden";
    return dom;
  }

  // modules/graphical-user-interface/custom-window/WindowHeader.js
  function WindowHeader(args) {
    const options = {
      name: "",
      onmousedown: () => {
      },
      onclose: () => {
      },
      ...args
    };
    this.$element = document.createElement("div");
    if (options.draggable)
      this.$element.style.cursor = "grab";
    else
      this.$element.style.cursor = "auto";
    this.$element.style.borderBottom = `${options.style.borderWidth}px ${options.style.borderStyle}`;
    this.$element.style.padding = options.style.padding + "px";
    const $closeButton = document.createElement("button");
    $closeButton.style.marginRight = options.style.padding + "px";
    $closeButton.innerHTML = "&#x2715";
    this.$element.appendChild($closeButton);
    this.$element.innerHTML += options.name;
    this.$element.onmousedown = (e) => {
      options.onmousedown();
      if (options.draggable) {
        this.$element.style.cursor = "grabbing";
      }
    };
    this.$element.onmouseup = (e) => {
      if (e.target.innerText === "\u2715") {
        options.onclose();
        return;
      }
      if (options.draggable) {
        this.$element.style.cursor = "grab";
      }
    };
    return this;
  }

  // modules/graphical-user-interface/custom-window/get-background.js
  function getBackground() {
    const dom = document.createElement("div");
    dom.style.position = "absolute";
    dom.style.left = 0;
    dom.style.top = 0;
    dom.style.right = 0;
    dom.style.bottom = 0;
    dom.style.zIndex = -1;
    dom.style.opacity = 0.9;
    return dom;
  }

  // modules/graphical-user-interface/custom-window/get-clicked-resizer.js
  function getClickedResizer(dom, threshold, x, y) {
    const n = y > dom.offsetTop && y < dom.offsetTop + threshold, e = x < dom.offsetLeft + dom.offsetWidth && x > dom.offsetLeft + dom.offsetWidth - threshold, s = y < dom.offsetTop + dom.offsetHeight && y > dom.offsetTop + dom.offsetHeight - threshold, w = x > dom.offsetLeft && x < dom.offsetLeft + threshold;
    return s && e ? "se" : s && w ? "sw" : n && e ? "ne" : n && w ? "nw" : n ? "n" : e ? "e" : s ? "s" : w ? "w" : "";
  }

  // modules/graphical-user-interface/custom-window/index.js
  function CustomWindow(args, themeManager4) {
    const self = this;
    const options = {
      id: getId(),
      style: {
        padding: 8,
        borderWidth: 1,
        borderStyle: "solid"
      },
      ...args
    };
    themeManager4.addListener((theme) => {
      this.$background.style.backgroundColor = theme.style.body.backgroundColor;
    });
    this.id = options.id;
    this.name = options.name || this.id;
    this.isHeaderMousedown = false;
    this.minWidth = 150;
    this.minHeight = 150;
    const extraSize = 50;
    this.padding = options.style.padding;
    this.cursorThreshold = options.style.padding;
    this.eventListener = { close: [] };
    this.$window = getUI({
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      options,
      extraSize
    });
    this.$background = getBackground();
    this.$wrapper = getWrapper({
      minWidth: this.minWidth,
      minHeight: this.minHeight,
      options,
      extraSize
    });
    this.$wrapper.appendChild(this.$background);
    this.$window.appendChild(this.$wrapper);
    this.$background.style.backgroundColor = themeManager4.getTheme().style.body.backgroundColor;
    this.header = new WindowHeader({
      ...options,
      name: this.name,
      onmousedown: () => this.isHeaderMousedown = true,
      onclose: handleClose
    });
    this.$wrapper.appendChild(this.header.$element);
    this.body = new WindowBody(options);
    this.$wrapper.appendChild(this.body.$element);
    function handleClose() {
      self.$window.remove();
      self.eventListener.close.forEach((listener) => {
        listener();
      });
    }
    return this;
  }
  CustomWindow.prototype.addEventListener = function(eventKey, fn) {
    this.eventListener[eventKey].push(fn);
  };
  CustomWindow.prototype.getClickedResizer = function(x, y) {
    return getClickedResizer(this.$window, this.cursorThreshold, x, y);
  };
  CustomWindow.prototype.setContent = function(element) {
    this.body.reset(element);
  };
  CustomWindow.prototype.finalize = function() {
    this.$wrapper.style.width = this.$window.offsetWidth - this.padding * 2 + "px";
    this.$wrapper.style.height = this.$window.offsetHeight - this.padding * 2 + "px";
    this.body.$element.style.maxHeight = this.$wrapper.offsetHeight - this.header.$element.offsetHeight + "px";
  };

  // modules/graphical-user-interface/theme.js
  var darkTheme = {
    name: "dark",
    backgroundColor: "#222222",
    borderWidth: 1,
    //px
    borderStyle: "solid",
    style: {
      body: {
        backgroundColor: "#222222",
        color: "#ffffff",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
      },
      button: {
        cursor: "pointer"
      }
    }
  };
  var lightTheme = {
    name: "light",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    //px
    borderStyle: "solid",
    style: {
      body: {
        backgroundColor: "#ffffff",
        color: "#222222",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
      },
      button: {
        cursor: "pointer"
      }
    }
  };
  var themeMap = {
    dark: darkTheme,
    light: lightTheme
  };

  // modules/graphical-user-interface/ThemeManager.js
  var HEAD = document.head;
  var BODY = document.body;
  function ThemeManager() {
    let theme = null;
    this.themeListeners = [];
    function generateStyleDOM(theme2) {
      const style = document.createElement("style");
      for (let [selector, selectorValue] of Object.entries(theme2.style)) {
        if (selector === "body") {
          for (let [prop, propValue] of Object.entries(selectorValue)) {
            BODY.style[prop] = propValue;
          }
        } else if (selector === "button") {
          let buttonStyle = "";
          for (let [prop, propValue] of Object.entries(selectorValue)) {
            buttonStyle += `${toKebabCase(prop)}: ${propValue}; `;
          }
          style.innerHTML += `button { ${buttonStyle} }`;
        }
      }
      return style;
    }
    this.getTheme = () => theme;
    this.setTheme = function(newTheme, callback) {
      if (!newTheme)
        throw Error("Unknown newTheme", newTheme);
      if (typeof newTheme === "string" && themeMap[newTheme]) {
        this.setTheme(themeMap[newTheme]);
        return;
      }
      if (theme !== null)
        HEAD.removeChild(theme.$style);
      const style = generateStyleDOM(newTheme);
      theme = { ...newTheme, $style: style };
      HEAD.appendChild(style);
      this.notify(theme);
      if (callback)
        callback(theme);
    };
    this.addListener = (fn) => {
      this.themeListeners.push(fn);
    };
    this.notify = (theme2) => {
      this.themeListeners.forEach((fn) => fn(theme2));
    };
    this.setTheme("dark");
  }
  function toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }
  var instance4 = new ThemeManager();
  var getInstance4 = () => {
    if (!instance4)
      instance4 = new ThemeManager();
    return instance4;
  };

  // modules/graphical-user-interface/WindowManager.js
  var hardware2 = getInstance3();
  var themeManager = getInstance4();
  var BODY2 = document.body;
  var eventScopesByKey2 = {
    mousemove: "mousemove",
    mouseup: "mouseup"
  };
  function WindowManager() {
    const self = this;
    const windowByName = {};
    this.sendToTop = function(customWindow) {
      if (!customWindow)
        return;
      for (let [, v] of Object.entries(windowByName)) {
        const parsed = parseInt(v.$window.style.zIndex);
        if (parsed > 1)
          v.$window.style.zIndex = parsed - 1;
      }
      customWindow.$window.style.zIndex = 5;
    };
    function initWindowInteraction(customWindow, options = {}) {
      if (!customWindow)
        throw Error("Unknown customWindow", customWindow);
      const $window = customWindow.$window;
      const $wrapper = customWindow.$wrapper;
      $window.style.position = "absolute";
      const { resizeable, draggable, style = { padding: 16 } } = options;
      let startPoint = { x: 0, y: 0 };
      let distance = { x: 0, y: 0 };
      let startDimension = { w: 0, h: 0 };
      let isMouseDown = false;
      let isResizing = false;
      let isDragging = false;
      let resizePoint = "";
      const prepareForInteraction = (ev) => {
        isMouseDown = true;
        self.sendToTop(customWindow);
        startPoint.x = ev.clientX;
        startPoint.y = ev.clientY;
        startDimension.w = $window.offsetWidth;
        startDimension.h = $window.offsetHeight;
        distance.x = Math.abs(startPoint.x - $window.offsetLeft);
        distance.y = Math.abs(startPoint.y - $window.offsetTop);
        resizePoint = customWindow.getClickedResizer(ev.clientX, ev.clientY);
      };
      const getProperCursor = (ev) => {
        if (isResizing || isDragging)
          return;
        const n = ev.clientY > $window.offsetTop && ev.clientY < $window.offsetTop + customWindow.cursorThreshold, e = ev.clientX < $window.offsetLeft + $window.offsetWidth && ev.clientX > $window.offsetLeft + $window.offsetWidth - customWindow.cursorThreshold, s = ev.clientY < $window.offsetTop + $window.offsetHeight && ev.clientY > $window.offsetTop + $window.offsetHeight - customWindow.cursorThreshold, w = ev.clientX > $window.offsetLeft && ev.clientX < $window.offsetLeft + customWindow.cursorThreshold;
        if (n && w || s && e) {
          $window.style.cursor = "nwse-resize";
          return;
        } else if (n && e || s && w) {
          $window.style.cursor = "nesw-resize";
          return;
        } else if (e || w) {
          $window.style.cursor = "col-resize";
          return;
        } else if (n || s) {
          $window.style.cursor = "row-resize";
          return;
        }
        $window.style.cursor = "auto";
      };
      const dragAndResize = (e) => {
        if (!isMouseDown)
          return;
        if (customWindow.isHeaderMousedown) {
          if (!draggable)
            return;
          $window.style.left = e.clientX - distance.x + "px";
          $window.style.top = e.clientY - distance.y + "px";
        } else {
          if (!resizeable)
            return;
          if (resizePoint.includes("e")) {
            $window.style.width = startDimension.w - (startPoint.x - e.clientX) + "px";
            $wrapper.style.width = startDimension.w - (startPoint.x - e.clientX) - customWindow.padding * 2 + "px";
          } else if (resizePoint.includes("w")) {
            if (e.clientX - distance.x < startPoint.x + startDimension.w - style.padding * 2 - customWindow.cursorThreshold) {
              if (startDimension.w + (startPoint.x - e.clientX) - customWindow.minWidth > 0) {
                $window.style.left = e.clientX - distance.x + "px";
                $window.style.width = startDimension.w + (startPoint.x - e.clientX) + "px";
                $wrapper.style.width = startDimension.w + (startPoint.x - e.clientX) - customWindow.padding * 2 + "px";
              }
            }
          }
          if (resizePoint.includes("s")) {
            $window.style.height = startDimension.h - (startPoint.y - e.clientY) + "px";
            $wrapper.style.height = startDimension.h - (startPoint.y - e.clientY) - customWindow.padding * 2 + "px";
          } else if (resizePoint.includes("n")) {
            if (e.clientY - distance.y < startPoint.y + startDimension.h - style.padding * 2 - customWindow.cursorThreshold) {
              if (startDimension.h + (startPoint.y - e.clientY) - customWindow.minHeight > 0) {
                $window.style.top = e.clientY - distance.y + "px";
                $window.style.height = startDimension.h + (startPoint.y - e.clientY) + "px";
                $wrapper.style.height = startDimension.h + (startPoint.y - e.clientY) - customWindow.padding * 2 + "px";
              }
            }
          }
          customWindow.body.$element.style.maxHeight = $wrapper.offsetHeight - customWindow.header.$element.offsetHeight + "px";
        }
      };
      $window.onmousedown = prepareForInteraction;
      if (resizeable)
        $window.onmousemove = getProperCursor;
      hardware2.addListener(`customWindow_${customWindow.id}`, eventScopesByKey2.mousemove, dragAndResize);
      hardware2.addListener(`customWindow_${customWindow.id}`, eventScopesByKey2.mouseup, () => {
        isMouseDown = false;
        isResizing = false;
        isDragging = false;
        customWindow.isHeaderMousedown = false;
      });
    }
    this.createWindow = function(args) {
      const options = {
        draggable: false,
        resizeable: false,
        theme: themeManager.getTheme(),
        ...args
      };
      const customWindow = new CustomWindow(options, themeManager);
      if (windowByName[customWindow.name])
        return;
      windowByName[customWindow.name] = customWindow;
      if (options.draggable || options.resizeable) {
        initWindowInteraction(customWindow, options);
      }
      customWindow.addEventListener("close", function() {
        self.destroyWindow(customWindow.name);
      });
      BODY2.appendChild(customWindow.$window);
      customWindow.finalize();
      return customWindow;
    };
    this.destroyWindow = function(name) {
      const customWindow = windowByName[name];
      for (let index = 0; index < Object.keys(eventScopesByKey2).length; index++) {
        const scopeKey = Object.keys(eventScopesByKey2)[index];
        hardware2.removeListener(`customWindow_${customWindow.id}`, scopeKey);
      }
      delete windowByName[name];
    };
    this.closeAllWindow = function() {
      for (let [, v] of Object.entries(windowByName)) {
        v.$window.remove();
        this.destroyWindow(v.name);
      }
    };
    this.isWindowOpened = function(name) {
      return windowByName[name] !== void 0;
    };
    this.setWindowContent = function(name, element) {
      const customWindow = windowByName[name];
      if (customWindow)
        customWindow.setContent(element);
    };
    this.notify = (theme) => {
      for (let [, v] of Object.entries(windowByName)) {
        v.setTheme(theme);
      }
    };
  }

  // modules/graphical-user-interface/ContextMenuManager.js
  var hardware3 = getInstance3();
  var themeManager2 = getInstance4();
  var BODY3 = document.body;
  function ContextMenuManager() {
    this.$contextMenu = void 0;
    this.$contextMenus = [];
    this.getContextMenu = () => {
    };
    this.showContextMenu = function(x, y, content) {
      const $menu = document.createElement("div");
      $menu.style.border = "1px solid";
      $menu.style.padding = "8px";
      $menu.style.position = "absolute";
      $menu.style.zIndex = 9;
      $menu.style.left = x + "px";
      $menu.style.top = y + "px";
      try {
        $menu.style.backgroundColor = themeManager2.getTheme().style.body.backgroundColor;
      } catch (error) {
        console.error(error);
      }
      $menu.onclick = () => this.destroyContextMenu();
      $menu.oncontextmenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };
      if (content) {
        content.forEach((element) => {
          element.style.display = "block";
          $menu.appendChild(element);
        });
      } else {
        this.$contextMenus.forEach((element) => {
          $menu.appendChild(element);
        });
      }
      this.$contextMenu = $menu;
      BODY3.appendChild(this.$contextMenu);
    };
    this.moveContextMenu = function(x, y) {
      this.$contextMenu.style.left = x + "px";
      this.$contextMenu.style.top = y + "px";
    };
    this.destroyContextMenu = function() {
      if (!this.$contextMenu)
        return;
      this.$contextMenu.remove();
      this.$contextMenu = void 0;
    };
    this.addToContextMenu = function(dom) {
      dom.style.display = "block";
      this.$contextMenus.push(dom);
    };
    this.init = function() {
      hardware3.addListener("UI", "contextmenu", (e) => {
        e.preventDefault();
        this.getContextMenu(e.target);
        if (this.$contextMenu) {
          this.moveContextMenu(e.clientX, e.clientY);
          return;
        }
        this.showContextMenu(e.clientX, e.clientY);
      });
      hardware3.addListener("UI", "mousedown", (e) => {
        if (!this.$contextMenu || e.target === this.$contextMenu)
          return;
        if (this.$contextMenu.contains(e.target))
          return;
        this.destroyContextMenu();
      });
    };
  }

  // modules/graphical-user-interface/index.js
  var iconManager = new IconManager();
  var themeManager3 = getInstance4();
  var windowManager = new WindowManager();
  var contextMenuManager = new ContextMenuManager();
  function GraphicalUserInterface() {
    this.init = () => {
      this.setTheme("dark");
      contextMenuManager.init();
    };
    return this;
  }
  GraphicalUserInterface.prototype.getTheme = themeManager3.getTheme.bind(themeManager3);
  GraphicalUserInterface.prototype.createIcon = iconManager.createIcon.bind(iconManager);
  GraphicalUserInterface.prototype.sendToTop = windowManager.sendToTop.bind(windowManager);
  GraphicalUserInterface.prototype.createWindow = windowManager.createWindow.bind(windowManager);
  GraphicalUserInterface.prototype.addThemeListener = themeManager3.addListener.bind(themeManager3);
  GraphicalUserInterface.prototype.closeAllWindow = windowManager.closeAllWindow.bind(windowManager);
  GraphicalUserInterface.prototype.setWindowContent = windowManager.setWindowContent.bind(windowManager);
  GraphicalUserInterface.prototype.showContextMenu = contextMenuManager.showContextMenu.bind(contextMenuManager);
  GraphicalUserInterface.prototype.setTheme = (newTheme) => themeManager3.setTheme(newTheme, (theme) => {
    windowManager.notify(theme);
  });
  var instance5 = new GraphicalUserInterface();
  var getInstance5 = () => {
    if (!instance5)
      instance5 = new GraphicalUserInterface();
    return instance5;
  };

  // modules/softwares/terminal.js
  var ui = getInstance5();
  var cli = getInstance();
  function Terminal() {
    this.name = "Terminal";
    const logs = [];
    const $logs = document.createElement("div");
    cli.register("echo", (payload) => {
      logs.push(payload);
      renderLogs();
    });
    function renderLogs() {
      $logs.innerHTML = "";
      for (let index = logs.length - 1; index >= 0; index--) {
        const log = logs[index];
        $logs.innerHTML += `${log}<br>`;
      }
    }
    this.getContent = function() {
      const $content = document.createElement("div");
      const input = document.createElement("input");
      input.placeholder = 'echo "hello world"';
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          console.log(input.value);
          cli.execute(input.value);
          input.value = "";
        }
      });
      $content.append(input);
      $content.append($logs);
      return $content;
    };
    this.start = () => {
      const customWindow = ui.createWindow({ name: this.name, resizeable: true, draggable: true });
      ui.sendToTop(customWindow);
      const $content = this.getContent();
      ui.setWindowContent(this.name, $content);
    };
  }

  // modules/softwares/settings.js
  var ui2 = getInstance5();
  function Settings() {
    this.name = "Settings";
    this.getContent = function() {
      const $content = document.createElement("div");
      const $darkTheme = document.createElement("button");
      $darkTheme.onclick = function() {
        ui2.setTheme("dark");
      };
      $darkTheme.innerHTML = "Change to Dark Theme";
      $content.appendChild($darkTheme);
      const $lightTheme = document.createElement("button");
      $lightTheme.onclick = function() {
        ui2.setTheme("light");
      };
      $lightTheme.innerHTML = "Change to Light Theme";
      $content.appendChild($lightTheme);
      return $content;
    };
    this.start = () => {
      const customWindow = ui2.createWindow({ name: this.name, resizeable: true, draggable: true });
      ui2.sendToTop(customWindow);
      const $content = this.getContent();
      ui2.setWindowContent(this.name, $content);
    };
  }

  // modules/software-manager.js
  var instance6;
  function SoftwareManager() {
    this.accessKey = "software";
    this.software = /* @__PURE__ */ new Map();
    this.listener = {
      install: []
    };
  }
  SoftwareManager.prototype.install = function(software) {
    if (!software)
      throw Error("Undefined software.");
    if (!software.name)
      throw Error("Software name is required.");
    if (!software.start)
      throw Error("Software start function is required.");
    this.software.set(software.name, software);
    this.listener.install.forEach((fn) => fn());
  };
  SoftwareManager.prototype.getAllExcepts = function(filter) {
    let softwares = [];
    for (const [key, value] of this.software) {
      if (!filter.includes(key))
        softwares.push(value);
    }
    return softwares;
  };
  SoftwareManager.prototype.getAllExcept = function(name) {
    let softwares = [];
    for (const [key, value] of this.software) {
      if (key !== name)
        softwares.push(value);
    }
    return softwares;
  };
  SoftwareManager.prototype.get = function(name) {
    if (!name || !this.software.get(name))
      throw Error("Unknown software.");
    return this.software.get(name);
  };
  SoftwareManager.prototype.run = function(key, payload) {
    const s = this.software.get(key);
    if (!s)
      throw Error("unknown software:", key);
    s.start(payload);
  };
  SoftwareManager.prototype.addEventListener = function(event, cb) {
    if (!this.listener[event])
      throw Error("Unknown event.", event);
    this.listener[event].push(cb);
  };
  var getInstance6 = () => {
    if (!instance6)
      instance6 = new SoftwareManager();
    return instance6;
  };

  // modules/storage/index.js
  function CustomStorage() {
    const data = /* @__PURE__ */ new Map();
    let size = 0;
    this.add = function(k, v) {
      if (!k || !v)
        throw Error("Invalid arguments.", { k, v });
      if (v.size)
        size += v.size;
      if (!data.has(k)) {
        data.set(k, v);
      } else {
        const pathObject = data.get(k);
        if (!pathObject.data)
          return;
        if (pathObject.size && v.size)
          pathObject.size += v.size;
        pathObject.data.set(v.id, v);
      }
    };
    this.getDirectories = (path, result) => {
      data.forEach((v, k) => {
        if (path === "/") {
          if ((k.match(/\//g) || []).length === 2)
            result.set(k, v);
        } else {
          if (k !== path && k.startsWith(path)) {
            if ((k.replace(path, "").match(/\//g) || []).length === 1) {
              result.set(k, v);
            }
          }
        }
      });
    };
    this.getFiles = (path, result) => {
      const pathObject = data.get(path);
      if (!pathObject)
        return;
      if (!pathObject.data)
        return;
      pathObject.data.forEach((d) => result.set(d.id, d));
    };
    this.get = (k) => data.get(k);
    this.getWithPath = function(path) {
      if (!path)
        throw Error("Invalid path.", path);
      let result = /* @__PURE__ */ new Map();
      this.getDirectories(path, result);
      this.getFiles(path, result);
      return result;
    };
    this.deletePathData = (path, key) => data.get(path).data.delete(key);
    this.getSize = () => size;
    this.set = (k, v) => data.set(k, v);
    this.deleteByPath = (path) => data.delete(path);
    this.bulkModify = function(parameter, modifier) {
      data.forEach((v, k) => {
        if (!k.startsWith(parameter))
          return;
        v.path = modifier + k.substring(1);
        data.set(v.path, v);
        data.delete(k);
      });
    };
    this.delete = function(object) {
      if (object.type === "directory") {
        data.delete(object.path);
      } else {
        const pathObject = data.get(object.path);
        if (pathObject.size && object.size)
          pathObject.size -= object.size;
        pathObject.data.delete(object.id);
      }
    };
    this.log = () => console.info(data);
    this.write = this.set.bind(this);
    this.read = this.get.bind(this);
  }
  var storage = new CustomStorage();

  // modules/file-system/constants.js
  var NAMESPACE = "CustomFileSystem";
  var DEFAULT_SIZE = 1;
  var ADD_TO_STORAGE = "addToStorage";
  var CREATE_FILE = "createFile";
  var CREATE_DIRECTORY = "createDirectory";
  var DELETE = "delete";
  var MOVE = "move";
  var TYPE_FILE2 = "file";
  var TYPE_DIRECTORY = "directory";

  // modules/file-system/FileSystemObject.js
  function FileSystemObject(options = {}) {
    this.size = DEFAULT_SIZE;
    this.type = options.type || "file";
    this.id = this.type.slice(0, 1) + getId();
    this.name = options.name || this.type;
    this.path = this.type === "directory" ? options.path + this.id + "/" : options.path;
    return this;
  }

  // modules/file-system/directory-manager.js
  var eventManager2 = getInstance2();
  function DirectoryManager() {
    this.create = function(options = {}) {
      const data = {
        ...new FileSystemObject({ type: "directory", ...options }),
        data: /* @__PURE__ */ new Map()
      };
      eventManager2.dispatch(NAMESPACE, CREATE_DIRECTORY, data);
      return data;
    };
    this.createSystemDirectory = function(name) {
      return {
        ...new FileSystemObject({ type: "directory" }),
        path: "/" + name + "/",
        name,
        data: /* @__PURE__ */ new Map(),
        isSystemFile: true
      };
    };
    this.addListener = (namespace, directory, fn) => {
      eventManager2.add(`${NAMESPACE}_dir`, `${namespace}_${directory}`, fn);
    };
    return this;
  }
  var instance7 = new DirectoryManager();
  var getInstance7 = () => {
    if (!instance7)
      instance7 = new DirectoryManager();
    return instance7;
  };

  // modules/file-system/index.js
  var eventManager3 = getInstance2();
  var directoryManager = getInstance7();
  eventManager3.set(NAMESPACE);
  function dispatch(event, data) {
    eventManager3.dispatch(NAMESPACE, event, data);
    return data;
  }
  function CustomFileSystem() {
    this.read = (d) => console.info(d);
    this.isSystemFile = (d) => d.isSystemFile;
    this.addListener = (k, v) => eventManager3.add(NAMESPACE, k, v);
    this.createFile = function(options = {}) {
      return dispatch(CREATE_FILE, new FileSystemObject({
        type: "file",
        ...options
      }));
    };
    this.getParentPath = (path) => {
      const splitted = path.split("/");
      splitted.pop();
      if (splitted.length > 1)
        splitted.pop();
      return splitted.join("/") + "/";
    };
    this.rename = function(d, newName) {
      d.name = newName;
      return d;
    };
    this.addToStorage = function(object = {}) {
      storage.add(object.path, dispatch(ADD_TO_STORAGE, object));
    };
    this.move = function(toBeMoved, target) {
      if (target.type !== TYPE_DIRECTORY || toBeMoved === target)
        return;
      if (toBeMoved.type === TYPE_FILE2) {
        target.data.set(toBeMoved.id, { ...toBeMoved, path: target.path });
        storage.deletePathData(toBeMoved.path, toBeMoved.id);
      } else {
        storage.bulkModify(toBeMoved.path, target.path);
      }
      return dispatch(MOVE, { toBeMoved, target });
    };
    this.delete = function(object = {}) {
      storage.delete(dispatch(DELETE, object));
    };
    storage.add("/", {
      ...new FileSystemObject({ type: "directory" }),
      path: "/",
      name: "root",
      data: /* @__PURE__ */ new Map(),
      isSystemFile: true
    });
  }
  CustomFileSystem.prototype.get = storage.get.bind(storage);
  CustomFileSystem.prototype.set = storage.set.bind(storage);
  CustomFileSystem.prototype.getWithPath = storage.getWithPath.bind(storage);
  CustomFileSystem.prototype.createDirectory = directoryManager.create.bind(directoryManager);
  CustomFileSystem.prototype.createSystemDirectory = directoryManager.createSystemDirectory.bind(directoryManager);
  CustomFileSystem.prototype.listenToDirectory = directoryManager.addListener.bind(directoryManager);
  var instance8 = new CustomFileSystem();
  var getInstance8 = () => {
    if (!instance8)
      instance8 = new CustomFileSystem();
    return instance8;
  };

  // modules/softwares/file-manager.js
  var fs = getInstance8();
  var ui3 = getInstance5();
  function FileManager(os2) {
    const self = this;
    this.name = "File Manager";
    this.currentPath = "/";
    this.getHead = () => {
      const $head = document.createElement("div");
      $head.style.marginBottom = "8px";
      const $createFileButton = document.createElement("button");
      $createFileButton.innerHTML = "create file";
      $createFileButton.onclick = () => {
        const file = fs.createFile({
          name: null,
          path: this.currentPath
        });
        fs.addToStorage(file);
        this.reload();
      };
      $head.appendChild($createFileButton);
      const $createDirectory = document.createElement("button");
      $createDirectory.innerHTML = "create directory";
      $createDirectory.onclick = () => {
        const directory = fs.createDirectory({
          name: null,
          path: this.currentPath
        });
        fs.addToStorage(directory);
        this.reload();
      };
      $head.appendChild($createDirectory);
      const $back = document.createElement("button");
      $back.innerHTML = "back";
      $back.onclick = () => {
        this.currentPath = fs.getParentPath(this.currentPath);
        this.reload();
      };
      const $path = document.createElement("p");
      $path.innerHTML = this.currentPath;
      $head.appendChild($back);
      $head.appendChild($path);
      return $head;
    };
    this.getBody = () => {
      const $body = document.createElement("div");
      const $table = this.generateTable();
      $body.appendChild($table);
      return $body;
    };
    this.getRoot = () => {
      const $root = document.createElement("div");
      const $head = this.getHead();
      const $body = this.getBody();
      $root.appendChild($head);
      $root.appendChild($body);
      return $root;
    };
    this.reload = () => {
      const $root = this.getRoot();
      ui3.setWindowContent(this.name, $root);
    };
    this.openDirectory = (directory) => {
      this.currentPath = directory.path;
      this.reload();
    };
    function createTd() {
      const td = document.createElement("td");
      td.style.border = "1px solid";
      td.style.padding = "4px";
      return td;
    }
    function createTh(text) {
      const th = document.createElement("th");
      th.style.border = "1px solid";
      th.style.padding = "4px";
      th.innerHTML = text;
      return th;
    }
    this.generateTable = () => {
      const data = fs.getWithPath(this.currentPath);
      const $table = document.createElement("table");
      $table.style.borderCollapse = "collapse";
      $table.style.width = "100%";
      const $thead = document.createElement("thead");
      const $tr = document.createElement("tr");
      $tr.appendChild(createTh("ID"));
      $tr.appendChild(createTh("Name"));
      $tr.appendChild(createTh("Type"));
      $tr.appendChild(createTh("Size"));
      $thead.appendChild($tr);
      $table.appendChild($thead);
      const $tbody = document.createElement("tbody");
      $table.appendChild($tbody);
      let dragged;
      data.forEach((d) => {
        const tr = document.createElement("tr");
        if (!d.isSystemFile) {
          tr.draggable = true;
          tr.ondragstart = () => dragged = d;
        }
        tr.ondragenter = (e) => {
          tr.style.backgroundColor = "yellow";
        };
        tr.ondragleave = (e) => {
          tr.style.backgroundColor = "initial";
        };
        tr.ondragover = (e) => e.preventDefault();
        tr.ondrop = () => {
          tr.style.backgroundColor = "initial";
          if (!dragged.path.includes(d.path)) {
            fs.move(dragged, d);
            this.reload();
          }
        };
        tr.onmousedown = function(e) {
          if (e.button === 2) {
            tr.style.backgroundColor = "#666";
            setTimeout(() => {
              tr.style.backgroundColor = "initial";
            }, 200);
          } else {
            tr.style.backgroundColor = "#666";
          }
        };
        tr.onmouseup = function(e) {
          tr.style.backgroundColor = "initial";
        };
        const tdId = createTd();
        const tdType = createTd();
        const tdName = createTd();
        const tdSize = createTd();
        tr.oncontextmenu = function(e) {
          e.preventDefault();
          const $contextMenus = [];
          const $open = document.createElement("button");
          $open.innerHTML = "Open";
          $open.onclick = () => {
            if (d.type === "file") {
              os2.run("File Reader", d);
            } else if (d.type === "directory") {
              self.openDirectory(d);
            }
          };
          $contextMenus.push($open);
          if (!fs.isSystemFile(d)) {
            const $rename = document.createElement("button");
            $rename.innerHTML = "Rename";
            const handleSubmit = (e2) => {
              const newData = fs.rename(d, e2.target.innerHTML);
              tdName.contentEditable = false;
              fs.set(d.id, newData);
            };
            $rename.onclick = () => {
              tdName.contentEditable = true;
              tdName.focus();
              setTimeout(() => {
                const range = document.createRange();
                range.selectNodeContents(tdName);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
              }, 50);
              tdName.onkeydown = (e2) => {
                if (e2.key === "Enter") {
                  e2.target.blur();
                }
              };
              tdName.onblur = (e2) => handleSubmit(e2);
            };
            $contextMenus.push($rename);
            const $delete = document.createElement("button");
            $delete.innerHTML = "Delete";
            $delete.onclick = () => {
              fs.delete(d);
              self.reload();
            };
            $contextMenus.push($delete);
          }
          ui3.showContextMenu(e.clientX, e.clientY, $contextMenus);
        };
        tr.ondblclick = () => {
          if (d.type === "file") {
            os2.run("File Reader", d);
          } else if (d.type === "directory") {
            self.openDirectory(d);
          }
        };
        tdId.innerHTML = d.id;
        tdType.innerHTML = d.type;
        tdName.innerHTML = d.isSystemFile ? "." + d.name : d.name;
        tdSize.innerHTML = d.size;
        tr.appendChild(tdId);
        tr.appendChild(tdName);
        tr.appendChild(tdType);
        tr.appendChild(tdSize);
        $tbody.appendChild(tr);
      });
      return $table;
    };
    fs.addListener("file-manager.app", (payload) => {
      if (!payload)
        return;
      if (!payload.event || !payload.data)
        return;
      this.reload();
    });
    this.start = () => {
      ui3.createWindow({ name: this.name, resizeable: true, draggable: true, initialWidth: 300 });
      this.reload();
    };
  }

  // modules/softwares/dock/dock.ui.js
  function DockUI(theme) {
    const $element = document.createElement("div");
    $element.style.boxSizing = "border-box";
    $element.style.position = "fixed";
    $element.style.zIndex = 9;
    $element.style.left = 0;
    $element.style.bottom = 0;
    $element.style.width = "100%";
    $element.style.padding = "8px";
    $element.style.boxSizing = "border-box";
    $element.style.borderTop = `${theme.borderWidth}px ${theme.borderStyle}`;
    $element.style.backgroundColor = theme.backgroundColor;
    const $layout = document.createElement("table");
    const $menuTriggerTd = document.createElement("td");
    $menuTriggerTd.setAttribute("width", "100%");
    const $menuTrigger = document.createElement("button");
    $menuTrigger.innerHTML = "Menu";
    $menuTriggerTd.appendChild($menuTrigger);
    $layout.appendChild($menuTriggerTd);
    const $clockTd = document.createElement("td");
    const $clock = document.createElement("span");
    const now = /* @__PURE__ */ new Date();
    $clock.innerHTML = `${now.getHours()}:${now.getMinutes()}`;
    $clockTd.appendChild($clock);
    $layout.appendChild($clockTd);
    $element.appendChild($layout);
    const $menu = document.createElement("div");
    $menu.style.display = "none";
    $menu.style.position = "absolute";
    $menu.style.left = 0;
    $menu.style.width = "200px";
    $menu.style.height = "200px";
    $menu.style.padding = "8px";
    $menu.style.borderRight = `${theme.borderWidth}px ${theme.borderStyle}`;
    $menu.style.borderTop = `${theme.borderWidth}px ${theme.borderStyle}`;
    $menu.style.backgroundColor = theme.backgroundColor;
    $element.appendChild($menu);
    setTimeout(() => {
      $menu.style.bottom = $element.offsetHeight + "px";
    }, 200);
    this.setTheme = function(theme2) {
      $element.style.backgroundColor = theme2.style.body.backgroundColor;
      $menu.style.backgroundColor = theme2.style.body.backgroundColor;
    };
    this.addToMenu = (element) => {
      element.style.display = "block";
      $menu.appendChild(element);
    };
    this.clear = () => $menu.innerHTML = "";
    this.closeMenu = () => $menu.style.display = "none";
    $menuTrigger.onclick = () => {
      if ($menu.style.display === "none")
        $menu.style.display = "block";
      else if ($menu.style.display === "block")
        $menu.style.display = "none";
    };
    this.getMenuElement = () => $menu;
    this.getMenuTrigger = () => $menuTrigger;
    this.render = () => document.body.appendChild($element);
    this.destroy = () => $element.remove();
  }

  // modules/softwares/dock/dock.js
  var ui4 = getInstance5();
  var hardware4 = getInstance3();
  var softwareManager = getInstance6();
  var NAMESPACE2 = "Dock";
  function Dock() {
    const self = this;
    this.name = NAMESPACE2;
    softwareManager.addEventListener("install", () => {
      this.refresh();
    });
    this.ui = new DockUI(ui4.getTheme());
    ui4.addThemeListener((theme) => self.ui.setTheme(theme));
    hardware4.addListener(NAMESPACE2, "mousedown", (e) => {
      if (e.target !== self.ui.getMenuElement() && e.target !== self.ui.getMenuTrigger() && e.target instanceof HTMLButtonElement === false) {
        self.ui.closeMenu();
      }
    });
    this.refresh = () => {
      self.ui.clear();
      softwareManager.getAllExcepts([NAMESPACE2, "Desktop"]).forEach(function(app) {
        const $trigger = document.createElement("button");
        $trigger.innerHTML = app.name;
        $trigger.onclick = () => app.start();
        self.ui.addToMenu($trigger);
      });
    };
    this.start = () => {
      this.ui.render();
      this.refresh();
    };
    this.stop = () => {
      this.ui.destroy();
    };
  }

  // modules/softwares/file-reader.js
  var ui5 = getInstance5();
  function CustomFileReader() {
    this.name = "File Reader";
    this.file = void 0;
    this.getContent = function() {
      if (!this.file) {
        const $open = document.createElement("button");
        $open.onclick = function() {
          ui5.createWindow({ name: "file prompt", resizeable: true, draggable: true });
        };
        $open.innerHTML = "Open File";
        return $open;
      } else {
        const $content = document.createElement("div");
        $content.style.wordBreak = "break-all";
        $content.style.userSelect = "text";
        $content.oncontextmenu = (e) => e.stopPropagation();
        $content.innerHTML = `<pre><code>${JSON.stringify(this.file, " ", 2)}</code></pre>`;
        return $content;
      }
    };
    this.start = (file) => {
      if (file)
        this.file = file;
      const customWindow = ui5.createWindow({ name: this.name, resizeable: true, draggable: true });
      ui5.sendToTop(customWindow);
      const $content = this.getContent();
      ui5.setWindowContent(this.name, $content);
    };
  }

  // modules/softwares/desktop.js
  var fs2 = getInstance8();
  var ui6 = getInstance5();
  var NAMESPACE3 = "Desktop";
  function Desktop(os2) {
    const self = this;
    this.name = NAMESPACE3;
    this.path = "/desktop/";
    this.iconDomMap = {};
    const $desktop = document.createElement("div");
    $desktop.id = "$desktop";
    $desktop.style.position = "fixed";
    $desktop.style.left = 0;
    $desktop.style.top = 0;
    $desktop.style.width = "100vw";
    $desktop.style.height = "100vh";
    $desktop.oncontextmenu = (e) => {
      e.preventDefault();
      const $createFile = document.createElement("button");
      $createFile.innerHTML = "Create file";
      $createFile.onclick = () => {
        const file = fs2.createFile({
          name: null,
          path: this.path
        });
        fs2.addToStorage(file);
      };
      const $closeAllWindow = document.createElement("button");
      $closeAllWindow.innerHTML = "Close All Window";
      $closeAllWindow.onclick = function() {
        ui6.closeAllWindow();
      };
      const $contextMenus = [
        $closeAllWindow,
        $createFile
      ];
      ui6.showContextMenu(e.clientX, e.clientY, $contextMenus);
    };
    const desktopDirectory = fs2.createSystemDirectory("desktop");
    fs2.addToStorage(desktopDirectory);
    fs2.listenToDirectory(NAMESPACE3, desktopDirectory, (objects) => {
      $desktop.innerHTML = "";
      objects.forEach((object) => {
        renderIcon(object);
      });
    });
    function renderIcon(data) {
      const $d = document.createElement("div");
      $d.innerHTML = JSON.stringify(data);
      $d.style.background = "#222";
      $d.style.maxWidth = "100px";
      $d.style.maxHeight = "100px";
      $d.style.overflow = "auto";
      const $icon = ui6.createIcon(data.id, $d, data.type);
      if (data.type === "file") {
        $icon.ondblclick = () => {
          os2.run("File Reader", data);
        };
        $icon.oncontextmenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          ui6.destroyContextMenu();
          const $contextMenus = [];
          const $open = document.createElement("button");
          $open.innerHTML = "Open";
          $open.onclick = () => {
            os2.run("File Reader", data);
          };
          $contextMenus.push($open);
          ui6.showContextMenu(e.clientX, e.clientY, $contextMenus);
        };
      }
      self.iconDomMap[data.id] = $icon;
      $desktop.appendChild($icon);
    }
    fs2.addListener("desktop.app", (payload) => {
      if (!payload)
        return;
      if (!payload.event || !payload.data)
        return;
      if (payload.event === CREATE_FILE) {
        if (payload.data.path !== this.path)
          return;
        renderIcon(payload.data);
      } else if (payload.event === CREATE_DIRECTORY) {
        if (!payload.data.path)
          return;
        if (payload.data.path.startsWith(this.path) === false)
          return;
        if ((payload.data.path.match(/\//g) || []).length !== 3)
          return;
        renderIcon(payload.data);
      } else if (payload.event === DELETE) {
        if (!payload.data.path)
          return;
        if (payload.data.path === this.path || payload.data.path.startsWith(this.path) && (payload.data.path.match(/\//g) || []).length === 3) {
          this.iconDomMap[payload.data.id].remove();
        }
      }
    });
    this.start = () => {
      document.body.appendChild($desktop);
    };
  }

  // modules/softwares/window-creator.js
  var ui7 = getInstance5();
  function WindowCreator() {
    this.name = "Window Creator";
    this.start = () => {
      ui7.createWindow({ name: this.name, resizeable: true, draggable: true });
      const $create = document.createElement("button");
      $create.innerHTML = "create window";
      $create.onclick = () => {
        ui7.createWindow({ draggable: true, resizeable: true });
      };
      ui7.setWindowContent(this.name, $create);
    };
  }

  // modules/operating-system.js
  var ui8 = getInstance5();
  var softwareManager2 = getInstance6();
  function OperatingSystem() {
    this.boot = () => {
      ui8.init();
      this.install(new Dock());
      this.install(new Settings());
      this.install(new CustomFileReader());
      this.install(new Desktop(instance9));
      this.install(new WindowCreator());
      this.install(new FileManager(instance9));
      this.install(new Terminal());
      this.run(NAMESPACE2);
      this.run(NAMESPACE3);
    };
  }
  OperatingSystem.prototype.get = softwareManager2.get.bind(softwareManager2);
  OperatingSystem.prototype.install = softwareManager2.install.bind(softwareManager2);
  OperatingSystem.prototype.run = softwareManager2.run.bind(softwareManager2);
  var instance9 = new OperatingSystem();
  var getInstance9 = () => {
    if (!instance9)
      instance9 = new OperatingSystem();
    return instance9;
  };

  // main.js
  var os = getInstance9();
  var $boot = document.createElement("button");
  $boot.innerHTML = "click me to boot the OS";
  $boot.onclick = () => {
    os.boot();
    $boot.remove();
  };
  var bootingScene = createScene($boot);
  document.body.appendChild(bootingScene);
})();
//# sourceMappingURL=out.js.map
