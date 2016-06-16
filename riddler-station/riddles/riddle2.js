/**
 * Created by omers on 20-5-2016.
 */
var five = require('johnny-five');

var riddle_status = {
    START : 'Start',
    BOTH_BAD: 'Both lights are bad',
    BLUE_GOOD: 'Blue is good',
    RED_GOOD: 'Red is good',
    BOTH_GOOD: 'Both lights are good'
};
var switch_status = {
    UP: 'Switch is Up',
    DOWN: 'Switch is Down'
};
module.exports = function riddle2(api, board) {

    var state = {
        status : riddle_status.START,
        good_switch_red : switch_status.UP,
        good_switch_blue : switch_status.DOWN,
        current_switch_red : switch_status.DOWN,
        current_switch_blue : switch_status.DOWN,
       // code_to_enter: 103856,
      //  keys_pressed: 0,
    };

    function readState(){
        return {
            status : state.status,
            good_switch_red : state.good_switch_red,
            good_switch_blue : state.good_switch_blue,
            current_switch_red : state.current_switch_red,
            current_switch_blue : state.current_switch_blue,
            functional : state.status == riddle_status.BOTH_GOOD
        };
    }

    interval = 1;
    var ledRed = new five.Led({
        pin:'A0',
        board:board
    });
    var ledGreen = new five.Led({
        pin:'A1',
        board:board
    });

    var switchRed = new five.Button({
        pin:'A3',
        board:board
    });
    var switchBlue = new five.Button({
        pin:'A2',
        board:board
    });

    switchRed.on('press', function(){
        state.current_switch_red = switch_status.UP;
        console.log('Clicked on red button! state: ', JSON.stringify(state));
        calcSwitchesStatus();
    });
    switchRed.on('release', function(){
        state.current_switch_red = switch_status.DOWN;
        console.log('Released red button! state: ', JSON.stringify(state));
        calcSwitchesStatus();
    });
    switchBlue.on('press', function(){
        state.current_switch_blue = switch_status.UP;
        console.log('Clicked on blue button! state: ', JSON.stringify(state));
        calcSwitchesStatus();
    });
    switchBlue.on('release', function(){
        state.current_switch_blue = switch_status.DOWN;
        console.log('Released blue button! state: ', JSON.stringify(state));
        calcSwitchesStatus();
    });


    function calcLedsStatus(){
        if (readState().functional){
            ledGreen.on();
            ledRed.off();
        } else {
            ledGreen.off();
            ledRed.on();
        }
    }

    // Calculates if the positions of both switches are correct.
    // Changes state.status to the new status according to the switches
    function calcSwitchesStatus(){
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
        calcLedsStatus();
    }
    calcSwitchesStatus();

    //
    // Json's to server
    //

    api.get('/data', function (req, res) {
        res.json(readState());
    });

    api.post('/set_start', function (req, res) {
        state.status =  riddle_status.BOTH_BAD;
        state.keys_pressed = 0;
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
        calcSwitchesStatus();
        res.json(readState());
    });

    api.post('/fix_riddle_manually', function (req, res) {
        state.status =  riddle_status.START;
        state.good_switch_red = state.current_switch_red;
        state.good_switch_blue = state.current_switch_blue;
        calcSwitchesStatus();
        res.json(readState());
    });
};


