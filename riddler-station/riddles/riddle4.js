/**
 * Created by amira on 17/5/16.
 */
var five = require('johnny-five');

var BLINK_INTERVAL = 500;

var riddle_status = {
	START: 'Initial state',
	SIMPLE: 'Broken - simple mode',
	COMPLEX: 'Broken - complex mode',
	SUCCESS: 'Fixed'
};

var switch_status = {
	ON: 'Switch is up',
	OFF: 'Switch is down'
};

var led_status = {
	ON: 'LED is on',
	OFF: 'LED is off',
	BLINKING: 'LED is blinking'
};

var led_array = {
	0: 'Green LED',
	1: 'Red LED',
	2: 'Blue LED'
};

module.exports = function riddle4(api, board){

	var state = {
		status: riddle_status.START,
	    state_button: switch_status.ON,
		push_button: switch_status.OFF,
		leds: {'GREEN': led_status.ON, 'RED': led_status.OFF, 'BLUE': led_status.OFF}
	};

	var leds = {};
	leds['RED'] = new five.Led({
		pin: 13,
		board: board
	});
	//Green LED
	leds['GREEN'] = new five.Led({
		pin: 12,
		board: board
	});
	//Blue LED
	leds['BLUE'] = new five.Led({
		pin: 2,
		board: board
	});

	var pushButton = new five.Button({
		pin: 3,
		holdtime: 10000,
		board: board
	});

	var stateButton = new five.Button({
		pin: 4,
		board: board
	});

	var buzzer = new five.Piezo({
		pin: 11,
		board: board
	});

	function setLeds(array_state) {
		Object.keys(leds).forEach(function (led, idx){
			if (array_state[idx] == led_status.ON){
				leds[led].on();
				state.leds[led] = led_status.ON
			} else if (array_state[idx] == led_status.BLINKING){
				leds[led].blink(BLINK_INTERVAL);
				state.leds[led] = led_status.BLINKING
			} else {
				leds[led].off();
				state.leds[led] = led_status.OFF
			}
		})
	}

	function stateButtonPress() {
		state.stateButton = switch_status.OFF;
		if (state.status === riddle_status.SIMPLE) {
			setLeds([led_status.OFF, led_status.OFF, led_status.ON])
		} else if (state.status === riddle_status.COMPLEX) {
			setLeds([led_status.OFF, led_status.ON, led_status.OFF])
		} else {
			setLeds([led_status.OFF, led_status.OFF, led_status.OFF])
		}
	}

	function stateButtonRelease() {
		state.state_button = switch_status.ON;
		if ((state.status === riddle_status.START) || (state.status === riddle_status.SUCCESS){
			setLeds([led_status.ON, led_status.OFF, led_status.OFF])
		}
		else {
			setLeds([led_status.OFF, led_status.ON, led_status.OFF])
		}
	}

	function pushButtonHold() {
		state.push_button = switch_status.ON;
		if (state.status === riddle_status.SIMPLE) {
			setLeds([led_status.OFF, led_status.OFF, led_status.BLINKING])
		} else if (state.status === riddle_status.COMPLEX) {
			buzzer.play({
				tempo: 150, // Beats per minute, default 150
				song: [ // An array of notes that comprise the tune
					[ "c1", 1 ],
					[ "e4", 2 ],
					[ "g4", 3 ],
					[ "d9", 4 ] // null indicates "no tone" for the beats indicated
				]
			});
		}
	}

	function pushButtonRelease() {
		state.push_button = switch_status.OFF;
		buzzer.stop()
		if (state.status === riddle_status.SIMPLE) {
			setLeds([led_status.OFF, led_status.OFF, led_status.ON])
		} else if (state.status === riddle_status.COMPLEX) {
			setLeds([led_status.OFF, led_status.ON, led_status.OFF])
		}
	}




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
};
