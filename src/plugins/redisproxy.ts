import { Request, Response } from "express";
import { parse } from "url";

import { RestProxyPlugin } from ".";
import { App } from "..";

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
    constructor(private config) { }

    ready(): Promise<void> {
        return Promise.resolve();
    }

    register(app: App): Promise<void> {
        app.app.get("*", (req: Request, res: Response) => {
            const key = parse(req.url).pathname;
        
            if (app.isValid(key)) {
                app.redisclient.get(key, sendCb(res));
            } else {
                app.refresh().then(() => {
                    if (app.isValid(key)) {
                        app.redisclient.get(key, sendCb(res));
                    } else {
                        res.status(404).jsonp("Not found");
                    }
                });
            }
        });

        return Promise.resolve();
    }
}
