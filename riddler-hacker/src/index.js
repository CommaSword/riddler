const EventEmitter = require('events');
const app = require('./app');
const server = require('./server')

const ee = new EventEmitter();

app(ee);
server(ee);
