"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCb = void 0;
function sendCb(res, parseFn) {
    return function (err, val) {
        if (err) {
            res.status(500).jsonp('Error!');
        }
        else if (val) {
            if (typeof val === 'string') {
                try {
                    var obj = parseFn(val);
                    res.jsonp(obj);
                }
                catch (e) {
                    res.jsonp(val);
                }
            }
            else {
                res.jsonp(val);
            }
        }
        else {
            res.status(404).jsonp('Not found!');
        }
    };
}
exports.sendCb = sendCb;
//# sourceMappingURL=index.js.map