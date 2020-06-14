"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __1 = require("../..");
describe("Should fail when no valid config is set", function () {
    it("should return ok when asking for api", function () {
        var failingConfig = { restproxyplugins: [] };
        var app = new __1.App(failingConfig);
        expect(function () {
            app.setServer();
        }).toThrowError();
    });
});
//# sourceMappingURL=config.spec.js.map