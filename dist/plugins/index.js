"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPlugins = void 0;
var path_1 = require("path");
function buildPlugins(config) {
    var restproxyplugins = config.restproxyplugins;
    var pluginsInstances = restproxyplugins.map(function (plugin) {
        var pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
        var pluginConfig = Array.isArray(plugin) ? plugin[1] : null;
        var path = path_1.resolve(__dirname, pluginName);
        var lib;
        try {
            lib = require(path);
        }
        catch (err) {
            lib = require(plugin);
        }
        var constructor = lib.default ? lib.default : lib;
        var instance;
        try {
            instance = new constructor(pluginConfig);
        }
        catch (err) {
            console.error("Cannot instance plugin", pluginName, "check it's availability or parameters", "\n\tParameters:", pluginConfig);
            throw err;
        }
        return instance;
    });
    return pluginsInstances;
}
exports.buildPlugins = buildPlugins;
//# sourceMappingURL=index.js.map