var commands = require('./src/commands');

var birdAscii = require('./src/birdAscii');



var terminalOptions = {
  greetings: false,
  name: 'flappy-text',
  height: 480,
  width: 640,
  prompt: '> ',
  onInit: function(term) {
    term.echo(birdAscii);
    term.echo('FLAPPY TEXT Adventure.\n')
    commands._start(term);
  }
};









var handleInput = function(command, term) {
  if (command !== '') {
    if (commands.hasOwnProperty(command)) {
      commands[command](term);
    } else {
      term.echo('I did not catch that.');
    }
  }
}



// start the thing
$(document).ready(function() {
  $('#terminal').terminal(handleInput, terminalOptions);
});
