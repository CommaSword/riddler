var express = require('express');

module.exports = function hacking(eventEmitter) {
    const app = express();
    //most basic body parser for raw strings
    app.use(function rawBody(req, res, next) {
        req.setEncoding('utf8');
        req.rawBody = '';
        req.on('data', function (chunk) {
            req.rawBody += chunk;
        });
        req.on('end', function () {
            next();
        });
    });

    const state = {
        status: '',
        request_parameters: '',
        ship_id: ''
    };

    function readState() {
        return {
            status: state.status,
            request_parameters: state.request_parameters,
            ship_id: state.ship_id
        }
    }

    eventEmitter.on('ui-message', (data) => {
        state.status = data.status || state.status;
        state.request_parameters = data.details || state.request_parameters;
        state.ship_id = data.shipId || state.ship_id;
    });

    app.get('/data', function(req, res){
        res.json(readState());
    });
    app.post('/speed', function(req, res){
        if (req.rawBody.match(/^\d+$/)) {
            eventEmitter.emit('server-message', {speed: parseInt(req.rawBody)});
        }
        res.json(readState())
    });
    app.post('/duration', function(req, res){
        if (req.rawBody.match(/^\d+$/)) {
            eventEmitter.emit('server-message', {duration: parseInt(req.rawBody)});
        }
        res.json(readState())
    });
    app.post('/abort', function(req, res){
        eventEmitter.emit('server-message', {state: "abort"});
        res.json(readState())
    });

    app.post('/ok', function(req, res){
        eventEmitter.emit('server-message', {state: "ok"});
        res.json(readState())
    });
    app.listen(5000);
};

