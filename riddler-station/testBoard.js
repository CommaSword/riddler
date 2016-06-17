/**
 * Created by amira on 10/6/16.
 */
var five = require('johnny-five');

require('./detect-board')(function (config, raw, board) {
	console.log('\nraw value: ' + raw + '\n');
	/*
	var p = new five.Pin({
		pin: 2,
		mode: 0,
		board:board
	});

	setInterval(function(){
		p.query(function(state){
			console.log('\n\n##################value in pin is (raw:'+state.value+')\n\n');
		//	process.exit(0);
		})
	}, 500);
	*/
	new five.Led({
		pin:10,
		board:board
	}).blink(500);

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
});
