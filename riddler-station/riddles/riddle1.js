/**
 * Created by amira on 17/5/16.
 */
var five = require('johnny-five');

module.exports = function riddle1(api, board){

	var interval = 1;

	var state = {
		timeout_value: 3,
		time_since_press: 0
	};

	function readState(){
		return {
			timeout_value : state.timeout_value,
			time_since_press : state.time_since_press,
			functional : state.time_since_press < state.timeout_value
		};
	}
	var button = new five.Button({
		pin:10,
		board:board
	});
	var red = new five.Led({
		pin:8,
		board:board
	});
	var green = new five.Led({
		pin:9,
		board:board
	});

	function reset(){
		state.time_since_press = 0;
		console.log('Click! state: ', JSON.stringify(state));
		calcLedsStatus();
	}
	button.on('press', reset);
	button.on('hold', reset);

	function calcLedsStatus(){
		if (readState().functional) {
			red.off();
			green.on();
		} else {
			red.on();
			green.off();
		}
	}

	calcLedsStatus();
	setInterval(function() {
		state.time_since_press = state.time_since_press + interval;
		console.log('Tick! state: ', JSON.stringify(state));
		calcLedsStatus();
	}, interval * 1000);


	api.get('/data', function (req, res) {
		res.json(readState());
	});

	api.post('/timeout_value', function (req, res) {
		console.log('set_timeout_value', req.rawBody);
		if (req.rawBody.match(/^\d+$/)) {
			state.timeout_value = parseInt(req.rawBody);
			calcLedsStatus();
		}
		res.json(readState());
	});

	api.post('/time_since_press', function (req, res) {
		console.log('set_time_since_press', req.rawBody);
		if (req.rawBody.match(/^\d+$/)) {
			state.time_since_press = parseInt(req.rawBody);
			calcLedsStatus();
		}
		res.json(readState());
	});
};
