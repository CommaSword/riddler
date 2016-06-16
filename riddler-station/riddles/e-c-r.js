/**
 * Created by amira on 10/6/16.
 */
var five = require('johnny-five');
var express = require('express');

var REPAIR_BLINK_PHASE = 1000;
var FAILURE_BLINK_PHASE = 300;

module.exports = function EngineeringControlRoom(api, board){
	var systems = {
		'reactor' : {toggle:'A3', led: 5},
		'beam_weapon' : {toggle:'A2', led: 6},
		'missiles' : {toggle:'A1', led: 7},
		'maneuvering' : {toggle:'A0', led: 8},
		'impulse_engine' : {toggle:0, led: 9},
		'warp_drive' : {toggle:1, led: 10},
		'jump_drive' : {toggle:2, led: 11},
		'front_shield' : {toggle:3, led: 12},
		'rear_shield' : {toggle:4, led: 13}
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
	Object.keys(systems).forEach(initSystem);

	var schema = {
		state : 'data'
	};
	function initSystem(sysName){
		state[sysName] = {
			damaged : false,
			functional : true,
			autoRepair : false
		};
		var led = new five.Led({
			pin:systems[sysName].led,
			board:board
		});
		function calcStatus(){
			if (state.numToggled > state.numToggledMax){
				led.blink(FAILURE_BLINK_PHASE);
			} else if (state[sysName].damaged){
				if (state[sysName].autoRepair){
					led.blink(state[sysName].functional? REPAIR_BLINK_PHASE : FAILURE_BLINK_PHASE);
				} else {
					led.on();
				}
			} else {
				led.off();
			}
		}
		var toggleSwitch = new five.Switch({
			pin:systems[sysName].toggle,
			board:board
		});
		toggleSwitch.on("close", function() {
			state[sysName].autoRepair = false;
			calcStatus();
		});

		// "open" the switch is opened
		toggleSwitch.on("open", function() {
			state[sysName].autoRepair = true;
			state.numToggled++;
			calcStatus();
		});
		var route = express.Router();
		route.get('/', function (req, res) {
			res.json(state[sysName]);
		});
		route.post('/damaged', function (req, res) {
			console.log('damaged', req.rawBody);
			switch(req.rawBody){
				case 'true':
					state[sysName].damaged = true;
					calcStatus();
					break;
				case 'false':
					state[sysName].damaged = false;
					calcStatus();
					break;
			}
			res.json(state[sysName]);
		});
		route.post('/functional', function (req, res) {
			console.log('functional', req.rawBody);
			switch(req.rawBody){
				case 'true':
					state[sysName].functional = true;
					calcStatus();
					break;
				case 'false':
					state[sysName].functional = false;
					calcStatus();
					break;
			}
			res.json(state[sysName]);
		});
		api.use('/' + sysName, route);
		schema[sysName + '.state'] = sysName + '/data';
		schema[sysName + '.damaged'] = sysName + '/damaged';
		schema[sysName + '.functional'] = sysName + '/functional';
	}
	return schema;
};
