import request = require("supertest");
import { readFileSync } from "fs";
import { resolve } from "path";
import { App } from "../../..";
import { IConfig } from "../../../config";
import { MockedDatabase } from "../../database.mock";

const config = JSON.parse(readFileSync(resolve(__dirname, "..", "..", "..", "..", "config.json"), "utf-8"));

interface ThisSpecInstance {
    app: App;
}

describe("Should work as expected", () => {
    beforeEach(function(this: ThisSpecInstance) {
        const configWithRPlugin: IConfig = Object.assign({}, config, {restproxyplugins: ["redisproxy"]});
        const app = new App(configWithRPlugin, new MockedDatabase());
        app.setServer();

        return app.register().then(() => {
            this.app = app;
        });
    });
    it("should return ok when asking for a valid content", function(this: ThisSpecInstance) {

        return this.app.refresh().then((urls) => {
            const validurls = urls.filter((u) => u.startsWith("/"));

            if (validurls.length === 0) {
                return;
            }

            const url = validurls[0];

            return request(this.app.app)
                .get(url)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
    it("should return NOT FOUND when asking for no valid content", function(this: ThisSpecInstance) {
        
        return this.app.refresh().then(() => {
            const notvalidurl = "/veryrandomtextveryrandomtext";

            return request(this.app.app)
                .get(notvalidurl)
                .set('Accept', 'application/json')
                .expect(404);
        });
    });
});