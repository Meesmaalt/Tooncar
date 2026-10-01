class TurtlePath {
  constructor(startX = 0, startY = 0, startZ = 0, startHeading = 0) {
    this.x = startX;
    this.y = startY;
    this.z = startZ;
    this.heading = startHeading;
    this.points = [];
    this.points.push([this.x, this.y, this.z]);
  }

  forward(dist, elevationChange = 0, resolution = 15) {
    const steps = Math.max(1, Math.ceil(dist / resolution));
    const stepDist = dist / steps;
    const stepY = elevationChange / steps;
    const rad = this.heading * Math.PI / 180;
    
    for (let i = 0; i < steps; i++) {
      this.x += Math.sin(rad) * stepDist;
      this.z += Math.cos(rad) * stepDist;
      this.y += stepY;
      this.points.push([this.x, this.y, this.z]);
    }
  }

  turn(angle, radius, elevationChange = 0, resolution = 15) {
    const arcLen = (Math.abs(angle) / 360) * 2 * Math.PI * radius;
    const steps = Math.max(1, Math.ceil(arcLen / resolution));
    const stepAngle = angle / steps;
    const stepY = elevationChange / steps;
    
    for (let i = 0; i < steps; i++) {
      const startRad = this.heading * Math.PI / 180;
      const dir = angle > 0 ? 1 : -1;
      const centerHeading = startRad + dir * Math.PI / 2;
      const cx = this.x + Math.sin(centerHeading) * radius;
      const cz = this.z + Math.cos(centerHeading) * radius;
      
      this.heading = (this.heading + stepAngle) % 360;
      const endRad = this.heading * Math.PI / 180;
      
      this.x = cx - Math.sin(endRad + dir * Math.PI / 2) * radius;
      this.z = cz - Math.cos(endRad + dir * Math.PI / 2) * radius;
      this.y += stepY;
      
      this.points.push([this.x, this.y, this.z]);
    }
  }
}

function genBeach() {
  const t = new TurtlePath(0, 0, 0);
  t.forward(400, 0);
  t.turn(180, 120, 12);
  t.forward(150, 4);
  t.turn(-90, 100, 0);
  t.forward(200, -8);
  t.turn(180, 100, 0);
  t.forward(200, -8);
  t.turn(-90, 100, 0);
  t.forward(150, 0);
  t.turn(180, 120, 0);
  t.forward(300, 0);
  console.log("Beach distance:", Math.hypot(t.x, t.y, t.z));
}

function genSpooky() {
  const t = new TurtlePath(0, 0, 0);
  t.forward(200, 0);
  t.turn(90, 80, 5);
  t.forward(150, 0);
  t.turn(-180, 60, -5);
  t.forward(200, 0);
  t.turn(90, 80, 5);
  t.forward(100, 5);
  t.turn(90, 120, 5);
  t.forward(300, -5);
  t.turn(90, 100, -5);
  // Need to close loop
}

genBeach();
