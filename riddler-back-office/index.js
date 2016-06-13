/**
 * Created by amira on 14/5/16.
 */
var http = require('http');
var path = require('path');
var express = require("express");
var RED = require("node-red");
var storageModule = require('./multi-file-flows');
var Discover = require('node-discover'); //https://github.com/wankdanker/node-discover
// load environment configurations to process.env
require('dotenv').config();

var d = Discover({
	multicast : process.env.multicastAddr || '239.0.0.0'
});

setInterval(function(){
	//var detected = {};
	Object.keys(d.nodes).forEach(function(key){
		var node = d.nodes[key];
		if (node.advertisement && node.advertisement.schema) {
			Object.keys(node.advertisement.schema).forEach(function (riddleId) {
				// {riddle1 : {data : '/data', timeout : '/timeout'}
				var riddleProps = node.advertisement.schema[riddleId];
				Object.keys(riddleProps).forEach(function (property) {
					var resource = riddleProps[property];
					var value = 'http://' + node.address + ':' + node.advertisement.port + '/' + riddleId + '/' + resource;
					if (process.env[riddleId + '_' + property] !== value){
						process.env[riddleId + '_' + property] = value;
						console.log('detected', riddleId+'_'+property, '=', value);
					}
				});
			});
		}
	});
}, 1000);

// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
// app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = {
	storageModule : storageModule(),
	flowFile: 'flows.json',
	flowFilePretty: true,
	verbose:true,
	httpAdminRoot:"/",
	httpNodeRoot: "/",
	userDir: path.join(__dirname , 'node-red'),
	functionGlobalContext: { } ,   // enables global context
	ui:{  // https://github.com/andrei-tatar/node-red-contrib-ui/blob/master/ui.js#L162

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
RED.start();