(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var commands = require('./src/commands');

var terminalOptions = {
  greetings: false,
  name: 'flappy-text',
  height: 480,
  width: 640,
  prompt: '> ',
  onInit: function(term) {
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

},{"./src/commands":4}],2:[function(require,module,exports){
module.exports = function (world) {
  return {
    alive: true,
    x : 0,
    y : 50,
    v0 : 2,
    mass: 0.08,
    θ: 0 * Math.PI / 180, // initial angle is zero
    dt: 0, // time since last flap
    // x component of velocity
    vx : function () {
      return this.v0 * Math.cos(this.θ);
    },
    // y component of velocity
    vy : function () {
      return this.v0 * Math.sin(this.θ) - world.gravity * this.dt;
    },
    // x displacement
    disx : function() {
      return this.v0 * this.dt * Math.cos(this.θ);
    },
    // the y displacement
    disy : function() {
      return (this.v0 * this.dt * Math.sin(this.θ)) - (.5 * world.gravity * (this.dt*this.dt))
    },
    px : function() {
      return this.vx() * this.mass;
    },
    py : function() {
      return this.vy() * this.mass;
    },
    toString: function() {
      return 'x: ' + Math.floor(this.x) + ', y: ' + Math.floor(this.y);
    },

    update : function () {
      this.dt++;
      if (!this.alive)
        return;
      this.x += this.disx();
      this.y += this.disy();
    },

    flap : function () {
      if (!this.alive)
        return;
      this.dt = 0;
      // this.θ = 80 * Math.PI / 180; // our angle is 70 degrees
      this.y += 20;
    }
  }
}
},{}],3:[function(require,module,exports){
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
str += 'A FLAPPY TEXT Adventure.\n'

module.exports = str;
},{}],4:[function(require,module,exports){
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
},{"./birdAscii":3,"./world":6}],5:[function(require,module,exports){
module.exports = function (x) {
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
      return 'at x: ' + this.x + ' \nThere is an opening between ' + this.top + ' and ' + this.bot;
    }
  }
}
},{}],6:[function(require,module,exports){

var makeBird = require('./bird');
var makePipe = require('./pipes');


var crashed = function (bird, pipe) {
  if (bird.y < 1) {
    return true
  }
  if ((pipe.x - bird.x) < 1) {
    return (bird.y < pipe.bot) || (bird.y > pipe.top)
  }
  return false
}

module.exports = function() {
  return {
    score: 0,
    time: 0,
    gravity: 7,
    pipes: [],
    bird : makeBird(this),
    init : function () {
      this.bird = makeBird(this);
      this.pipes.push(makePipe());
    },

    update: function(term) {
      this.time++;
      this.bird.update()
      for (var i = 0; i < this.pipes.length; i++) {
        this.pipes[i].update();
        this.bird.alive = !crashed(this.bird, this.pipes[i])

        if (!this.bird.alive) {
          term.echo('You crashed at ' + this.bird.y );
          return
        }


        if (this.pipes[i].x < this.bird.x) {
          term.echo('You crossed the pipes');
          this.score++;
          this.pipes.splice(i, 1);
        }
      }

      // add a pipe if we're out of them
      if (this.pipes.length < 1) {
        this.pipes.push(makePipe(this.bird.x + 10))
      }
    }
  }

}
},{"./bird":2,"./pipes":5}]},{},[1,2,3,4,5,6])