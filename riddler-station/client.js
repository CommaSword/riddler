var Discover = require('node-discover');

var services = {
  ip: 1 //imagine i actually got my ip here
};

var d = Discover({
  advertisement: services,
  isMasterEligible: false
});

var a = false;
var b = false;

var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('which service to enable> ');
rl.prompt();
rl.on('line', function(line) {
    if (line === "a") {
      openA()
    } else if(line === "b"){
      openB()
    }
    rl.prompt();
});

function openA(){
  console.log("opening a")
  services['a'] = { name: "I am a walrus" }
  d.advertise(services)
}

function openB(){
  console.log("opening b")
  services['b'] = { name: "This is an arbitrary json object", functions: "you can put anything here", id: 231}
  d.advertise(services)
}