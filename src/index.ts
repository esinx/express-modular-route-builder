import { Router } from "express";
import fs from "fs";
import path from "path";
import { OPENSSL_VERSION_NUMBER } from "constants";

interface _Route {
    path: string;
    src: string;
    handler: any;
}

const createRouteMap = (routeRoot: string, basePath: string): Array<_Route> => {
    const items = fs.readdirSync(routeRoot);
    let routeMap: Array<_Route> = [],
        directories: Array<string> = [],
        endpoints: Array<string> = [];
    for (const item of items) {
        const resolved = path.resolve(routeRoot, item);
        const stat = fs.statSync(resolved);
        if (stat.isDirectory()) directories.push(resolved);
        if (path.extname(item).match(/(\.js|\.ts)/)) endpoints.push(resolved);
    }
    for (const endpoint of endpoints) {
        const handler = require(endpoint);
        if (!handler) continue;
        let endpointName = path.basename(endpoint).replace(/(\.js|\.ts)/g, "");
        if (endpointName == "index") endpointName = "";
        if (endpointName.startsWith("_")) continue;
        routeMap.push({
            path: path.join(basePath, endpointName).replace(/\[(.*?)\]/g, ":$1"),
            src: endpoint,
            handler,
        });
    }
    for (const directory of directories) {
        let endpointName = path.basename(directory);
        if (endpointName.startsWith("_")) continue;
        routeMap = [...routeMap, ...createRouteMap(directory, path.join(basePath, endpointName))];
    }
    routeMap = [
        ...routeMap
            .filter((route) => !route.path.includes(":"))
            .sort((a, b) => a.path.lastIndexOf(b.path)),
        ...routeMap
            .filter((route) => route.path.includes(":"))
            .sort((a, b) => a.path.lastIndexOf(b.path)),
    ];
    return routeMap;
};

const applyRouteMap = (router: Router, routeMap: Array<_Route>) => {
    for (const route of routeMap) {
        for (const method of Object.keys(route.handler)) {
            const register = router[method as keyof Router] as Function;
            if (register && typeof route.handler[method] == "function") {
                register.call(router, route.path, route.handler[method]);
            }
        }
    }
};

const buildRoute = (routeRoot: string) => {
    const router = Router();
    const routeMap = createRouteMap(routeRoot, "/");
    applyRouteMap(router, routeMap);
    return router;
};

export = buildRoute;
