import { ServeStaticOptions } from "serve-static";

import { ok } from "assert";
import { static as ServeStatic } from "express";

import { RestProxyPlugin } from ".";
import { App } from "..";

export interface StaticPluginOptions {
    endpoint: string;
    directory: string;
    options?: ServeStaticOptions
}

export type StaticPluginDefinition = ["static", StaticPluginOptions];

export default class StaticPlugin implements RestProxyPlugin {
    constructor(private config: StaticPluginOptions) {
        ok(typeof config === "object", "config must be set when using static plugin");
        ok(typeof config.endpoint === "string", "endpoint attribute must be set when using static plugin");
        ok(typeof config.directory === "string", "directory attribute must be set when using static plugin");
    }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        const options: ServeStaticOptions = Object.assign({}, {dotfiles: "deny", index: false}, this.config.options);
        app.app.use(this.config.endpoint, ServeStatic(this.config.directory, options));

        return Promise.resolve();
    }
}
