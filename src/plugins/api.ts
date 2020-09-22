import { Request, Response } from "express";
import { promisify } from "util";

import { RestProxyPlugin } from ".";
import { App } from "../";

export type ApiPluginDefinition = "api";

export default class ApiPlugin implements RestProxyPlugin {
    constructor(){}

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        app.app.get("/api", (req: Request, res: Response) => {
            app.database.keys("*").then((keys) => {
                res.jsonp(keys);
            }).catch((err) => {
                console.error(err);
                res.status(500).send("Error");
            });
        });

        return Promise.resolve();
    }
}