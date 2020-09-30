"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockedDatabase = void 0;
var MockedDatabase = /** @class */ (function () {
    function MockedDatabase() {
    }
    MockedDatabase.prototype.keys = function (p) {
        return Promise.resolve(["/api/example"]);
    };
    MockedDatabase.prototype.get = function (key) {
        if (key === "/api/example") {
            return Promise.resolve("[]");
        }
        return Promise.resolve("");
    };
    MockedDatabase.prototype.ready = function () {
        return Promise.resolve();
    };
    return MockedDatabase;
}());
exports.MockedDatabase = MockedDatabase;
//# sourceMappingURL=database.mock.js.map