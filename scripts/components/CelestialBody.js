class CelestialBody {
    constructor(params = {}) {
        this.name = params.name || 'Unnamed Body';
        this.radius = params.radius || 1;
        this.rotationSpeed = params.rotationSpeed || 0;
        this.rotationAxis = params.rotationAxis || new THREE.Vector3(0, 1, 0);
        this.position = params.position || new THREE.Vector3(0, 0, 0);
        this.parent = params.parent || null;
        this.scene = params.scene || null;
        this.mesh = null;
        this.orbitRadius = params.orbitRadius || 0;
        this.orbitSpeed = params.orbitSpeed || 0;
        this.orbitInclination = params.orbitInclination || 0;
        this.orbitStartAngle = params.orbitStartAngle || 0;
        this.orbitAngle = this.orbitStartAngle;
        this.data = params.data || {};
        
        // For orbit visualization
        this.orbitLine = null;
        this.showOrbit = params.showOrbit !== undefined ? params.showOrbit : true;

        this.labelMesh = null; // Will hold the text mesh for the label
        this.createLabel();
    }
    
    createMesh() {
        // To be implemented by subclasses
        console.warn('createMesh() should be implemented by subclasses');
    }
    
    createOrbitLine() {
        if (!this.parent || !this.showOrbit) return;
        
        const orbitGeometry = new THREE.BufferGeometry();
        const points = [];
        const segments = 128;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const x = Math.cos(angle) * this.orbitRadius;
            const z = Math.sin(angle) * this.orbitRadius;
            
            // Apply inclination
            const y = Math.sin(angle) * Math.sin(this.orbitInclination) * this.orbitRadius;
            
            points.push(new THREE.Vector3(x, y, z));
        }
        
        orbitGeometry.setFromPoints(points);
        
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0x444444,
            opacity: 0.3,
            transparent: true
        });
        
        this.orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        
        if (this.parent && this.parent.mesh) {
            this.parent.mesh.add(this.orbitLine);
        } else if (this.scene) {
            this.scene.add(this.orbitLine);
        }
    }
    
    createLabel() {
        // Create a canvas for the label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        // Store the canvas context for later updates
        this.labelCanvas = canvas;
        this.labelContext = context;
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        
        // Create sprite material
        const material = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true
        });
        
        // Create sprite
        this.labelMesh = new THREE.Sprite(material);
        
        // Scale the sprite
        this.labelMesh.scale.set(2, 1, 1);
        
        // Position slightly above the body
        const labelOffset = this.radius * 1.5;
        this.labelMesh.position.set(0, labelOffset, 0);
        
        // Add to parent mesh if it exists
        if (this.mesh) {
            this.mesh.add(this.labelMesh);
        }
        
        // Initial update with current name
        this.updateLabel();
    }
    
    updateLabel(text) {
        if (!this.labelContext) return;
        
        const displayText = text || (window.languageManager ? 
            window.languageManager.translatePlanetName(this.name) : 
            this.name);
        
        // Clear the canvas
        this.labelContext.clearRect(0, 0, this.labelCanvas.width, this.labelCanvas.height);
        
        // Set text properties
        this.labelContext.font = 'bold 40px Arial';
        this.labelContext.textAlign = 'center';
        this.labelContext.textBaseline = 'middle';
        
        // Draw text shadow
        this.labelContext.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.labelContext.fillText(displayText, 128 + 2, 64 + 2);
        
        // Draw text
        this.labelContext.fillStyle = 'white';
        this.labelContext.fillText(displayText, 128, 64);
        
        // Update the texture
        this.labelMesh.material.map.needsUpdate = true;
    }
    
    update(timeScale = 1) {
        if (!this.mesh) return;
        
        // Self rotation
        this.mesh.rotateOnAxis(this.rotationAxis, this.rotationSpeed * timeScale);
        
        // Orbit around parent
        if (this.parent && this.orbitRadius > 0) {
            this.orbitAngle += this.orbitSpeed * timeScale;
            
            const x = Math.cos(this.orbitAngle) * this.orbitRadius;
            const z = Math.sin(this.orbitAngle) * this.orbitRadius;
            const y = Math.sin(this.orbitAngle) * Math.sin(this.orbitInclination) * this.orbitRadius;
            
            this.mesh.position.set(x, y, z);
        }
    }
    
    dispose() {
        if (this.mesh) {
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            if (this.mesh.material) {
                if (Array.isArray(this.mesh.material)) {
                    this.mesh.material.forEach(material => material.dispose());
                } else {
                    this.mesh.material.dispose();
                }
            }
            if (this.mesh.parent) this.mesh.parent.remove(this.mesh);
        }
        
        if (this.orbitLine) {
            if (this.orbitLine.geometry) this.orbitLine.geometry.dispose();
            if (this.orbitLine.material) this.orbitLine.material.dispose();
            if (this.orbitLine.parent) this.orbitLine.parent.remove(this.orbitLine);
        }
    }
    
    onClick() {
        // Show information about this celestial body
        if (window.uiManager) {
            window.uiManager.showInfoPanel(this.name);
        }
        
        // Store reference to the selected body for language changes
        if (window.languageManager) {
            window.languageManager.setCurrentOpenPlanet(this.name);
        }
    }
}
