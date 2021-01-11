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
					res.status(200).jsonp(obj);
				} catch (e) {
					res.status(200).jsonp(val);
				}
			} else {
				res.status(200).jsonp(val);
			}
		} else {
			res.status(404).jsonp('Not found!');
		}
	};
}
