"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPlugins = void 0;
var path_1 = require("path");
function buildPlugins(config) {
    var restproxyplugins = config.restproxyplugins;
    var plugins = restproxyplugins.map(function (plugin) {
        var path = path_1.resolve(__dirname, plugin);
        var p;
        try {
            p = require(path);
        }
        catch (err) {
            p = require(plugin);
        }
        return p;
    });
    var pluginsInstances = plugins.map(function (plugin) { return plugin.default ? new plugin.default(config) : new plugin(config); });
    return pluginsInstances;
}
exports.buildPlugins = buildPlugins;
//# sourceMappingURL=index.js.map