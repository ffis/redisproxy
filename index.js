(function(){

	const express = require('express'),
		redis = require('redis'),
		url = require('url'),
		BloomFilter = require('bloom.js'),
		config = require('./config.json'),
		app = express();

	const clients = [];

	let filter = new BloomFilter();

	const redisclient = redis.createClient(config.redis.port, config.redis.host);
	const redissubs = redis.createClient(config.redis.port, config.redis.host);

	redisclient.on('error', function (err) {
		logger.error('REDIS Error:', err);
	});

	function refreshbloom(cb){
		redisclient.keys('*', function(err, vals){
			if (!err){
				filter = new BloomFilter();
				vals.forEach(function(value){
					filter.add(value);
				});
			}
			if (cb){
				cb(err);
			}
		});
	}

	redisclient.on('connect', function(){
		refreshbloom();
	});

	if (config.redis.password){
		redisclient.auth(config.redis.password);
		Reflect.deleteProperty(config.redis.password);
	}

	const existingkeys = {};

	app.get('*', function(req, res){
		const key = url.parse(req.url).pathname;
		if (typeof filter.contains(key)){
			console.log('bloom ok', key);
			redisclient.get(key, function(err, val){
				if (err){
					res.status(500);
				} else if (!val){
					res.status(404);
				} else {
					res.jsonp(val);
				}
			});
		} else {
			refreshbloom(function(err){
				if (typeof filter.contains(key)){
					redisclient.get(key, function(erro, val){
						if (erro){
							res.status(500);
						} else if (!val){
							res.status(404);
						} else {
							res.jsonp(val);
						}
					});
				} else {
					res.status(404);
				}
			});
		}
	});


	if (config.server.https){
		const https = require('https'),
			fs = require('fs');
		config.server.options.key = fs.readFileSync(config.server.options.key);
		config.server.options.cert = fs.readFileSync(config.server.options.cert);
		https.createServer(config.server.options, app).listen(config.server.port);
		Reflect.deleteProperty(config.server, 'options');

	} else {

		const server = require('http').createServer(app);
		const io = require('socket.io')(server);
		
		io.on('connection', function(client){
			clients.push(client);
			console.log('Added client', clients.length)

			client.on('event', function(data){
				console.log('helllo', data);
			});
			client.on('disconnect', function(){
				const index = clients.indexOf(client);
				if (index > -1){
					clients.splice(index, 1);
				}
				console.log('removed client', clients.length);
			});
		});

		redissubs.subscribe('updates', function(evt){
			console.log(evt);
		});
		redissubs.on('message', function (channel, data) {
			console.log(channel, data);
			clients.forEach(function(socket){
				socket.send(data);
			});
		});


		server.listen(config.server.port);
	}

})();
