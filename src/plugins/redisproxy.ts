import { Request, Response, NextFunction } from "express";
import { parse } from "url";

import { RestProxyPlugin } from ".";
import { App } from "..";

export type RedisProxyPluginDefinition = "redisproxy";

function sendCb(res: Response) {
	return function(err, val) {
		if (err) {
			res.status(500).jsonp('Error!');
		} else if (val) {
			if (typeof val === 'string') {
				try {
					const obj = JSON.parse(val);
					res.jsonp(obj);
				} catch (e) {
					res.jsonp(val);
				}
			} else {
				res.jsonp(val);
			}
		} else {
			res.status(404).jsonp('Not found!');
		}
	};
}

export default class RedisProxyPlugin implements RestProxyPlugin {
    constructor() { }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        app.app.get("*", (req: Request, res: Response, next: NextFunction) => {
            const key = parse(req.url).pathname;
        
            if (app.isValid(key)) {
                app.redisclient.get(key, sendCb(res));
            } else {
                app.refresh().then(() => {
                    if (app.isValid(key)) {
                        app.redisclient.get(key, sendCb(res));
                    } else {
                        next();
                    }
                });
            }
        });

        return Promise.resolve();
    }
}
