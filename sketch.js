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

// Debug mode to help troubleshoot visibility
let debugMode = false;

function setup() {
  let canvas = createCanvas(canvasSize, canvasSize, WEBGL);
  canvas.parent('canvas-container');
  
  // Initialize the physics worker
  physicsWorker = new Worker('physics-worker.js');
  
  // Listen for messages (updated particle positions) from the worker
  physicsWorker.onmessage = (e) => {
    // Store the latest particle data for rendering
    particles = e.data;
    
    // Debug: Log first particle position if available
    if (debugMode && particles.length > 0) {
      console.log("First particle position:", particles[0].pos);
    }
  };

  // Initialize with the first element (Hydrogen)
  resetNucleus(true); // Pass true to start the worker's loop
}

function draw() {
  background(0);
  
  // Debug: Show axes to help orientation
  if (debugMode) {
    push();
    stroke(255, 0, 0);
    line(0, 0, 0, 100, 0, 0); // X axis (red)
    stroke(0, 255, 0);
    line(0, 0, 0, 0, 100, 0); // Y axis (green)
    stroke(0, 0, 255);
    line(0, 0, 0, 0, 0, 100); // Z axis (blue)
    pop();
  }

  // Set camera to a fixed position for debugging
  // This places camera slightly back and above to look at origin
  camera(0, -100, 300, 0, 0, 0, 0, 1, 0);
  
  // Enhanced lighting setup
  ambientLight(80, 80, 80); // Increased ambient light
  pointLight(255, 255, 255, 0, -200, 200); // Above
  pointLight(200, 200, 200, 200, 0, 100); // Right side
  
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
  
  // Gentle rotation (reduced for debugging)
  if (!debugMode) {
    rotateY(frameCount * 0.002);
    rotateX(frameCount * 0.001);
  }

  // Draw nucleus boundary (brighter in debug mode)
  stroke(255, 255, 255, debugMode ? 100 : 30);
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
    
    // Debug: Draw particle with wireframe in debug mode
    if (debugMode) {
      if (p.type === 'proton') {
        fill(255, 68, 68);
        stroke(255, 255, 255, 100);
      } else {
        fill(59, 130, 246);
        stroke(255, 255, 255, 100);
      }
      strokeWeight(1);
    } else {
      // Normal rendering with materials
      if (p.type === 'proton') {
        fill(255, 68, 68);
      } else {
        fill(59, 130, 246);
      }
      noStroke();
    }
    
    // Larger spheres for visibility during debugging
    sphere(debugMode ? 15 : 12);
    pop();
  }
  
  // Debug info overlay
  if (debugMode) {
    push();
    // Move to screen coordinates for text
    camera();
    ortho();
    noLights();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(12);
    text(`Debug Mode: ON\nParticles: ${particles.length}\nFPS: ${currentFps.toFixed(1)}`, 10, 10);
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

// Toggle debug mode with keypress
function keyPressed() {
  if (key === 'd' || key === 'D') {
    debugMode = !debugMode;
    console.log("Debug mode:", debugMode);
  }
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
