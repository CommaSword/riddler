var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'my window title';

// Create a text perfectly centered horizontally and vertically.
var text = blessed.Text({
  content: ' Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    }
  }
});

// Append our text to the screen.
screen.append(text);

// Add a png icon to the text
var icon = blessed.image({
  parent: text,
  top: 0,
  left: 0,
  type: 'overlay',
  width: 'shrink',
  height: 'shrink',
  file: __dirname + '/my-program-icon.png',
  search: false
});

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Render the screen.
screen.render();