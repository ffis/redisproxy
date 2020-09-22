import { App } from "../..";
import { IConfig } from "../../config";
import { MockedDatabase } from "../dabase.mock";

describe("Config behavoir", () => {
    it("Should fail when no valid config is set", () => {
        const failingConfig: IConfig = {restproxyplugins: []};
        const app = new App(failingConfig, new MockedDatabase());
        expect(function() {
            app.setServer();
        }).withContext("no server parameter was set").toThrow();
    });
});
