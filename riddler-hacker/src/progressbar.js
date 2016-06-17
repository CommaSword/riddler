var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'my window title';

var progressBox = blessed.Box({
  content: ' Hello {bold}world{/bold}!',
  tags: true,
  width: '100%',
  height: '100%',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    }
  }
});

var progressBar = blessed.ProgressBar({
  height: '10%',
  width: '80%',
  top: 'center',
  left: 'center',
  pch: "*",
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    }
  },
  border: {
    type: 'line'
  },
  orientation: 'horizontal',
  filled: 0
});

progressBox.append(progressBar);
screen.append(progressBox);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  loading.stop();
  return process.exit(0);
});

var right = true;

function advance(){
  // progressBar.progress((100 - progressBar.filled) / (Math.random() * 20 + 40));
  // progressBar.progress(Math.random()*30 - 15);
  // if(progressBar.filled > 95){
  //   progressBar.progress(Math.random()*-10)
  // }
  if(progressBar.filled <= 0 || progressBar.filled >= 100){
    right = !right;
  }
  if(right){
    progressBar.progress(10);
  } else {
    progressBar.progress(-10);
  }
  screen.render();
}

setInterval(function(){
  advance();
}, 1000);

// Render the screen.
screen.render();