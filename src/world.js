
var makeBird = require('./bird');
var makePipe = require('./pipes');


var crashed = function (bird, pipe) {
  if (bird.y <= 0) {
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
    init : function (term) {
      this.time = 0;
      this.score = 0;
      this.term = term;
      this.bird = makeBird(this);
      this.pipes.push(makePipe());
      clearInterval(this.interval);
    },

    start : function(term) {
      clearInterval(this.interval);
      this.update();
      this.interval = setInterval(this.update.bind(this), 2000);
    },

    pause : function(term) {
      clearInterval(this.interval);
    },

    update: function() {
      if (!this.bird.alive)
        return
      this.term.echo('\n')
      this.time++;
      this.term.echo("time is " + this.time + " bird " + this.bird + " pipe " + this.pipes[this.pipes.length-1]);
      this.bird.update()
      for (var i = 0; i < this.pipes.length; i++) {
        this.pipes[i].update();
        this.bird.alive = !crashed(this.bird, this.pipes[i])

        if (!this.bird.alive) {
          document.body.classList.remove('play')
          this.term.echo('\n********************');
          this.renderCrash();
          if (this.bird.y < 1) {
            this.term.echo('You crashed on the floor');
          } else {
            this.term.echo('You crashed at ' + this.bird.y );
          }
          this.term.echo('********************\n');
          this.term.echo('\ntype restart to try again.\n');
          return
        }


        if (this.pipes[i].x < this.bird.x) {
          this.term.echo('\n********************');
          this.term.echo('You crossed the pipes');
          this.term.echo('********************\n');
          this.score++;
          this.pipes.splice(i, 1);
        }
      }

      // add a pipe if we're out of them
      if (this.pipes.length < 1) {
        this.pipes.push(makePipe(this.bird.x + 10))
      }
    },

    renderCrash: function() {
      if (this.bird.y <= 0) {
        this.term.echo('\n\n');
        this.term.echo('                x\\      ');
        this.term.echo('__________________\\______');
      } else if (this.bird.y > this.pipes[this.pipes.length-1].top) {
        this.term.echo('\n\n');
        this.term.echo('                  | |      ');
        this.term.echo('                  | |      ');
        this.term.echo('                x\\| |      ');
        this.term.echo('                  | |      ');
        this.term.echo('                  ___      ');
        this.term.echo('                           ');
        this.term.echo('                           ');
        this.term.echo('                  ___      ');
        this.term.echo('                  | |      ');
        this.term.echo('                  | |     ');
        this.term.echo('                  | |      ');
        this.term.echo('__________________| |______');
      } else if (this.bird.y < this.pipes[this.pipes.length-1].bot) {
        this.term.echo('\n\n');
        this.term.echo('                  | |      ');
        this.term.echo('                  | |      ');
        this.term.echo('                  | |      ');
        this.term.echo('                  | |      ');
        this.term.echo('                  ___      ');
        this.term.echo('                           ');
        this.term.echo('                           ');
        this.term.echo('                  ___      ');
        this.term.echo('                  | |      ');
        this.term.echo('                x\\| |     ');
        this.term.echo('                  | |      ');
        this.term.echo('__________________| |______');
      }
    }
  }

}