var express = require('express');

var hacking_status = {
    hacking_false : 'Not trying to hack',
    hacking_ready_start: 'Hacking start waiting for confirmation',
    hacking_in_progress: 'Hacking in progress',
    hacking_wait_confirm: 'Hacking successful - waiting for final confirmation'
};

var hacking_level = {
    0: 'Easy',
    1: 'Medium',
    2: 'Hard'
};

module.exports = function hacking(eventEmitter) {
    var app = express();

    var state = {
        status: hacking_status.hacking_false,
        difficulty: hacking_level[0],
        request_parameters: '',
        ship_id: '',
    };

    function readState() {
        return {
            status: state.status,
            request_parameters: state.request_parameters,
            ship_id: state.ship_id,
        };
    }

    eventEmitter.on('ui-message', (data) => {
        data.status = newStatus,
        shipId = data.shipId || null,
        parameters = data.parameters || null,
        state.request_parameters = parameters || state.request_parameters,
        state.ship_id = shipId || state.ship_id
    });

    app.get('/data', function(req, res){
        res.json(readState());
    });

    app.post('/set_start', function(req, res){
        if (state.status == hacking_status.hacking_ready_start){
            // Open up hacking console
            eventEmmiter.emit('server-mesage',
                {
                    state: "start_hacking",
                    message: null,
                });
            state.status =  hacking_status.hacking_in_progress;
        }
        res.json(state);
    });

    app.post('/set_deny', function(req, res){
        if (state.status == hacking_status.hacking_ready_start){
            eventEmitter.emit('server-mesage',
                {
                    state: "hack_before_start",
                    message: "hacking this ship is impossible",
                });
            state.status =  hacking_status.hacking_false;
        }
        if (state.status == hacking_status.hacking_in_progress){
            eventEmitter.emit('server-mesage',
                {
                    state: "hack_before_start",
                    message: "hacking attempt was interrupted",
                });
            state.status =  hacking_status.hacking_false;
        }
        res.json(state);
    });

    app.post('/attempt_succeed', function(req, res){
        if (state.status == hacking_status.hacking_wait_confirm){
            eventEmitter.emit('server-mesage',
                {
                    state: "hacking_result",
                    message: "hacking successful",
                });
            state.status =  hacking_status.hacking_false;
        }
        res.json(state);
    });

    app.post('/attempt_partial_succeed', function(req, res){
        if (state.status == hacking_status.hacking_wait_confirm){
            eventEmitter.emit('server-mesage',
                {
                    state: "hacking_result",
                    message: "hacking partially successful",
                });
            state.status =  hacking_status.hacking_false;
        }
        res.json(state);
    });

    app.post('/attempt_fail', function(req, res){
        if (state.status == hacking_status.hacking_wait_confirm){
            eventEmmiter.emit('server-mesage',
                {
                    state: "hacking_result",
                    message: "hacking failed",
                });
            state.status =  hacking_status.hacking_false;
        }
        if (state.status == hacking_status.hacking_in_progress){
            eventEmitter.emit('server-mesage',
                {
                    state: "hack_before_start",
                    message: "hacking attempt was interrupted",
                });
            state.status =  hacking_status.hacking_false;
        }
        res.json(state);
    });
};

