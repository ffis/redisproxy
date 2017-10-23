(function(logger){
	'use strict';

	const express = require('express'),
		redis = require('redis'),
		url = require('url'),
		BloomFilter = require('bloom.js'),
		CAS = require('cas'),
		jsonwebtoken = require('jsonwebtoken'),
		config = require('./config.json'),
		app = express(),
		cas = new CAS(config.cas);

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

			return cb ? cb(err) : true;
		});
	}

	redisclient.on('connect', function(){
		refreshbloom();
	});

	if (config.redis.password){
		redisclient.auth(config.redis.password);
		Reflect.deleteProperty(config.redis.password);
	}

	app.use('/authenticate', function(req, res){
		if (typeof req.query.ticket === 'string' && req.query.ticket !== ''){
			cas.validate(data.ticket, function(err, status, username){
				if (err){
					res.status(400);

					return;
				}
				const token = jsonwebtoken.sign({username: username}, config.jwt.secret, {'expiresIn': config.jwt.session_time});

				res.jsonp({token: token});
			});
		} else {
			res.status(400);
		}
	});

	app.get('*', function(req, res){
		const key = url.parse(req.url).pathname;

		if (filter.contains(key)){
			redisclient.get(key, function(err, val){
				if (err){
					res.status(500);
				} else if (val){

					res.jsonp(val);
				} else {
					res.status(404);
				}
			});
		} else {
			refreshbloom(function(){
				if (filter.contains(key)){
					redisclient.get(key, function(erro, val){
						if (erro){
							res.status(500);
						} else if (val){

							res.jsonp(val);
						} else {
							res.status(404);
						}
					});
				} else {
					res.status(404);
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
			cas.validate(data.ticket, function(err, status, username){
				if (err){
					logger.log(data, err);
				} else {
					logger.log(data, status, username);
					clients.push(client);
				}
			});
		});
		client.on('disconnect', function(){
			const index = clients.indexOf(client);
			if (index > -1){
				clients.splice(index, 1);
			}
			logger.log('removed client', clients.length);
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
