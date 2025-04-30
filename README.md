# Interactive Solar System Simulation

A realistic, interactive 3D simulation of our Solar System built with HTML, CSS, JavaScript, and Three.js.

## Features

- Accurately scaled and textured planets orbiting the Sun
- Realistic lighting with the Sun emitting light and casting shadows
- Planet rotation on their own axes with correct tilt and rotation speeds
- Moons orbiting their parent planets
- Asteroid belt between Mars and Jupiter
- Occasional comets with realistic tails
- Meteor showers near Earth
- City lights visible on Earth's night side
- Interactive controls to explore the Solar System
- Time controls to speed up, slow down, or pause the simulation
- Mini-map showing the system from top-down view
- Information panels for each celestial body
- multi-language support 

## Getting Started

### Prerequisites

- A modern web browser that supports WebGL (Chrome, Firefox, Safari, Edge)
- Local web server for development (optional)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/wahid-heisenberg/solar-system.git
   ```

2. Navigate to the project directory:
   ```
   cd solar-system
   ```

3. Open `index.html` in your web browser, or serve it with a local web server.

## Usage

- **Navigation**: 
  - Click and drag to rotate the view
  - Scroll to zoom in/out
  - Press 'F' to toggle between Orbit and Fly controls

- **Interaction**:
  - Hover over planets to see their names
  - Click on a planet to focus on it and view detailed information
  - Use the buttons at the bottom to switch views

- **Time Control**:
  - Use the slider to adjust simulation speed
  - Click the Pause button to pause/resume the simulation

## Project Structure

- `/index.html` - Main HTML file
- `/styles/` - CSS stylesheets
- `/scripts/` - JavaScript code
  - `/scripts/components/` - Classes for celestial bodies
  - `/scripts/managers/` - System management classes
  - `/scripts/utils/` - Utility functions

## Technologies Used

- Three.js - 3D graphics library
- WebGL - Web Graphics Library
- HTML5 - Structure
- CSS3 - Styling
- JavaScript (ES6+) - Logic and interaction

## Performance Optimization

The simulation uses several techniques to maintain good performance:

- Instanced geometry for asteroid belt
- Efficient lighting and shadow settings
- Optimized particle systems for special effects
- Post-processing effects with appropriate settings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Planet textures courtesy of NASA
- Three.js community for examples and documentation
