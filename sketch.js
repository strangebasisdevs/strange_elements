// p5.js sketch for nucleus visualization
let particles = [];
let canvasSize = 400;
let centerX, centerY;
let nucleusRadius = 120;

function setup() {
  // Create canvas and parent it to the container
  let canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent('canvas-container');
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Initialize with the first element (Hydrogen)
  resetNucleus();
}

function draw() {
  // Dark background
  background(0);
  
  // Draw nucleus boundary (faint circle)
  stroke(255, 255, 255, 30);
  strokeWeight(2);
  noFill();
  circle(centerX, centerY, nucleusRadius * 2);
  
  // Update and draw particles
  for (let particle of particles) {
    updateParticle(particle);
    drawParticle(particle);
  }
}

function resetNucleus() {
  particles = [];
  
  if (!selectedElement) return;
  
  const totalParticles = selectedElement.protons + selectedElement.neutrons;
  
  // Create particles in a rough spherical arrangement
  for (let i = 0; i < totalParticles; i++) {
    const isProton = i < selectedElement.protons;
    
    // Distribute particles in layers for better visualization
    const layer = Math.floor(i / 6); // Roughly 6 particles per layer
    const particlesInLayer = Math.min(6, totalParticles - layer * 6);
    const angleStep = TWO_PI / particlesInLayer;
    const angle = (i % 6) * angleStep + layer * 0.5; // Offset each layer
    
    const radius = 25 + layer * 20; // Increase radius for each layer
    
    particles.push({
      x: centerX + cos(angle) * radius,
      y: centerY + sin(angle) * radius,
      angle: angle,
      baseRadius: radius,
      type: isProton ? 'proton' : 'neutron',
      speed: random(0.015, 0.025), // Slight variation in rotation speed
      wobblePhase: random(TWO_PI), // Random wobble phase
      size: 12
    });
  }
}

function updateParticle(particle) {
  // Update rotation angle
  particle.angle += particle.speed;
  
  // Add slight wobble for more organic movement
  particle.wobblePhase += 0.05;
  const wobble = sin(particle.wobblePhase) * 5;
  
  // Calculate new position with wobble
  const currentRadius = particle.baseRadius + wobble;
  particle.x = centerX + cos(particle.angle) * currentRadius;
  particle.y = centerY + sin(particle.angle) * currentRadius;
}

function drawParticle(particle) {
  push();
  
  // Set particle color and glow
  if (particle.type === 'proton') {
    // Red for protons
    fill(255, 68, 68);
    stroke(255, 68, 68);
  } else {
    // Blue for neutrons
    fill(59, 130, 246);
    stroke(59, 130, 246);
  }
  
  // Draw glow effect
  strokeWeight(8);
  stroke(red(get(particle.x, particle.y)), green(get(particle.x, particle.y)), blue(get(particle.x, particle.y)), 50);
  noFill();
  circle(particle.x, particle.y, particle.size + 8);
  
  // Draw main particle
  strokeWeight(2);
  if (particle.type === 'proton') {
    stroke(255, 100, 100);
    fill(255, 68, 68);
  } else {
    stroke(100, 150, 255);
    fill(59, 130, 246);
  }
  circle(particle.x, particle.y, particle.size);
  
  // Draw particle label
  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(8);
  textFont('Arial', 8);
  text(particle.type === 'proton' ? 'p+' : 'n', particle.x, particle.y);
  
  pop();
}

// Handle window resize
function windowResized() {
  // Keep canvas size responsive but maintain aspect ratio
  const container = document.getElementById('canvas-container');
  const containerWidth = container.clientWidth;
  const newSize = Math.min(containerWidth - 40, 400); // Max 400px, with padding
  
  if (newSize !== canvasSize) {
    canvasSize = newSize;
    resizeCanvas(canvasSize, canvasSize);
    centerX = width / 2;
    centerY = height / 2;
    nucleusRadius = canvasSize * 0.3;
    resetNucleus(); // Recalculate particle positions
  }
}

// This function is called from elements.js when element changes
// (The resetNucleus function is already defined above)
