// Element data
const elements = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, massNumber: 1, protons: 1, neutrons: 0, category: 'nonmetal' },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, massNumber: 4, protons: 2, neutrons: 2, category: 'noble-gas' },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, massNumber: 7, protons: 3, neutrons: 4, category: 'alkali-metal' },
  { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, massNumber: 9, protons: 4, neutrons: 5, category: 'alkaline-earth-metal' },
  { symbol: 'B', name: 'Boron', atomicNumber: 5, massNumber: 11, protons: 5, neutrons: 6, category: 'metalloid' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, massNumber: 12, protons: 6, neutrons: 6, category: 'nonmetal' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, massNumber: 14, protons: 7, neutrons: 7, category: 'nonmetal' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, massNumber: 16, protons: 8, neutrons: 8, category: 'nonmetal' },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, massNumber: 19, protons: 9, neutrons: 10, category: 'halogen' },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, massNumber: 20, protons: 10, neutrons: 10, category: 'noble-gas' },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, massNumber: 23, protons: 11, neutrons: 12, category: 'alkali-metal' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, massNumber: 24, protons: 12, neutrons: 12, category: 'alkaline-earth-metal' },
  { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, massNumber: 27, protons: 13, neutrons: 14, category: 'post-transition-metal' },
  { symbol: 'Si', name: 'Silicon', atomicNumber: 14, massNumber: 28, protons: 14, neutrons: 14, category: 'metalloid' },
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, massNumber: 31, protons: 15, neutrons: 16, category: 'nonmetal' },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, massNumber: 32, protons: 16, neutrons: 16, category: 'nonmetal' },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, massNumber: 35, protons: 17, neutrons: 18, category: 'halogen' },
  { symbol: 'Ar', name: 'Argon', atomicNumber: 18, massNumber: 40, protons: 18, neutrons: 22, category: 'noble-gas' },
  { symbol: 'K', name: 'Potassium', atomicNumber: 19, massNumber: 39, protons: 19, neutrons: 20, category: 'alkali-metal' },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, massNumber: 40, protons: 20, neutrons: 20, category: 'alkaline-earth-metal' }
];

// Current selected element
let selectedElement = elements[0]; // Start with Hydrogen

// Generate periodic table
function generatePeriodicTable() {
  const tableContainer = document.getElementById('periodic-table');
  
  elements.forEach(element => {
    const button = document.createElement('button');
    button.className = `element-button ${element.category}`;
    button.innerHTML = `
      <div class="atomic-number">${element.atomicNumber}</div>
      <div class="symbol">${element.symbol}</div>
      <div class="name">${element.name}</div>
    `;
    
    button.addEventListener('click', () => {
      selectElement(element);
    });
    
    tableContainer.appendChild(button);
  });
  
  // Select the first element by default
  updateSelection();
}

// Select an element
function selectElement(element) {
  selectedElement = element;
  updateSelection();
  updateElementInfo();
  
  // Reset the nucleus visualization
  if (typeof resetNucleus === 'function') {
    resetNucleus();
  }
}

// Update visual selection
function updateSelection() {
  const buttons = document.querySelectorAll('.element-button');
  buttons.forEach(button => {
    button.classList.remove('selected');
    const symbol = button.querySelector('.symbol').textContent;
    if (symbol === selectedElement.symbol) {
      button.classList.add('selected');
    }
  });
}

// Update element information display
function updateElementInfo() {
  document.getElementById('element-name').textContent = `${selectedElement.name} (${selectedElement.symbol})`;
  document.getElementById('proton-count').textContent = `${selectedElement.protons} Proton${selectedElement.protons !== 1 ? 's' : ''}`;
  document.getElementById('neutron-count').textContent = `${selectedElement.neutrons} Neutron${selectedElement.neutrons !== 1 ? 's' : ''}`;
  document.getElementById('atomic-number').textContent = selectedElement.atomicNumber;
  document.getElementById('mass-number').textContent = selectedElement.massNumber;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  generatePeriodicTable();
  updateElementInfo();
});
