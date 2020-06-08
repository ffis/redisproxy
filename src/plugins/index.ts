import { resolve } from "path";

import { App } from "..";

export interface RestProxyPlugin {
    ready(): Promise<void>;
    register(app: App): Promise<void>;
}

export function buildPlugins(config): RestProxyPlugin[] {
    const restproxyplugins = config.restproxyplugins;
    const plugins = restproxyplugins.map((plugin) => {
        const path = resolve(__dirname, plugin);
        let p;
        try {
            p = require(path);
        } catch (err) {
            p = require(plugin);
        }

        return p;
    });

    const pluginsInstances: RestProxyPlugin[] = plugins.map((plugin) => plugin.default ? new plugin.default(config) : new plugin(config));

    return pluginsInstances;
}

 