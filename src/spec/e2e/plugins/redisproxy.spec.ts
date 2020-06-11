import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

describe("Should work as expected", () => {
    beforeEach(() => {
        const configWithRPlugin = Object.assign({}, config, {restproxyplugins: ["redisproxy"]});
        const app = new App(configWithRPlugin);
        return app.register().then(() => {
            this.app = app;
        });
    });
    it("should return ok when asking for valid content", (done) => {
        this.app.refresh().then((validurls) => {
            if (validurls.length > 0) {
                const validurl = validurls[0];
                const url = validurl.startsWith("/") ? validurl : "/" + validurl;

                request(this.app.app)
                    .get(url)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect((res) => {
                        expect(res.status).toBe(200);
                        done();
                    })
                    .end((err) => {
                        if (err) throw err;
                    });
            } else {
                done();
            } 
        });
    });
});