/**
 * Created by amira on 9/6/16.
 * 0=={;;;;;;;;;;;;;;>
 */
var five = require('johnny-five');


var debug = process.env.debug;
var boardConfig = {
	repl:false,
	debug: debug
};

var configurations = {
	0: {type: 'riddle2', id:'0'},
	32: {type: 'riddle2', id:'32'},
	64: {type: 'riddle2', id:'64'},
	95: {type: 'riddle2', id:'95'},
	129: {type: 'riddle2', id:'129'},
	164: {type: 'riddle3', id:'164'},
	// 197: {type: 'riddle4', id:'197'},
	230: {type: 'riddle3', id:'230'},
	262: {type: 'riddle3', id:'262'},
	295: {type: 'riddle3', id:'295'},
	326: {type: 'riddle3', id:'326'},
	339: {type: 'riddle4', id:'339'},
	361: {type: 'riddle4', id:'361'},
	400: {type: 'riddle4', id:'400'},
	428: {type: 'riddle4', id:'428'},
	442: {type: 'riddle4', id:'442'},
	493: {type: 'riddle4', id:'493'},
	1024: {type: 'e-c-r', id:'ECR'}
};

function detectBoard(cb) {
	var board = new five.Board(boardConfig);
	board.on("ready", function () {
		queryBoard(this, cb);
	});
}

function findConfig(analog) {
	var closestVal = Object.keys(configurations).reduce(function(prev, curr){
		return Math.abs(analog - prev) < Math.abs(analog - curr) ? prev : curr;
	});
	return configurations[closestVal];
}

function queryBoard(board, callback){
	new five.Pin({
		pin: 'A5',
		mode: 0,
		board:board
	}).query(function(state){
		var config = findConfig(state.value);
		console.log('find confid: ' + JSON.stringify(state));
		console.log('detected board '+ config.id +' with riddle: ' + config.type + ' (raw:'+state.value+')');
		callback(config, state.value, board);
	});
}

module.exports = detectBoard;
