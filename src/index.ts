import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient, RedisClient } from "redis";
import { Application, Request, Response } from "express";

import { getServer, sendCb } from "./utils";

import { promisify } from "util";
import { buildPlugins, RestProxyPlugin } from "./plugins";
import { Server } from "http";

const express = require("express"),
	url = require("url"),
	BloomFilter = require("bloom.js");

export class App {
	public app: Application;
	public redisclient: RedisClient;
	public server: Server;

	private keys: (p: string) => Promise<string[]>;
	private filter: any;
	private readyP: Promise<void>;
	private plugins: RestProxyPlugin[];

	constructor(private config: any) {
		this.app = express();
		this.server = getServer(this.config, this.app);
		this.filter = new BloomFilter();
		
		this.redisclient = createClient(config.redis);
		this.readyP = new Promise((resolve, reject) => {
			this.redisclient.once("ready", () => {
				resolve();
				this.refresh();
			});

			this.redisclient.once("error", () => {
				reject();
			});

			this.keys = promisify(this.redisclient.keys).bind(this.redisclient);
		});
	}

	private refresh(): Promise<string[]> {
		return this.keys("*").then((vals) => {
			this.filter = new BloomFilter();
			vals.forEach((value) => {
				this.filter.add(value);
			});
	
			return vals;
		});
	}

	private ready(): Promise<void> {
		this.plugins = buildPlugins(this.config);

		return Promise.all(this.plugins.map((p) => p.ready())).then(() => this.readyP);
	}

	public register(): Promise<void> {

		return this.ready().then(() => {
		
			this.plugins.forEach((plugin) => {
				plugin.register(this);
			})

			this.app.get("*", (req: Request, res: Response) => {
				const key = url.parse(req.url).pathname;
			
				if (this.filter.contains(key)) {
					this.redisclient.get(key, sendCb(res));
				} else {
					this.refresh().then(() => {
						if (this.filter.contains(key)) {
							this.redisclient.get(key, sendCb(res));
						} else {
							res.status(404).jsonp("Not found");
						}
					});
				}
			});
		});
	}

	public listen() {
		this.server.listen(this.config.server.port, this.config.server.bind, () => {
			const protocol = this.config.server.https ? "https" : "http";
			console.log("Listening on", protocol + "://" + this.config.server.bind + ":" + this.config.server.port);
		});
	}
}

export function run() {
	const config = JSON.parse(readFileSync(resolve(__dirname, "..", "config.json"), "utf-8"));

	const app = new App(config);
	app.register().then(() => {
		app.listen();
	}).catch((err) => {
		console.error(err);

		throw err;
	});
}

if (require.main === module) {
	run();
}
