/**
 * Created by omers on 20-5-2016.
 */

var five = require('johnny-five');

var riddle_status = {
    START : 'Start',
    BROKEN: 'Need to switch between connections',
}
var led_activate = {
    LEFT: 'Left LED',
    MIDDLE: 'Middle LED',
    RIGHT: 'Right LED'
}
module.exports = function riddle1(api, board) {

    var state = {
        status : riddle_status.START,
        current_led : led_activate.LEFT,
        good_led : led_activate.LEFT,
    };

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