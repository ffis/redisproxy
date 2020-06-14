import request = require("supertest");
import { readFileSync } from "fs";
import { basename, resolve } from "path";
import { App } from "../../..";
import { IConfig } from "../../../config";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    beforeEach(() => {
        const directory = resolve(__dirname);
        const configWithStaticPlugin: IConfig = Object.assign({}, config, {restproxyplugins: [["static", {endpoint: "/", directory }]]});
        const app = new App(configWithStaticPlugin);
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should return ok when asking for /" + basename(__filename), (done) => {
        const url = "/" + basename(__filename);
        request(this.app)
            .get(url)
            .expect((res) => {
                expect(res.status).toBe(200);
                done();
            })
            .end(() => {});
    });
});
