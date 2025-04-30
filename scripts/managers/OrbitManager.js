class OrbitManager {
    constructor(scene) {
        this.scene = scene;
        this.celestialBodies = [];
    }
    
    addBody(body) {
        this.celestialBodies.push(body);
        return body;
    }
    
    updateOrbits(timeScale = 1) {
        for (const body of this.celestialBodies) {
            body.update(timeScale);
        }
    }
    
    showAllOrbits() {
        for (const body of this.celestialBodies) {
            if (body.orbitLine) {
                body.orbitLine.visible = true;
            }
        }
    }
    
    hideAllOrbits() {
        for (const body of this.celestialBodies) {
            if (body.orbitLine) {
                body.orbitLine.visible = false;
            }
        }
    }
    
    disposeAll() {
        for (const body of this.celestialBodies) {
            body.dispose();
        }
        this.celestialBodies = [];
    }
}
