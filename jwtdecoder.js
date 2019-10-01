(function(){
    'use strict';

    const tiny = require('tiny-json-http'),
        jwt = require('jwt-simple');

    function JWTDecoder (config) {
        this.config = config;
        this.jwtKey = config.secret;

        switch (config.format) {
            case 'hex':
                this.jwtKey = Buffer.from(this.jwtKey, 'hex');
                break;
            case 'base64':
                this.jwtKey = Buffer.from(this.jwtKey, 'base64');
                break;
            default:
        }
    }

    JWTDecoder.prototype.register = function(app) {
        app.use((req, res, next) => {
            const auth = req.header('Authorization');
            if (auth && auth.startsWith('Bearer ')) {
                const token = auth.replace('Bearer ', '');
                try {
                    const decoded = jwt.decode(token, this.jwtKey);
                    req.user = decoded;

                    const data = {
                        user: decoded,
                        ip: req.get('X-Real-IP'),
                        originalUrl: req.originalUrl,
                        body: req.body
                    };

                    if (this.config.notify) {
                        const url = Object.keys(decoded).reduce((p, c) => p.replace(':' + c, decoded[c]), this.config.notify);
                        tiny.post({
                            url: url,
                            data: data
                        }).then(() => { }).catch((err) => console.error(err) );
                    }

                    next();
                } catch (e) {
                    res.status(401).send('Unauthorized');
                }
            } else {
                res.status(401).send('Unauthorized');
            }

        });
    };

    module.exports = JWTDecoder;

})(module);
    
