class CelestialBody {
    constructor(params = {}) {
        this.originalName = params.name; // Store original name for data lookups
        this.name = params.name;         // This will be translated
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

        // Remove permanent label creation
        // this.labelMesh = null; // Will hold the text mesh for the label
        // this.createLabel();

        // Initialize translated name if language manager exists
        if (window.languageManager) {
            this.name = window.languageManager.translatePlanetName(this.originalName);
        }
    }
    
    createMesh() {
        // To be implemented by subclasses
        // console.warn('createMesh() should be implemented by subclasses');
        
        // Add these lines as a template for subclasses to follow
        if (this.mesh) {
            // Always set userData on mesh to reference this celestial body
            this.mesh.userData = { celestialBody: this };
            this.mesh.name = this.originalName;
        }
        
        return this.mesh;
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
    
    // Comment out or remove the createLabel method
    /*
    createLabel() {
        // This method is no longer needed as we're using tooltips instead
    }
    
    updateLabel(text) {
        // This method is no longer needed as we're using tooltips instead
    }
    */
    
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
        // Show information about this celestial body using original name for consistent lookup
        if (window.uiManager) {
            window.uiManager.showInfoPanel(this.originalName);
            console.log("Clicked on: " + this.originalName);
        }
        
        // Store reference to the selected body for language changes
        if (window.languageManager) {
            window.languageManager.setCurrentOpenPlanet(this.originalName);
        }
    }

    // Add a method to update the translated name
    updateLanguage() {
        if (window.languageManager) {
            // Update name with translated version
            this.name = window.languageManager.translatePlanetName(this.originalName);
            
            // Make sure userData is updated on the mesh and any child objects
            if (this.mesh) {
                this.mesh.userData.celestialBody = this;
                
                // Update all child objects too
                this.mesh.traverse(child => {
                    if (child !== this.mesh) {
                        child.userData = child.userData || {};
                        child.userData.celestialBody = this;
                    }
                });
            }
            
            // Remove label update since we don't use labels anymore
            /*
            if (this.labelMesh) {
                this.updateLabel(this.name);
            }
            */
        }
    }
}
