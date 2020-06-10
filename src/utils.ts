import { Server } from "http";
import { createServer } from "https";
import { readFileSync } from "fs";
import { resolve } from "path";

export function getServer(config: any, app): Server {
    let server;

    if (config.server.https) {
        config.server.options.key = readFileSync(resolve(__dirname, "..", config.server.options.key));
        config.server.options.cert = readFileSync(resolve(__dirname, "..", config.server.options.cert));
        server = createServer(config.server.options, app);
        Reflect.deleteProperty(config.server, 'options');

    } else {
        server = require('http').createServer(app);
    }

    return server;
}
