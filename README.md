# Strange Elements - Atomic Nucleus Visualizer

A lightweight, interactive web application for visualizing atomic nuclei with spinning protons and neutrons. Built with vanilla JavaScript, p5.js, and CSS for maximum simplicity and performance.

![Demo Screenshot](demo.png)

## 🚀 Quick Start

1. **Clone the repository:**
   `ash
   git clone https://github.com/yourusername/strange-elements.git
   cd strange-elements
   `

2. **Open in browser:**
   - Simply open index.html in any modern web browser
   - Or use a local server for development

3. **Development server (optional):**
   `ash
   npm install
   npm run dev
   `

## ✨ Features

- 🔬 **Interactive Periodic Table** - Click any of 20 elements to explore
- ⚛️ **Real-time Nucleus Animation** - Watch protons and neutrons spin with physics
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 🎨 **Beautiful Design** - Modern gradient backgrounds and smooth animations
- 🔗 **Easy Embedding** - Perfect for educational websites and presentations
- ⚡ **High Performance** - 60fps animations with optimized p5.js rendering
- 🛠️ **Zero Dependencies** - No build process, just HTML/CSS/JS

## 🎯 Why p5.js?

This project uses p5.js instead of frameworks like React because:

- **Perfect for animations** - Built specifically for creative coding and particle physics
- **Simpler deployment** - No build process, works anywhere
- **Better performance** - Direct canvas manipulation optimized for 60fps
- **Easier to embed** - Single HTML file, perfect for iframes
- **Educational focus** - Clean, readable code that's easy to understand and modify

## 📁 Project Structure

`
strange-elements/
├── index.html      # Main HTML structure and layout
├── style.css       # Responsive styling and animations
├── elements.js     # Element data and periodic table logic
├── sketch.js       # p5.js nucleus visualization
├── package.json    # Development dependencies (optional)
├── README.md       # This file
└── .gitignore      # Git ignore patterns
`

## 🧪 Element Categories

The periodic table displays elements with color-coded categories:

- 🟢 **Nonmetals** (Green): H, C, N, O, P, S
- 🟣 **Noble Gases** (Purple): He, Ne, Ar  
- 🔴 **Alkali Metals** (Red): Li, Na, K
- 🟠 **Alkaline Earth Metals** (Orange): Be, Mg, Ca
- 🟡 **Metalloids** (Yellow): B, Si
- ⚫ **Post-transition Metals** (Gray): Al
- 🔵 **Halogens** (Teal): F, Cl

## 🎛️ Animation Details

- **Protons**: Red spheres with "p+" labels and glow effects
- **Neutrons**: Blue spheres with "n" labels and glow effects  
- **Orbital Motion**: Particles rotate around nucleus center with realistic physics
- **Wobble Effect**: Slight oscillation creates organic, lifelike movement
- **Layered Structure**: Particles arranged in nuclear shells for accuracy
- **Responsive Scaling**: Animation scales smoothly across all screen sizes

## 🌐 Deployment Options

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Access at https://yourusername.github.io/strange-elements

### Netlify
1. Drag and drop project folder to [Netlify](https://netlify.com)
2. Get instant URL for sharing

### Any Web Server
- Upload files to any web hosting service
- Works with Apache, Nginx, or any static hosting

### Local Development
`ash
# Option 1: Python server
python -m http.server 8000

# Option 2: Node.js live-server
npm install -g live-server
live-server --port=3000

# Option 3: PHP server
php -S localhost:8000
`

## 🔗 Embedding

Perfect for educational websites, online courses, and science demonstrations:

`html
<iframe 
  src="https://your-domain.com/strange-elements/" 
  width="100%" 
  height="800" 
  frameborder="0"
  title="Atomic Nucleus Visualizer">
</iframe>
`

## 🛠️ Customization

### Adding More Elements
Edit lements.js to include additional elements:

`javascript
const newElement = {
  symbol: 'Fe', 
  name: 'Iron', 
  atomicNumber: 26, 
  massNumber: 56, 
  protons: 26, 
  neutrons: 30, 
  category: 'transition-metal'
};
elements.push(newElement);
`

### Modifying Animation
Adjust physics in sketch.js:

`javascript
// Rotation speed
particle.speed = random(0.015, 0.025);

// Wobble intensity
const wobble = sin(particle.wobblePhase) * 5;

// Particle size
size: 12
`

### Styling Changes
Edit style.css for visual customization:

`css
/* Change background gradient */
body {
  background: linear-gradient(135deg, #1e293b 0%, #7c3aed 50%, #1e293b 100%);
}

/* Modify element button colors */
.nonmetal { background: #10b981; }
`

## 🔧 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Mobile Features

- Touch-friendly element selection
- Responsive grid layout that adapts to screen size
- Optimized canvas rendering for mobile performance
- Smooth animations even on older devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: git checkout -b feature-name
3. Make your changes and test across browsers
4. Commit changes: git commit -m 'Add feature'
5. Push to branch: git push origin feature-name
6. Create a Pull Request

## 📄 License

MIT License - Feel free to use for educational purposes, personal projects, or commercial applications.

## 🎓 Educational Use

Perfect for:
- **Chemistry classes** - Visualizing atomic structure
- **Physics courses** - Understanding nuclear composition  
- **Interactive textbooks** - Embedded demonstrations
- **Science museums** - Touch screen exhibits
- **Online courses** - Engaging visual content
- **Student projects** - Easy to modify and extend

## 🚀 Performance

- **Lightweight**: ~50KB total size
- **Fast loading**: No external dependencies except p5.js CDN
- **Smooth animation**: 60fps on modern devices
- **Memory efficient**: Optimized particle system
- **Mobile optimized**: Responsive and touch-friendly

---

Built with ❤️ and p5.js for the science education community.
