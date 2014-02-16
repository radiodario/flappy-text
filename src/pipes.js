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