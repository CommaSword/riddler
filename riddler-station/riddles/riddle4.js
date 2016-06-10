/**
 * Created by amira on 17/5/16.
 */
var five = require('johnny-five');

module.exports = function riddle4(api, board){

	var interval = 1;
	state = {
		pinStates : 0
	};

	var pin = five.Pin({
			pin: 9,
			mode: 0
		});


	setInterval(function() {
		pin.query(function (pinState) {
			state.pinStates += pinState.value;
		});
	}, interval * 10);

	setInterval(function() {
		state.pinStates /= 10;
		console.log("pin state is ", state.pinStates);
	}, interval * 1000)


	return {};
};
