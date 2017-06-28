import {checkEmpty, tryParse} from './utils';
import cookieStore from './cookie-storage';

/**
 * @private
 *
 * Keys not allowed for cookies.
 *
 * @type {RegExp}
 */
const BANNED_KEYS = /^(?:expires|max-age|path|domain|secure)$/i;

/**
 * @private
 *
 * Copies all existing keys in the storage.
 *
 * @param  {CookieStorage} instance: the object to where copy the keys
 * @param  {object} storage: the storage mechanism
 * @return {object}
 */
function copyKeys(instance, storage) {
  Object.keys(storage).forEach((key) => {
    instance[key] = tryParse(storage[key]);
  });
  return instance;
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
    copyKeys(this, cookieStore);
  }

  /**
   * Stores a value given a key name.
   *
   * @param  {string} key: keyname of the storage
   * @param  {any} value: data to save in the storage
   * @param  {object} options: additional options for cookieStore
   * @return {void}
   *
   * @memberOf CookieStorage
   */
  setItem(key, value, options) {
    checkEmpty(key);
    if (BANNED_KEYS.test(key)) {
      throw new Error('The key is a reserved word, therefore not allowed');
    }
    this[key] = value;
    // prevents converting strings to JSON to avoid extra quotes
    if (typeof value !== 'string') value = JSON.stringify(value);
    cookieStore.setItem(key, value, options);
    // checks if the cookie was created, or delete it if the domain or path are not valid
    if (cookieStore.getItem(key) === null) {
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
    let value = cookieStore.getItem(key);
    if (value == null) { // null or undefined
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
   * @param  {object} options: additional options for cookieStore
   * @return {void}
   *
   * @memberOf CookieStorage
   */
  removeItem(key, options) {
    checkEmpty(key);
    delete this[key];
    cookieStore.removeItem(key, options);
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
    cookieStore.clear();
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
