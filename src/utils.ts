import { Server } from "http";
import { createServer } from "https";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Application } from "express";

import { IConfig } from "./config";

export function getServer(config: IConfig, app: Application): Server {
    let server;

    if (config.server.https) {
        config.server.options.key = readFileSync(resolve(__dirname, "..", config.server.options.key), "utf-8");
        config.server.options.cert = readFileSync(resolve(__dirname, "..", config.server.options.cert), "utf-8");
        server = createServer(config.server.options, app);
        Reflect.deleteProperty(config.server, 'options');

    } else {
        server = require('http').createServer(app);
    }

    return server;
}
