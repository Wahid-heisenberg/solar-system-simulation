// Main entry point
document.addEventListener('DOMContentLoaded', () => {
    // Create and initialize the solar system
    const solarSystem = new SolarSystem();
    
    // Handle cleanup on page unload
    window.addEventListener('beforeunload', () => {
        solarSystem.dispose();
    });
    
    // Make the solar system instance accessible globally for debugging
    window.solarSystem = solarSystem;
});
