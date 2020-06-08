import { Request, Response } from "express";
import { promisify } from "util";

import { RestProxyPlugin } from ".";
import { App } from "../";

export default class ApiPlugin implements RestProxyPlugin {
    constructor(private config: any){}

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        if (this.config.server.expose) {
            const keys = promisify(app.redisclient.keys).bind(app.redisclient);

			app.app.get("/api", (req: Request, res: Response) => {
				keys("*").then((keys) => {
					res.jsonp(keys);
				}).catch((err) => {
					console.error(err);
					res.status(500).send("Error");
				});
			});
        }
        
        return Promise.resolve();
    }
}