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
      this.x += this.vx();
      this.y += this.vy();
    },

    flap : function () {
      if (!this.alive)
        return;
      this.dt = 0;
      this.y += 20;
    }
  }
}