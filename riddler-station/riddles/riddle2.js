/**
 * Created by omers on 20-5-2016.
 */


var five = require('johnny-five');

var riddle_status = {
    BOTH_BAD: 'Both lights are bad',
    BLUE_GOOD: 'Blue is good',
    RED_GOOD: 'Red is good',
    BOTH_GOOD: 'Both lights are good'
}
var switch_status = {
    UP: 'Switch is Up',
    DOWN: 'Switch is Down'
}
module.exports = function riddle1(api, board) {

    var state = {
        status : riddle_status.BOTH_GOOD,
        good_switch_red : switch_status.UP,
        good_switch_blue : switch_status.DOWN,
        current_switch_red : switch_status.DOWN,
        current_switch_blue : switch_status.DOWN,
    };

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

    function redButtonPress(){
        state.current_switch_red = switch_status.UP;
        console.log('Clicked on red button! state: ', JSON.stringify(state));
        calculateStatus();
    }
    function redButtonRelease(){
        state.current_switch_red = switch_status.DOWN;
        console.log('Released red button! state: ', JSON.stringify(state));
        calculateStatus();
    }
    function blueButtonPress(){
        state.current_switch_blue = switch_status.UP;
        console.log('Clicked on blue button! state: ', JSON.stringify(state));
        calculateStatus();
    }
    function blueButtonRelease(){
        state.current_switch_blue = switch_status.DOWN;
        console.log('Released blue button! state: ', JSON.stringify(state));
        calculateStatus();
    }

    switchRed.on('press', redButtonPress);
    switchRed.on('release', redButtonRelease);
    switchBlue.on('press', blueButtonPress);
    switchBlue.on('release', blueButtonRelease);

    // Calculates if the positions of both switches are correct.
    // Changes state.status to the new status according to the switches
    function calculateStatus(){
        if ((state.current_switch_red == state.good_switch_red) && (state.current_switch_blue == state.good_switch_blue)){
            state.status = riddle_status.BOTH_GOOD
        }
        if ((state.current_switch_red != state.good_switch_red) && (state.current_switch_blue != state.good_switch_blue)){
            state.status = riddle_status.BOTH_BAD
        }
        if ((state.current_switch_red == state.good_switch_red) && (state.current_switch_blue != state.good_switch_blue)){
            state.status = riddle_status.RED_GOOD
        }
        if ((state.current_switch_red != state.good_switch_red) && (state.current_switch_blue == state.good_switch_blue)){
            state.status = riddle_status.BLUE_GOOD
        }
        // Changes LED if necessary
        if (state.status == riddle_status.BOTH_GOOD){
            ledGreen.on();
            ledRed.off();
        } else {
            ledGreen.off();
            ledRed.on();
        }
    }
    calculateStatus();

    //
    // Jsons to server
    //
    api.get('/data', function (req, res) {
        res.json(state);
    });

    api.post('/set_start_riddle', function (req, res) {
        state.status =  riddle_status.BOTH_BAD;
        // Switches the good positions for the switches to be opposite then the last positions
        if (state.good_switch_red == switch_status.DOWN){
            state.good_switch_red = switch_status.UP;
        }else{
            state.good_switch_red = switch_status.DOWN;
        }
        if (state.good_switch_blue == switch_status.DOWN){
            state.good_switch_blue = switch_status.UP;
        }else{
            state.good_switch_blue = switch_status.DOWN;
        }
        calculateStatus();
        res.json(state);
    });

    api.post('/fix_riddle_manually', function (req, res) {
        // Define good position for switches manually
        state.good_switch_red = state.current_switch_red;
        state.good_switch_blue = state.current_switch_blue;
        calculateStatus();
        res.json(state);
    });

};


