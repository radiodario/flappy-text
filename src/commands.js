var state = [];

var birdAscii = require('./birdAscii');

var pipeText = 'You are a bird. There are two pipes in front of you.'

var world = require('./world')();


module.exports = {

  _start : function (term) {
    world.init(term);
    term.clear();
    term.echo(birdAscii);
    term.echo(pipeText);
    this.status(term);
  },

  start : function(term) {
    if (world.bird.alive) {
      document.body.classList.add('play')
      world.start();
    }
  },

  pause : function(term) {
    document.body.classList.remove('play')
    world.pause();
    term.echo('GAME PAUSED');
  },

  flap : function (term) {
    if (world.bird.alive) {
      world.bird.flap();
      term.echo('You flapped your wings: ' + world.bird);
    } else {
      term.echo('The bird tried to flap its wings, but it was dead');
    }
  },

  status: function (term) {

    if (world.bird.alive) {
      term.echo('You are at ' + world.bird)
      term.echo('There are two pipes at ' + world.pipe)
      term.echo('Your score is ' + world.score);
    } else {
      term.echo('YOU ARE DEAD');
      return term.echo('Your score is ' + world.score);
    }
    this.help(term);
  },

  info: function (term) {
    this.status(term);

  },

  help: function(term) {
    // term.echo('You can:')
    var commands = []
    for (key in this) {
      // don't add private methods
      if (!(key.indexOf('_') === 0))
        commands.push(key)
    }

    term.echo('Type start to start the game.');
    term.echo('Type pause to pause at any time.');
    term.echo('Type restart to start again after you die.');
    term.echo('Type flap to flap your wings.');
  },

  restart: function(term) {
    this._start(term);
    this.start(term);
  }

}