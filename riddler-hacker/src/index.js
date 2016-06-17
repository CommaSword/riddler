const EventEmitter = require('events');
const appComp = require('./app');
const server = require('./server')

const ee = new EventEmitter();

appComp(ee);
server(ee);
