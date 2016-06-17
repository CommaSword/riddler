
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

module.exports = function hacking(api, board) {

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

    function sendHackingData(newStatus, shipId, parameters) {
        state.status = newStatus;
        shipId = shipId || null;
        parameters = parameters || null;
        state.request_parameters = parameters || state.request_parameters;
        state.ship_id = shipId || state.ship_id;
    }

    app.get('/data', function(req, res){
        res.json(readState());
    });

    app.post('/set_start', function(req, res){
        if (state.status == hacking_status.hacking_ready_start){
            // Open up hacking console
            state.status =  hacking_status.hacking_in_progress;
        }
        res.json(state);
    });

    app.post('/set_deny', function(req, res){
        if (state.status == hacking_status.hacking_ready_start){
            // send message to user that hacking this ship is impossible
            state.status =  hacking_status.hacking_false;
        }
        if (state.status == hacking_status.hacking_in_progress){
            // cancel user's hacking attempt while in progress
            state.status =  hacking_status.hacking_false;
        }
        res.json(state);
    });

    app.post('/attempt_succeed', function(req, res){
        if (state.status == hacking_status.hacking_wait_confirm){
            // send message to user that hacking this ship was fully successful
            state.status =  hacking_status.hacking_false;
        }
        res.json(state);
    });

    app.post('/attempt_partial_succeed', function(req, res){
        if (state.status == hacking_status.hacking_wait_confirm){
            // send message to user that hacking this ship was partially successful
            state.status =  hacking_status.hacking_false;
        }
        res.json(state);
    });

    app.post('/attempt_fail', function(req, res){
        if (state.status == hacking_status.hacking_wait_confirm){
            // send message to user that hacking this ship failed despite best efforts
            state.status =  hacking_status.hacking_false;
        }
        if (state.status == hacking_status.hacking_in_progress){
            // cancel user's hacking attempt while in progress
            state.status =  hacking_status.hacking_false;
        }
        res.json(state);
    });
};

