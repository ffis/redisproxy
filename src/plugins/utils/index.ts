import { Response } from "express";
import { parseFunction } from "..";

export function sendCb(res: Response, parseFn: parseFunction) {
	return function(err: Error | null, val?: string) {
		if (err) {
			res.status(500).jsonp('Error!');
		} else if (val) {
			if (typeof val === 'string') {
				try {
					const obj = parseFn(val);
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
