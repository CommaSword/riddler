/**
 * Created by amira on 17/5/16.
 */
var five = require('johnny-five');

module.exports = function riddle3(api, board){

	var interval = 1;

	var keypad = new five.Keypad({
		controller : '3X4_I2C_NANO_BACKPACK',
		board:board
	});

	["change", "press", "hold", "release"].forEach(function(eventType) {
		keypad.on(eventType, function (data) {
			console.log("Event: %s, Target: %s", eventType, data.which);
		});
	});

	pins = []
	for (i = 2; i < 8; i++) {
		pins.push(five.Pin({
			pin: i,
			mode: 0
		}))
	}
	pins.forEach(function (currentPin, pinIndex) {
		currentPin.on('data', function (pinState) {
			console.log("pin ", pinIndex, " is ", pinState.value);
		});
	});
};
