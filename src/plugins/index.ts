import { resolve } from "path";

import { App } from "..";

import { ApiPluginDefinition } from "./api";
import { CompressionPluginDefinition } from "./compression";
import { CorsPluginDefinition } from "./cors";
import { JWTPluginDefinition } from "./jwt";
import { NotifyPluginDefinition } from "./notify";
import { RealTimeProxyPluginDefinition } from "./realtimeproxy";
import { RedisProxyPluginDefinition } from "./redisproxy";
import { StaticPluginDefinition } from "./static";

export type PluginWithParameters = [string, any];
export type PluginDefinition = ApiPluginDefinition | CompressionPluginDefinition | CorsPluginDefinition | JWTPluginDefinition | NotifyPluginDefinition | RealTimeProxyPluginDefinition | RedisProxyPluginDefinition | StaticPluginDefinition | string | PluginWithParameters;

export interface RestProxyPlugin {
    ready(): Promise<void>;
    register(app: App): Promise<void>;
    unregister?: () => Promise<void>;
}

export function buildPlugins(config): RestProxyPlugin[] {
    const restproxyplugins = config.restproxyplugins;
    const pluginsInstances: RestProxyPlugin[] = restproxyplugins.map((plugin) => {
        const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
        const pluginConfig = Array.isArray(plugin) ? plugin[1] : null;
        const path = resolve(__dirname, pluginName);

        let lib;
        try {
            lib = require(path);
        } catch (err) {
            lib = require(plugin);
        }

        const constructor = lib.default ? lib.default : lib;
        let instance;
        try {
            instance = new constructor(pluginConfig);
        } catch (err) {
            console.error("Cannot instance plugin", pluginName, "check it's availability or parameters", "\n\tParameters:", pluginConfig);

            throw err;
        }

        return instance;
    });


    return pluginsInstances;
}

 