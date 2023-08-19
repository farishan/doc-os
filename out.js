(() => {
  // modules/hardware.js
  function Hardware() {
    this.listener = {
      mousedown: {},
      mousemove: {},
      mouseup: {},
      mouseenter: {},
      mouseleave: {},
      contextmenu: {},
      keydown: {},
      keyup: {},
      resize: {}
    };
  }
  Hardware.prototype.addListener = function(id, event, cb) {
    if (!event || !id || !cb)
      throw Error("Invalid arguments.", { event, id, cb });
    if (!this.listener[event])
      throw Error("Unknown event.", event);
    this.listener[event][id] = cb;
    window.addEventListener(event, cb);
  };
  Hardware.prototype.removeListener = function(id, event) {
    if (!event || !id)
      throw Error("Invalid arguments.", { event, id });
    if (!this.listener[event])
      throw Error("Unknown event.", event);
    if (!this.listener[event][id])
      throw Error(`No ${event} listener with this id: ${id}`);
    window.removeEventListener(event, this.listener[event][id]);
    delete this.listener[event][id];
  };
  var hardware = new Hardware();

  // modules/graphical-user-interface/ContextMenuManager.js
  var BODY = document.body;
  function ContextMenuManager(themeManager) {
    const self = this;
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
        $menu.style.backgroundColor = themeManager.getTheme().style.body.backgroundColor;
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
      BODY.appendChild(this.$contextMenu);
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
    this.initEventListeners = function() {
      hardware.addListener("UI", "contextmenu", (e) => {
        e.preventDefault();
        this.getContextMenu(e.target);
        if (this.$contextMenu) {
          this.moveContextMenu(e.clientX, e.clientY);
          return;
        }
        this.showContextMenu(e.clientX, e.clientY);
      });
      hardware.addListener("UI", "mousedown", (e) => {
        if (!this.$contextMenu || e.target === this.$contextMenu)
          return;
        if (this.$contextMenu.contains(e.target))
          return;
        this.destroyContextMenu();
      });
    };
  }

  // modules/graphical-user-interface/EventManager.js
  function EventManager() {
    const listener = {};
    this.setListener = (id) => {
      listener[id] = {};
    };
    this.addListener = function(id, key, fn) {
      listener[id][key] = fn;
    };
    this.removeListener = function(id) {
      delete listener[id];
    };
    this.init = () => {
      hardware.addListener("UI", "mousemove", (e) => {
        for (let [, v] of Object.entries(listener)) {
          if (v["mousemove"])
            v["mousemove"](e);
        }
      });
      hardware.addListener("UI", "mouseup", (e) => {
        for (let [, v] of Object.entries(listener)) {
          if (v["mouseup"])
            v["mouseup"](e);
        }
      });
    };
  }

  // modules/graphical-user-interface/IconManager.js
  function IconManager(eventManager) {
    this.createIcon = function(id, dom) {
      eventManager.setListener(id);
      let isMouseDown = false;
      let isDragging = false;
      let startPoint = { x: 0, y: 0 };
      let distance = { x: 0, y: 0 };
      const $icon = document.createElement("div");
      $icon.appendChild(dom);
      $icon.style.border = "1px solid";
      $icon.style.position = "absolute";
      $icon.style.left = 0;
      $icon.style.top = 0;
      $icon.style.cursor = "grab";
      $icon.style.userSelect = "none";
      $icon.onmousedown = (ev) => {
        isMouseDown = true;
        startPoint.x = ev.clientX;
        startPoint.y = ev.clientY;
        distance.x = Math.abs(startPoint.x - $icon.offsetLeft);
        distance.y = Math.abs(startPoint.y - $icon.offsetTop);
        $icon.style.cursor = "grabbing";
      };
      eventManager.addListener(id, "mousemove", (ev) => {
        if (!isMouseDown)
          return;
        isDragging = true;
        $icon.style.left = ev.clientX - distance.x + "px";
        $icon.style.top = ev.clientY - distance.y + "px";
      });
      eventManager.addListener(id, "mouseup", () => {
        isMouseDown = false;
        isDragging = false;
        $icon.style.cursor = "grab";
      });
      return $icon;
    };
  }

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
  var BODY2 = document.body;
  function ThemeManager(gui) {
    let theme = null;
    this.themeListeners = [];
    function generateStyleDOM(theme2) {
      const style = document.createElement("style");
      for (let [selector, selectorValue] of Object.entries(theme2.style)) {
        if (selector === "body") {
          for (let [prop, propValue] of Object.entries(selectorValue)) {
            BODY2.style[prop] = propValue;
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
  }
  function toKebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  // modules/graphical-user-interface/CustomWindow.js
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
  function WindowBody(options) {
    this.$element = document.createElement("div");
    this.$element.style.padding = options.style.padding + "px";
    this.$element.style.overflow = "auto";
    this.$element.style.cursor = "auto";
    this.$element.style.boxSizing = "border-box";
    this.$element.style.height = "100%";
    this.reset = (dom) => {
      this.$element.innerHTML = "";
      this.$element.appendChild(dom);
    };
    return this;
  }
  function CustomWindow(args, themeManager) {
    const self = this;
    const options = {
      id: Math.random().toString(36).slice(2, 9),
      style: {
        padding: 8,
        borderWidth: 1,
        borderStyle: "solid"
      },
      ...args
    };
    themeManager.addListener((theme) => {
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
    this.$window = document.createElement("div");
    this.$background = document.createElement("div");
    this.$wrapper = document.createElement("div");
    this.$wrapper.appendChild(this.$background);
    this.$window.appendChild(this.$wrapper);
    this.$background.style.backgroundColor = themeManager.getTheme().style.body.backgroundColor;
    this.header = new WindowHeader({
      ...options,
      name: this.name,
      onmousedown: () => this.isHeaderMousedown = true,
      onclose: handleClose
    });
    this.$wrapper.appendChild(this.header.$element);
    this.body = new WindowBody(options);
    this.$wrapper.appendChild(this.body.$element);
    this.$window.style.padding = options.style.padding + "px";
    this.$window.style.boxSizing = "border-box";
    this.$window.style.userSelect = "none";
    this.$window.style.minWidth = this.minWidth + "px";
    this.$window.style.minHeight = this.minHeight + "px";
    if (options.initialWidth) {
      this.$window.style.width = options.initialWidth + extraSize + "px";
    } else {
      this.$window.style.width = this.minWidth + extraSize + "px";
    }
    this.$window.style.height = this.minHeight + extraSize + "px";
    this.$background.style.position = "absolute";
    this.$background.style.left = 0;
    this.$background.style.top = 0;
    this.$background.style.right = 0;
    this.$background.style.bottom = 0;
    this.$background.style.zIndex = -1;
    this.$background.style.opacity = 0.9;
    this.$wrapper.style.minWidth = this.minWidth - options.style.padding * 2 + "px";
    this.$wrapper.style.minHeight = this.minHeight - options.style.padding * 2 + "px";
    this.$wrapper.style.width = this.minWidth + extraSize - options.style.padding * 2 + "px";
    this.$wrapper.style.height = this.minHeight + extraSize - options.style.padding * 2 + "px";
    this.$wrapper.style.position = "absolute";
    this.$wrapper.style.border = `${options.style.borderWidth}px ${options.style.borderStyle}`;
    this.$wrapper.style.overflow = "hidden";
    this.$window.oncontextmenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };
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
    const n = y > this.$window.offsetTop && y < this.$window.offsetTop + this.cursorThreshold, e = x < this.$window.offsetLeft + this.$window.offsetWidth && x > this.$window.offsetLeft + this.$window.offsetWidth - this.cursorThreshold, s = y < this.$window.offsetTop + this.$window.offsetHeight && y > this.$window.offsetTop + this.$window.offsetHeight - this.cursorThreshold, w = x > this.$window.offsetLeft && x < this.$window.offsetLeft + this.cursorThreshold;
    return s && e ? "se" : s && w ? "sw" : n && e ? "ne" : n && w ? "nw" : n ? "n" : e ? "e" : s ? "s" : w ? "w" : "";
  };
  CustomWindow.prototype.setContent = function(element) {
    this.body.reset(element);
  };
  CustomWindow.prototype.finalize = function() {
    this.$wrapper.style.width = this.$window.offsetWidth - this.padding * 2 + "px";
    this.$wrapper.style.height = this.$window.offsetHeight - this.padding * 2 + "px";
    this.body.$element.style.maxHeight = this.$wrapper.offsetHeight - this.header.$element.offsetHeight + "px";
  };

  // modules/graphical-user-interface/WindowManager.js
  var BODY3 = document.body;
  function WindowManager(eventManager, themeManager) {
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
      eventManager.addListener(customWindow.id, "mousemove", dragAndResize);
      eventManager.addListener(customWindow.id, "mouseup", () => {
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
      eventManager.setListener(customWindow.id);
      if (options.draggable || options.resizeable) {
        initWindowInteraction(customWindow, options);
      }
      customWindow.addEventListener("close", function() {
        self.destroyWindow(customWindow.name);
      });
      BODY3.appendChild(customWindow.$window);
      customWindow.finalize();
      return customWindow;
    };
    this.destroyWindow = function(name) {
      const customWindow = windowByName[name];
      eventManager.removeListener(customWindow.id);
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

  // modules/graphical-user-interface/index.js
  var instance;
  function GraphicalUserInterface() {
    const self = this;
    const eventManager = new EventManager(self);
    const themeManager = new ThemeManager(self);
    const windowManager = new WindowManager(eventManager, themeManager);
    const contextMenuManager = new ContextMenuManager(themeManager);
    const iconManager = new IconManager(eventManager);
    this.themeListeners = [];
    this.setWindowContent = (...args) => windowManager.setWindowContent(...args);
    this.sendToTop = (...args) => windowManager.sendToTop(...args);
    this.createWindow = (...args) => windowManager.createWindow(...args);
    this.createIcon = (id, dom) => iconManager.createIcon(id, dom);
    this.getTheme = () => themeManager.getTheme();
    this.showContextMenu = (...args) => contextMenuManager.showContextMenu(...args);
    this.setTheme = (newTheme) => themeManager.setTheme(newTheme, (theme) => {
      windowManager.notify(theme);
    });
    this.addThemeListener = (cb) => themeManager.addListener(cb);
    this.closeAllWindow = () => windowManager.closeAllWindow();
    this.init = () => {
      this.setTheme("dark");
      eventManager.init();
      contextMenuManager.initEventListeners();
    };
    return this;
  }
  var getInstance = () => {
    if (!instance)
      instance = new GraphicalUserInterface();
    return instance;
  };

  // modules/software-manager.js
  var instance2;
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
  var getInstance2 = () => {
    if (!instance2)
      instance2 = new SoftwareManager();
    return instance2;
  };

  // modules/storage.js
  var instance3;
  function Storage() {
    let size = 0;
    const data = /* @__PURE__ */ new Map();
    this.add = function(k, v) {
      if (!k || !v)
        throw Error("Invalid arguments.");
      if (v.size)
        size += v.size;
      if (!data.has(k)) {
        data.set(k, v);
      } else {
        const pathObject = data.get(k);
        if (pathObject.data) {
          if (pathObject.size && v.size)
            pathObject.size += v.size;
          pathObject.data.set(v.id, v);
        }
      }
    };
    this.get = function(path) {
      if (!path)
        throw Error("Invalid path.", path);
      let result = /* @__PURE__ */ new Map();
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
      const pathObject = data.get(path);
      if (pathObject) {
        if (pathObject.data) {
          pathObject.data.forEach((d) => result.set(d.id, d));
        }
      }
      return result;
    };
    this.deletePathData = (path, key) => {
      return data.get(path).data.delete(key);
    };
    this.getSize = function() {
      return size;
    };
    this.set = function(k, v) {
      data.set(k, v);
    };
    this.bulkModify = function(parameter, modifier) {
      data.forEach((v, k) => {
        if (k.startsWith(parameter)) {
          v.path = modifier + k.substring(1);
          data.set(v.path, v);
          data.delete(k);
        }
      });
    };
    this.deleteByPath = function(path) {
      data.delete(path);
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
    this.log = () => {
      console.info(data);
    };
  }
  var getInstance3 = () => {
    if (!instance3)
      instance3 = new Storage();
    return instance3;
  };

  // modules/file-system.js
  var instance4;
  var storage = getInstance3();
  function CustomFileSystem() {
    const MAX_INT = 9007199254740991;
    const MAX_INT_MOD = -3;
    const DEFAULT_SIZE = 1;
    let id = 0;
    let string = getRandomString();
    this.listener = /* @__PURE__ */ new Map();
    this.directoryListener = {};
    function getRandomString() {
      return Math.random().toString(36).slice(2, 5);
    }
    function getId() {
      if (id > MAX_INT + MAX_INT_MOD) {
        id = 0;
        string = getRandomString();
      }
      return ++id + string;
    }
    function createFileSystemObject(options = {}) {
      const { type, name, path } = options;
      const id2 = type.slice(0, 1) + getId();
      return {
        id: id2,
        path: type === "directory" ? path + id2 + "/" : path,
        type,
        name: name || type,
        size: DEFAULT_SIZE
      };
    }
    this.createFile = function(options = {}) {
      const file = createFileSystemObject({
        type: "file",
        ...options
      });
      this.listener.forEach((v, k) => {
        v({ event: CustomFileSystem.CREATE_FILE, data: file });
      });
      return file;
    };
    this.createDirectory = function(options = {}) {
      const directory = {
        ...createFileSystemObject({ type: "directory", ...options }),
        data: /* @__PURE__ */ new Map()
      };
      this.listener.forEach((v, k) => {
        v({ event: CustomFileSystem.CREATE_DIRECTORY, data: directory });
      });
      return directory;
    };
    this.createRootDirectory = function() {
      return {
        ...createFileSystemObject({ type: "directory" }),
        path: "/",
        name: "root",
        data: /* @__PURE__ */ new Map(),
        isSystemFile: true
      };
    };
    this.createSystemDirectory = function(name) {
      return {
        ...createFileSystemObject({ type: "directory" }),
        path: "/" + name + "/",
        name,
        data: /* @__PURE__ */ new Map(),
        isSystemFile: true
      };
    };
    this.getParentPath = (path) => {
      const splitted = path.split("/");
      splitted.pop();
      if (splitted.length > 1)
        splitted.pop();
      return splitted.join("/") + "/";
    };
    this.isSystemFile = (d) => {
      return d.isSystemFile;
    };
    this.addListener = (k, v) => {
      this.listener.set(k, v);
    };
    this.listenToDirectory = (directory, fn) => {
      if (!this.directoryListener[directory.id]) {
        this.directoryListener[directory.id] = [];
      } else {
        this.directoryListener[directory.id].push(fn);
      }
    };
    this.rename = function(d, newName) {
      d.name = newName;
      return d;
    };
    this.read = function(d) {
      console.info(d);
    };
    this.addToStorage = function(object = {}) {
      storage.add(object.path, object);
      this.listener.forEach((v, k) => {
        v({ event: CustomFileSystem.ADD_TO_STORAGE, data: object });
      });
    };
    this.move = function(toBeMoved, target) {
      if (target.type !== "directory")
        return;
      if (toBeMoved.type === "file") {
        target.data.set(toBeMoved.id, toBeMoved);
        storage.deletePathData(toBeMoved.path, toBeMoved.id);
      } else {
        storage.bulkModify(toBeMoved.path, target.path);
      }
      this.listener.forEach((v, k) => {
        v({ event: CustomFileSystem.MOVE, data: { toBeMoved, target } });
      });
    };
    this.set = function(k, v) {
      storage.set(k, v);
    };
    this.get = function(path) {
      return storage.get(path);
    };
    this.delete = function(object = {}) {
      this.listener.forEach((v, k) => {
        v({ event: CustomFileSystem.DELETE, data: object });
      });
      storage.delete(object);
    };
    const rootDirectory = this.createRootDirectory();
    storage.add("/", rootDirectory);
  }
  CustomFileSystem.ADD_TO_STORAGE = "addToStorage";
  CustomFileSystem.CREATE_FILE = "createFile";
  CustomFileSystem.CREATE_DIRECTORY = "createDirectory";
  CustomFileSystem.DELETE = "delete";
  CustomFileSystem.MOVE = "move";
  var getInstance4 = () => {
    if (!instance4)
      instance4 = new CustomFileSystem();
    return instance4;
  };
  var MOVE = CustomFileSystem.MOVE;
  var DELETE = CustomFileSystem.DELETE;
  var CREATE_FILE = CustomFileSystem.CREATE_FILE;
  var CREATE_DIRECTORY = CustomFileSystem.CREATE_DIRECTORY;
  var ADD_TO_STORAGE = CustomFileSystem.ADD_TO_STORAGE;

  // modules/softwares/desktop.js
  var fs = getInstance4();
  var ui = getInstance();
  function Desktop(os2) {
    const self = this;
    this.name = "Desktop";
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
        const file = fs.createFile({
          name: null,
          path: this.path
        });
        fs.addToStorage(file);
      };
      const $closeAllWindow = document.createElement("button");
      $closeAllWindow.innerHTML = "Close All Window";
      $closeAllWindow.onclick = function() {
        ui.closeAllWindow();
      };
      const $contextMenus = [
        $closeAllWindow,
        $createFile
      ];
      ui.showContextMenu(e.clientX, e.clientY, $contextMenus);
    };
    const desktopDirectory = fs.createSystemDirectory("desktop");
    fs.addToStorage(desktopDirectory);
    fs.listenToDirectory(desktopDirectory, (objects) => {
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
      const $icon = ui.createIcon(data.id, $d);
      if (data.type === "file") {
        $icon.ondblclick = () => {
          os2.run("File Reader", data);
        };
        $icon.oncontextmenu = (e) => {
          e.preventDefault();
          e.stopPropagation();
          ui.destroyContextMenu();
          const $contextMenus = [];
          const $open = document.createElement("button");
          $open.innerHTML = "Open";
          $open.onclick = () => {
            os2.run("File Reader", data);
          };
          $contextMenus.push($open);
          ui.showContextMenu(e.clientX, e.clientY, $contextMenus);
        };
      }
      self.iconDomMap[data.id] = $icon;
      $desktop.appendChild($icon);
    }
    fs.addListener("desktop.app", (payload) => {
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
  var ui2 = getInstance();
  function Dock() {
    const self = this;
    this.name = "Dock";
    const softwareManager = getInstance2();
    softwareManager.addEventListener("install", () => {
      this.refresh();
    });
    this.ui = new DockUI(ui2.getTheme());
    ui2.addThemeListener((theme) => self.ui.setTheme(theme));
    hardware.addListener("Dock", "mousedown", (e) => {
      if (e.target !== self.ui.getMenuElement() && e.target !== self.ui.getMenuTrigger() && e.target instanceof HTMLButtonElement === false) {
        self.ui.closeMenu();
      }
    });
    this.refresh = () => {
      self.ui.clear();
      softwareManager.getAllExcepts(["Dock", "Desktop"]).forEach(function(app) {
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

  // modules/softwares/file-manager.js
  var fs2 = getInstance4();
  var ui3 = getInstance();
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
        const file = fs2.createFile({
          name: null,
          path: this.currentPath
        });
        fs2.addToStorage(file);
        this.reload();
      };
      $head.appendChild($createFileButton);
      const $createDirectory = document.createElement("button");
      $createDirectory.innerHTML = "create directory";
      $createDirectory.onclick = () => {
        const directory = fs2.createDirectory({
          name: null,
          path: this.currentPath
        });
        fs2.addToStorage(directory);
        this.reload();
      };
      $head.appendChild($createDirectory);
      const $back = document.createElement("button");
      $back.innerHTML = "back";
      $back.onclick = () => {
        this.currentPath = fs2.getParentPath(this.currentPath);
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
      const data = fs2.get(this.currentPath);
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
            fs2.move(dragged, d);
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
          if (!fs2.isSystemFile(d)) {
            const $rename = document.createElement("button");
            $rename.innerHTML = "Rename";
            const handleSubmit = (e2) => {
              const newData = fs2.rename(d, e2.target.innerHTML);
              tdName.contentEditable = false;
              fs2.set(d.id, newData);
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
              fs2.delete(d);
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
    fs2.addListener("file-manager.app", (payload) => {
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

  // modules/softwares/file-reader.js
  var ui4 = getInstance();
  function CustomFileReader() {
    this.name = "File Reader";
    this.file = void 0;
    this.getContent = function() {
      if (!this.file) {
        const $open = document.createElement("button");
        $open.onclick = function() {
          ui4.createWindow({ name: "file prompt", resizeable: true, draggable: true });
        };
        $open.innerHTML = "Open File";
        return $open;
      } else {
        const $content = document.createElement("div");
        $content.style.wordBreak = "break-all";
        $content.style.userSelect = "text";
        $content.oncontextmenu = (e) => e.stopPropagation();
        $content.innerHTML = JSON.stringify(this.file);
        return $content;
      }
    };
    this.start = (file) => {
      if (file)
        this.file = file;
      const customWindow = ui4.createWindow({ name: this.name, resizeable: true, draggable: true });
      ui4.sendToTop(customWindow);
      const $content = this.getContent();
      ui4.setWindowContent(this.name, $content);
    };
  }

  // modules/softwares/settings.js
  var ui5 = getInstance();
  function Settings() {
    this.name = "Settings";
    this.getContent = function() {
      const $content = document.createElement("div");
      const $darkTheme = document.createElement("button");
      $darkTheme.onclick = function() {
        ui5.setTheme("dark");
      };
      $darkTheme.innerHTML = "Change to Dark Theme";
      $content.appendChild($darkTheme);
      const $lightTheme = document.createElement("button");
      $lightTheme.onclick = function() {
        ui5.setTheme("light");
      };
      $lightTheme.innerHTML = "Change to Light Theme";
      $content.appendChild($lightTheme);
      return $content;
    };
    this.start = () => {
      const customWindow = ui5.createWindow({ name: this.name, resizeable: true, draggable: true });
      ui5.sendToTop(customWindow);
      const $content = this.getContent();
      ui5.setWindowContent(this.name, $content);
    };
  }

  // modules/softwares/window-creator.js
  var ui6 = getInstance();
  function WindowCreator() {
    this.name = "Window Creator";
    this.start = () => {
      ui6.createWindow({ name: this.name, resizeable: true, draggable: true });
      const $create = document.createElement("button");
      $create.innerHTML = "create window";
      $create.onclick = () => {
        ui6.createWindow({ draggable: true, resizeable: true });
      };
      ui6.setWindowContent(this.name, $create);
    };
  }

  // modules/operating-system.js
  var instance5;
  function OperatingSystem() {
    const ui7 = getInstance();
    const softwareManager = getInstance2();
    this.boot = () => {
      ui7.init();
      softwareManager.install(new Dock());
      softwareManager.install(new Settings());
      softwareManager.install(new FileManager(instance5));
      softwareManager.install(new WindowCreator());
      softwareManager.install(new CustomFileReader());
      softwareManager.install(new Desktop(instance5));
      softwareManager.get("Dock").start();
      softwareManager.get("Desktop").start();
    };
    this.run = function(appKey, payload) {
      softwareManager.run(appKey, payload);
    };
  }
  var getInstance5 = () => {
    if (!instance5)
      instance5 = new OperatingSystem();
    return instance5;
  };

  // main.js
  var os = getInstance5();
  os.boot();
})();
//# sourceMappingURL=out.js.map
