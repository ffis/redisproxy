import request = require("supertest");
import { Application } from "express";
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";
import { IConfig } from "../../../config";
import { MockedDatabase } from "../../database.mock";

interface ThisSpecInstance {
    app: Application;
}

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    it("should throw error when running without a proper configuration of plugins", () => {
        const notValidConfig: IConfig = Object.assign({}, config);
        Reflect.deleteProperty(notValidConfig, "restproxyplugins");

        expect(() => {
            const app = new App(notValidConfig, new MockedDatabase());
        }).toThrow();

    });
});

describe("should work without plugins", () => {
    beforeEach(function(this: ThisSpecInstance) {
        const configWithoutPlugins: IConfig = Object.assign({}, config, {restproxyplugins: []});
        const app = new App(configWithoutPlugins, new MockedDatabase());
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should return NOT FOUND error when asking for /", function(this: ThisSpecInstance, done: DoneFn) {
        request(this.app)
            .get("/")
            .expect((res) => {
                expect(res.status).toBe(404);
                done();
            })
            .end(() => {});
    });
});
