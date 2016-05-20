/**
 * Created by omers on 20-5-2016.
 */

var five = require('johnny-five');

var riddle_status = {
    START : 'Start',
    BROKEN: 'Switch Connections'
}
var led_activate = {
    0: 'Left LED',
    1: 'Middle LED',
    2: 'Right LED'
}
module.exports = function riddle3(api, board) {

    var state = {
        status : riddle_status.START,
        place : 1,
        current_led : led_activate[1],
        good_led : led_activate[1]
    };

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
        res.json(state);
    });

    api.post('/fix_riddle_manually', function (req, res) {
        state.status =  riddle_status.START;
        state.good_led = state.current_led;
        res.json(state);
    });

};