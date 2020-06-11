import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient, RedisClient } from "redis";
import { Application } from "express";
import * as express from "express";

import { getServer } from "./utils";

import { promisify } from "util";
import { buildPlugins, RestProxyPlugin } from "./plugins";
import { Server } from "http";
import { IConfig } from "./config";

import * as BloomFilter from "bloom.js";

export class App {
	public app: Application;
	public redisclient: RedisClient;
	public server: Server;

	private keys: (p: string) => Promise<string[]>;
	private filter: any;
	private readyP: Promise<void>;
	private plugins: RestProxyPlugin[];

	constructor(private config: IConfig) {

		if (!config.restproxyplugins) {
			throw new Error("You need to enable at least one plugin. Try editing config.json file and add plugin: [\"redisproxy\"]");
		}

		this.app = express();

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

	public isValid(key: string): boolean {
		return this.filter.contains(key);
	}

	public refresh(): Promise<string[]> {
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
			});
		});
	}

	public listen() {
		if (!this.config.server || !this.config.server.port || !this.config.server.bind) {
			throw new Error("No valid config for server has been set");
		}
		this.server = getServer(this.config, this.app);

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
