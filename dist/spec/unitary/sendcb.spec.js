"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../plugins/utils");
describe("send callback", function () {
    beforeEach(function () {
        var fakeres = {
            status: function (_code) { return fakeres; },
            jsonp: function (_body) { return fakeres; },
            end: function () { }
        };
        spyOn(fakeres, "status").and.callThrough();
        spyOn(fakeres, "jsonp").and.callThrough();
        spyOn(fakeres, "end").and.callThrough();
        this.res = fakeres;
    });
    it("should work with no errors", function () {
        var value = { "casa": "valor" };
        var stringified = JSON.stringify(value);
        utils_1.sendCb(this.res, JSON.parse)(null, stringified);
        expect(this.res.status).toHaveBeenCalledWith(200);
        expect(this.res.jsonp).toHaveBeenCalledWith(value);
    });
    it("should work with errors", function () {
        var value = { "casa": "valor" };
        var stringified = JSON.stringify(value);
        utils_1.sendCb(this.res, JSON.parse)(new Error("my error"), stringified);
        expect(this.res.status).toHaveBeenCalledWith(500);
        expect(this.res.jsonp).toHaveBeenCalledWith("Error!");
    });
    it("should work with empty value", function () {
        utils_1.sendCb(this.res, JSON.parse)(null, "");
        expect(this.res.status).toHaveBeenCalledWith(404);
    });
});
//# sourceMappingURL=sendcb.spec.js.map