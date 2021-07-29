# req-helper

The req-helper  is an ajax, fetch and other interface request help library. It provides some functions to reduce the number of HTTP requests. Proxy functions are used to control the sending frequency of requests and cache responses.

It is applicable to client-side JavaScript (such as Browser, React Native, Electron) and server-side Node environment.

## Install and usage

Install via npm or yarn.
```shell
npm install req-helper
```
or
```shell
yarn add req-helper
```

It supports es module, commonJs module and AMD module loading and running.
```js
// es module
import { polling } from 'req-helper'
```

```js
// commonJs module
const { polling } = require('req-helper')
```
```js
// AMD module
require('req-helper', ({ polling }) => { 
  // Do something
})
```

## Function description
- [cache](./doc/markdowns/cache.md): The response to a request is cached in memory for a period of time.
- [deResend](./doc/markdowns/deResend.md): Prevent duplicate requests.
- [latest](./doc/markdowns/latest.md): Control frequent queries in a short time through cache and concurrency restrictions.
- [packing](./doc/markdowns/packing.md): Merge frequently requested data and use the requested data for batch interface.
- [polling](./doc/markdowns/polling.md): Polling for the same request.


## Some precautions

#### About parameter fn
Most functions of req-helper need to take a function as a parameter. This function needs to send an ajax request and return a promise object to express the status of the request.

We can handle ajax through promise at any time, such as [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) and [Axios](https://axios-http.com/). You can also use `XMLHttpRequest` with [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).


#### About promise status of fn returned
The req-helper needs to get this state accurately to ensure that the program can run normally.
- `pending`: The client has not received a response.
- `fulfilled`: The client received the correct response.
- `rejected`: Request error or the client received an incorrect response.

The following code takes the `cache()` of req-helper as an example
```js
// Baaaaaaad!
// The req-helper Unable to know the request error
cache(() => {
  return fetch(url).then(() => {
    // Do something
  }).catch(() => {
    // Do other thing
  })
})

// Gooooood!
cache(() => fetch(url)).then(() => {
  // Do something
}).catch(() => {
  // Do other thing
})

```

#### About time
Most functions of req-helper involve time parameters, such as interval time and cache time. All times are in milliseconds. Some parameters allow 0, and the score parameter must be greater than 0

Some browsers (such as chrome) have a phenomenon: The value of `setTimeout` parameter 2 is `0`, which is actually 1 ms. Moreover, `setTimeout` is nested in multiple, and the time is more unpredictable.
```js
// In chrome
let now = Date.now()
setTimeout(() => console.log('parameter set 1:' + (Date.now() - now) + 'ms'), 1)
setTimeout(() => console.log('parameter set 0:' + (Date.now() - now) + 'ms'), 0)
// Print
// parameter set 1:1ms
// parameter set 0:1ms
```
The processing of timer time by req-helper is as follows:
```js
const setDelay = (cb, time) => {
  if (time === 0) {
    Promise.resolve().then(fn)
  } else {
    setTimeout(fn, time)
  }
}
```

#### About proxy function
Most functions of req helper will be passed into a function `fn` to produce a proxy function `proxyFn`. The functions of the proxy function are as follows:
- Call parameter function with control `fn`.
- In general, pass the parameter to `fn`.
- In general, return the result of `fn`.
- Bind this for `fn`.

```js
const proxyFn = (function (fn) {
  return function (...args) {
    // Some control 
    return fn.call(this, ...args)
  }
})(fn);
```

## License

The MIT License (MIT)

Copyright (c) 2021 kasslun<kasslun@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
