const EventEmitter = require('events');
const appComp = require('./app');
const server = require('./server');
var Discover = require('node-discover');

const ee = new EventEmitter();

appComp(ee);
server(ee);
var d = Discover({
  multicast : process.env.multicastAddr || '239.0.0.0',
  isMasterEligible: false,
  advertisement: {
    service: 'hacking'
  }
});