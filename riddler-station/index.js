/**
 * Created by amira on 2/5/16.
 */
require('dotenv').config();
var detectBoard = require('./detect-board');
var port = process.env.port || 80;
var discover = require('node-discover');
var station = require('./station');

station(port, detectBoard, discover);