import { ClientOpts } from "redis";

export type PluginWithParameters = [string, any];
export type PluginDefinition = string | PluginWithParameters;

export interface IConfig {
	"redis"?: ClientOpts,
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
	"debug"?: boolean,
	"restproxyplugins"?: PluginDefinition[];
}
