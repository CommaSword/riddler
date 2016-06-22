/**
 * Created by amira on 10/6/16.
 */
var five = require('johnny-five');
var express = require('express');

var REPAIR_BLINK_PHASE = 1000;
var FAILURE_BLINK_PHASE = 200;

module.exports = function EngineeringControlRoom(api, board){
	var systems = {
		'reactor' : {toggles:[2, 7], led: 10},
		'beam_weapon' : {toggles:[3, 4, 6], led: 11},
		'missiles' : {toggles:[3, 4], led: 12},
		'maneuvering' : {toggles:[2, 4, 7], led: 13},
		'impulse_engine' : {toggles:[5, 6], led: 'A0'},
		'warp_drive' : {toggles:[3, 6, 7], led: 'A1'},
		'jump_drive' : {toggles:[2, 5], led: 'A2'},
		'front_shield' : {toggles:[3, 5, 6], led: 'A3'},
		'rear_shield' : {toggles:[2, 5, 7], led: 'A4'}
	};
	var state = {
		numToggled : 0,
		numToggledMax : 4
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
	var onChange = function() {
		state.numToggled = Object.keys(toggles).reduce(function (sum, toggle) {
			return sum + (toggles[toggle].state?1:0);
		}, 0);
	};
	Object.keys(systems).forEach(function (sysName) {
		systems[sysName].toggles.forEach(function (toggle) {
			if (!toggles[toggle]) {
				toggles[toggle] = new five.Pin({
					pin: toggle,
					mode: 0,
					board:board
				});

				setInterval(function(){
					toggles[toggle].query(function(d){
						if (toggle === 8)	console.log(d.value);
						var old = toggles[toggle].state;
						toggles[toggle].state = !!d.value;
						if (!!d.value != old){
							onChange();
						}
					})
				}, 500);
			}
		});
	});

	Object.keys(systems).forEach(function initSystem(sysName){
		state[sysName] = {
			functional : true,
			hp : 100,
			repairStartTime : 0,
			repairJobIntervalId : 0
		};

		function readSystemState(){
			return {
				hp : state[sysName].hp,
				damaged : state[sysName].hp < 100,
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
			oldOnChanged();
			calcStatus();
		};
		function calcStatus(){
			var repairing = false;
			if (readState().functional) {
				if (readSystemState().damaged) {
					if (readSystemState().autoRepair) {
						if (state[sysName].functional){
							repairing = true;
							led.stop().blink(REPAIR_BLINK_PHASE);
						} else {
							led.stop().blink(FAILURE_BLINK_PHASE);
						}
					} else {
						led.stop().on();
					}
				} else {
					led.stop().off();
				}
			} else {
				led.stop().blink(FAILURE_BLINK_PHASE);
			}
			if(repairing){
				if (!state[sysName].repairStartTime){
					state[sysName].repairStartTime = Date.now();
					state[sysName].repairJobIntervalId = setInterval(function() {
						applyRepair(Date.now());
					}, 100);
				}
			} else {
				if (state[sysName].repairJobIntervalId){
					clearInterval(state[sysName].repairJobIntervalId);
					state[sysName].repairJobIntervalId = 0;
				}
				applyRepair(0);
			}
		}
		function applyRepair(newRepairStartTime){
			if (readSystemState().damaged && state[sysName].repairStartTime){
				var repairTime = Date.now() - state[sysName].repairStartTime;
				var reapiredHp = repairTime/500;  // 1 HP in 0.5 second
				state[sysName].hp = Math.min(state[sysName].hp + reapiredHp, 99.9);
			}
			state[sysName].repairStartTime = newRepairStartTime;
		}

		api.get('/' + sysName, function (req, res) {
			res.json(readSystemState());
		});
		api.post('/' + sysName + '/hp', function (req, res) {
			if (req.rawBody.match(/^\d+$/)) {
				state[sysName].hp = parseInt(req.rawBody);
				calcStatus();
			}
			res.json(readSystemState());
		});
		api.post('/' + sysName + '/functional', function (req, res) {
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
	});
	onChange();
};
