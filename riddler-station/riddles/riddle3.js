/**
 * Created by omers on 20-5-2016.
 */

var five = require('johnny-five');

var riddle_status = {
    START : 'Start',
    BROKEN: 'Need to switch between connections'
};
var led_activate = {
    LEFT: 'Left LED',
    MIDDLE: 'Middle LED',
    RIGHT: 'Right LED'
};
module.exports = function riddle1(api, board) {

    var state = {
        status : riddle_status.START,
        current_led : led_activate.LEFT,
        good_led : led_activate.LEFT
    };


    var ledRed = new five.Led({
        pin:'A0',
        board:board
    });
    var ledGreen = new five.Led({
        pin:'A1',
        board:board
    });

    var ledRight = new five.Led({
        pin:'A2',
        board:board
    });

    var ledMiddle = new five.Led({
        pin:'A3',
        board:board
    });

    var ledLeft = new five.Led({
        pin:'A4',
        board:board
    });

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

    function checkLeds() {
        pairs.forEach(function (currentPair, index) {
            if ((checkPair(currentPair) == true && index != state.good_led) || (checkPair(currentPair) == false && index == state.good_led)) {
                return false
            }
        });
        return true;
    }

    api.get('/data', function (req, res) {
        res.json(state);
    });

    api.post('/set_start', function (req, res) {
        2*Math.random();
        state.status =  riddle_status.BOTH_BAD;
        calcLedsStatus();
        res.json(state);
    });

    api.post('/fix_riddle_manually', function (req, res) {
        state.status =  riddle_status.START;
        // Define good position for switches manually
        state.good_switch_red == switch_status.UP;
        state.good_switch_blue == switch_status.DOWN;
        calcLedsStatus();
        res.json(state);
    });

};