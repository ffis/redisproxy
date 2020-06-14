import { ClientOpts } from "redis";
import { PluginDefinition } from "./plugins";

export interface IConfig {
	"redis"?: ClientOpts;
	"server"?: {
		"port": number;
		"bind": string;
		"https": boolean;
		"options"?: {
			"key": string;
			"cert": string;
			"passphrase": string;
		}
	},
	"debug"?: boolean;
	"restproxyplugins"?: PluginDefinition[];
}
