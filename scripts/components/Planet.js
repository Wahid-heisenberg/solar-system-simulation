class Planet extends CelestialBody {
    constructor(params = {}) {
        super(params);
        this.hasBumpMap = params.hasBumpMap || false;
        this.hasSpecularMap = params.hasSpecularMap || false;
        this.hasNightMap = params.hasNightMap || false;
        this.rings = params.rings || null;
        this.children = [];
    }
    
    createMesh() {
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32);
        const materialOptions = {
            map: this.data.texture
        };
        
        // Only add bump map if available and requested
        if (this.hasBumpMap && this.data.bumpMap) {
            materialOptions.bumpMap = this.data.bumpMap;
            materialOptions.bumpScale = 0.05;
        }
        
        // Only add specular map if available and requested
        if (this.hasSpecularMap && this.data.specularMap) {
            materialOptions.specularMap = this.data.specularMap;
            materialOptions.specular = new THREE.Color(0x333333);
            materialOptions.shininess = 5;
        }
        
        const material = new THREE.MeshPhongMaterial(materialOptions);
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = this.name;
        
        // Create rings if applicable (e.g., Saturn)
        if (this.rings && this.data.ringsTexture) {
            const ringGeometry = new THREE.RingGeometry(
                this.rings.innerRadius, 
                this.rings.outerRadius, 
                64
            );
            
            const ringMaterial = new THREE.MeshBasicMaterial({
                map: this.data.ringsTexture,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9
            });
            
            this.ringsObject = new THREE.Mesh(ringGeometry, ringMaterial);
            this.ringsObject.rotation.x = Math.PI / 2;
            this.mesh.add(this.ringsObject);
        }
        
        // Add night lights for Earth
        if (this.hasNightMap && this.data.nightMap) {
            // Create a clone for night side
            const nightGeometry = new THREE.SphereGeometry(this.radius * 1.001, 32, 32);
            const nightMaterial = new THREE.MeshBasicMaterial({
                map: this.data.nightMap,
                transparent: true,
                blending: THREE.AdditiveBlending,
                opacity: 0.8
            });
            
            this.nightMesh = new THREE.Mesh(nightGeometry, nightMaterial);
            this.mesh.add(this.nightMesh);
        }
        
        // Set initial position based on orbit parameters
        if (this.parent && this.orbitRadius > 0) {
            const x = Math.cos(this.orbitStartAngle) * this.orbitRadius;
            const z = Math.sin(this.orbitStartAngle) * this.orbitRadius;
            const y = Math.sin(this.orbitStartAngle) * Math.sin(this.orbitInclination) * this.orbitRadius;
            
            this.mesh.position.set(x, y, z);
        } else {
            this.mesh.position.copy(this.position);
        }
        
        // Add to parent or scene
        if (this.parent && this.parent.mesh) {
            this.parent.mesh.add(this.mesh);
        } else if (this.scene) {
            this.scene.add(this.mesh);
        }
        
        // Create orbit line
        this.createOrbitLine();
        
        return this.mesh;
    }
    
    addMoon(moon) {
        this.children.push(moon);
        return moon;
    }
    
    update(timeScale = 1) {
        super.update(timeScale);
        
        // Update moons and other children
        for (const child of this.children) {
            child.update(timeScale);
        }
    }
    
    dispose() {
        super.dispose();
        
        // Dispose children
        for (const child of this.children) {
            child.dispose();
        }
        
        if (this.ringsObject) {
            if (this.ringsObject.geometry) this.ringsObject.geometry.dispose();
            if (this.ringsObject.material) this.ringsObject.material.dispose();
        }
        
        if (this.nightMesh) {
            if (this.nightMesh.geometry) this.nightMesh.geometry.dispose();
            if (this.nightMesh.material) this.nightMesh.material.dispose();
        }
    }
}
