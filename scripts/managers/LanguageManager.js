class LanguageManager {
    constructor() {
        // get the current language from localStorage or default to English
        this.currentLanguage = localStorage.getItem('solarSystemLanguage') || 'en';
        this.currentOpenPlanet = null; // Track which planet info is currently shown
        this.translations = translations

        // Planet names in different languages
        this.planetNames = planetNames

        // Initialize language from localStorage or default to English
        this.initLanguage();
    }

    initLanguage() {
        const savedLanguage = localStorage.getItem('solarSystemLanguage');
        if (savedLanguage && this.translations[savedLanguage]) {
            this.currentLanguage = savedLanguage;
        }
        
        // Set document direction for RTL language (Arabic)
        if (this.currentLanguage === 'ar') {
            document.documentElement.dir = 'rtl';
            document.documentElement.lang = 'ar';
        } else {
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = this.currentLanguage;
        }
        
        // console.log(`Initializing with language: ${this.currentLanguage}`);
        
        // Update UI with current language
        this.updateUI();

        // Trigger language update event so all components can respond
        const event = new CustomEvent('languageInitialized', { detail: { language: this.currentLanguage } });
        window.dispatchEvent(event);
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('solarSystemLanguage', lang);
            
            // Set document direction for RTL language (Arabic)
            if (lang === 'ar') {
                document.documentElement.dir = 'rtl';
                document.documentElement.lang = 'ar';
            } else {
                document.documentElement.dir = 'ltr';
                document.documentElement.lang = lang;
            }
            
            // Update UI
            this.updateUI();
            
            // Refresh planet info if open
            this.refreshOpenPlanetInfo();
            
            // Update celestial body names
            this.updateCelestialBodyNames();
            
            return true;
        }
        return false;
    }

    translate(key) {
        const keys = key.split('.');
        let translation = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                // Fallback to English
                let fallback = this.translations['en'];
                for (const fb of keys) {
                    if (fallback && fallback[fb]) {
                        fallback = fallback[fb];
                    } else {
                        return key; // If all else fails, return the key
                    }
                }
                return fallback;
            }
        }
        
        return translation;
    }

    translatePlanetName(name) {
        if (!name) return '';
        
        if (this.planetNames[this.currentLanguage] && 
            this.planetNames[this.currentLanguage][name]) {
            return this.planetNames[this.currentLanguage][name];
        }
        return name; // Fallback to original name
    }

    updateUI() {
        // Update static UI elements
        document.getElementById('pause-btn').textContent = 
            this.translate('pauseBtn');
        document.getElementById('top-view-btn').textContent = 
            this.translate('topViewBtn');
        document.getElementById('reset-view-btn').textContent = 
            this.translate('resetViewBtn');
        document.querySelector('.loading-text').textContent = 
            this.translate('loadingText');
            
        // Update active language button
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            if (btn.dataset.lang === this.currentLanguage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update all planet labels in the scene
        this.updatePlanetLabels();

        // Update credits text
        const creditsLabel = document.getElementById('credits-label');
        if (creditsLabel) {
            creditsLabel.textContent = this.translate('createdBy');
        }
        
        const authorName = document.getElementById('author-name');
        if (authorName) {
            authorName.textContent = this.translate('authorName');
        }
    }

    setCurrentOpenPlanet(planetName) {
        this.currentOpenPlanet = planetName;
    }

    refreshOpenPlanetInfo() {
        // If a planet info panel is open, refresh it with the new language
        if (this.currentOpenPlanet && window.uiManager) {
            window.uiManager.refreshInfoPanel(this.currentOpenPlanet);
        }
    }

    // Update all planet names in the scene according to the current language
    updatePlanetLabels() {
        // This method is simplified since we no longer use labels
        // Just update the celestial body names for tooltips
        this.updateCelestialBodyNames();
    }
    
    // Add method to update all celestial body names
    updateCelestialBodyNames() {
        if (window.solarSystem) {
            // Update Sun
            if (window.solarSystem.sun) {
                window.solarSystem.sun.updateLanguage();
            }
            
            // Update planets
            const planets = window.solarSystem.planets;
            for (const key in planets) {
                if (planets[key]) {
                    planets[key].updateLanguage();
                }
            }
            
            // Update moons
            const moons = window.solarSystem.moons;
            for (const key in moons) {
                if (moons[key]) {
                    moons[key].updateLanguage();
                }
            }
            
            // Dispatch a custom event for controllers to detect
            const event = new CustomEvent('languageChange');
            window.dispatchEvent(event);
        }
    }
}
