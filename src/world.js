
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