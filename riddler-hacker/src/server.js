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
            request_parameters: state.request_parameters,
            ship_id: state.ship_id,
        };
    }

    eventEmitter.on('ui-message', (data) => {
        switch (data.status) {
            case "welcome": state.status = 'User not hacking'; break;
            case "preHack": state.status = 'User waiting for confirmation'; break;
            case 'hacking': state.status = 'Hacking in progress'; break;
            case 'postHack': state.status = 'Waiting for hacking result'; break;
        }
        var newShipId = data.shipId || null;
        var newDetails = data.details || null;
        state.request_parameters = newDetails || state.request_parameters;
        state.ship_id = newShipId || state.ship_id;
    });

    app.get('/data', function(req, res){
        res.json(readState());
    });

    app.post('/set_start', function(req, res){
        eventEmitter.emit('server-message',
            {
                state: "hackStart",
            });
        res.json(state);
    });

    app.post('/set_deny', function(req, res){
        eventEmitter.emit('server-message',
            {
                state: "hackDeny",
            });
        res.json(state);
    });

    app.post('/attempt_succeed', function(req, res){
        eventEmitter.emit('server-message',
            {
                state: "hackSuccessful",
            });
        res.json(state);
    });

    app.post('/attempt_partial_succeed', function(req, res){
        eventEmitter.emit('server-message',
            {
                state: "hackPartialSuccessful",
            });
        res.json(state);
    });

    app.post('/attempt_fail', function(req, res){
        eventEmitter.emit('server-message',
            {
                state: "hackDeny",
            });
        res.json(state);
    });

    app.listen(5000);
};

