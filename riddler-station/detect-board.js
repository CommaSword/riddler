/**
 * Created by amira on 9/6/16.
 * 0=={;;;;;;;;;;;;;;>
 */
var five = require('johnny-five');


var boardConfig = {
	repl:false,
	debug: false
};

var riddles = {
	0: 'riddle2',
	512 : 'riddle1',
	1023: 'riddle3'
};

function detectBoard(cb) {
	var board = new five.Board(boardConfig);
	board.on("ready", function () {
		queryBoard(this, cb);
	});
}

function analog2Id(analog) {
	var closestVal = Object.keys(riddles).reduce(function(prev, curr){
		return Math.abs(analog - prev) < Math.abs(analog - curr) ? prev : curr;
	});
	return riddles[closestVal];
}

function queryBoard(board, callback){
	new five.Pin({
		pin: 'A5',
		mode: 0,
		board:board
	}).query(function(state){
		var id = analog2Id(state.value);
		console.log('detected board with riddle: ' + id);
		callback(id, state.value);
	});
}

module.exports = detectBoard;
