import { Server } from "http";
import { createServer } from "https";
import { readFileSync } from "fs";
import { resolve } from "path";
import { Response } from "express";

export function getServer(config: any, app): Server {
    let server;

    if (config.server.https) {
        config.server.options.key = readFileSync(resolve(__dirname, "..", config.server.options.key));
        config.server.options.cert = readFileSync(resolve(__dirname, "..", config.server.options.cert));
        server = createServer(config.server.options, app);
        Reflect.deleteProperty(config.server, 'options');

    } else {
        server = require('http').createServer(app);
    }

    return server;
}


export function sendCb(res: Response) {
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
