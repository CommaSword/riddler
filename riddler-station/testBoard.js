/**
 * Created by amira on 10/6/16.
 */
var five = require('johnny-five');

require('./detect-board')(function (config, raw, board) {
	console.log('\nraw value: ' + raw + '\n');
	new five.Pin({
		pin: 7,
		mode: 0,
		board:board
	}).query(function(state){
		console.log('\n\n##################value in pin is (raw:'+state.value+')\n\n');
		process.exit(0);
	});
});
