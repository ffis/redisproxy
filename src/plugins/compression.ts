import { CompressionOptions } from "compression";
import compression = require("compression");

import { RestProxyPlugin } from ".";
import { App } from "..";

export type CompressionPluginDefinition = "compression" | ["compression", CompressionOptions];

export default class CompressionPlugin implements RestProxyPlugin {
    constructor(private config?: CompressionOptions) { }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        app.app.use(compression(this.config));

        return Promise.resolve();
    }

}
