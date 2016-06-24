/**
 * Created by omers on 20-5-2016.
 */

var five = require('johnny-five');

var ledsConfig = [
    {id:0, title:'Right LED'},
    {id:1, title:'Middle LED'},
    {id:2, title:'Left LED'},
    {id:3, title:'NONE'}

];
var BAD_WIRING = 3;

module.exports = function riddle3(api, board) {
    var state = {
        good_led: 1,
        current_led: 2
    };
    function readState(){
        return {
            good_led : ledsConfig[state.good_led].title,
            current_led : ledsConfig[state.current_led].title,
            pins : JSON.stringify(pinsState.pinStatePairs),
            functional : state.good_led === state.current_led
        };
    }
    var pinsState = {
        pinStatePairs: [0, 0, 0, 0, 0, 0]
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

    function checkWires() {
        leds.forEach(function(currentLed, index) {
            if (index == state.good_led) {
                currentLed.on();
            }
            else {
                currentLed.off();
            }
        });
        pins.forEach(function (currentPin, pinIndex) {
            currentPin.query(function (pinState) {
                pinsState.pinStatePairs[pinIndex] = pinState.value;
            });
        });
        setTimeout(function(){
            if (pinsState.pinStatePairs[0] && pinsState.pinStatePairs[1]) {
                state.current_led = 2;
            } else if (pinsState.pinStatePairs[2] && pinsState.pinStatePairs[3]) {
                state.current_led = 1;
            } else if (pinsState.pinStatePairs[4] && pinsState.pinStatePairs[5]) {
                state.current_led = 0;
            } else {
                state.current_led = BAD_WIRING;
            }
            if (readState().functional) {
                ledGreen.on();
                ledRed.off();
            } else {
                ledGreen.off();
                ledRed.on();
                false && buzzer.play({
                    tempo: 150, // Beats per minute, default 150
                    song: [ // An array of notes that comprise the tune
                        ["c1", 1],
                        ["e4", 2],
                        ["g4", 3],
                        ["d9", 4] // null indicates "no tone" for the beats indicated
                    ]
                });
            }
        }, 100);
    }


    setInterval(function() {
        checkWires();
    }, 500);

    api.get('/data', function (req, res) {
        res.json(readState());
    });

    api.post('/set_start', function (req, res) {
        // state.status =  riddle_status.BROKEN;
        // Change state for good place
        if (state.current_led !== BAD_WIRING) {
            state.good_led = (state.current_led + Math.floor(Math.random() +1.5)) % 3;
        }
        checkWires();
        res.json(readState());
    });

    api.post('/fix_riddle_manually', function (req, res) {
        // Define good position for switches manually
        if (state.current_led !== BAD_WIRING) {
            state.good_led = state.current_led;
        }
        res.json(readState());
    });
};
