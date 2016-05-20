/**
 * Created by amira on 2/5/16.
 */
require('dotenv').config();
var five = require('johnny-five');
var express = require('express');

var app = express();

var port = process.env.port || 80;

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
	var id;
	var isOk = false;
	board.on("ready", function () {
		id = identifyRiddle(this);
		isOk = true;
		console.log('ready board for riddle' + id);
		var route = express.Router();
		route.get('/', function (req, res) {
			res.json(isOk);
		});
		route.use(function(req, res, next) {
			isOk? next() : res.status(500).send('Board Disconnected');
		});
		require('./riddles/'+id)(route, this);
		app.use('/'+id, route);
		console.log('started riddle' + id);
		initNextBoard();
	});
	board.on("close", function () {
		isOk = false;
		console.log('board closed ' + id);
	});
}

function identifyRiddle(board){
	// TODO use input from board to identify hardware
	return 'riddle3';
}

app.listen(port, function () {
	console.log('Station API listening on port', port);
	initNextBoard();
});