const assert = require('assert');

class TurtlePath {
  constructor(startX = 0, startY = 0, startHeading = 0) {
    this.x = startX;
    this.y = startY;
    this.heading = startHeading;
  }

  forward(dist) {
    const rad = this.heading * Math.PI / 180;
    this.x += Math.sin(rad) * dist;
    this.y += Math.cos(rad) * dist;
  }

  turn(angle, radius) {
    const startRad = this.heading * Math.PI / 180;
    const dir = angle > 0 ? 1 : -1;
    const centerHeading = startRad + dir * Math.PI / 2;
    const cx = this.x + Math.sin(centerHeading) * radius;
    const cy = this.y + Math.cos(centerHeading) * radius;
    
    this.heading = (this.heading + angle) % 360;
    const endRad = this.heading * Math.PI / 180;
    
    this.x = cx - Math.sin(endRad + dir * Math.PI / 2) * radius;
    this.y = cy - Math.cos(endRad + dir * Math.PI / 2) * radius;
    
    // avoid -0
    if (Math.abs(this.x) < 0.001) this.x = 0;
    if (Math.abs(this.y) < 0.001) this.y = 0;
  }
}

const t = new TurtlePath(0, 0, 0);
t.forward(300);
console.log(t.x, t.y, t.heading);
t.turn(180, 100);
console.log(t.x, t.y, t.heading);
t.forward(100);
console.log(t.x, t.y, t.heading);
t.turn(-90, 100);
console.log(t.x, t.y, t.heading);
t.forward(150);
console.log(t.x, t.y, t.heading);
t.turn(180, 100);
console.log(t.x, t.y, t.heading);
t.forward(150);
console.log(t.x, t.y, t.heading);
t.turn(-90, 100);
console.log(t.x, t.y, t.heading);
t.forward(100);
console.log(t.x, t.y, t.heading);
t.turn(180, 100);
console.log(t.x, t.y, t.heading);
t.forward(300);
console.log(t.x, t.y, t.heading);

