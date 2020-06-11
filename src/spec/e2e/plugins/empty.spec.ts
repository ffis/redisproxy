import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    it("should throw error when running without a proper configuration of plugins", () => {
        const notValidConfig = Object.assign({}, config);
        Reflect.deleteProperty(notValidConfig, "restproxyplugins");

        expect(() => {
            const app = new App(notValidConfig);
        }).toThrow();

    });
});


describe("should work without plugins", () => {
    beforeEach(() => {
        const configWithoutPlugins = Object.assign({}, config, {restproxyplugins: []});
        const app = new App(configWithoutPlugins);
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should return NOT FOUND error when asking for /", (done) => {
        request(this.app)
            .get("/")
            .expect((res) => {
                expect(res.status).toBe(404);
                done();
            })
            .end((err) => {
                if (err) throw err;
            });
    });
});
