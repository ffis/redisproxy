import { Server } from "http";
import { createServer } from "https";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Application } from "express";

import { IConfig } from "./config";

export function getServer(config: IConfig, app: Application): Server {
    let server;

    if (config.server.https) {
        const options = Object.assign({}, config.server.options);
        options.key = readFileSync(resolve(__dirname, "..", options.key), "utf-8");
        options.cert = readFileSync(resolve(__dirname, "..", options.cert), "utf-8");
        server = createServer(options, app);
    } else {
        server = require('http').createServer(app);
    }

    return server;
}
