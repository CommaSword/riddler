/**
 * Created by amira on 16/6/16.
 */

/**
 * Created by amira on 2/5/16.
 */
var express = require('express');
var port = process.env.port || 80;
var discover = require('node-discover');

module.exports = function startStation(port, detectBoard, discover) {
	var app = express();

	var advertisement = {
		schema: {},
		port: port
	};

	var d = discover({
		advertisement: advertisement,
		isMasterEligible: false,
		multicast: '240.0.0.0'
	});

// most basic body parser for raw strings
	app.use(function rawBody(req, res, next) {
		req.setEncoding('utf8');
		req.rawBody = '';
		req.on('data', function (chunk) {
			req.rawBody += chunk;
		});
		req.on('end', function () {
			next();
		});
	});

	function loadRiddle(config, raw, board) {
		var isOk = true;
		board.on("close", function () {
			isOk = false;
			delete advertisement.schema[config.id];
			console.log('board closed ' + config.id);
			d.advertise(advertisement);
		});
		var route = express.Router();
		route.get('/', function (req, res) {
			res.json(isOk);
		});
		route.use(function (req, res, next) {
			isOk ? next() : res.status(500).send('Board Disconnected');
		});
		try {
			require('./riddles/' + config.type)(route, board);
			app.use('/' + config.id, route);
			advertisement.schema[config.id] = true;
			console.log('started riddle', config.id);
			d.advertise(advertisement);
		} catch (e) {
			console.error(e.message);
			console.error(e.stack);
		} finally {
			detectBoard(loadRiddle);
		}
	}

	var server = app.listen(port, function () {
		console.log('Station API listening on port', port);
		detectBoard(loadRiddle);
	});

	function close(signal) {
		console.log("\nGracefully shutting down from " + signal);
		server.close();
		process.exit();
	}

	process.on('SIGTERM', function () {
		close('SIGTERM');
	});

	process.on('SIGINT', function () {
		close('SIGINT');
	});
}