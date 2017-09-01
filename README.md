# NODE40 Front End Programming Challenge

This is an application scaffold for a basic React project. This scaffold is provided to you so that you don't have to spend time creating a build configuration. For this reason, it is intentionally bare bones, and does not include many common features you might normally see and it is not intended to be used for building a production grade application.

## Overview

This scaffold provides the following:

**`webpack`** For module bundling. The `webpack` configuration borrows heavily from the [Create React App](https://github.com/facebookincubator/create-react-app) project. It includes loaders to handle:

 * ES6/2016+ transpiling (Babel)
 * SASS (.scss to css)
 * static files (images etc).

For ES6/ES2015+ features as well as JSX support, it uses the [babel-preset-react-app](https://github.com/facebookincubator/create-react-app/tree/master/packages/babel-preset-react-app). This should give you access to all of the modern language features of JavaScript you should need.

It also provides polyfills for Promises, `Object.assign()` and `fetch()`.

## Getting Started

You can use either NPM or Yarn to install the base dependencies. We recommend a version of Node.js 6.x or greater.

The `package.json` file contains three scripts:

* **`npm start`** or **`npm run start`** will run `webpack Dev Server`, create a development build and update or reload the browser when changes occur.
* **`npm run build-test`** will create a static development build in the `/dist` folder.
* **`npm run build`** will create a static production build in the `/dist` folder., including minifying code.
