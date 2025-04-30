class Comet {
    constructor(params = {}) {
        this.scene = params.scene || null;
        this.radius = params.radius || 0.05;
        this.tailLength = params.tailLength || 1;
        this.tailWidth = params.tailWidth || 0.1;
        this.orbitRadius = params.orbitRadius || 10;
        this.orbitSpeed = params.orbitSpeed || 0.005;
        this.orbitInclination = params.orbitInclination || 0.3;
        this.orbitStartAngle = params.orbitStartAngle || Math.random() * Math.PI * 2;
        this.orbitAngle = this.orbitStartAngle;
        this.active = false;
        this.mesh = null;
        this.tail = null;
        this.tailParticles = [];
        this.maxParticles = params.maxParticles || 100;
    }
    
    create() {
        // Create comet head
        const geometry = new THREE.SphereGeometry(this.radius, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            emissive: 0x88AAFF,
            emissiveIntensity: 0.2,
            specular: 0xFFFFFF
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Create tail particle system
        this.createTail();
        
        if (this.scene) {
            this.scene.add(this.mesh);
            this.scene.add(this.tail);
        }
        
        return this.mesh;
    }
    
    createTail() {
        // Create particles for tail
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.maxParticles * 3);
        const colors = new Float32Array(this.maxParticles * 3);
        const sizes = new Float32Array(this.maxParticles);
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
        });
        
        this.tail = new THREE.Points(particleGeometry, material);
        
        // Initialize tail particles
        for (let i = 0; i < this.maxParticles; i++) {
            this.tailParticles.push({
                position: new THREE.Vector3(),
                size: 0.05 + Math.random() * 0.05,
                color: new THREE.Color(),
                alpha: 1.0,
                age: 0,
                maxAge: 1 + Math.random() * 2
            });
            
            // Blue to white gradient
            const t = i / this.maxParticles;
            const color = new THREE.Color(0.5 + t * 0.5, 0.5 + t * 0.5, 1.0);
            
            // Set initial attributes
            const index = i * 3;
            colors[index] = color.r;
            colors[index + 1] = color.g;
            colors[index + 2] = color.b;
            sizes[i] = this.tailParticles[i].size;
        }
        
        this.tail.geometry.attributes.color.needsUpdate = true;
        this.tail.geometry.attributes.size.needsUpdate = true;
    }
    
    update(timeScale = 1) {
        if (!this.mesh || !this.active) return;
        
        // Update orbit position
        this.orbitAngle += this.orbitSpeed * timeScale;
        
        const x = Math.cos(this.orbitAngle) * this.orbitRadius;
        const z = Math.sin(this.orbitAngle) * this.orbitRadius;
        const y = Math.sin(this.orbitAngle) * Math.sin(this.orbitInclination) * this.orbitRadius;
        
        this.mesh.position.set(x, y, z);
        
        // Calculate velocity direction (tangent to orbit)
        const velocityX = -Math.sin(this.orbitAngle);
        const velocityZ = Math.cos(this.orbitAngle);
        const velocityDir = new THREE.Vector3(velocityX, 0, velocityZ).normalize();
        
        // Update tail particle positions
        const positions = this.tail.geometry.attributes.position.array;
        const colors = this.tail.geometry.attributes.color.array;
        const sizes = this.tail.geometry.attributes.size.array;
        
        // Emit new particles
        for (let i = 0; i < this.tailParticles.length; i++) {
            const particle = this.tailParticles[i];
            
            // Age existing particles
            particle.age += 0.02 * timeScale;
            
            if (particle.age > particle.maxAge) {
                // Reset particle at head of comet
                particle.position.copy(this.mesh.position);
                particle.age = 0;
                particle.alpha = 1.0;
                
                // Add some randomness
                const offset = new THREE.Vector3(
                    (Math.random() - 0.5) * this.radius * 2,
                    (Math.random() - 0.5) * this.radius * 2,
                    (Math.random() - 0.5) * this.radius * 2
                );
                particle.position.add(offset);
            } else {
                // Move in opposite direction of velocity
                const moveSpeed = 0.05 * timeScale;
                particle.position.x -= velocityDir.x * moveSpeed;
                particle.position.z -= velocityDir.z * moveSpeed;
                
                // Add some randomness to movement
                particle.position.x += (Math.random() - 0.5) * 0.01;
                particle.position.y += (Math.random() - 0.5) * 0.01;
                particle.position.z += (Math.random() - 0.5) * 0.01;
                
                // Fade out with age
                particle.alpha = 1.0 - (particle.age / particle.maxAge);
            }
            
            // Update buffer
            const index = i * 3;
            positions[index] = particle.position.x;
            positions[index + 1] = particle.position.y;
            positions[index + 2] = particle.position.z;
            
            // Update color (fade to transparent)
            const colorFade = particle.alpha * 0.8 + 0.2; // Keep some base color
            colors[index] *= colorFade;
            colors[index + 1] *= colorFade;
            colors[index + 2] *= colorFade;
            
            // Update size (shrink with age)
            sizes[i] = particle.size * (1 - particle.age / particle.maxAge);
        }
        
        this.tail.geometry.attributes.position.needsUpdate = true;
        this.tail.geometry.attributes.color.needsUpdate = true;
        this.tail.geometry.attributes.size.needsUpdate = true;
    }
    
    activate() {
        this.active = true;
        
        // Reset all particles to start at comet position
        for (let i = 0; i < this.tailParticles.length; i++) {
            this.tailParticles[i].position.copy(this.mesh.position);
            this.tailParticles[i].age = i / this.maxParticles * this.tailParticles[i].maxAge; // Stagger ages
        }
    }
    
    deactivate() {
        this.active = false;
    }
    
    dispose() {
        if (this.mesh) {
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            if (this.mesh.material) this.mesh.material.dispose();
            if (this.mesh.parent) this.mesh.parent.remove(this.mesh);
        }
        
        if (this.tail) {
            if (this.tail.geometry) this.tail.geometry.dispose();
            if (this.tail.material) this.tail.material.dispose();
            if (this.tail.parent) this.tail.parent.remove(this.tail);
        }
    }
}
