import compression = require("compression");

import { RestProxyPlugin } from ".";
import { App } from "..";

export default class CompressionPlugin implements RestProxyPlugin {
    constructor() { }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        app.app.use(compression());

        return Promise.resolve();
    }

}
