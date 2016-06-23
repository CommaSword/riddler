/**
 * Created by amira on 17/5/16.
 */
var five = require('johnny-five');

var BLINK_INTERVAL = 500;

var riddle_status = {
	START: 'Initial state',
	SIMPLE_START: 'Simple mode - started',
    SIMPLE_SWITCH: 'Simple mode - switch down',
    SIMPLE_PUSH: 'Simple mode - button press',
    SIMPLE_FINISH: 'Simple mode - button hold - ready for power up',

	COMPLEX_START: 'Complex  mode - started',
    COMPLEX_SWITCH_ONLY: 'Complex  - switch is down',
    COMPLEX_CABLES_ONLY: 'Complex  - switch up and cables out',
    COMPLEX_CABLES_SWITCH_INCORRECT: 'Complex  - cables out before switch down',
    COMPLEX_CABLES_SWITCH_CORRECT: 'Complex  - switch down before cables',
    COMPLEX_CABLES_BAD_SWITCH: 'Complex  - switch down, cables out then switch up',
    COMPLEX_FINISH: 'Complex  - ready for power up',
};

var switch_status = {
	ON: 'Switch is up - Red switch == 1',
	OFF: 'Switch is down - Red switch == 0',
    HOLD: 'Switch is holding - Red switch == 1'
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
	    switch_button: switch_status.ON,
		push_button: switch_status.OFF,
		leds: {'GREEN': led_status.OFF, 'RED': led_status.OFF, 'BLUE': led_status.OFF},
        //cables: {5,6,7,8,9,10}
	};

	function readState(){
		return {
			status: state.status
		};
	}

    // Defining hardware
	var leds = {};
    leds['RED'] = new five.Led({
		pin: 12,
		board: board
	});
	//Green LED
    leds['GREEN'] = new five.Led({
		pin: 13,
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

    var switchButton = new five.Button({
        pin: 4,
        board: board
    });

	var buzzer = new five.Piezo({
		pin: 11,
		board: board
	});


    // pins for cables
    var pinsState = {
        5:1,
        6:1,
        7:1,
        8:1,
        9:1,
        10:1,
    };
    var pins = [];
    for (var i = 0; i < 6; i++) {
        pins.push(new five.Pin({
            pin: i + 5,
            mode: 0
        }));
        pins[i].read(function(error, value){
            calculateAll();
        });
    }

    var time = 1;

    function checkSetPins() {
        // Checks and sets the pins states that the cable connect to.
        // If the cable is connected to the board then the relevant pin's pinState will be 1, else pinState = 0
        pins.forEach(function (currentPin, pinNumber) {
            currentPin.query(function (pinState) {
                pinsState[pinNumber] = pinState.value;
            });
        });
    }

    function checkConnectedWires() {
        // Return an array with cables that are still connected
        checkSetPins();
        connected = [];
        // Checks if any of the cables have been disconnected
        Object.keys(pinsState).forEach(function(pinId){
            var pinVal = pinsState[pinId];
            if (pinVal == 1){
                connected.append(pinId)
            }
        });
        return connected;
    }

	function setLeds(array_state) {
		Object.keys(leds).forEach(function (led, idx){
			if (array_state[idx] == led_status.ON){
                leds[led].stop().on();
				state.leds[led] = led_status.ON
			} else if (array_state[idx] == led_status.BLINKING){
                leds[led].stop().blink(BLINK_INTERVAL);
				state.leds[led] = led_status.BLINKING
			} else {
                leds[led].stop().off();
				state.leds[led] = led_status.OFF
			}
		})
	}

    //
    // switchButton and pushButton functions
    //
	function switchButtonPress() {
        // switchButton = 0, start handling the riddle
		if (state.status == riddle_status.SIMPLE_START) {
            state.status = riddle_status.SIMPLE_SWITCH;
        }

        // if (state.status == riddle_status.COMPLEX_START) {
        //     state.status = riddle_status.COMPLEX_SWITCH_ONLY;
        // } else if (state.status == riddle_status.COMPLEX_CABLES_ONLY) {
        //     state.status = riddle_status.COMPLEX_CABLES_SWITCH_INCORRECT;
        // } else if (state.status == riddle_status.COMPLEX_CABLES_BAD_SWITCH) {
        //     state.status = riddle_status.COMPLEX_CABLES_SWITCH_CORRECT;
        // } else if (state.status == riddle_status.START) {
        //     state.status = riddle_status.COMPLEX_FINISH;
        // }
	}

	function switchButtonRelease() {
        // switchButton = 1, riddle finished or can't start
        buzzer.stop();
        if (state.status == riddle_status.SIMPLE_SWITCH) {
            state.status = riddle_status.SIMPLE_START;
        }else if (state.status == riddle_status.SIMPLE_PUSH) {
            state.status = riddle_status.SIMPLE_START;
        }else if (state.status == riddle_status.SIMPLE_FINISH) {
            state.status = riddle_status.START
        }

        // if (state.status == riddle_status.COMPLEX_SWITCH_ONLY) {
        //     state.status = riddle_status.COMPLEX_START;
        // } else if (state.status == riddle_status.COMPLEX_CABLES_SWITCH_INCORRECT) {
        //     state.status = riddle_status.COMPLEX_CABLES_ONLY;
        // } else if (state.status == riddle_status.COMPLEX_CABLES_SWITCH_CORRECT) {
        //     state.status = riddle_status.COMPLEX_CABLES_BAD_SWITCH;
        // } else if (state.status == riddle_status.COMPLEX_FINISH) {
        //     state.status = riddle_status.START;
        // }
	}

	function pushButtonPress() {
        // Red button is pressed - do not care if holding it or not
        state.push_button = switch_status.ON;
        if (state.status == riddle_status.SIMPLE_START) {
            playBuzzer();
        }else if (state.status == riddle_status.SIMPLE_SWITCH) {
            state.status = riddle_status.SIMPLE_PUSH;
        }else if (state.status == riddle_status.SIMPLE_FINISH) {
            return;
        }

        if (!isRiddleSimple()) {
            playBuzzer();
        }
	}

	function pushButtonHold() {
        // Red button was held for 10 whole seconds
		state.push_button = switch_status.HOLD;
        if (state.status == riddle_status.SIMPLE_START) {
            playBuzzer();
        // }
        // else if (state.status == riddle_status.SIMPLE_SWITCH) {
        //     state.status = riddle_status.SIMPLE_FINISH;
        }else if (state.status == riddle_status.SIMPLE_PUSH) {
            state.status = riddle_status.SIMPLE_FINISH;
        }
        // else if (state.status == riddle_status.SIMPLE_FINISH) {
        //     return;
        // }

        if (!isRiddleSimple()) {
            playBuzzer();
            return;
        }
	}

	function pushButtonRelease() {
        // Red button is released
		state.push_button = switch_status.OFF;
		buzzer.stop();
        if (state.status == riddle_status.SIMPLE_START) {
            return;
        }else if (state.status == riddle_status.SIMPLE_SWITCH) {
            return;
        }else if ((state.status == riddle_status.SIMPLE_PUSH) && (state.switch_button == switch_status.OFF) ){
            state.status = riddle_status.SIMPLE_SWITCH;
        }else if (state.status == riddle_status.SIMPLE_FINISH) {
            return;
        }
	}

    function playBuzzer(){
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

    function isRiddleSimple(){
        // returns true if the riddle type is simple
        if ((state.status == riddle_status.SIMPLE_FINISH) || (state.status == riddle_status.SIMPLE_PUSH) ||
            (state.status == riddle_status.SIMPLE_START) || (state.status == riddle_status.SIMPLE_SWITCH)){
            return true;
        }else{
            return false;
        }
    }

    function calculateAll(){
        // Calculate all of the states from scratch
        // var connectedWires = checkConnectedWires();
        // Make sure all wires are connected in simple riddle
        // if ((connectedWires.length < 6) && (isRiddleSimple()) ){
        //     playBuzzer();
        //     return
        // }

        calculateSwitch();
        //console.info(state.status);
        //console.info(leds['BLUE'].value);

        if (state.status == riddle_status.START) {
            setLeds([led_status.OFF, led_status.OFF, led_status.OFF]);
            setLeds([led_status.OFF, led_status.ON, led_status.OFF]);
            
        }else if (state.status == riddle_status.SIMPLE_START) {
            setLeds([led_status.OFF, led_status.OFF, led_status.OFF]);
            setLeds([led_status.ON, led_status.OFF, led_status.OFF]);

        }else if (state.status == riddle_status.SIMPLE_SWITCH){
            setLeds([led_status.OFF, led_status.OFF, led_status.OFF]);
            setLeds([led_status.ON, led_status.OFF, led_status.OFF]);

        }else if (state.status == riddle_status.SIMPLE_PUSH) {
            if (state.leds['BLUE'] != led_status.BLINKING){
                setLeds([led_status.ON, led_status.OFF, led_status.BLINKING]);
            }
        }else if (state.status == riddle_status.SIMPLE_FINISH) {
            setLeds([led_status.OFF, led_status.OFF, led_status.OFF]);
            setLeds([led_status.ON, led_status.OFF, led_status.ON]);
        }

        // if ((state.status == riddle_status.COMPLEX_CABLES_ONLY)||(state.status == riddle_status.COMPLEX_CABLES_SWITCH_INCORRECT)
        //     || (state.status == riddle_status.COMPLEX_CABLES_BAD_SWITCH)) {
        //     playBuzzer();
        //     setLeds([led_status.OFF, led_status.OFF, led_status.OFF]);
        //     setLeds([led_status.OFF, led_status.ON, led_status.OFF]);
        //
        // } else if (state.status == riddle_status.COMPLEX_CABLES_SWITCH_CORRECT) {
        //     setLeds([led_status.OFF, led_status.OFF, led_status.OFF]);
        //     setLeds([led_status.OFF, led_status.OFF, led_status.BLINKING]);
        //
        // } else if ((state.status == riddle_status.COMPLEX_START) || (state.status == riddle_status.COMPLEX_SWITCH_ONLY)){
        //     // No buzzer
        //     setLeds([led_status.OFF, led_status.OFF, led_status.OFF]);
        //     setLeds([led_status.OFF, led_status.ON, led_status.OFF]);
        //
        // } else if (state.status == riddle_status.COMPLEX_FINISH) {
        //     setLeds([led_status.OFF, led_status.OFF, led_status.OFF]);
        //     setLeds([led_status.OFF, led_status.OFF, led_status.ON]);
        // }

        // if ((connectedWires.length < 6) && (isRiddleSimple()) ) {
        //     playBuzzer();
        // }
    }

    function calculateSwitch(){
        if (switchButton.value == 1){
            state.switch_button = switch_status.ON;
            switchButtonRelease();
        }else{
            state.switch_button = switch_status.OFF;
            switchButtonPress();
        }
    }

    //
    // Buttons actions - pushButton and switchButton
    //
    pushButton.on('press', function(){
        pushButtonPress();
        calculateAll();
    });

    pushButton.on('release', function(){
        pushButtonRelease();
        calculateAll();
    });

    pushButton.on('hold', function(){
        pushButtonHold();
        calculateAll();
    });

    switchButton.on('press', function(){
        calculateAll();
    });

    switchButton.on('release', function(){
        calculateAll();
    });


    //
    // Action from master desk
    //

    api.get('/data', function (req, res) {
		//console.log('/data');
        res.json(readState());
    });

    api.post('/set_start_simple', function (req, res) {
		state.status = riddle_status.SIMPLE_START;
        calculateAll();
        res.json(readState());
    });

    api.post('/fix_riddle_manually', function (req, res) {
		// Define good position for switches manually
        state.status = riddle_status.START;
        calculateAll();
        res.json(readState());
    });

};
