var express = require('express');

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
        switch (data.status) {
            case "welcome": state.status = 'User not hacking';
            case "preHack": state.status = 'User waiting for confirmation';
            case 'hacking': state.status = 'Hacking in progress';
            case 'postHack': state.status = 'Waiting for hacking result';
        }
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

    app.listen(5000)
};

