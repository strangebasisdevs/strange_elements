// p5.js sketch for nucleus visualization
let particles = []; // This will now store simple data objects, not Particle instances
let canvasSize = 400;

// Physics constants are now primarily used in the worker.
// They are kept here for reference or if needed for non-worker logic.
const NUCLEUS_RADIUS = 120;
const PROTON_REPULSION = 0.5;
const CONTAINMENT_FORCE = 0.005;
const DAMPING = 0.98;

// The Particle class and physics logic have been moved to physics-worker.js
let physicsWorker;

let fpsHistory = [];
const fpsHistoryLength = 30; // Average over 30 frames

function setup() {
  let canvas = createCanvas(canvasSize, canvasSize, WEBGL);
  canvas.parent('canvas-container');
  
  // Initialize the physics worker
  physicsWorker = new Worker('physics-worker.js');
  
  // Listen for messages (updated particle positions) from the worker
  physicsWorker.onmessage = (e) => {
    // Store the latest particle data for rendering
    particles = e.data;
  };

  // Initialize with the first element (Hydrogen)
  resetNucleus(true); // Pass true to start the worker's loop
}

function draw() {
  background(0);
  
  // --- FPS Calculation ---
  const currentFps = frameRate();
  fpsHistory.push(currentFps);
  if (fpsHistory.length > fpsHistoryLength) {
    fpsHistory.shift();
  }
  const avgFps = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
  
  // Display FPS stats
  if (document.getElementById('fps-current')) {
    document.getElementById('fps-current').textContent = currentFps.toFixed(1);
    document.getElementById('fps-avg').textContent = avgFps.toFixed(1);
  }
  
  // Add subtle rotation to the whole scene for a better 3D feel
  rotateY(frameCount * 0.002);
  rotateX(frameCount * 0.001);

  // Draw nucleus boundary (faint sphere)
  stroke(255, 255, 255, 30);
  strokeWeight(1);
  noFill();
  sphere(NUCLEUS_RADIUS);

  // --- Render Loop ---
  // The simulation runs in the background. The draw loop only renders.
  if (!particles || particles.length === 0) return;

  // Render all particles at their latest known positions
  for (let p of particles) {
    push();
    translate(p.pos.x, p.pos.y, p.pos.z);

    // Set particle color
    if (p.type === 'proton') {
      fill(255, 68, 68);
      stroke(255, 100, 100);
    } else {
      fill(59, 130, 246);
      stroke(100, 150, 255);
    }
    
    strokeWeight(1);
    sphere(12); // Use fixed size

    pop();
  }
}

function resetNucleus(startWorker = false) {
  particles = []; // Clear local particles immediately for a snappy UI
  if (!selectedElement) return;

  // Tell the worker to reset its simulation
  physicsWorker.postMessage({
    type: 'reset',
    element: {
      protons: selectedElement.protons,
      neutrons: selectedElement.neutrons
    },
    start: startWorker
  });
}

// Handle window resize
function windowResized() {
  const container = document.getElementById('canvas-container');
  const containerWidth = container.clientWidth;
  const newSize = Math.min(containerWidth - 40, 400);
  
  if (newSize !== canvasSize) {
    canvasSize = newSize;
    resizeCanvas(canvasSize, canvasSize);
    // No need to reset nucleus on resize, as positions are relative to center
  }
}

// This function is called from elements.js when element changes
// (The resetNucleus function is already defined above)
