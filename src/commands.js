var state = [];

var birdAscii = require('./birdAscii');

var pipeText = 'You are a bird. There are two pipes in front of you.'

var world = require('./world')();


module.exports = {

  _start : function (term) {
    world.init();
    term.clear();
    term.echo(birdAscii);
    term.echo(pipeText);
    this.status(term);
  },

  flap : function (term) {
    term.echo('You flapped your wings')
    world.bird.flap();
    world.update(term);
    this.status(term);
  },

  wait: function (term) {
    term.echo('You waited, feeling the air rushing past your face')
    world.update(term);
    this.status(term);
  },

  status: function (term) {

    if (world.bird.alive) {
      term.echo('You are at ' + world.bird)
      term.echo('There are two pipes at ' + world.pipes[world.pipes.length-1])
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
    term.echo('You can:')
    var commands = []
    for (key in this) {
      // don't add private methods
      if (!(key.indexOf('_') === 0))
        commands.push(key)
    }
    term.echo(commands.join('\t'))
  },

  restart: function(term) {
    this._start(term);
  }

}