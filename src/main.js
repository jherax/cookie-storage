import cookies from './cookie-storage';
import {checkEmpty} from './utils';

/**
 * @private
 *
 * Keys not allowed for cookies.
 *
 * @type {RegExp}
 */
const bannedKeys = /^(?:expires|max-age|path|domain|secure)$/i;

/**
 * @private
 *
 * Try to parse a value
 *
 * @param  {string} value: the value to parse
 * @return {any}
 */
function tryParse(value) {
  let parsed;
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
  Object.keys(storage).forEach((key) => {
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
class CookieStorage {

  /**
   * Creates an instance of CookieStorage.
   *
   * @memberOf CookieStorage
   */
  constructor() {
    copyKeys(this, cookies);
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
  setItem(key, value, options) {
    checkEmpty(key);
    if (bannedKeys.test(key)) {
      throw new Error('The key is a reserved word, therefore not allowed');
    }
    this[key] = value;
    // prevents converting strings to JSON to avoid extra quotes
    if (typeof value !== 'string') value = JSON.stringify(value);
    cookies.setItem(key, value, options);
    // checks if the cookie was created, or delete it if the domain or path are not valid
    if (cookies.getItem(key) === null) {
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
  getItem(key) {
    checkEmpty(key);
    let value = cookies.getItem(key);
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
  removeItem(key, options) {
    checkEmpty(key);
    delete this[key];
    cookies.removeItem(key, options);
  }

  /**
   * Removes all keys from the storage.
   *
   * @return {void}
   *
   * @memberOf CookieStorage
   */
  clear() {
    Object.keys(this).forEach((key) => {
      delete this[key];
    }, this);
    cookies.clear();
  }

  /**
   * Gets the number of data items stored in the storage object.
   *
   * @readonly
   *
   * @memberOf CookieStorage
   */
  get length() {
    return Object.keys(this).length;
  }

}

/**
 * @public API
 */
export default new CookieStorage();
