/**
 * Created by amira on 14/5/16.
 */
var http = require('http');
var path = require('path');
var express = require("express");
var RED = require("node-red");
var EventEmitter = require('events');
var storageModule = require('./multi-file-flows');
var Discover = require('node-discover'); //https://github.com/wankdanker/node-discover
// load environment configurations to process.env
require('dotenv').config();
require('./spoon-node-red-ui')();


// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
// app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var riddlesEvents = new EventEmitter();
riddlesEvents.setMaxListeners(30);
var settings = {
	storageModule : storageModule(),
	flowFile: 'flows.json',
	flowFilePretty: true,
	verbose:false,
	httpAdminRoot:"/",
	httpNodeRoot: "/",
	userDir: path.join(__dirname , 'node-red'),
	functionGlobalContext: {
		riddlesEvents : riddlesEvents
	} ,   // enables global context
	ui:{  // https://github.com/andrei-tatar/node-red-contrib-ui/blob/master/ui.js#L162
		title: 'riddler back office'
	}
};

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(process.env.node_red_port || 80);

// Start the runtime
RED.start()
	.then(function(){

		var d = Discover({
			multicast : process.env.multicastAddr || '239.0.0.0'
		});

		setInterval(function(){
			d.eachNode(function(node){
				if (node.advertisement && node.advertisement.schema) {
					Object.keys(node.advertisement.schema).forEach(function (riddleId) {
						riddlesEvents.emit('added-'+riddleId, 'http://' + node.address + ':' + node.advertisement.port + '/' + riddleId);
					});
				}
			});
		}, 1000);

		d.on("added", function(data){
			if(data.advertisement && data.advertisement.service == 'hacking'){
				var baseUrl = 'http://127.0.0.1:5000'
				riddlesEvents.emit('added-hacking', baseUrl);
			}
		});
	});