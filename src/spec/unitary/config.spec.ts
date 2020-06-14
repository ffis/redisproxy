import { App } from "../..";
import { IConfig } from "../../config";

describe("Should fail when no valid config is set", () => {
    it("should return ok when asking for api", () => {
        const failingConfig: IConfig = {restproxyplugins: []};
        const app = new App(failingConfig);
        expect(() => {
            app.setServer();
        }).toThrowError();
    });
});
