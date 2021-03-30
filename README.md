# destructor

## Installation

```bash
npm install @braintree/destructor
```

## Example

A class to keep track of tasks that must be performed to clean up any side effects caused by your SDK.

```js
import Destructor from "@braintree/destructor";

class MyClass {
  constructor() {
    this.destructor = new Destructor();

    // add iframe to page
    const iframe = document.createElement("iframe");
    iframe.src = "https://example.com";
    document.body.appendChild(iframe);

    // register the removal of the iframe with the destructor
    this.destructor.register(() => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    });

    // any other tasks that need to be registered to the destructor
    // go here. Think event listeners or script tags, etc.
  }

  teardown() {
    // if you need to clean up any changes MyClass made, call
    // teardown and the destructor will run any functions that
    // were registered to it
    this.destructor.teardown();
  }
}
```

## Requirements

This module requires Promises, so if used in an environment without Promise support, Promises will need to be polyfilled.

## Running tests

```bash
npm test
```
