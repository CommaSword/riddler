var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
  title: "Blessed penetration system"
});

var layout = blessed.Layout({
    parent: screen,
    width:'100%',
    height:'100%'
});

var text = blessed.Text({
  parent: layout,
  content: ' Enter call signes:',
  tags: true,
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: '#f0f0f0'
    }
  }
});

var form = blessed.form({
    parent: layout,
    name: 'form',
    top: 0,
    left: 0,
    width: '60%',
    height: '60%',
});

var input = blessed.textarea({
    parent: form,
    inputOnFocus: true,
    name: 'input',
    input: true,
    keys: true,
    top: 0,
    left: 0,
    height: 1,
    width: '100%',
    style: {
        fg: 'white',
        bg: 'black',
        focus: {
            bg: 'red',
            fg: 'white'
        }
    }
});

input.focus();
input.on('submit', function() {
  console.log('im here');
})

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.key('enter', function(ch, key) {
  console.log('YO');
  form.submit();
});

// Render the screen.
screen.render();

