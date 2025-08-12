// This script runs in a background thread and handles all physics calculations.

// --- Data and State ---
let particles = [];
let particleGrid;
let simulationInterval;

// --- p5.Vector replacement (p5 is not available in workers) ---
class Vector {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  add(v) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
  mult(n) { this.x *= n; this.y *= n; this.z *= n; return this; }
  magSq() { return this.x * this.x + this.y * this.y + this.z * this.z; }
  normalize() {
    const len = Math.sqrt(this.magSq());
    if (len !== 0) this.mult(1 / len);
    return this;
  }
  static sub(v1, v2) { return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z); }
  static mult(v, n) { return new Vector(v.x * n, v.y * n, v.z * n); }
  static random3D() {
    const angle1 = Math.random() * 2 * Math.PI;
    const angle2 = Math.random() * 2 * Math.PI;
    return new Vector(Math.cos(angle1) * Math.sin(angle2), Math.sin(angle1) * Math.sin(angle2), Math.cos(angle2));
  }
}

// --- Physics Constants (mirrored from sketch.js) ---
const NUCLEUS_RADIUS = 120;
const PROTON_REPULSION = 0.5;
const CONTAINMENT_FORCE = 0.005;
const DAMPING = 0.98;

// --- Classes (Particle, ParticleGrid) ---
// Note: These are copied from sketch.js, but use the worker's Vector class
class Particle {
  constructor(isProton) {
    this.type = isProton ? 'proton' : 'neutron';
    this.pos = Vector.random3D().mult(Math.random() * NUCLEUS_RADIUS * 0.5);
    this.vel = Vector.random3D().mult(Math.random() * 0.5);
    this.acc = new Vector(0, 0, 0);
  }
  applyForce(force) { this.acc.add(force); }
  update() {
    this.vel.add(this.acc);
    this.vel.mult(DAMPING);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
}

class ParticleGrid {
    constructor(bounds, resolution) {
        this.bounds = bounds;
        this.resolution = resolution;
        this.cellSize = this.bounds / this.resolution;
        this.grid = this._createGrid();
    }
    _createGrid() {
        let grid = new Array(this.resolution);
        for (let i = 0; i < this.resolution; i++) {
            grid[i] = new Array(this.resolution);
            for (let j = 0; j < this.resolution; j++) {
                grid[i][j] = new Array(this.resolution).fill(null).map(() => []);
            }
        }
        return grid;
    }
    _getGridCoords(pos) {
        const x = Math.floor((pos.x + this.bounds / 2) / this.cellSize);
        const y = Math.floor((pos.y + this.bounds / 2) / this.cellSize);
        const z = Math.floor((pos.z + this.bounds / 2) / this.cellSize);
        return { x, y, z };
    }
    clear() {
        for (let i = 0; i < this.resolution; i++) {
            for (let j = 0; j < this.resolution; j++) {
                for (let k = 0; k < this.resolution; k++) {
                    this.grid[i][j][k] = [];
                }
            }
        }
    }
    insert(particle) {
        const { x, y, z } = this._getGridCoords(particle.pos);
        if (this.grid[x] && this.grid[x][y] && this.grid[x][y][z]) {
            this.grid[x][y][z].push(particle);
        }
    }
    getNearbyParticles(particle) {
        const nearby = [];
        const { x, y, z } = this._getGridCoords(particle.pos);
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                for (let k = -1; k <= 1; k++) {
                    const nx = x + i;
                    const ny = y + j;
                    const nz = z + k;
                    if (this.grid[nx] && this.grid[nx][ny] && this.grid[nx][ny][nz]) {
                        nearby.push(...this.grid[nx][ny][nz]);
                    }
                }
            }
        }
        return nearby;
    }
}


// --- Simulation Loop ---
function runSimulation() {
  if (!particles.length) return;

  // 1. Populate the spatial grid
  particleGrid.clear();
  for (let p of particles) {
    particleGrid.insert(p);
  }

  // 2. Calculate forces
  for (let p1 of particles) {
    const containment = Vector.mult(p1.pos, -1).mult(CONTAINMENT_FORCE);
    p1.applyForce(containment);

    const nearby = particleGrid.getNearbyParticles(p1);
    for (let p2 of nearby) {
      if (p1 === p2) continue;
      if (p1.type === 'proton' && p2.type === 'proton') {
        const forceDir = Vector.sub(p1.pos, p2.pos);
        const distSq = forceDir.magSq();
        if (distSq > 0) {
          const repulsion = forceDir.normalize().mult(PROTON_REPULSION / (distSq + 0.1));
          p1.applyForce(repulsion);
        }
      }
    }
  }

  // 3. Update particles and prepare data for sending
  const particleData = [];
  for (let p of particles) {
    p.update();
    particleData.push({
      type: p.type,
      pos: { x: p.pos.x, y: p.pos.y, z: p.pos.z }
    });
  }
  
  // 4. Post data back to the main thread
  postMessage(particleData);
}

// --- Event Listener for Main Thread ---
self.onmessage = function(e) {
  if (e.data.type === 'reset') {
    const { protons, neutrons } = e.data.element;
    particles = [];
    const totalParticles = protons + neutrons;
    for (let i = 0; i < totalParticles; i++) {
      particles.push(new Particle(i < protons));
    }
    particleGrid = new ParticleGrid(NUCLEUS_RADIUS * 2, 8);
    
    // Start the simulation loop if it's the first time
    if (e.data.start) {
      if (simulationInterval) clearInterval(simulationInterval);
      simulationInterval = setInterval(runSimulation, 1000 / 60); // Run simulation at 60Hz
    }
  }
};
