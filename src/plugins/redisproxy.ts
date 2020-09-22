import { Request, Response, NextFunction } from "express";
import { parse } from "url";

import { parseFunction, RestProxyPlugin } from ".";
import { App } from "..";
import { sendCb } from "./utils";

export type RedisProxyPluginDefinition = "redisproxy";

export default class RedisProxyPlugin implements RestProxyPlugin {
    constructor() { }

    parse(): parseFunction {
        return JSON.parse;
    }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        app.app.get("*", (req: Request, res: Response, next: NextFunction) => {
            const key = parse(req.url).pathname;
        
            if (app.isValid(key)) {
                this.sendData2Output(app, key, res);
            } else {
                app.refresh().then(() => {
                    if (app.isValid(key)) {
                        this.sendData2Output(app, key, res);
                    } else {
                        next();
                    }
                });
            }
        });

        return Promise.resolve();
    }

    private sendData2Output(app: App, key: string, res: Response): void {
        app.database.get(key).then((value) => {
            sendCb(res, this.parse)(null, value);
        }).catch((err) => {
            sendCb(res, this.parse)(err);
        });
    }
}
