/**
 * Created by amira on 2/5/16.
 */
require('dotenv').config();
var five = require('johnny-five');
var express = require('express');

const board = new five.Board({
	repl:false,
	// debug: false
});
var interval = 1;

var state = {
	timeout_value: 3,
	time_since_press: 0
};

board.on("ready", function() {

	var button = new five.Button(10);
	var red = new five.Led(8);
	var green = new five.Led(9);
	function reset(){
		state.time_since_press = 0;
		console.log('Click! state: ', JSON.stringify(state));
		calcLedsStatus();
	}
	button.on('press', reset);
	button.on('hold', reset);

	function calcLedsStatus(){
		if (state.time_since_press > state.timeout_value){
			red.on();
			green.off();
		} else {
			red.off();
			green.on();
		}
	}
	calcLedsStatus();
	setInterval(function() {
		state.time_since_press = state.time_since_press + interval;
		console.log('Tick! state: ', JSON.stringify(state));
		calcLedsStatus();
	}, interval * 1000);
	runServer();
});
function runServer() {
	const BODY = 'rawBody';
	var app = express();
// most basic body parser for raw strings
	app.use(function rawBody(req, res, next) {
		req.setEncoding('utf8');
		req[BODY] = '';
		req.on('data', function (chunk) {
			req[BODY] += chunk;
		});
		req.on('end', function () {
			next();
		});
	});

	app.get('/data', function (req, res) {
		res.json(state);
	});

	app.post('/timeout_value', function (req, res) {
		console.log('set_timeout_value', req[BODY]);
		if (req[BODY].match(/^\d+$/)) {
			state.timeout_value = parseInt(req[BODY]);
		}
		res.json(state);
	});

	app.post('/time_since_press', function (req, res) {
		console.log('set_time_since_press', req[BODY]);
		if (req[BODY].match(/^\d+$/)) {
			state.time_since_press = parseInt(req[BODY]);
		}
		res.json(state);
	});

	app.listen(process.env.riddle1_port, function () {
		console.log('Example app listening on port', process.env.riddle1_port);
	});
}