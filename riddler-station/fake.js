/**
 * Created by amira on 16/6/16.
 */

/**
 * Created by amira on 2/5/16.
 */
require('dotenv').config();
var port = process.env.port || 80;
var discover = require('node-discover');
var station = require('./station');
var five = require('johnny-five');
var mocks = require('mock-firmata');

var configurations = [
	{type: 'riddle2', id:'0'}, {type: 'riddle2', id:'32'},
	{type: 'riddle2', id:'64'}, {type: 'riddle2', id:'95'},
	{type: 'riddle2', id:'129'}, {type: 'riddle3', id:'164'},
	{type: 'riddle3', id:'230'}, {type: 'riddle3', id:'262'},
	{type: 'riddle3', id:'295'}, {type: 'riddle3', id:'326'}
];


function newBoard(pins) {
	if (pins) {
		pins.forEach(function(pin) {
			Object.assign(pin, {
				mode: 1,
				value: 0,
				report: 1,
				analogChannel: 127
			});
		});
	}
	var io = new mocks.Firmata({
		pins: pins
	});

	io.SERIAL_PORT_IDs.DEFAULT = 0x08;

	var board = new five.Board({
		io: io,
		debug: false,
		repl: false
	});

	io.emit("connect");
	io.emit("ready");

	return board;
}
function detectBoard(callback) {
	if (configurations.length) {
		var config = configurations.pop();
		if (configurations.length) {
			configurations.pop();
		}
		callback(config, null, newBoard());
	}
}

station(port, detectBoard, discover);