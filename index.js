(function(){

	const express = require('express'),
		redis = require('redis'),
		config = require('./config.json'),
		app = express();

	const redisclient = redis.createClient(config.redis.port, config.redis.host);

	redisclient.on('error', function (err) {
		logger.error('Error REDIS:', err);
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
	app.listen(config.port);

})();
