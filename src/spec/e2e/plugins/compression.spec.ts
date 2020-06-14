import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";
import { IConfig } from "../../../config";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    beforeEach(() => {
        const configWithCompressionPlugin: IConfig = Object.assign({}, config, {restproxyplugins: [["compression", {threshold: 1}]]});
        const app = new App(configWithCompressionPlugin);
        return app.register().then(() => {
            this.app = app.app;
        });
    });
    it("should use compression when asking for /", (done) => {

        const url = "/";
        request(this.app)
            .get(url)
            .set("Accept-Encoding", "gzip")
            .expect((res) => {
                expect(res.header["content-encoding"]).toBe("gzip");
               
                done();
            })
            .end(() => {});
    });
});
