/**
 * Created by amira on 2/5/16.
 */
require('dotenv').config();
var express = require('express');
var detectBoard = require('./detect-board');
var app = express();

var port = process.env.port || 80;
var idMap = {};

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

function loadRiddle(id){
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
		console.log('started riddle', id, 'at', availableId);
	} catch(e){
		console.error(e.message);
		console.error(e.stack);
	} finally {
		detectBoard(loadRiddle);
	}
}

app.listen(port, function () {
	console.log('Station API listening on port', port);
	detectBoard(loadRiddle);
});