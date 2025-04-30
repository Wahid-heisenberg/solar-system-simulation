class Moon extends CelestialBody {
    constructor(params = {}) {
        super(params);
    }
    
    createMesh() {
        const geometry = new THREE.SphereGeometry(this.radius, 24, 24);
        
        // Create material with proper handling for optional bump map
        const materialOptions = {
            map: this.data.texture
        };
        
        // Only add bumpMap if it exists
        if (this.data.bumpMap) {
            materialOptions.bumpMap = this.data.bumpMap;
            materialOptions.bumpScale = 0.02;
        }
        
        const material = new THREE.MeshPhongMaterial(materialOptions);
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = this.name;
        
        // Set initial position based on orbit parameters
        if (this.parent && this.orbitRadius > 0) {
            const x = Math.cos(this.orbitStartAngle) * this.orbitRadius;
            const z = Math.sin(this.orbitStartAngle) * this.orbitRadius;
            const y = Math.sin(this.orbitStartAngle) * Math.sin(this.orbitInclination) * this.orbitRadius;
            
            this.mesh.position.set(x, y, z);
        } else {
            this.mesh.position.copy(this.position);
        }
        
        // Add to parent
        if (this.parent && this.parent.mesh) {
            this.parent.mesh.add(this.mesh);
        } else if (this.scene) {
            this.scene.add(this.mesh);
        }
        
        // Create orbit line
        this.createOrbitLine();
        
        return this.mesh;
    }
}
