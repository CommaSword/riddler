/**
 * Created by amira on 10/6/16.
 */
var five = require('johnny-five');

function readPin(board, pin){
	var p2 = new five.Pin({
		pin: pin,
		mode: 0,
		board:board
	});
	setInterval(function(){
		p2.query(function(state){
			console.log('pin',pin,'value', state.value);
		})
	}, 500);
}

require('./detect-board')(function (config, raw, board) {
	console.log('\nraw value: ' + raw + '\n');

	/*
	readPin(board,2);
	readPin(board,3);
	readPin(board,4);
	readPin(board,5);
	readPin(board,6);
	readPin(board,7);
	*/
	new five.Led({
		pin:'A3',
		board:board
	}).blink(500);
	/*


	var toggleSwitch = new five.Button({
		pin:2,
		board:board
	});
	toggleSwitch.on("press", function() {
		console.log('press!');
	});

	// "open" the switch is opened
	toggleSwitch.on("release", function() {
		console.log('release!');
	});
	*/
});
