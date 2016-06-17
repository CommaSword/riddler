var Discover = require('node-discover'); //https://github.com/wankdanker/node-discover
var d = Discover({
  multicast : '239.0.0.0'
});

d.on("added", function (obj) {
  console.log("obj", obj)
});

setInterval(function(){
  Object.keys(d.nodes).forEach(function(key){
    console.log(key, "|", d.nodes[key].advertisement)
  });
}, 4000);