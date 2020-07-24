# express-modular-route-builder

_Modular express server routing using directory structure_

[![Node version](https://img.shields.io/node/v/express-modular-route-builder.svg?style=flat)](http://nodejs.org/download/) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/esinx/express-modular-route-builder/issues)

## Installation

```shell
npm i --save express-modular-route-builder
```

## Usage

### Server

```javascript
const path = require("path");

const express = require("express");
const buildRoutes = require("express-modular-route-builder");

const app = express();
// build routes from "./routes"
const routes = buildRoutes(path.resolve(__dirname, "./routes"));
// map all routes to root
app.use("/", (req, res, next) => routes(req, res, next));

// listen on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000!");
});
```

### Route

Each route is represented as a JavaScript module(source, .js file). For instance, a directory structure like below would produce the following routes.

```
./routes
    | - ./test.js
    | - ./[id].js
    | - ./posts
        | - ./[id].js
        | - ./index.js
```

```
/test
/:id
/posts/(index)
/posts/:id
```

### Method

Within each route modules, the exported object's properties are mapped to the corresponding method names.

```javascript
module.exports = {
    get: async (req, res) => {...},
    post: async (req, res) => {...},
    delete: async (req, res) => {...}
}
```

## Routing Rules

-   Files starting with `_` are not routed.
    -   ex) `_database.js` will remain _unrouted_-- It could be imported from other mapped routes.
-   Only files ending with `.js` are routed.
    -   Static file serving is not supported yet. Pull requests are welcome.
-   Static routes(routes without params) have higher priority compared to dynamic routes(routes with params).
-   Files named `index` will be re-routed to its parent directory

## License

MIT. Copyright (C) 2020-present by esinx (Eunsoo Shin).

[![HitCount](http://hits.dwyl.com/esinx/express-modular-route-builder.svg?style=flat)](http://hits.dwyl.com/esinx/express-modular-route-builder)
