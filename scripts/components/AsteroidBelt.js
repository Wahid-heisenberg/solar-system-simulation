class AsteroidBelt {
    constructor(params = {}) {
        this.innerRadius = params.innerRadius || 2.2;
        this.outerRadius = params.outerRadius || 3.3;
        this.count = params.count || 2000;
        this.size = params.size || { min: 0.01, max: 0.1 };
        this.scene = params.scene || null;
        this.parent = params.parent || null;
        this.texture = params.texture || null;
        this.material = null;
        this.asteroids = null;
    }
    
    create() {
        const asteroidGeometry = new THREE.SphereGeometry(1, 6, 6);
        
        this.material = new THREE.MeshPhongMaterial({
            color: 0xAAAAAA,
            flatShading: true
        });
        
        if (this.texture) {
            this.material.map = this.texture;
        }
        
        // Create instanced mesh for performance
        this.asteroids = new THREE.InstancedMesh(
            asteroidGeometry,
            this.material,
            this.count
        );
        
        // Create dummy for transformations
        const dummy = new THREE.Object3D();
        
        // Position each asteroid
        for (let i = 0; i < this.count; i++) {
            // Random radius within the belt
            const radius = this.innerRadius + Math.random() * (this.outerRadius - this.innerRadius);
            
            // Random angle around the sun
            const angle = Math.random() * Math.PI * 2;
            
            // Add some variation in height
            const height = (Math.random() - 0.5) * 0.2;
            
            // Set position
            dummy.position.x = Math.cos(angle) * radius;
            dummy.position.z = Math.sin(angle) * radius;
            dummy.position.y = height * radius;
            
            // Random rotation
            dummy.rotation.x = Math.random() * Math.PI;
            dummy.rotation.y = Math.random() * Math.PI;
            dummy.rotation.z = Math.random() * Math.PI;
            
            // Random scale
            const scale = this.size.min + Math.random() * (this.size.max - this.size.min);
            dummy.scale.set(scale, scale, scale);
            
            // Update matrix
            dummy.updateMatrix();
            
            // Apply to instance
            this.asteroids.setMatrixAt(i, dummy.matrix);
        }
        
        this.asteroids.instanceMatrix.needsUpdate = true;
        
        // Add to parent or scene
        if (this.parent && this.parent.mesh) {
            this.parent.mesh.add(this.asteroids);
        } else if (this.scene) {
            this.scene.add(this.asteroids);
        }
        
        return this.asteroids;
    }
    
    animate(timeScale = 1) {
        if (!this.asteroids) return;
        
        const dummy = new THREE.Object3D();
        
        for (let i = 0; i < this.count; i++) {
            // Get current matrix
            this.asteroids.getMatrixAt(i, dummy.matrix);
            dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
            
            // Calculate angle from center
            const angle = Math.atan2(dummy.position.z, dummy.position.x);
            const radius = Math.sqrt(dummy.position.x * dummy.position.x + dummy.position.z * dummy.position.z);
            
            // Orbital motion - smaller asteroids move faster
            const speed = (0.0005 / dummy.scale.x) * timeScale;
            const newAngle = angle + speed;
            
            // Update position
            dummy.position.x = Math.cos(newAngle) * radius;
            dummy.position.z = Math.sin(newAngle) * radius;
            
            // Rotate the asteroid
            dummy.rotation.y += 0.01 * timeScale;
            
            // Update matrix
            dummy.updateMatrix();
            this.asteroids.setMatrixAt(i, dummy.matrix);
        }
        
        this.asteroids.instanceMatrix.needsUpdate = true;
    }
    
    dispose() {
        if (this.asteroids) {
            if (this.asteroids.geometry) this.asteroids.geometry.dispose();
            if (this.asteroids.material) this.asteroids.material.dispose();
            if (this.asteroids.parent) this.asteroids.parent.remove(this.asteroids);
        }
    }
}
