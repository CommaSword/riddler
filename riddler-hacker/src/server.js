var express = require('express');

// var hacking_status = {
//     hackingWelcome: 'Welcome screen',
//     hackingPreHack : 'Not trying to hack',
//     hackingWaitingForHack: 'Hacking start waiting for confirmation',
//     hackingInProgress: 'Hacking in progress',
//     hackingWaitConfirm: 'Hacking successful - waiting for final confirmation'
// };

var hacking_level = {
    0: 'Easy',
    1: 'Medium',
    2: 'Hard'
};

module.exports = function hacking(eventEmitter) {
    var app = express();

    var state = {
        status: '',
        difficulty: hacking_level[0],
        request_details: '',
        ship_id: '',
    };

    function readState() {
        return {
            status: state.status,
            request_details: state.request_details,
            ship_id: state.ship_id,
        };
    }

    eventEmitter.on('ui-message', (data) => {
        var newStatus = data.status;
        var newShipId = data.shipId || null;
        var newDetails = data.details || null;
        state.request_details = newDetails || state.request_details;
        state.ship_id = newShipId || state.ship_id;
    });

    app.get('/data', function(req, res){
        res.json(readState());
    });

    app.post('/set_start', function(req, res){
        eventEmmiter.emit('server-mesage',
            {
                state: "hackStart",
            });
        res.json(state);
    });

    app.post('/set_deny', function(req, res){
        eventEmitter.emit('server-mesage',
            {
                state: "hackDeny",
            });
        res.json(state);
    });

    app.post('/attempt_succeed', function(req, res){
        eventEmitter.emit('server-mesage',
            {
                state: "hackSuccessful",
            });
        res.json(state);
    });

    app.post('/attempt_partial_succeed', function(req, res){
        eventEmitter.emit('server-mesage',
            {
                state: "hackPartialSuccessful",
            });
        res.json(state);
    });

    app.post('/attempt_fail', function(req, res){
        eventEmmiter.emit('server-mesage',
            {
                state: "hackDeny",
            });
        res.json(state);
    });
};

