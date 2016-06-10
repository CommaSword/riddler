/**
 * Created by amira on 2/5/16.
 */
require('dotenv').config();
var five = require('johnny-five');
var express = require('express');

var app = express();

var port = process.env.port || 80;
var idMap = {}

function generateAvailableId(id) {
	var decimal = 0;
	while (!!idMap[id + '.' + decimal]) {
		decimal++;
	}
	id += '.' + decimal;
	idMap[id] = true;
	return id;
}

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

const boardConfig = {
	repl:false,
	// debug: false
};

function initNextBoard() {
	var board = new five.Board(boardConfig);
	board.on("ready", function () {
		identifyRiddle(this, function(id){
			console.log('identified board with riddle: ' + id);
			board.on("close", function () {
				isOk = false;
				console.log('board closed ' + id);
			});
			var isOk = true;
			var route = express.Router();
			route.get('/', function (req, res) {
				res.json(isOk);
			});
			route.use(function(req, res, next) {
				isOk? next() : res.status(500).send('Board Disconnected');
			});
			try {
				require('./riddles/' + id)(route, board);
				var availableId = generateAvailableId(id);
				app.use('/' + availableId, route);
				console.log('started riddle' + id);
			} catch(e){
				console.error(e.message);
				console.error(e.stack);
			} finally {
				initNextBoard();
			}
		});
	});

}

var riddles = {
	0: 'riddle2',
	512 : 'riddle1',
	1023: 'riddle3'
};

function analog2Id(analog) {
	var closestVal = Object.keys(riddles).reduce(function(prev, curr){
		return Math.abs(analog - prev) < Math.abs(analog - curr) ? prev : curr;
	});
	return riddles[closestVal];
}

function identifyRiddle(board, callback){
	new five.Pin({
		pin: 'A5',
		mode: 0,
		board:board
	}).query(function(state){
		callback(analog2Id(state.value));
	});
}

var server = app.listen(port, function () {
	console.log('Station API listening on port', port);
	initNextBoard();
});

function close(signal) {
	console.log( "\nGracefully shutting down from " + signal );
	server.close();
	process.exit();
}

process.on('SIGTERM', close);

process.on('SIGINT', close);
