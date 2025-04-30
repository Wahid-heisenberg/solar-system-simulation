class Star extends CelestialBody {
    constructor(params = {}) {
        super(params);
        this.lightIntensity = params.lightIntensity || 1.5;
        this.lightColor = params.lightColor || 0xFFFFFF;
        this.emissiveIntensity = params.emissiveIntensity || 1.0;
        this.light = null;
    }
    
    createMesh() {
        const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
        
        // Use MeshPhongMaterial instead of MeshBasicMaterial for emissive properties
        const material = new THREE.MeshPhongMaterial({
            map: this.data.texture,
            emissive: this.lightColor,
            emissiveMap: this.data.texture,
            emissiveIntensity: this.emissiveIntensity,
            shininess: 0
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = this.name;
        this.mesh.position.copy(this.position);
        
        // Create light source
        this.light = new THREE.PointLight(this.lightColor, this.lightIntensity, 0);
        this.light.position.set(0, 0, 0);
        this.mesh.add(this.light);
        
        // Add to scene
        if (this.scene) {
            this.scene.add(this.mesh);
        }
        
        return this.mesh;
    }
    
    update(timeScale = 1) {
        super.update(timeScale * 0.1); // Slow down sun rotation
    }
    
    dispose() {
        super.dispose();
        if (this.light) {
            if (this.light.parent) this.light.parent.remove(this.light);
        }
    }
}
