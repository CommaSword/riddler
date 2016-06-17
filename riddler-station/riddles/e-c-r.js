/**
 * Created by amira on 10/6/16.
 */
var five = require('johnny-five');
var express = require('express');

var REPAIR_BLINK_PHASE = 1000;
var FAILURE_BLINK_PHASE = 300;

module.exports = function EngineeringControlRoom(api, board){
	var systems = {
		'reactor' : {toggles:['A3'], led: 5},
		'beam_weapon' : {toggles:['A2'], led: 6},
		'missiles' : {toggles:['A1'], led: 7},
		'maneuvering' : {toggles:['A0'], led: 8},
		'impulse_engine' : {toggles:[0], led: 9},
		'warp_drive' : {toggles:[1], led: 10},
		'jump_drive' : {toggles:[2], led: 11},
		'front_shield' : {toggles:[3], led: 12},
		'rear_shield' : {toggles:[4], led: 13}
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
				toggles[toggleId].on('press', function () {
					toggles[toggle].state = true;
					state.numToggled++;
					onChange();
				});

				toggles[toggleId].on('release', function() {
					toggles[toggle].state = false;
					state.numToggled--;
					onChange();
				});
			}
		});
	});

	Object.keys(systems).forEach(function initSystem(sysName){
		state[sysName] = {
			damaged : false,
			functional : true
		};

		function readState(){
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
					if (readState().autoRepair) {
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
			res.json(readState());
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
			res.json(readState());
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
			res.json(readState());
		});
		api.use('/' + sysName, route);
	});
};
