(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    term.echo('FLAPPY TEXT Adventure\ninteractive fiction - a science flap story.\n')
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

},{"./src/birdAscii":2,"./src/commands":3}],2:[function(require,module,exports){
var str = '';
str += '               ,,,,,,,,,,,,             \n'
str += '           ,,,,??????,,7777,,           \n'
str += '         ,,I???====,,77777777,,         \n'
str += '         ,,????====,,77777777,,         \n'
str += '       ,,??========,,??7777,,77,,       \n'
str += '     ,,============,,??7777,,77,,       \n'
str += '     ,,==============,,??777777,,       \n'
str += '     ,,==============,,??777777,,       \n'
str += '     ,,,,,,,,,,========,,,,,,,,,,,,     \n'
str += '   ,,==??????==,,====,,~~~~~~~~~~~~,,   \n'
str += '   ,,????????,,~~~~,,~~,,,,,,,,,,,,     \n'
str += '   ,,??????I?,,~~~~,,~~,,,,,,,,,,,,     \n'
str += '   ,,????==,,~~~~~~~~,,~~~~~~~~~~,,     \n'
str += '     ,,,,,,,,~~~~~~~~~~,,,,,,,,,,       \n'
str += '             ,,,,,,,,,,                 \n'
str += '             ,,,,,,,,,,                 \n'

module.exports = str;
},{}],3:[function(require,module,exports){
var state = [];

var speed = 1;
var gravity = 9;
var time = 0;

var pipeText = 'You are a bird. There are two pipes in front of you, creating an opening'

var makeBird = function () {
  return {
    x : 0,
    y : 50,
    alive: true,
    toString: function() {
      return 'x: ' + this.x + ', y: ' + this.y;
    },

    update : function () {
      if (!this.alive)
        return;
      this.y--;
      this.x += speed;
    },

    flap : function () {
      if (!this.alive)
        return;
      this.y += 5;
      this.x += 5;
    }
  }
}


var makePipe = function (x) {
  offset = Math.floor(Math.random()*2)*10 + 10
  if (Math.random() < .5) offset = -1 * offset;

  x = x || 10;

  return {
    x: x,
    top: 60 + offset,
    bot: 40 + offset,
    update : function(){

    },
    toString : function () {
      return 'at x: ' + this.x + ' with an opening between ' + this.top + ' and ' + this.bot;
    }
  }
}


var crashed = function (bird, pipe) {
  if (bird.y < 1) {
    return true
  }
  if ((pipe.x - bird.x) < 1) {
    return (bird.y < pipe.bot) || (bird.y > pipe.top)
  }
  return false
}

var world = {
  score: 0,
  pipes: [],
  bird : makeBird(),
  init : function () {
    this.bird = makeBird()
    this.pipes.push(makePipe())
  },

  update: function(term) {
    time++;
    this.bird.update()
    for (var i = 0; i < this.pipes.length; i++) {
      this.pipes[i].update();
      this.bird.alive = !crashed(this.bird, this.pipes[i])

      if (!this.bird.alive) {
        term.echo('You crashed at ' + this.bird.y );
        return
      }


      if (this.pipes[i].x < this.bird.x) {
        term.echo('You crossed the pipe');
        world.score++;
        this.pipes.splice(i, 1);
      }
    }

    // add a pipe if we're out of them
    if (this.pipes.length < 1) {
      this.pipes.push(makePipe(this.bird.x + 10))
    }
  }

};


module.exports = {

  _start : function (term) {
    world.init();
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
      term.echo('There is a pipe ' + world.pipes[world.pipes.length-1])
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
  }

}
},{}]},{},[1,2,3])