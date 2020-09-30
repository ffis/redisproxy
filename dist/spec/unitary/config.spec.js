"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
var database_mock_1 = require("../database.mock");
describe("Config behavoir", function () {
    it("Should fail when no valid config is set", function () {
        var failingConfig = { restproxyplugins: [] };
        var app = new __1.App(failingConfig, new database_mock_1.MockedDatabase());
        expect(function () {
            app.setServer();
        }).withContext("no server parameter was set").toThrow();
    });
});
//# sourceMappingURL=config.spec.js.map