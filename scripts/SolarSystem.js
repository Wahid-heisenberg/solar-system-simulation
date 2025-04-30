class SolarSystem {
    constructor() {
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        
        // Managers
        this.assetManager = null;
        this.orbitManager = null;
        this.cometManager = null;
        this.controlsManager = null;
        
        // Celestial bodies
        this.sun = null;
        this.planets = {};
        this.moons = {};
        this.asteroidBelt = null;
        
        // Effect objects
        this.meteorSystem = null;
        
        // Animation
        this.clock = new THREE.Clock();
        this.timeScale = 1.0;
        
        // Initialize the system
        this.initialize();
    }
    
    initialize() {
        // Create asset manager and load assets
        this.assetManager = new AssetManager();
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            60, window.innerWidth / window.innerHeight, 0.1, 1000
        );
        this.camera.position.set(0, 15, 30);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer with proper settings
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 1); // Force black background
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        // Create managers
        this.orbitManager = new OrbitManager(this.scene);
        this.cometManager = new CometManager(this.scene);
        window.controlsManager = this.controlsManager = new ControlsManager(this.camera, this.renderer, this.scene);
        window.uiManager = this.uiManager = new UIManager();
        
        // Set up controls
        this.controlsManager.initialize();
        
        // Create post-processing effects
        this.setupPostProcessing();
        
        // Add skybox
        this.createStarfield();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Add event listener for language initialization to update celestial bodies
        window.addEventListener('languageInitialized', () => {
            if (this.sun && window.languageManager) {
                // Update all celestial body names when language is initialized
                window.languageManager.updateCelestialBodyNames();
            }
        });
        
        // Load assets and then create all celestial bodies
        this.assetManager.loadSolarSystemAssets().then(() => {
            this.createCelestialBodies();
            this.createSpecialEffects();
            
            // Initialize mini-map
            this.uiManager.createMiniMap(this.scene, this.camera);
            
            // Hide loading screen
            this.uiManager.hideLoading();
            
            // Start animation loop
            this.animate();
        });
    }
    
    setupPostProcessing() {
        // Create composer
        this.composer = new THREE.EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add bloom pass for sun glow
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,  // strength
            0.4,  // radius
            0.85  // threshold
        );
        this.composer.addPass(bloomPass);
    }
    
    createStarfield() {
        // Create a large sphere with stars texture on the inside
        const geometry = new THREE.SphereGeometry(500, 32, 32);
        
        // Make sure we're using the correct texture and proper settings
        const starsTexture = this.assetManager.getTexture('stars');
        if (!starsTexture) {
            console.warn('Stars texture not loaded, creating black background');
            // If texture failed to load, create a black background instead
            const material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.BackSide
            });
            const starfield = new THREE.Mesh(geometry, material);
            this.scene.add(starfield);
            return;
        }
        
        // Set proper texture settings for stars
        starsTexture.wrapS = THREE.RepeatWrapping;
        starsTexture.wrapT = THREE.RepeatWrapping;
        
        const material = new THREE.MeshBasicMaterial({
            map: starsTexture,
            side: THREE.BackSide,
            fog: false
        });
        
        const starfield = new THREE.Mesh(geometry, material);
        this.scene.add(starfield);
    }
    
    createCelestialBodies() {
        // Create the Sun
        this.sun = new Star({
            name: 'Sun',
            radius: 3,
            rotationSpeed: 0.001,
            lightIntensity: 1.5,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('sun')
            }
        });
        const sunMesh = this.sun.createMesh();
        this.orbitManager.addBody(this.sun);
        this.controlsManager.addHoverObject(sunMesh);
        this.controlsManager.addClickObject(sunMesh);
        
        // Create Mercury
        this.planets.mercury = new Planet({
            name: 'Mercury',
            radius: 0.38,
            rotationSpeed: 0.005,
            parent: this.sun,
            orbitRadius: 5,
            orbitSpeed: 0.02,
            orbitInclination: 0.034,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('mercury')
            }
        });
        const mercuryMesh = this.planets.mercury.createMesh();
        this.orbitManager.addBody(this.planets.mercury);
        this.controlsManager.addHoverObject(mercuryMesh);
        this.controlsManager.addClickObject(mercuryMesh);
        
        // Create Venus
        this.planets.venus = new Planet({
            name: 'Venus',
            radius: 0.95,
            rotationSpeed: -0.0024, // Retrograde rotation
            parent: this.sun,
            orbitRadius: 7,
            orbitSpeed: 0.015,
            orbitInclination: 0.009,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('venus')
            }
        });
        const venusMesh = this.planets.venus.createMesh();
        this.orbitManager.addBody(this.planets.venus);
        this.controlsManager.addHoverObject(venusMesh);
        this.controlsManager.addClickObject(venusMesh);
        
        // Create Earth
        this.planets.earth = new Planet({
            name: 'Earth',
            radius: 1,
            rotationSpeed: 0.01,
            parent: this.sun,
            orbitRadius: 10,
            orbitSpeed: 0.01,
            orbitInclination: 0.0167,
            scene: this.scene,
            hasBumpMap: true,
            hasSpecularMap: true,
            hasNightMap: true,
            data: {
                texture: this.assetManager.getTexture('earth'),
                bumpMap: this.assetManager.getTexture('earthBump'),
                specularMap: this.assetManager.getTexture('earthSpecular'),
                nightMap: this.assetManager.getTexture('earthNight')
            }
        });
        const earthMesh = this.planets.earth.createMesh();
        this.orbitManager.addBody(this.planets.earth);
        this.controlsManager.addHoverObject(earthMesh);
        this.controlsManager.addClickObject(earthMesh);
        
        // Create Earth's Moon
        this.moons.moon = new Moon({
            name: 'Moon',
            radius: 0.27,
            rotationSpeed: 0.001,
            parent: this.planets.earth,
            orbitRadius: 2.5,
            orbitSpeed: 0.03,
            orbitInclination: 0.08,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('moon')
            }
        });
        const moonMesh = this.moons.moon.createMesh();
        this.planets.earth.addMoon(this.moons.moon);
        this.orbitManager.addBody(this.moons.moon);
        this.controlsManager.addHoverObject(moonMesh);
        this.controlsManager.addClickObject(moonMesh);
        
        // Create Mars
        this.planets.mars = new Planet({
            name: 'Mars',
            radius: 0.53,
            rotationSpeed: 0.009,
            parent: this.sun,
            orbitRadius: 13,
            orbitSpeed: 0.008,
            orbitInclination: 0.035,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('mars')
            }
        });
        const marsMesh = this.planets.mars.createMesh();
        this.orbitManager.addBody(this.planets.mars);
        this.controlsManager.addHoverObject(marsMesh);
        this.controlsManager.addClickObject(marsMesh);
        
        // Create asteroid belt
        this.asteroidBelt = new AsteroidBelt({
            innerRadius: 15,
            outerRadius: 17,
            count: 2000,
            scene: this.scene,
            parent: this.sun
        });
        this.asteroidBelt.create();
        
        // Create Jupiter
        this.planets.jupiter = new Planet({
            name: 'Jupiter',
            radius: 2.5, // Actually 11.2, scaled down for visualization
            rotationSpeed: 0.02,
            parent: this.sun,
            orbitRadius: 21,
            orbitSpeed: 0.004,
            orbitInclination: 0.018,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('jupiter')
            }
        });
        const jupiterMesh = this.planets.jupiter.createMesh();
        this.orbitManager.addBody(this.planets.jupiter);
        this.controlsManager.addHoverObject(jupiterMesh);
        this.controlsManager.addClickObject(jupiterMesh);
        
        // Create Jupiter's moons (Galilean moons)
        // Io
        this.moons.io = new Moon({
            name: 'Io',
            radius: 0.28,
            rotationSpeed: 0.005,
            parent: this.planets.jupiter,
            orbitRadius: 3.5,
            orbitSpeed: 0.04,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('moon') // Substituting texture
            }
        });
        const ioMesh = this.moons.io.createMesh();
        this.planets.jupiter.addMoon(this.moons.io);
        this.orbitManager.addBody(this.moons.io);
        
        // Europa
        this.moons.europa = new Moon({
            name: 'Europa',
            radius: 0.24,
            rotationSpeed: 0.005,
            parent: this.planets.jupiter,
            orbitRadius: 4.2,
            orbitSpeed: 0.03,
            orbitStartAngle: Math.PI/2,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('moon') // Substituting texture
            }
        });
        const europaMesh = this.moons.europa.createMesh();
        this.planets.jupiter.addMoon(this.moons.europa);
        this.orbitManager.addBody(this.moons.europa);
        
        // Create Saturn
        this.planets.saturn = new Planet({
            name: 'Saturn',
            radius: 2.2, // Actually 9.5, scaled down for visualization
            rotationSpeed: 0.018,
            parent: this.sun,
            orbitRadius: 26,
            orbitSpeed: 0.003,
            orbitInclination: 0.043,
            scene: this.scene,
            rings: {
                innerRadius: 2.5,
                outerRadius: 4
            },
            data: {
                texture: this.assetManager.getTexture('saturn'),
                ringsTexture: this.assetManager.getTexture('saturnRings')
            }
        });
        const saturnMesh = this.planets.saturn.createMesh();
        this.orbitManager.addBody(this.planets.saturn);
        this.controlsManager.addHoverObject(saturnMesh);
        this.controlsManager.addClickObject(saturnMesh);
        
        // Create Uranus
        this.planets.uranus = new Planet({
            name: 'Uranus',
            radius: 1.8, // Actually 4.0, scaled down for visualization
            rotationSpeed: 0.012,
            rotationAxis: new THREE.Vector3(0.5, 0.9, 0), // Tilted axis
            parent: this.sun,
            orbitRadius: 32,
            orbitSpeed: 0.002,
            orbitInclination: 0.013,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('uranus')
            }
        });
        const uranusMesh = this.planets.uranus.createMesh();
        this.orbitManager.addBody(this.planets.uranus);
        this.controlsManager.addHoverObject(uranusMesh);
        this.controlsManager.addClickObject(uranusMesh);
        
        // Create Neptune
        this.planets.neptune = new Planet({
            name: 'Neptune',
            radius: 1.7, // Actually 3.9, scaled down for visualization
            rotationSpeed: 0.014,
            parent: this.sun,
            orbitRadius: 36,
            orbitSpeed: 0.001,
            orbitInclination: 0.03,
            scene: this.scene,
            data: {
                texture: this.assetManager.getTexture('neptune')
            }
        });
        const neptuneMesh = this.planets.neptune.createMesh();
        this.orbitManager.addBody(this.planets.neptune);
        this.controlsManager.addHoverObject(neptuneMesh);
        this.controlsManager.addClickObject(neptuneMesh);
        
        // After all bodies are created, ensure their userData references are set
        setTimeout(() => {
            // Update all planet names and references
            if (window.languageManager) {
                window.languageManager.updateCelestialBodyNames();
            }
        }, 100);
    }
    
    createSpecialEffects() {
        // Create comets
        this.cometManager.createComets(5);
        
        // Create meteor system (near Earth)
        this.createMeteorSystem();
    }
    
    createMeteorSystem() {
        // Meteor particle system
        const meteorGeometry = new THREE.BufferGeometry();
        const meteorCount = 50;
        
        // Create positions, velocities and colors
        this.meteorPositions = new Float32Array(meteorCount * 3);
        this.meteorVelocities = [];
        const meteorColors = new Float32Array(meteorCount * 3);
        const meteorSizes = new Float32Array(meteorCount);
        
        // Initialize meteors
        for (let i = 0; i < meteorCount; i++) {
            // Random position far from Earth
            const radius = 12; // Just outside Earth's orbit
            const randomAngle = Math.random() * Math.PI * 2;
            const randomHeight = (Math.random() - 0.5) * 4;
            
            const index = i * 3;
            this.meteorPositions[index] = Math.cos(randomAngle) * radius;
            this.meteorPositions[index + 1] = randomHeight;
            this.meteorPositions[index + 2] = Math.sin(randomAngle) * radius;
            
            // Velocity toward Earth with some randomness
            const earthPos = new THREE.Vector3(10, 0, 0); // Approximate Earth position
            const meteorPos = new THREE.Vector3(
                this.meteorPositions[index],
                this.meteorPositions[index + 1],
                this.meteorPositions[index + 2]
            );
            
            const direction = new THREE.Vector3().subVectors(earthPos, meteorPos).normalize();
            
            // Add some randomness to direction
            direction.x += (Math.random() - 0.5) * 0.3;
            direction.y += (Math.random() - 0.5) * 0.3;
            direction.z += (Math.random() - 0.5) * 0.3;
            
            // Random speed
            const speed = 0.05 + Math.random() * 0.15;
            
            this.meteorVelocities.push({
                direction: direction,
                speed: speed,
                active: false,
                trailLength: 5 + Math.random() * 15
            });
            
            // Color (white to blue)
            meteorColors[index] = 0.8 + Math.random() * 0.2;
            meteorColors[index + 1] = 0.8 + Math.random() * 0.2;
            meteorColors[index + 2] = 1.0;
            
            // Size
            meteorSizes[i] = 0.05 + Math.random() * 0.2;
        }
        
        meteorGeometry.setAttribute('position', new THREE.BufferAttribute(this.meteorPositions, 3));
        meteorGeometry.setAttribute('color', new THREE.BufferAttribute(meteorColors, 3));
        meteorGeometry.setAttribute('size', new THREE.BufferAttribute(meteorSizes, 1));
        
        // Material with trails
        const meteorMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        this.meteorSystem = new THREE.Points(meteorGeometry, meteorMaterial);
        this.scene.add(this.meteorSystem);
        
        // Create meteor trails
        this.createMeteorTrails(meteorCount);
    }
    
    createMeteorTrails(meteorCount) {
        // Create a line for each meteor to represent its trail
        this.meteorTrails = [];
        
        for (let i = 0; i < meteorCount; i++) {
            const trailGeometry = new THREE.BufferGeometry();
            const trailPositions = new Float32Array(30 * 3); // 30 points per trail
            
            // Initialize all positions to the meteor's position
            const index = i * 3;
            const pos = new THREE.Vector3(
                this.meteorPositions[index],
                this.meteorPositions[index + 1],
                this.meteorPositions[index + 2]
            );
            
            for (let j = 0; j < 30; j++) {
                const trailIndex = j * 3;
                trailPositions[trailIndex] = pos.x;
                trailPositions[trailIndex + 1] = pos.y;
                trailPositions[trailIndex + 2] = pos.z;
            }
            
            trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
            
            const trailMaterial = new THREE.LineBasicMaterial({
                color: 0x88AAFF,
                transparent: true,
                opacity: 0.4
            });
            
            const trail = new THREE.Line(trailGeometry, trailMaterial);
            trail.frustumCulled = false; // Ensure trails don't disappear
            trail.visible = false; // Start hidden
            
            this.scene.add(trail);
            this.meteorTrails.push({
                line: trail,
                positions: trailPositions,
                active: false
            });
        }
    }
    
    updateMeteors(timeScale) {
        if (!this.meteorSystem) return;
        
        const positions = this.meteorSystem.geometry.attributes.position.array;
        const meteorChance = 0.01 * timeScale; // Chance for a meteor to become active
        
        for (let i = 0; i < positions.length / 3; i++) {
            const index = i * 3;
            const velocity = this.meteorVelocities[i];
            
            // If inactive, check if it should become active
            if (!velocity.active && Math.random() < meteorChance) {
                velocity.active = true;
                this.meteorTrails[i].active = true;
                this.meteorTrails[i].line.visible = true;
                
                // Reset position to outside the system
                const radius = 12 + Math.random() * 5;
                const randomAngle = Math.random() * Math.PI * 2;
                const randomHeight = (Math.random() - 0.5) * 4;
                
                positions[index] = Math.cos(randomAngle) * radius;
                positions[index + 1] = randomHeight;
                positions[index + 2] = Math.sin(randomAngle) * radius;
                
                // New velocity toward Earth with randomness
                const earthPos = new THREE.Vector3(
                    this.planets.earth.mesh.position.x,
                    this.planets.earth.mesh.position.y,
                    this.planets.earth.mesh.position.z
                );
                
                const meteorPos = new THREE.Vector3(
                    positions[index],
                    positions[index + 1],
                    positions[index + 2]
                );
                
                velocity.direction = new THREE.Vector3().subVectors(earthPos, meteorPos).normalize();
                
                // Add randomness
                velocity.direction.x += (Math.random() - 0.5) * 0.5;
                velocity.direction.y += (Math.random() - 0.5) * 0.5;
                velocity.direction.z += (Math.random() - 0.5) * 0.5;
                velocity.direction.normalize();
                
                // Random speed
                velocity.speed = 0.05 + Math.random() * 0.15;
            }
            
            // Update active meteors
            if (velocity.active) {
                // Move in velocity direction
                positions[index] += velocity.direction.x * velocity.speed * timeScale;
                positions[index + 1] += velocity.direction.y * velocity.speed * timeScale;
                positions[index + 2] += velocity.direction.z * velocity.speed * timeScale;
                
                // Update trail
                if (this.meteorTrails[i].active) {
                    const trailPositions = this.meteorTrails[i].positions;
                    
                    // Shift all positions one step back
                    for (let j = trailPositions.length - 3; j >= 3; j -= 3) {
                        trailPositions[j] = trailPositions[j - 3];
                        trailPositions[j + 1] = trailPositions[j - 2];
                        trailPositions[j + 2] = trailPositions[j - 1];
                    }
                    
                    // Set first position to current meteor position
                    trailPositions[0] = positions[index];
                    trailPositions[1] = positions[index + 1];
                    trailPositions[2] = positions[index + 2];
                    
                    this.meteorTrails[i].line.geometry.attributes.position.needsUpdate = true;
                }
                
                // Check if meteor has gone too far into the system
                const distToCenter = Math.sqrt(
                    positions[index] * positions[index] + 
                    positions[index + 1] * positions[index + 1] + 
                    positions[index + 2] * positions[index + 2]
                );
                
                if (distToCenter < 3) {
                    velocity.active = false;
                    this.meteorTrails[i].active = false;
                    this.meteorTrails[i].line.visible = false;
                }
            }
        }
        
        this.meteorSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    onWindowResize() {
        // Update camera
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer and composer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const delta = this.clock.getDelta();
        this.timeScale = this.uiManager.getTimeScale();
        
        // Update controls
        this.controlsManager.update(delta);
        
        // Update orbits
        this.orbitManager.updateOrbits(this.timeScale);
        
        // Update asteroid belt
        if (this.asteroidBelt) {
            this.asteroidBelt.animate(this.timeScale);
        }
        
        // Update comets
        this.cometManager.update(this.timeScale);
        
        // Update meteors
        this.updateMeteors(this.timeScale);
        
        // Render scene with post-processing if available, otherwise use standard renderer
        if (this.usePostProcessing && this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
        
        // Render mini-map if available
        if (this.uiManager.renderMiniMap) {
            this.uiManager.renderMiniMap();
        }
    }
    
    dispose() {
        // Dispose all objects and resources
        this.orbitManager.disposeAll();
        this.cometManager.disposeAll();
        
        if (this.asteroidBelt) {
            this.asteroidBelt.dispose();
        }
        
        // Dispose meteor system
        if (this.meteorSystem) {
            if (this.meteorSystem.geometry) this.meteorSystem.geometry.dispose();
            if (this.meteorSystem.material) this.meteorSystem.material.dispose();
            if (this.meteorSystem.parent) this.meteorSystem.parent.remove(this.meteorSystem);
        }
        
        // Dispose meteor trails
        if (this.meteorTrails) {
            for (const trail of this.meteorTrails) {
                if (trail.line.geometry) trail.line.geometry.dispose();
                if (trail.line.material) trail.line.material.dispose();
                if (trail.line.parent) trail.line.parent.remove(trail.line);
            }
        }
        
        // Dispose renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}
