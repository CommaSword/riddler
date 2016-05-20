
var five = require('johnny-five');

module.exports = function testId(api, board){
	var pin = new five.Pin({
		pin: 'A0',
		mode: 0,
		board:board
	});
	setInterval(function() {
		pin.query(function(state){
			//console.log('val', state.value);
		});
	}, 1000);

	for (var n = 0; n < 32; n++){
		var ratio = n / (32 - n);
		console.log('for value', 32 * n, 'use ratio', ratio);
	}
};