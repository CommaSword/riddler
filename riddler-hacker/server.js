var Discover = require('node-discover'); //https://github.com/wankdanker/node-discover
var d = Discover();

d.on("added", function (obj) {
  console.log("obj", obj)
});

setInterval(function(){
  Object.keys(d.nodes).forEach(function(key){
    console.log(key, "|", d.nodes[key].advertisement)
  });
}, 4000)