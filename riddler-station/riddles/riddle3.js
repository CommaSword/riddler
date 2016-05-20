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

    var state = {
        status : riddle_status.START,
        place : 1,
        current_led : led_activate[1],
        good_led : led_activate[1]
    };


    var ledRed = new five.Led({
        pin:'A0',
        board:board
    });
    var ledGreen = new five.Led({
        pin:'A1',
        board:board
    });

    leds = [];
    leds.push(new five.Led({
        pin:'A2',
        board:board
    }));
    leds.push(new five.Led({
        pin:'A3',
        board:board
    }));
    leds.push(new five.Led({
        pin:'A4',
        board:board
    }));
    pins = [];
    pairs = [[],[],[]];
    for (i = 2; i < 7; i++) {
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

    function checkPair(pair) {
        numOfPinsConnected = 0;
        pair.forEach(function (currentPin, index) {
            currentPin.query(function (state) {
                numOfPinsConnected += state.value;
            });
        });
        return (numOfPinsConnected == 2);
    }

    function checkWires() {
        var success = true;
        pairs.forEach(function (currentPair, index) {
            if (checkPair(currentPair) == true) {
                state.current_led = led_activate[index]
            }
            if ((checkPair(currentPair) == true && led_activate[index] != state.good_led) || (checkPair(currentPair) == false && led_activate[index] == state.good_led)) {
                leds[index].off();
                success = false;
            }
        });
        return success;
    }

    function checkLeds() {
        leds.forEach(function(currentLed, index) {
            if (led_activate[index] == state.current_led) {
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
        state.status =  riddle_status.START;
        // Define good position for switches manually
        state.status =  riddle_status.START;
        state.good_led = state.current_led;
        res.json(state);
    });

};
