const EventEmitter = require('events');
const app = require('./app.js');

const ee = new EventEmitter();

app(ee);
