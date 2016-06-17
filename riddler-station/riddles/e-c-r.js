/**
 * Created by amira on 10/6/16.
 */
var five = require('johnny-five');
var express = require('express');

var REPAIR_BLINK_PHASE = 1000;
var FAILURE_BLINK_PHASE = 300;

module.exports = function EngineeringControlRoom(api, board){
	var systems = {
		'reactor' : {toggles:[2], led: 10} ,
		'beam_weapon' : {toggles:[3], led: 11},
		'missiles' : {toggles:[4], led: 12},
		'maneuvering' : {toggles:[5], led: 13},
		'impulse_engine' : {toggles:[6], led: 'A0'},
		'warp_drive' : {toggles:[7], led: 'A1'},
		'jump_drive' : {toggles:[8], led: 'A2'},
		'front_shield' : {toggles:[9], led: 'A3'},
		'rear_shield' : {toggles:[2], led: 'A4'}
	};
	var state = {
		numToggled : 0,
		numToggledMax : 3
	};
	function readState(){
		return {
			numToggled : state.numToggled,
			numToggledMax : state.numToggledMax,
			functional : state.numToggled <= state.numToggledMax
		};
	}
	api.get('/data', function (req, res) {
		res.json(readState());
	});
	var toggles = {};
	var onChange = function(){};
	Object.keys(systems).forEach(function (sysName) {
		systems[sysName].toggles.forEach(function (toggle) {
			if (!toggles[toggle]) {
				toggles[toggle] = new five.Button({
					pin:toggle,
					board:board
				});
				toggles[toggle].on('press', function () {
					toggles[toggle].state = true;
					state.numToggled++;
					onChange();
				});

				toggles[toggle].on('release', function() {
					toggles[toggle].state = false;
					state.numToggled--;
					onChange();
				});
			}
		});
	});

	Object.keys(systems).forEach(function initSystem(sysName){
		state[sysName] = {
			damaged : true,
			functional : true
		};

		function readSystemState(){
			return {
				damaged : state[sysName].damaged,
				functional : state[sysName].functional,
				autoRepair : systems[sysName].toggles.every(function (toggle) {return toggles[toggle].state;})
			};
		}
		var led = new five.Led({
			pin:systems[sysName].led,
			board:board
		});
		var oldOnChanged = onChange;
		onChange = function(){
			calcStatus();
			oldOnChanged();
		};
		function calcStatus(){
			if (readState().functional) {
				if (state[sysName].damaged) {
					if (readSystemState().autoRepair) {
						led.blink(state[sysName].functional ? REPAIR_BLINK_PHASE : FAILURE_BLINK_PHASE);
					} else {
						led.on();
					}
				} else {
					led.off();
				}
			} else {
				led.blink(FAILURE_BLINK_PHASE);
			}
		}
		var route = express.Router();
		route.get('/', function (req, res) {
			res.json(readSystemState());
		});
		route.post('/damaged', function (req, res) {
			console.log('damaged', req.rawBody);
			if(req.rawBody === 'true') {
				state[sysName].damaged = true;
				calcStatus();
			} else if(req.rawBody === 'false') {
				state[sysName].damaged = false;
				calcStatus();
			}
			res.json(readSystemState());
		});
		route.post('/functional', function (req, res) {
			console.log('functional', req.rawBody);
			if(req.rawBody === 'true') {
				state[sysName].functional = true;
				calcStatus();
			} else if(req.rawBody === 'false') {
				state[sysName].functional = false;
				calcStatus();
			}
			res.json(readSystemState());
		});
		api.use('/' + sysName, route);
	});
	onChange();
};
