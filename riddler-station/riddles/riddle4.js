/**
 * Created by omers on 20-5-2016.
 */

var five = require('johnny-five');

var riddle_type = {
    RIDDLE_NONE: 'No riddle is activated',
    RIDDLE_SIMPLE: 'Simple riddle is activated',
    RIDDLE_COMPLEX: 'Complex riddle is activated',
}
var simple_riddle_status = {
    START: 'Simple riddle has started',
    SWITCH_DOWN: 'User pressed the switch down',
    BUTTON_PRESSED: 'User pressed the red button down enough time',
}
var complex_riddle_status = {
    START: 'Riddle has not started',
    SWITCH_DOWN: 'User pressed the switch down',
    RIDDLE_COMPLEX: 'Complex riddle is activated',
}
var switch_status = {
    UP: 'Switch is Up',
    DOWN: 'Switch is Down'
}
var button_pressed = {
    PRESSED: 'Switch is Up',
    NOT_PRESSED: 'Switch is Down'
}

module.exports = function riddle1(api, board) {

    var state = {
        type: riddle_type.RIDDLE_NONE,
        simple_status: simple_riddle_status.START,
        complex_status: complex_riddle_status.START
    };

    // Physical Objects
    var ledRed = new five.Led({
        pin:'A0',
        board:board
    });
    var ledGreen = new five.Led({
        pin:'A1',
        board:board
    });
    var switchBlue = new five.Button({
        pin:'A2',
        board:board
    });
    var switchRed = new five.Button({
        pin:'A3',
        board:board
    });

    //
    // Functions
    //

    // function SimpleCalculateStatus() {
    //     if ((state.current_switch_red == state.good_switch_red) && (state.current_switch_blue == state.good_switch_blue)) {
    //         state.status = riddle_status.BOTH_GOOD
    //     }
    // }
    // SimpleCalculateStatus()





    //
    // Jsons to server
    //

    api.get('/data', function (req, res) {
        res.json(state);
    });

    api.post('/set_start_simple', function (req, res) {
        state.type = riddle_type.RIDDLE_SIMPLE;
        state.simple_status = simple_riddle_status.START;
        res.json(state);
    });

    api.post('/set_start_complex', function (req, res) {
        state.type = riddle_type.RIDDLE_COMPLEX;
        state.complex_status = complex_riddle_status.START;
        res.json(state);
    });

}