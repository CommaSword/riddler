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
	31: {type: 'riddle2', id:'31'},
	512 : {type: 'riddle1', id:'512'},
	1023: {type: 'riddle3', id:'1023'}
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
		console.log('detected board '+ config.id +' with riddle: ' + config.type + ' (raw:'+state.value+')');
		callback(config, state.value, board);
	});
}

module.exports = detectBoard;
