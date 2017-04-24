/*! cookieStorage@v1.0.1. Jherax 2017. Visit https://github.com/jherax/cookie-storage */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cookieStorage"] = factory();
	else
		root["cookieStorage"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isObject = isObject;
exports.alterDate = alterDate;
exports.setProperty = setProperty;
exports.checkEmpty = checkEmpty;
/**
 * Determines whether a value is a plain object.
 *
 * @param  {any} value: the object to test
 * @return {boolean}
 */
function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Adds or subtracts date portions to the given date and returns the new date.
 *
 * @see https://gist.github.com/jherax/bbc43e479a492cc9cbfc7ccc20c53cd2
 *
 * @param  {object} options: It contains the date parts to add or remove, and can have the following properties:
 *         - {Date} date: if provided, this date will be affected, otherwise the current date will be used.
 *         - {number} minutes: minutes to add/subtract
 *         - {number} hours: hours to add/subtract
 *         - {number} days: days to add/subtract
 *         - {number} months: months to add/subtract
 *         - {number} years: years to add/subtract
 * @return {Date}
 */
function alterDate() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var opt = Object.assign({}, options);
  var d = opt.date instanceof Date ? opt.date : new Date();
  if (+opt.minutes) d.setMinutes(d.getMinutes() + opt.minutes);
  if (+opt.hours) d.setHours(d.getHours() + opt.hours);
  if (+opt.days) d.setDate(d.getDate() + opt.days);
  if (+opt.months) d.setMonth(d.getMonth() + opt.months);
  if (+opt.years) d.setFullYear(d.getFullYear() + opt.years);
  return d;
}

/**
 * Creates a non-enumerable read-only property.
 *
 * @param  {object} obj: the object to add the property
 * @param  {string} name: the name of the property
 * @param  {any} value: the value of the property
 * @return {void}
 */
function setProperty(obj, name, value) {
  var descriptor = {
    configurable: false,
    enumerable: false,
    writable: false
  };
  if (typeof value !== 'undefined') {
    descriptor.value = value;
  }
  Object.defineProperty(obj, name, descriptor);
}

/**
 * Validates if the key is not empty.
 * (null, undefined or empty string)
 *
 * @param  {string} key: keyname of an element in the storage mechanism
 * @return {void}
 */
function checkEmpty(key) {
  if (key == null || key === '') {
    throw new Error('The key provided can not be empty');
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(0);

/**
 * @private
 *
 * Proxy for document.cookie
 *
 * @see
 * https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
 *
 * @type {object}
 */
var $cookie = {
  get: function get() {
    return document.cookie;
  },
  set: function set(value) {
    document.cookie = value;
  },
  data: {} };

/**
 * @private
 *
 * Builds the expiration for the cookie.
 *
 * @see utils.alterDate(options)
 *
 * @param  {Date|object} date: the expiration date
 * @return {string}
 */
function buildExpirationString(date) {
  var expires = date instanceof Date ? (0, _utils.alterDate)({ date: date }) : (0, _utils.alterDate)(date);
  return expires.toUTCString();
}

/**
 * @private
 *
 * Builds the string for the cookie metadata.
 *
 * @param  {string} key: name of the metadata
 * @param  {object} data: metadata of the cookie
 * @return {string}
 */
function buildMetadataFor(key, data) {
  if (!data[key]) return '';
  return ';' + key + '=' + data[key];
}

/**
 * @private
 *
 * Builds the whole string for the cookie metadata.
 *
 * @param  {object} data: metadata of the cookie
 * @return {string}
 */
function formatMetadata(data) {
  var expires = buildMetadataFor('expires', data);
  var domain = buildMetadataFor('domain', data);
  var path = buildMetadataFor('path', data);
  var secure = data.secure ? ';secure' : '';
  return '' + expires + domain + path + secure;
}

/**
 * @private
 *
 * Finds an element in the array.
 *
 * @param  {string} cookie: key=value
 * @return {boolean}
 */
function findCookie(cookie) {
  var nameEQ = this.toString();
  // prevent leading spaces before the key
  return cookie.trim().indexOf(nameEQ) === 0;
}

/**
 * @private
 *
 * Create, read, and delete elements from document.cookie,
 * and implements the Web Storage interface.
 *
 * @return {object}
 */
function cookieStorage() {
  var api = {
    setItem: function setItem(key, value, options) {
      options = Object.assign({ path: '/' }, options);
      // keep track of the metadata associated to the cookie
      $cookie.data[key] = { path: options.path };
      var metadata = $cookie.data[key];
      if ((0, _utils.isObject)(options.expires) || options.expires instanceof Date) {
        metadata.expires = buildExpirationString(options.expires);
      }
      if (options.domain && typeof options.domain === 'string') {
        metadata.domain = options.domain.trim();
      }
      if (options.secure === true) metadata.secure = true;
      var cookie = key + '=' + encodeURIComponent(value) + formatMetadata(metadata);
      // TODO: should encodeURIComponent(key) ?
      $cookie.set(cookie);
    },
    getItem: function getItem(key) {
      var value = null;
      var nameEQ = key + '=';
      var cookie = $cookie.get().split(';').find(findCookie, nameEQ);
      if (cookie) {
        // prevent leading spaces before the key name
        value = cookie.trim().substring(nameEQ.length, cookie.length);
        value = decodeURIComponent(value);
      }
      if (value === null) delete $cookie.data[key];
      return value;
    },
    removeItem: function removeItem(key, options) {
      var metadata = Object.assign({}, $cookie.data[key], options);
      metadata.expires = { days: -1 };
      api.setItem(key, '', metadata);
      delete $cookie.data[key];
    },
    clear: function clear() {
      var key = void 0,
          indexEQ = void 0; // eslint-disable-line
      $cookie.get().split(';').forEach(function (cookie) {
        indexEQ = cookie.indexOf('=');
        if (indexEQ > -1) {
          key = cookie.substring(0, indexEQ);
          // prevent leading spaces before the key
          api.removeItem(key.trim());
        }
      });
    }
  };

  return initialize(api);
}

/**
 * @private
 *
 * Copy the current items in the cookie storage.
 *
 * @param  {object} api: the storage mechanism to initialize
 * @return {object}
 */
function initialize(api) {
  // sets API members to read-only and non-enumerable
  for (var prop in api) {
    // eslint-disable-line
    (0, _utils.setProperty)(api, prop);
  }
  // copies all existing elements in the storage
  $cookie.get().split(';').forEach(function (cookie) {
    var index = cookie.indexOf('=');
    var key = cookie.substring(0, index).trim();
    var value = cookie.substring(index + 1).trim();
    if (key) api[key] = decodeURIComponent(value);
  });
  return api;
}

/**
 * @public API
 */
exports.default = cookieStorage();
module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cookieStorage = __webpack_require__(1);

var _cookieStorage2 = _interopRequireDefault(_cookieStorage);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @private
 *
 * Keys not allowed for cookies.
 *
 * @type {RegExp}
 */
var bannedKeys = /^(?:expires|max-age|path|domain|secure)$/i;

/**
 * @private
 *
 * Try to parse a value
 *
 * @param  {string} value: the value to parse
 * @return {any}
 */
function tryParse(value) {
  var parsed = void 0;
  try {
    parsed = JSON.parse(value);
  } catch (e) {
    parsed = value;
  }
  return parsed;
}

/**
 * @private
 *
 * Copies all existing keys in the cookieStorage.
 *
 * @param  {CookieStorage} obj: the object to where copy the keys
 * @param  {object} storage: the storage mechanism
 * @return {void}
 */
function copyKeys(obj, storage) {
  Object.keys(storage).forEach(function (key) {
    obj[key] = tryParse(storage[key]);
  });
}

/**
 * @private
 *
 * Implementation of the Web Storage interface.
 * It saves and retrieves values as JSON.
 *
 * @see
 * https://developer.mozilla.org/en-US/docs/Web/API/Storage
 *
 * @type {class}
 */

var CookieStorage = function () {

  /**
   * Creates an instance of CookieStorage.
   *
   * @memberOf CookieStorage
   */
  function CookieStorage() {
    _classCallCheck(this, CookieStorage);

    copyKeys(this, _cookieStorage2.default);
  }

  /**
   * Stores a value given a key name.
   *
   * @param  {string} key: keyname of the storage
   * @param  {any} value: data to save in the storage
   * @param  {object} options: additional options for cookieStorage
   * @return {void}
   *
   * @memberOf CookieStorage
   */


  _createClass(CookieStorage, [{
    key: 'setItem',
    value: function setItem(key, value, options) {
      (0, _utils.checkEmpty)(key);
      if (bannedKeys.test(key)) {
        throw new Error('The key is a reserved word, therefore not allowed');
      }
      this[key] = value;
      // prevents converting strings to JSON to avoid extra quotes
      if (typeof value !== 'string') value = JSON.stringify(value);
      _cookieStorage2.default.setItem(key, value, options);
      // checks if the cookie was created, or delete it if the domain or path are not valid
      if (_cookieStorage2.default.getItem(key) === null) {
        delete this[key];
      }
    }

    /**
     * Retrieves a value by its key name.
     *
     * @param  {string} key: keyname of the storage
     * @return {void}
     *
     * @memberOf CookieStorage
     */

  }, {
    key: 'getItem',
    value: function getItem(key) {
      (0, _utils.checkEmpty)(key);
      var value = _cookieStorage2.default.getItem(key);
      if (value == null) {
        delete this[key];
        value = null;
      } else {
        value = tryParse(value);
        this[key] = value;
      }
      return value;
    }

    /**
     * Deletes a key from the storage.
     *
     * @param  {string} key: keyname of the storage
     * @param  {object} options: additional options for cookieStorage
     * @return {void}
     *
     * @memberOf CookieStorage
     */

  }, {
    key: 'removeItem',
    value: function removeItem(key, options) {
      (0, _utils.checkEmpty)(key);
      delete this[key];
      _cookieStorage2.default.removeItem(key, options);
    }

    /**
     * Removes all keys from the storage.
     *
     * @return {void}
     *
     * @memberOf CookieStorage
     */

  }, {
    key: 'clear',
    value: function clear() {
      var _this = this;

      Object.keys(this).forEach(function (key) {
        delete _this[key];
      }, this);
      _cookieStorage2.default.clear();
    }

    /**
     * Gets the number of data items stored in the storage object.
     *
     * @readonly
     *
     * @memberOf CookieStorage
     */

  }, {
    key: 'length',
    get: function get() {
      return Object.keys(this).length;
    }
  }]);

  return CookieStorage;
}();

/**
 * @public API
 */


exports.default = new CookieStorage();
module.exports = exports['default'];

/***/ })
/******/ ]);
});