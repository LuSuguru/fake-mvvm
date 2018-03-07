/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _observer = __webpack_require__(1);

	var _observer2 = _interopRequireDefault(_observer);

	var _vue = __webpack_require__(4);

	var _vue2 = _interopRequireDefault(_vue);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var v = new _vue2.default({
	  el: '#mvvm',
	  data: {
	    a: 'test model',
	    b: 'hello MVVM',
	    flag: true
	  },
	  methods: {
	    testToggle: function testToggle() {
	      this.flag = !this.flag;
	      this.b = this.flag ? 'hello MVVM' : 'test success';
	    }
	  }
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.observe = observe;

	var _utils = __webpack_require__(2);

	var _dep = __webpack_require__(3);

	var _dep2 = _interopRequireDefault(_dep);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Observer = function () {
	  function Observer(obj) {
	    _classCallCheck(this, Observer);

	    this.obj = obj;
	    this.dep = new _dep2.default();
	    this.walk(value);
	  }
	  //递归。。让每个字属性可以observe


	  _createClass(Observer, [{
	    key: 'walk',
	    value: function walk(obj) {
	      var _this = this;

	      Object.keys(obj).forEach(function (key) {
	        return _this.defineReactive(obj, key, obj[key]);
	      });
	    }
	  }, {
	    key: 'defineReactive',
	    value: function defineReactive(obj, key, val) {
	      var dep = new _dep2.default();
	      var childOb = observe(val);

	      Object.defineProperty(obj, key, {
	        enumerable: true,
	        configurable: true,

	        //给data对象添加依赖关系
	        get: function get() {
	          // watch使用的标志位，
	          _dep2.default.target && dep.depend();
	          childOb && childOb.dep.depend();

	          return val;
	        },

	        // 当数据改变时通知数据更新
	        set: function set(newVal) {
	          if (val === newVal || newVal !== newVal && val !== val) {
	            return;
	          }
	          val = newVal;
	          // 监听子属性
	          childOb = observe(newVal);
	          // 通知数据更新
	          dep.notify();
	        }
	      });
	    }
	  }]);

	  return Observer;
	}();

	exports.default = Observer;
	function observe(value, vm) {
	  if (!value || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
	    return;
	  }
	  return new Observer(value);
	}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// 定义$elm,缓存当前执行input事件的input dom 对象
	var $elm = void 0;
	var timer = null;

	// 指令处理集合
	exports.default = compileUtil = {
	  html: function html(node, vm, exp) {
	    this.bind(node, vm, exp, 'html');
	  },
	  text: function text(node, vm, exp) {
	    this.bind(node, vm, exp, 'text');
	  },
	  class: function _class(node, vm, exp) {
	    this.bind(node, vm, exp, 'class');
	  },
	  model: function model(node, vm, exp) {
	    var _this = this;

	    this.bind(node, vm, exp, 'model');

	    var val = this._getVmVal(vm, exp);

	    // 监听input事件
	    node.addEventListener('input', function (_ref) {
	      var target = _ref.target;

	      var newVal = target.value;
	      $elm = target;

	      if (val === newVal) return;

	      // 设置定时器，完成ui js的异步渲染
	      clearTimeout(timer);
	      timer = setTimeout(function () {
	        _this._setVmVal(vm, exp, newVal);
	        val = newVal;
	      });
	    });
	  },
	  bind: function bind(node, vm, exp, dir) {
	    var updaterFn = updater[dir + 'Updater'];
	    // 初始化渲染
	    updaterFn && updaterFn(node, this._getVmVal(vm, exp));

	    new Watcher(vm, exp, function (value, oldValue) {
	      updaterFn && updaterFn(node, value, oldValue);
	    });
	  },
	  eventHandler: function eventHandler(node, vm, exp, dir) {
	    var eventType = dir.splist(':')[1];
	    var fn = vm.$options.methods && vm.$options.methods[exp];

	    if (eventType && fn) {
	      node.addEventListener(eventType, fn.bind(vm), false);
	    }
	  },
	  _getVmVal: function _getVmVal(vm, exp) {
	    var val = vm;

	    exp = exp.split('.');
	    exp.forEach(function (key) {
	      key = key.trim();
	      val = val[key];
	    });
	    return val;
	  },
	  _setVmVal: function _setVmVal(vm, exp, value) {
	    var val = vm;
	    exp = exp.split('.');
	    exp.forEach(function (key, index) {
	      key = key.trim();
	      if (index < exps.length - 1) {
	        val = val[key];
	      } else {
	        val[key] = value;
	      }
	    });
	  }
	};

	// 指令渲染集合

	var updater = {
	  htmlUpdater: function htmlUpdater(node, value) {
	    node.innerHTML = typeof value === 'undefined' ? '' : value;
	  },
	  textUpdater: function textUpdater(node, value) {
	    node.textContent = typeof value === 'undefined' ? '' : value;
	  },
	  classUpdater: function classUpdater() {},
	  modelUpdater: function modelUpdater(node, value, oldValue) {
	    //不对当前操作input进行渲染操作
	    if ($elm === node) return false;

	    $elm = undefined;
	    node.value = typeof value === 'undefined' ? '' : value;
	  }
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var uid = 0;

	var Dep = function () {
	  function Dep() {
	    _classCallCheck(this, Dep);

	    this.id = uid++;
	    this.subs = [];
	  }

	  // 添加订阅者


	  _createClass(Dep, [{
	    key: "addSub",
	    value: function addSub(sub) {
	      this.subs.push(sub);
	    }

	    // 移除订阅者

	  }, {
	    key: "removeSub",
	    value: function removeSub(sub) {
	      var index = this.subs.indexOf(sub);
	      index !== -1 && this.subs.splice(index, 1);
	    }

	    //通知数据变更

	  }, {
	    key: "notify",
	    value: function notify() {
	      this.subs.forEach(function (sub) {
	        return sub.update();
	      });
	    }

	    // 添加watcher

	  }, {
	    key: "depend",
	    value: function depend() {
	      Dep.target.addDep(this);
	    }
	  }]);

	  return Dep;
	}();

	// Dep.target的是watcher


	exports.default = Dep;
	Dep.target = null;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _watcher = __webpack_require__(5);

	var _watcher2 = _interopRequireDefault(_watcher);

	var _observer = __webpack_require__(1);

	var _compile = __webpack_require__(6);

	var _compile2 = _interopRequireDefault(_compile);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Vue = function () {
	  function Vue() {
	    var _this = this;

	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, Vue);

	    this.$options = options;
	    var data = this._data = this.$options.data;

	    Object.keys(data).forEach(function (key) {
	      return _this._proxy(key);
	    });
	    (0, _observer.observe)(data, this);

	    new _compile2.default(options.el || document.body, this);
	  }

	  //代理属性


	  _createClass(Vue, [{
	    key: '_proxy',
	    value: function _proxy(key) {
	      var _this2 = this;

	      Object.defineProperty(this, key, {
	        configurable: true,
	        enumerable: true,
	        get: function get() {
	          return _this2._data[key];
	        },
	        set: function set(val) {
	          _this2._data[key] = val;
	        }
	      });
	    }
	  }]);

	  return Vue;
	}();

	exports.default = Vue;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _dep = __webpack_require__(3);

	var _dep2 = _interopRequireDefault(_dep);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/** 
	 * @class 观察类
	 * @param vm vm对象
	 * @param expOrFn 属性表达式
	 * @param cb 回调函数（一半用来做view动态更新）
	*/
	var Watcher = function () {
	  function Watcher(vm, expOrFn, cb) {
	    _classCallCheck(this, Watcher);

	    this.cb = cb;
	    this.vm = vm;
	    this.expOrFn = expOrFn.trim();
	    this.depIds = {};

	    if (typeof expOrFn === 'function') {
	      this.getter = expOrFn;
	    } else {
	      this.getter = this.parseGetter(expOrFn);
	    }

	    this.value = this.get();
	  }

	  _createClass(Watcher, [{
	    key: 'update',
	    value: function update() {
	      this.run();
	    }
	  }, {
	    key: 'run',
	    value: function run() {
	      var newVal = this.get();
	      var oldVal = this.value;
	      if (newVal === oldVal) return;

	      this.value = newVal;
	      // 将newVal,oldVal挂载到MVVM实例上
	      this.cb.call(this.vm, newVal, oldVal);
	    }
	  }, {
	    key: 'get',
	    value: function get() {
	      _dep2.default.target = this; // 将当前订阅者指向自己
	      var value = this.getter.call(this.vm, this.vm); // 触发get，将自身添加到dep中
	      _dep2.default.target = null; // 添加完成，重置
	      return value;
	    }

	    // 添加watcher到dep.subs[]

	  }, {
	    key: 'addDep',
	    value: function addDep(dep) {
	      if (!this.depIds.hasOwnProperty(dep.id)) {
	        dep.addSub(this);
	        this.depIds[dep.id] = dep;
	      }
	    }
	  }, {
	    key: 'parseGetter',
	    value: function parseGetter(exp) {
	      if (/[^\w.$]/.test(exp)) return;
	      var exps = exp.split('.');

	      // 简易的循环依赖处理
	      return function (obj) {
	        for (var i = 0; i < exps.length; i++) {
	          if (!obj) return;
	          obj = obj[exps[i]];
	        }
	        return obj;
	      };
	    }
	  }]);

	  return Watcher;
	}();

	exports.default = Watcher;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(2);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class 指令解析类 Compile
	 * @param el element节点
	 * @param vm mvvm实例
	 */
	var Compile = function () {
	  function Compile(el, vm) {
	    _classCallCheck(this, Compile);

	    this.$vm = vm;
	    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

	    if (this.$el) {
	      this.fragment = this.nodeFragment(this.$el);
	      this.compileElement(this.fragment);
	      // 将文档碎片放回真实dom
	      this.$el.appendChild(this.fragment);
	    }
	  }

	  _createClass(Compile, [{
	    key: 'compileElement',
	    value: function compileElement(el) {
	      var _this = this;

	      var childNodes = el.childNodes;


	      [].slice.call(childNodes).forEach(function (node) {
	        var text = node.textContent;
	        var reg = /\{\{((?:.|\n)+?)\}\}/;

	        // 如果是element节点
	        if (_this.isElementNode(node)) {
	          _this.compile(node);

	          // 如果是text节点
	        } else if (self.isTextNode(node) && reg.test(text)) {
	          // 匹配第一个选项
	          _this.compileText(node, RegExp.$1);
	        }

	        // 解析子节点包含的指令
	        if (node.childNodes && node.childNodes.length) {
	          _this.compileElement(node);
	        }
	      });
	    }

	    // 文档碎片，遍历过程中会有多次的dom操作，为提高性能我们会将el节点转化为fragment文档碎片
	    // 解析操作完成，将其添加回真实dom节点中

	  }, {
	    key: 'nodeFragment',
	    value: function nodeFragment(el) {
	      var fragment = document.createDocumentFragment();
	      var child = void 0;

	      while (child = el.firstChild) {
	        fragment.appendChild(child);
	      }
	      return fragment;
	    }

	    //指令解析

	  }, {
	    key: 'compile',
	    value: function compile(node) {
	      var _this2 = this;

	      var nodeAttrs = node.nodeAttrs;


	      [].slice.call(nodeAttrs).forEach(function (_ref) {
	        var name = _ref.name,
	            value = _ref.value;

	        if (_this2.isDirective(name)) {
	          var exp = value;
	          var dir = name.substring(2);

	          // 事件指令
	          if (_this2.isEventDirective(dir)) {
	            _utils2.default.eventHandler(node, _this2.$vm, exp, dir);
	          } else {
	            // 普通指令
	            _utils2.default[dir] && _utils2.default[dir](node, _this2.$vm, exp);
	          }

	          node.removeAttribute(name);
	        }
	      });
	    }

	    // 文本指令解析

	  }, {
	    key: 'compileText',
	    value: function compileText(node, exp) {
	      _utils2.default.text(node, this.$vm, exp);
	    }

	    // element节点

	  }, {
	    key: 'isElementNode',
	    value: function isElementNode(_ref2) {
	      var nodeType = _ref2.nodeType;

	      return nodeType === 1;
	    }

	    // text纯文本

	  }, {
	    key: 'isTextNode',
	    value: function isTextNode(_ref3) {
	      var nodeType = _ref3.nodeType;

	      return nodeType === 3;
	    }

	    // 普通指令判定

	  }, {
	    key: 'isDirective',
	    value: function isDirective(attr) {
	      return attr.indexOf('x-') === 0;
	    }

	    // 时间指令判定

	  }, {
	    key: 'isEventDirective',
	    value: function isEventDirective(dir) {
	      return dir.indexOf('on') === 0;
	    }
	  }]);

	  return Compile;
	}();

	exports.default = Compile;

/***/ })
/******/ ]);