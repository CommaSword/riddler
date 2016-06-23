var express = require('express');

module.exports = function hacking(eventEmitter) {
    const app = express();

    const state = {
        status: '',
        request_parameters: '',
        ship_id: ''
    };

    function readState() {
        return {
            status: state.status,
            request_parameters: state.request_parameters,
            ship_id: state.ship_id,
        };
    }

    eventEmitter.on('ui-message', (data) => {
        state.status = data.status || state.status;
        state.request_parameters = data.details || state.request_parameters;
        state.ship_id = data.shipId || state.ship_id;
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

