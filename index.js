(function(logger){
	'use strict';

	const express = require('express'),
		redis = require('redis'),
		url = require('url'),
		compression = require('compression'),
		BloomFilter = require('bloom.js'),
		config = require('./config.json'),
		app = express();

	app.use(compression());

	const clients = [];

	let filter = new BloomFilter();

	const redisclient = redis.createClient(config.redis.port, config.redis.host);
	const redissubs = redis.createClient(config.redis.port, config.redis.host);

	redisclient.on('error', function (err) {
		logger.error('REDIS Error:', err);
	});

	function refreshbloom(cb){
		return redisclient.keys('*', function(err, vals){
			if (!err){
				filter = new BloomFilter();
				vals.forEach(function(value){
					filter.add(value);
				});
			}

			return cb ? cb(err, vals) : true;
		});
	}

	redisclient.on('connect', function(){
		refreshbloom();
	});

	if (config.redis.password){
		redisclient.auth(config.redis.password);
		Reflect.deleteProperty(config.redis.password);
	}

	function sendCb(res){
		return function(err, val){
			if (err){
				res.status(500).jsonp('Error!');
			} else if (val){
				if (typeof val === 'string'){
					try{
						var obj = JSON.parse(val);
						res.jsonp(obj);
					}catch(e){
						res.jsonp(val);
					}
				} else {
					res.jsonp(val);
				}
			} else {
				res.status(404).jsonp('Not found!');
			}
		}
	}

	app.get('*', function(req, res){
		const key = url.parse(req.url).pathname;

		if (key === '/api' && config.server.expose){
			refreshbloom(function(err, keys){
				if (err){
					console.error(err);
					res.status(500).send('Error');
				} else {
					res.jsonp(keys);
				}
			});
			
			return;
		}

		if (filter.contains(key)){
			redisclient.get(key, sendCb(res));
		} else {
			refreshbloom(function(){
				if (filter.contains(key)){
					redisclient.get(key, sendCb(res));
				} else {
					res.status(404).jsonp('Not found');
				}
			});
		}
	});


	let server = false;

	if (config.server.https){
		const https = require('https'),
			fs = require('fs');
		config.server.options.key = fs.readFileSync(config.server.options.key);
		config.server.options.cert = fs.readFileSync(config.server.options.cert);
		server = https.createServer(config.server.options, app);
		Reflect.deleteProperty(config.server, 'options');

	} else {
		server = require('http').createServer(app);
	}

	const io = require('socket.io')(server);
	
	io.on('connection', function(client){
		logger.log('Added client', clients.length);
		client.on('event', function(data){
			logger.log(data);
			clients.push(client);
		});
		client.on('disconnect', function(){
			const index = clients.indexOf(client);
			if (index > -1){
				clients.splice(index, 1);
			}
			logger.log('removed client. Now we have', clients.length, 'clients');
		});
	});

	redissubs.subscribe('updates', function(evt){
		logger.log(evt);
	});

	redissubs.on('message', function (channel, data) {
		logger.log(channel, data);
		clients.forEach(function(socket){
			socket.send(data);
		});
	});

	server.listen(config.server.port);

})(console);
