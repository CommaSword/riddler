/**
 * Created by omers on 20-5-2016.
 */

var five = require('johnny-five');

var riddle_status = {
    START : 'Start',
    BROKEN: 'Switch Connections',
    SUCCESS: 'Connections Correct'
};
var led_activate = {
    0: 'Right LED',
    1: 'Middle LED',
    2: 'Left LED'
};
module.exports = function riddle3(api, board) {
    var state = {
        status: riddle_status.START,
        place: 1,
        good_led: led_activate[0],
        current_led: led_activate[0]
    };
    function readState(){
        return {
            status : state.status,
            place : state.place,
            good_led : state.good_led,
            current_led : state.current_led,
            functional : state.status === riddle_status.SUCCESS
        };
    }
    var pinsState = {
        pinStatePairs: [0, 0, 0,0, 0, 0]
    };

    var buzzer = new five.Piezo({
        pin : 11,
        board: board
    });

    var ledRed = new five.Led({
        pin: 'A3',
        board: board
    });
    var ledGreen = new five.Led({
        pin: 'A4',
        board: board
    });

    var leds = [];
    leds.push(new five.Led({
        pin: 12,
        board: board
    }));
    leds.push(new five.Led({
        pin: 10,
        board: board
    }));
    leds.push(new five.Led({
        pin: 9,
        board: board
    }));

    var pins = [];
    for (var i = 0; i < 6; i++) {
        pins.push(new five.Pin({
            pin: i + 2,
            mode: 0
        }));
    }

    function checkPins() {
        pins.forEach(function (currentPin, pinIndex) {
            currentPin.query(function (pinState) {
                pinsState.pinStatePairs[pinIndex] = pinState.value;
            });
        });
    }


    function checkWires() {
        var success = false;
        if ((pinsState.pinStatePairs[0] == 1) && (pinsState.pinStatePairs[1] == 1)) {
            state.current_led = led_activate[2];
            if (state.good_led == led_activate[2]) {
                state.status = riddle_status.SUCCESS;
                success = true;
                buzzer.noTone();
            }
        }
        else if ((pinsState.pinStatePairs[2] == 1) && (pinsState.pinStatePairs[3] == 1)) {
            state.current_led = led_activate[1];
            if (state.good_led == led_activate[1]) {
                state.status = riddle_status.SUCCESS;
                success = true;
                buzzer.noTone();
            }
        }
        else if ((pinsState.pinStatePairs[4] == 1) && (pinsState.pinStatePairs[5] == 1)) {
            state.current_led = led_activate[0];
            if (state.good_led == led_activate[0]) {
                state.status = riddle_status.SUCCESS;
                success = true;
                buzzer.noTone();
            }

        }
        else {
            state.current_led = led_activate[2];
            state.status = riddle_status.BROKEN;
        }
        if (!success) {
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
        return success;
    }

    function checkLeds() {
        leds.forEach(function(currentLed, index) {
            if (led_activate[index] == state.good_led) {
                currentLed.on();
            }
            else {
                currentLed.off();
            }
        });
    }

    function checkInterval() {
        if (checkWires() == true) {
            state.status = riddle_status.SUCCESS;
            ledGreen.on();
            ledRed.off();
        }
        else {
            state.status = riddle_status.BROKEN;
            ledGreen.off();
            ledRed.on();
        }
    }

    setInterval(function() {
        checkPins();
        checkWires();
        checkLeds();
        checkInterval();
    }, 500);

    api.get('/data', function (req, res) {
        res.json(readState());
    });

    api.post('/set_start', function (req, res) {
        state.status =  riddle_status.BROKEN;
        // Change state for good place
        if (Math.random()<0.5){
            state.place = (state.place + 1) % 3;
        }else{
            state.place = (state.place + 2) % 3;
        }
        state.good_led = led_activate[state.place];
        res.json(readState());
    });

    api.post('/fix_riddle_manually', function (req, res) {
        // Define good position for switches manually
        state.status =  riddle_status.SUCCESS;
        state.good_led = state.current_led;
        res.json(readState());
    });
};
