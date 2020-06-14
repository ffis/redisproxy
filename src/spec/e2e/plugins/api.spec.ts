import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";
import { IConfig } from "../../../config";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    beforeEach(() => {
        const configWithApiPlugin: IConfig = Object.assign({}, config, {restproxyplugins: ["api"]});
        const app = new App(configWithApiPlugin);
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should return ok when asking for api", (done) => {

        const url = "/api";
        request(this.app)
            .get(url)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect((res) => {
                expect(res.status).toBe(200);
                const collection = res.body;
                expect(Array.isArray(collection)).toBeTrue();
                expect(collection.length).toBeGreaterThan(0);
                done();
            })
            .end(() => {});
    });
});
