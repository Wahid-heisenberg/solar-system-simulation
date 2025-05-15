class UIManager {
    constructor() {
        this.timeScale = 1.0; // Default time scale
        this.isPaused = false;
        this.planetData = {}; // Will store data for each planet
        
        // Create language manager
        window.languageManager = this.languageManager = new LanguageManager();
        
        // Create quiz manager
        window.quizManager = this.quizManager = new QuizManager();
        
        // Initialize UI elements
        this.initializeUI();
        
        // Listen for language initialization
        window.addEventListener('languageInitialized', () => {
            this.updateUIForCurrentLanguage();
        });
    }
    
    initializeUI() {
        // Time control elements
        this.pauseBtn = document.getElementById('pause-btn');
        this.timeSpeedSlider = document.getElementById('time-speed');
        this.speedValueDisplay = document.getElementById('speed-value');
        
        // View control buttons
        this.topViewBtn = document.getElementById('top-view-btn');
        this.resetViewBtn = document.getElementById('reset-view-btn');
        
        // Info panel elements
        this.infoPanel = document.getElementById('info-panel');
        this.planetName = document.getElementById('planet-name');
        this.planetDetails = document.getElementById('planet-details');
        this.closeBtn = document.querySelector('.close-btn');
        
        // Loading screen
        this.loadingScreen = document.getElementById('loading-screen');
        
        // Language buttons
        this.languageButtons = document.querySelectorAll('.lang-btn');
        
        // Add event listeners
        this.addEventListeners();
        
        // Load planet data
        this.loadPlanetData();
    }
    
    addEventListeners() {
        // Pause button
        this.pauseBtn.addEventListener('click', () => {
            this.togglePause();
        });
        
        // Time speed slider
        this.timeSpeedSlider.addEventListener('input', () => {
            this.updateTimeScale(parseFloat(this.timeSpeedSlider.value));
        });
        
        // View control buttons
        this.topViewBtn.addEventListener('click', () => {
            if (window.controlsManager) {
                window.controlsManager.topView();
            }
        });
        
        this.resetViewBtn.addEventListener('click', () => {
            if (window.controlsManager) {
                window.controlsManager.resetView();
            }
        });
        
        // Close info panel
        this.closeBtn.addEventListener('click', () => {
            this.hideInfoPanel();
        });
        
        // Language buttons
        this.languageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.languageManager.setLanguage(lang);
            });
        });
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 
            this.languageManager.translate('resumeBtn') : 
            this.languageManager.translate('pauseBtn');
    }
    
    updateTimeScale(value) {
        this.timeScale = value;
        this.speedValueDisplay.textContent = value.toFixed(1) + this.languageManager.translate('speedLabel');
    }
    
    getTimeScale() {
        return this.isPaused ? 0 : this.timeScale;
    }
    
    showInfoPanel(planetName) {
        // Track the currently open planet in the language manager
        this.languageManager.setCurrentOpenPlanet(planetName);
        
        // console.log(`Showing info panel for: ${planetName}`);
        
        // Translate planet name
        const translatedName = this.languageManager.translatePlanetName(planetName);
        this.planetName.textContent = translatedName;
        
        // Get planet data in current language
        const data = this.getPlanetDataInCurrentLanguage(planetName);
        
        // console.log("Planet data:", data);
        
        if (!data) {
            // console.error(`No data found for planet: ${planetName}`);
            this.planetDetails.innerHTML = `<p>No data available for ${translatedName}</p>`;
            this.infoPanel.classList.remove('hidden');
            return;
        }
        
        // Build HTML content for planet details
        let htmlContent = '';
        
        if (data.description) {
            htmlContent += `<p>${data.description}</p>`;
        }
        
        // Add factual data with proper translations
        if (data.diameter) {
            htmlContent += `<p><strong>${this.languageManager.translate('planetDetails.diameter')}:</strong> ${data.diameter} km</p>`;
        }
        
        if (data.mass) {
            htmlContent += `<p><strong>${this.languageManager.translate('planetDetails.mass')}:</strong> ${data.mass}</p>`;
        }
        
        if (data.distance) {
            htmlContent += `<p><strong>${this.languageManager.translate('planetDetails.distance')}:</strong> ${data.distance} AU</p>`;
        }
        
        if (data.orbitPeriod) {
            htmlContent += `<p><strong>${this.languageManager.translate('planetDetails.orbitPeriod')}:</strong> ${data.orbitPeriod}</p>`;
        }
        
        if (data.rotationPeriod) {
            htmlContent += `<p><strong>${this.languageManager.translate('planetDetails.rotationPeriod')}:</strong> ${data.rotationPeriod}</p>`;
        }
        
        if (data.moons && data.moons.length > 0) {
            htmlContent += `<p><strong>${this.languageManager.translate('planetDetails.moons')}:</strong> ${data.moons.join(', ')}</p>`;
        }
        
        if (data.atmosphere) {
            htmlContent += `<p><strong>${this.languageManager.translate('planetDetails.atmosphere')}:</strong> ${data.atmosphere}</p>`;
        }
        
        if (data.temperature) {
            htmlContent += `<p><strong>${this.languageManager.translate('planetDetails.temperature')}:</strong> ${data.temperature}</p>`;
        }
        
        // Add quiz button to planet details
        htmlContent += `
            <div class="quiz-button-container">
                <button id="start-quiz-btn" class="quiz-btn">
                    <i class="fas fa-question-circle"></i> ${this.languageManager.translate('quiz.startQuiz')}
                </button>
            </div>
        `;
        
        this.planetDetails.innerHTML = htmlContent;
        this.infoPanel.classList.remove('hidden');
        
        // Add event listener to the quiz button
        document.getElementById('start-quiz-btn').addEventListener('click', () => {
            if (window.quizManager) {
                window.quizManager.startQuiz(planetName);
            }
        });
    }
    
    hideInfoPanel() {
        this.infoPanel.classList.add('hidden');
        // Clear the currently open planet when closing the panel
        this.languageManager.setCurrentOpenPlanet(null);
    }
    
    hideLoading() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }
    
    getPlanetDataInCurrentLanguage(planetName) {
        if (!planetName) {
            console.warn('No planet name provided to getPlanetDataInCurrentLanguage');
            return null;
        }
        
        // Get base data
        const baseData = this.planetData[planetName];
        
        if (!baseData) {
            console.warn(`No base data found for planet: ${planetName}`);
            return null;
        }
        
        // Try to get localized description if it exists
        const descriptions = this.planetDescriptions[this.languageManager.currentLanguage];
        if (descriptions && descriptions[planetName]) {
            // Create a new object with base data
            const localizedData = {...baseData};
            // Replace description with localized version
            localizedData.description = descriptions[planetName];
            return localizedData;
        }
        
        // If no localized description in current language, try English fallback
        if (this.languageManager.currentLanguage !== 'en') {
            const englishDescriptions = this.planetDescriptions['en'];
            if (englishDescriptions && englishDescriptions[planetName]) {
                const localizedData = {...baseData};
                localizedData.description = englishDescriptions[planetName];
                return localizedData;
            }
        }
        
        return baseData;
    }
    
    loadPlanetData() {
        // Store basic information about planets (common data like measurements)
        this.planetData = planetData
        this.planetDescriptions = planetDescriptions;
    }
    
    createMiniMap(scene, camera) {
        // Create mini-map renderer
        const miniMapContainer = document.getElementById('mini-map');
        const miniMapSize = miniMapContainer.clientWidth;
        
        const miniMapRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        miniMapRenderer.setSize(miniMapSize, miniMapSize);
        miniMapContainer.appendChild(miniMapRenderer.domElement);
        
        // Create top-down camera for mini-map
        const miniMapCamera = new THREE.OrthographicCamera(
            -15, 15, 15, -15, 0.1, 1000
        );
        miniMapCamera.position.set(0, 30, 0);
        miniMapCamera.lookAt(0, 0, 0);
        
        // Function to render mini-map
        this.renderMiniMap = () => {
            miniMapRenderer.render(scene, miniMapCamera);
        };
        
        return this.renderMiniMap;
    }
    
    // Add a new method to refresh the info panel without having to click again
    refreshInfoPanel(planetName) {
        // Only refresh if the panel is actually visible
        if (!this.infoPanel.classList.contains('hidden')) {
            this.showInfoPanel(planetName);
        }
    }
    
    updateUIForCurrentLanguage() {
        // Update any UI elements that need to reflect the current language
        this.updateTimeScale(this.timeScale); // Update speed display with correct unit
        
        // If there's an open info panel, refresh it
        if (this.languageManager.currentOpenPlanet && !this.infoPanel.classList.contains('hidden')) {
            this.refreshInfoPanel(this.languageManager.currentOpenPlanet);
        }
        
        // Update quiz UI
        if (window.quizManager) {
            window.quizManager.updateLanguage();
        }
    }
    
    createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'control-panel';
        
        // Create pause/resume button
        const pauseBtn = document.createElement('button');
        pauseBtn.id = 'pause-btn';
        pauseBtn.className = 'control-button';
        pauseBtn.innerHTML = this.isPaused ? 
            (window.languageManager ? window.languageManager.translate('resumeBtn') : 'Resume') : 
            (window.languageManager ? window.languageManager.translate('pauseBtn') : 'Pause');
        pauseBtn.addEventListener('click', () => this.togglePause());
        controlPanel.appendChild(pauseBtn);
        this.pauseBtn = pauseBtn;
        
        // Create real-time mode button with clock icon
        const realTimeBtn = document.createElement('button');
        realTimeBtn.id = 'real-time-btn';
        realTimeBtn.className = 'control-button';
        realTimeBtn.innerHTML = '<i class="fas fa-clock"></i>';
        realTimeBtn.title = window.languageManager ? 
            window.languageManager.translate('realTimeBtn') : 'Current Positions';
        
        realTimeBtn.addEventListener('click', () => {
            this.toggleRealTimeMode();
        });
        
        controlPanel.appendChild(realTimeBtn);
        this.realTimeBtn = realTimeBtn;
        
        // Create view buttons (top view, reset view)
        const topViewBtn = document.createElement('button');
        topViewBtn.id = 'top-view-btn';
        topViewBtn.className = 'control-button';
        topViewBtn.innerHTML = window.languageManager ? window.languageManager.translate('topViewBtn') : 'Top View';
        topViewBtn.addEventListener('click', () => {
            if (window.solarSystem && window.solarSystem.controlsManager) {
                window.solarSystem.controlsManager.setTopView();
            }
        });
        controlPanel.appendChild(topViewBtn);
        
        const resetViewBtn = document.createElement('button');
        resetViewBtn.id = 'reset-view-btn';
        resetViewBtn.className = 'control-button';
        resetViewBtn.innerHTML = window.languageManager ? window.languageManager.translate('resetViewBtn') : 'Reset View';
        resetViewBtn.addEventListener('click', () => {
            if (window.solarSystem && window.solarSystem.controlsManager) {
                window.solarSystem.controlsManager.resetView();
            }
        });
        controlPanel.appendChild(resetViewBtn);
        
        document.body.appendChild(controlPanel);
        
        // Create slider for time control
        // ...existing code...
    }
    
    toggleRealTimeMode() {
        if (!window.solarSystem) return;
        
        if (!window.solarSystem.realTimeMode) {
            // Switch to real-time mode
            window.solarSystem.enableRealTimeMode();
            
            // Update button appearance
            this.realTimeBtn.classList.add('active');
            this.realTimeBtn.title = window.languageManager ? 
                window.languageManager.translate('simulationBtn') : 'Return to Simulation';
            
            // Disable the pause button during real-time mode
            if (this.pauseBtn) {
                this.pauseBtn.disabled = true;
            }
            
            // Disable timeline slider during real-time mode
            if (this.timeSlider) {
                this.timeSlider.disabled = true;
            }
        } else {
            // Switch back to simulation mode
            window.solarSystem.disableRealTimeMode();
            
            // Update button appearance
            this.realTimeBtn.classList.remove('active');
            this.realTimeBtn.title = window.languageManager ? 
                window.languageManager.translate('realTimeBtn') : 'Current Positions';
            
            // Re-enable the pause button
            if (this.pauseBtn) {
                this.pauseBtn.disabled = false;
            }
            
            // Re-enable timeline slider
            if (this.timeSlider) {
                this.timeSlider.disabled = false;
            }
            
            // Unpause simulation
            this.resumeSimulation();
        }
    }
}
