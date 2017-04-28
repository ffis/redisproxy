(function(){

	const express = require('express'),
		redis = require('redis'),
		config = require('./config.json'),
		app = express();

	const redisclient = redis.createClient(config.redis.port, config.redis.host);

	redisclient.on('error', function (err) {
		logger.error('REDIS Error:', err);
	});

	if (config.redis.password){
		redisclient.auth(config.redis.password);
		Reflect.deleteProperty(config.redis.password);
	}

	app.get('*', function(req, res){
		redisclient.get(req.url, function(err, val){
			if (err){
				res.status(500);
			} else {
				res.jsonp(val);
			}
		});
	});

	if (config.server.https){
		const https = require('https'),
			fs = require('fs');
		config.server.options.key = fs.readFileSync(config.server.options.key);
		config.server.options.cert = fs.readFileSync(config.server.options.cert);
		https.createServer(config.server.options, app).listen(config.server.port);
		Reflect.deleteProperty(config.server, 'options');
	} else {
		app.listen(config.server.port);
	}

})();
