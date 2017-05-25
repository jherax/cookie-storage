# cookie-storage

<!-- markdownlint-disable MD014 MD025 MD033 MD034 MD036 -->

A lightweight JavaScript UMD to handle cookies through Web Storage Interface.

This library manages an adapter that implements an interface similar to
[Web Storage] to normalize the API for [document.cookie], with the advantage
that the values are stored as **JSON**, allowing to save and retrieve `Object`
and `Array<Any>`, which is not the default behavior when using the native
`document.cookie`.

If you want a more robust mechanism to store data in `cookies`, `localStorage`,
`sessionStorage`, `memoryStorage`, you may pay attention to [proxy-storage].

## Content

1. [Installing the library](#installing-the-library)
1. [Including the library](#including-the-library)
1. [API Reference](#api)
1. [Polyfills](#polyfills)

## Installing the library

To include this library into your package manager with `npm` or `yarn`

```shell
# with npm
$ npm install cookie-storage-v2 --save

# with yarn
$ yarn add cookie-storage-v2
```

## Including the library

`cookie-storage` can be included directly from a CDN in your page:

```html
<!-- from unpkg.com -->
<script src="https://unpkg.com/cookie-storage-v2/dist/cookie-storage.min.js"></script>

<!-- or from rawgit.com -->
<script src="https://cdn.rawgit.com/jherax/cookie-storage/1.0.1/dist/cookie-storage.min.js"></script>
```

In the above case, [`cookieStorage`](#api) is included as a global object
in the browser, and you can use it as shown in the [API](#api).

### Browser

```javascript
var session = cookieStorage.getItem('sessionId');
cookieStorage.setItem('sessionId', btoa(session));
```

As `cookie-storage` is built as [UMD] _(Universal Module Definition)_,
it can be included from module loaders such as [CommonJS], [ES2015 Export]
or [AMD RequireJS].

### CommonJS

```javascript
var cookies = require('cookie-storage-v2');
```

### ES2015 Export

```javascript
import cookies from 'cookie-storage-v2';
```

### AMD

```javascript
// using RequireJS
requirejs.config({
  paths: {
    // remove the extension .js
    'cookie-storage': '<PATH>/cookie-storage.min'
  }
});
require(['cookie-storage'], function(cookies) {
  cookies.setItem('testing', [1,2,3,5,8,13], {
    expires: { minutes: 10 },
  });
});
```

See an example with RequireJS here: http://jsfiddle.net/FdKTn/72/

# API

The exposed `cookieStorage` object is an instance of the internal
`CookieStorage` class, which implements an API similar to the
[Web Storage] interface. It can store and retrieve **primitive**,
`Object` and `Array<Any>` values, thanks to `JSON.stringify`.

The inherited members of the prototype are:

- **`setItem`**`(key, value, options)`: stores a `value` given a `key` name.
  <br>The `options` parameter is optional and describes the metadata passed
  to the cookie.
- **`getItem`**`(key)`: retrieves a value by its `key` name.
- **`removeItem`**`(key, options)`: deletes an item from the storage.
  <br>The `options` parameter is optional and describes the metadata passed
  to the cookie.
- **`clear`**`()`: removes all items from the storage instance.
- **`length`**: gets the number of items stored in the instance.

The parameter `options` for `setItem()` and `removeItem()` is an `object` that
configures the way how the cookie is stored. It has the following properties:

- `domain`_`{string}`_: the domain or subdomain where the cookie will be valid.
- `path`_`{string}`_: relative path where the cookie is valid. _Default `"/"`_
- `secure`_`{boolean}`_: if provided, sets a secure cookie (HTTPS).
- `expires`_`{Date, object}`_: the expiration date of the cookie.
  You can pass an object describing the expiration:
  - `date`_`{Date}`_: if provided, this date will be applied, otherwise the
    current date will be used.
  - `minutes`_`{number}`_: minutes to add / subtract
  - `hours`_`{number}`_: hours to add / subtract
  - `days`_`{number}`_: days to add / subtract
  - `months`_`{number}`_: months to add / subtract
  - `years`_`{number}`_: years to add / subtract

**Example**

```javascript
import cookieStorage from 'cookie-storage-v2';

let data = {
  start: new Date().toISOString(),
  sessionId: 'J34H5609-SG7ND98W3',
  platform: 'Linux x86_64',
};

cookieStorage.setItem('activity', data, {
  expires: { minutes: 30 },
});

cookieStorage.setItem('testing1', true, {
  secure: true,
  path: '/jherax',
  expires: new Date('2017/12/31'),
});

cookieStorage.setItem('testing2', [1,4,7], {
  domain: '.github.com',
  expires: { days: 1 },
});

cookieStorage.setItem('testing3', 3, {
  expires: {
    date: new Date('2018/03/06'),
    hours: -6,
  },
});
```

**Important**: Take into account that if you want to modify or remove a cookie
that was created with a specific `path` or `domain` / subdomain, you need to
explicitate the domain attribute in the `options` when calling
`setItem(key, value, options)` or `removeItem(key, options)`.

![cookies](https://www.dropbox.com/s/wlvgm0t8xc07me1/cookies-metadata.gif?dl=1)

If you have created the cookie with **cookieStorage**, it will handle the
metadata internally, so that you can call `removeItem(key)` safely.

But if you want to modify / remove a cookie that was created from another page,
then you should provide the metadata as `path` or `domain` in order to match
the right cookie:

```javascript
// change the value of an external cookie in /answers
cookieStorage.setItem('landedAnswers', 999, {
  path: '/answers',
});

// remove an external cookie in a subdomain
cookieStorage.removeItem('optimizelyEndUserId', {
  domain: '.healthcare.org',
});
```

## Looping the storage

You can loop over the items in the `cookieStorage` instance,
but it is not a good practice, see the Important note below.

```javascript
cookieStorage.setItem('test1', 1);
cookieStorage.setItem('test2', 2);

// loop over the storage object
Object.keys(cookieStorage).forEach((key) => {
  console.log(key, cookieStorage[key]);
});

// or...
for (let key in cookieStorage) {
  console.log(key, cookieStorage[key]);
}
```

**Important**: Although you can loop over the storage items, it is
recommended to use the API methods instead, this is because navigable
items in the storage instance are not synchronized for external changes,
e.g. a domain cookie was created from another page, or a cookie has expired.

```javascript
// not recommended, they are not synchronized
var title = cookieStorage['title'];
var session = cookieStorage.sessionId;
cookieStorage['sessionId'] = 'E6URTG5';

// the good way, it tracks external changes
var title = cookieStorage.getItem('title');
var session = cookieStorage.getItem('sessionId');
cookieStorage.setItem('sessionId', 'E6URTG5');
```

## Polyfills

This library is written using some of the new ES5/ES6 features. If you have
to support Non-standard-compliant browsers like Internet Explorer, you can
polyfill some of the missing features with the following alternatives:

**Using [es6-shim](https://github.com/paulmillr/es6-shim)**

```html
<!-- put this script FIRST, before all other scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.35.3/es6-shim.min.js"></script>
```

**Using [polyfill.io](https://polyfill.io/v2/docs/)**

```html
<!-- put this script FIRST, before all other scripts -->
<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default-3.3"></script>
```

[Polyfill.io](https://polyfill.io/v2/docs/examples) reads the `User-Agent`
header of each request and returns the polyfills that are suitable for the
requesting browser.

If you want to request specific polyfills, you can pass a query parameter
to the url, for example:

```html
<!--[if IE]>
<script src="https://polyfill.io/v2/polyfill.min.js?features=default-3.3&flags=always"></script>
<![endif]-->
```

Read the list of available features:
[Features and Browsers Supported](https://polyfill.io/v2/docs/features/).

## Versioning

This projects adopts the [Semantic Versioning](http://semver.org/)
(SemVer) guidelines:

```text
<MAJOR>.<MINOR>.<PATCH>
```

Given a version number MAJOR.MINOR.PATCH, increment the:

1. MAJOR version when you make incompatible API changes.
1. MINOR version when you add functionality in a backwards-compatible manner.
1. PATCH version when you make backwards-compatible bug fixes.

## Issues

To report an issue and keep traceability of bug-fixes, please report to:

- https://github.com/jherax/cookie-storage/issues

## Changelog

The change history for each version is documented [here](CHANGELOG.md).

## License

This project is released under the [MIT](https://opensource.org/licenses/MIT)
license. This license applies ONLY to the source of this repository and doesn't
extend to any other distribution, or any other 3rd party libraries used in a
repository. See [LICENSE](LICENSE) file for more information.

<!-- LINKS -->

[proxy-storage]: https://github.com/jherax/proxy-storage
[Web Storage]: https://developer.mozilla.org/en-US/docs/Web/API/Storage
[document.cookie]: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
[UMD]: http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/
[CommonJS]: https://blog.risingstack.com/node-js-at-scale-module-system-commonjs-require/
[ES2015 Export]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export
[AMD RequireJS]: http://requirejs.org/docs/api.html#jsfiles
