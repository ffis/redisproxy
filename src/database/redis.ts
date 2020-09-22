import { ClientOpts, createClient, RedisClient } from "redis";
import { promisify } from "util";
import { Database } from ".";

export class RedisDatabase implements Database {
	private redisclient: RedisClient;
	private keysFn: (p: string) => Promise<string[]>;
	private getFn: (p: string) => Promise<string>;
	private isReady: Promise<void>;

	constructor(config: ClientOpts) {
		this.redisclient = createClient(config);
	}

	keys(p: string): Promise<string[]> {
		return this.ready().then(() => this.keysFn(p));
	}

	get(key: string): Promise<string> {
		return this.ready().then(() => this.getFn(key));
	}

	ready(): Promise<void> {
		if (!this.isReady) {
			this.isReady = new Promise((resolve, reject) => {
				this.redisclient.once("ready", () => {
					this.keysFn = promisify(this.redisclient.keys).bind(this.redisclient);
					this.getFn = promisify(this.redisclient.get).bind(this.redisclient);
					resolve();
				});

				this.redisclient.once("error", () => {
					reject();
				});
			});
		}

		return this.isReady;
	}
}
