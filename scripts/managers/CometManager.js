class CometManager {
    constructor(scene) {
        this.scene = scene;
        this.comets = [];
        this.activeComets = new Set();
        this.cometChance = 0.002; // Chance per frame to spawn a new comet
    }
    
    createComets(numComets = 5) {
        for (let i = 0; i < numComets; i++) {
            const comet = new Comet({
                scene: this.scene,
                orbitRadius: 10 + Math.random() * 20,
                orbitSpeed: 0.001 + Math.random() * 0.005,
                orbitInclination: Math.random() * Math.PI * 0.5,
                orbitStartAngle: Math.random() * Math.PI * 2,
                tailLength: 1 + Math.random() * 3
            });
            
            comet.create();
            comet.deactivate(); // Start inactive
            this.comets.push(comet);
        }
    }
    
    update(timeScale = 1) {
        // Chance to activate a new comet
        if (Math.random() < this.cometChance * timeScale && 
            this.activeComets.size < Math.min(2, this.comets.length)) {
            
            // Find an inactive comet
            const inactiveComets = this.comets.filter(comet => !this.activeComets.has(comet));
            
            if (inactiveComets.length > 0) {
                const randomComet = inactiveComets[Math.floor(Math.random() * inactiveComets.length)];
                randomComet.activate();
                this.activeComets.add(randomComet);
                
                // Set a timeout to deactivate after some time
                setTimeout(() => {
                    randomComet.deactivate();
                    this.activeComets.delete(randomComet);
                }, 20000 + Math.random() * 40000); // Random time between 20-60 seconds
            }
        }
        
        // Update active comets
        for (const comet of this.activeComets) {
            comet.update(timeScale);
        }
    }
    
    disposeAll() {
        for (const comet of this.comets) {
            comet.dispose();
        }
        this.comets = [];
        this.activeComets.clear();
    }
}
