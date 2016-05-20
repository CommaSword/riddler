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
    0: 'Left LED',
    1: 'Middle LED',
    2: 'Right LED'
};
module.exports = function riddle1(api, board) {
    interval = 1;
    var state = {
        status: riddle_status.START,
        place: 1,
        good_led: led_activate[2],
        current_led: led_activate[1]
    };

    var pinsState = {
        pinStatePairs: [0, 0, 0]
    };

    var buzzer = new five.Piezo({
        pin : 11,
        board: board
    });

    var ledRed = new five.Led({
        pin: 'A0',
        board: board
    });
    var ledGreen = new five.Led({
        pin: 'A1',
        board: board
    });

    leds = [];
    for (i = 8; i < 11; i++) {
        leds.push(new five.Led({
            pin: i,
            board: board
        }));
    }
    pins = [];
    pairs = [[],[],[]];
    for (i = 2; i < 8; i++) {
        pins.push(new five.Pin({
            pin: i,
            mode: 0
        }));
        switch (i) {
            case 2: pairs[0].push(pins[i - 2]); break;
            case 3: pairs[0].push(pins[i - 2]); break;
            case 4: pairs[1].push(pins[i - 2]); break;
            case 5: pairs[1].push(pins[i - 2]); break;
            case 6: pairs[2].push(pins[i - 2]); break;
            case 7: pairs[2].push(pins[i - 2]); break;
        }
    }


    function checkWires() {
        var success = false;
        if ((pinsState.pinStatePairs[0] == 1) && (pinsState.pinStatePairs[1] == 1) && state.good_led == led_activate[0]) {
            state.current_led = led_activate[0];
            state.status = riddle_status.SUCCESS;
            success = true;
            buzzer.noTone();
        }
        else if ((pinsState.pinStatePairs[2] == 1) && (pinsState.pinStatePairs[3] == 1) && state.good_led == led_activate[1]) {
            state.status = riddle_status.SUCCESS;
            state.current_led = led_activate[1];
            success = true;
            buzzer.noTone();
        }
        else if ((pinsState.pinStatePairs[4] == 1) && (pinsState.pinStatePairs[5] == 1) && state.good_led == led_activate[2]) {
            state.status = riddle_status.SUCCESS;
            state.current_led = led_activate[2];
            success = true;
            buzzer.noTone();
        }
        else {
            state.status = riddle_status.BROKEN;
            buzzer.play({
                tempo: 150, // Beats per minute, default 150
                song: [ // An array of notes that comprise the tune
                    [ "c4", 1 ],
                    [ "e4", 2 ],
                    [ "g4", 3 ],
                    [ "d4", 4 ] // null indicates "no tone" for the beats indicated
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

    pins.forEach(function (currentPin, pinIndex) {
        currentPin.on('data', function (pinState) {
            switch (pinIndex) {
                case 0: pinsState.pinStatePairs[0] = pinState.value; break;
                case 1: pinsState.pinStatePairs[0] = pinState.value; break;
                case 2: pinsState.pinStatePairs[1] = pinState.value; break;
                case 3: pinsState.pinStatePairs[1] = pinState.value; break;
                case 4: pinsState.pinStatePairs[2] = pinState.value; break;
                case 5: pinsState.pinStatePairs[2] = pinState.value; break;
            }
        });
    });

    setInterval(function() {
        checkWires();
        checkLeds();
        checkInterval();
    }, interval * 500);

    api.get('/data', function (req, res) {
        res.json(state);
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
    });

    api.post('/fix_riddle_manually', function (req, res) {
        // Define good position for switches manually
        state.status =  riddle_status.SUCCESS;
        state.good_led = state.current_led;
        res.json(state);
    });

};
