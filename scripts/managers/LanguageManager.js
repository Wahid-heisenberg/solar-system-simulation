class LanguageManager {
    constructor() {
        this.currentLanguage = 'en';
        this.currentOpenPlanet = null; // Track which planet info is currently shown
        this.translations = {
            en: {
                pauseBtn: 'Pause',
                resumeBtn: 'Resume',
                topViewBtn: 'Top View',
                resetViewBtn: 'Reset View',
                speedLabel: 'x',
                loadingText: 'Loading Solar System...',
                planetDetails: {
                    description: 'Description',
                    diameter: 'Diameter',
                    mass: 'Mass',
                    distance: 'Distance from Sun',
                    orbitPeriod: 'Orbital Period',
                    rotationPeriod: 'Rotation Period',
                    moons: 'Moons',
                    atmosphere: 'Atmosphere',
                    temperature: 'Average Temperature'
                }
            },
            fr: {
                pauseBtn: 'Pause',
                resumeBtn: 'Reprendre',
                topViewBtn: 'Vue de Dessus',
                resetViewBtn: 'Vue par Défaut',
                speedLabel: 'x',
                loadingText: 'Chargement du Système Solaire...',
                planetDetails: {
                    description: 'Description',
                    diameter: 'Diamètre',
                    mass: 'Masse',
                    distance: 'Distance du Soleil',
                    orbitPeriod: 'Période Orbitale',
                    rotationPeriod: 'Période de Rotation',
                    moons: 'Lunes',
                    atmosphere: 'Atmosphère',
                    temperature: 'Température Moyenne'
                }
            },
            ar: {
                pauseBtn: 'إيقاف',
                resumeBtn: 'استئناف',
                topViewBtn: 'منظر علوي',
                resetViewBtn: 'إعادة ضبط',
                speedLabel: 'x',
                loadingText: 'جاري تحميل النظام الشمسي...',
                planetDetails: {
                    description: 'وصف',
                    diameter: 'القطر',
                    mass: 'الكتلة',
                    distance: 'المسافة من الشمس',
                    orbitPeriod: 'فترة المدار',
                    rotationPeriod: 'فترة الدوران',
                    moons: 'الأقمار',
                    atmosphere: 'الغلاف الجوي',
                    temperature: 'متوسط درجة الحرارة'
                }
            },
            tzm: {
                pauseBtn: 'ⵙⴱⴷ',
                resumeBtn: 'ⴽⵎⵍ',
                topViewBtn: 'ⵜⴰⵎⵓⵏⵉⵜ ⵜⴰⵎⵄⵍⴰⵢⵜ',
                resetViewBtn: 'ⴰⵔⵔⴰⵔⴰⵢ',
                speedLabel: 'x',
                loadingText: 'ⴰⵣⴷⴰⵎ ⵏ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ...',
                planetDetails: {
                    description: 'ⴰⴳⵍⴰⵎ',
                    diameter: 'ⵜⴰⵣⵍⴰⵢⵜ',
                    mass: 'ⵜⴰⴽⵜⵉⵡⵜ',
                    distance: 'ⴰⴳⴳⵓⴳ ⵅⴼ ⵜⴰⴼⵓⴽⵜ',
                    orbitPeriod: 'ⵜⴰⵙⵓⵜ ⵏ ⵓⵎⵓⴷⴷⵓ',
                    rotationPeriod: 'ⵜⴰⵙⵓⵜ ⵏ ⵓⵏⵏⵓⵕⵥⵎ',
                    moons: 'ⴰⵢⵓⵔⵏ',
                    atmosphere: 'ⴰⵀⵡⴰ',
                    temperature: 'ⴰⵣⵣⵓⵎ ⵏ ⵜⴽⵓⵙⵜ'
                }
            },
            tzm_lat: {
                pauseBtn: 'Sbedd',
                resumeBtn: 'Kmel',
                topViewBtn: 'Tamunit Tamaɛlayt',
                resetViewBtn: 'Arraray',
                speedLabel: 'x',
                loadingText: 'Azdam n usnglal atafukt...',
                planetDetails: {
                    description: 'Aglam',
                    diameter: 'Tazlayt',
                    mass: 'Taktiwt',
                    distance: 'Aggug ɣef tafukt',
                    orbitPeriod: 'Tasut n umuddud',
                    rotationPeriod: 'Tasut n unnuṛẓem',
                    moons: 'Ayurn',
                    atmosphere: 'Ahwa',
                    temperature: 'Azzum n tkust'
                }
            }
        };

        // Planet names in different languages
        this.planetNames = {
            en: {
                "Sun": "Sun",
                "Mercury": "Mercury",
                "Venus": "Venus",
                "Earth": "Earth",
                "Moon": "Moon",
                "Mars": "Mars",
                "Jupiter": "Jupiter",
                "Saturn": "Saturn",
                "Uranus": "Uranus",
                "Neptune": "Neptune"
            },
            fr: {
                "Sun": "Soleil",
                "Mercury": "Mercure",
                "Venus": "Vénus",
                "Earth": "Terre",
                "Moon": "Lune",
                "Mars": "Mars",
                "Jupiter": "Jupiter",
                "Saturn": "Saturne",
                "Uranus": "Uranus",
                "Neptune": "Neptune"
            },
            ar: {
                "Sun": "الشمس",
                "Mercury": "عطارد",
                "Venus": "الزهرة",
                "Earth": "الأرض",
                "Moon": "القمر",
                "Mars": "المريخ",
                "Jupiter": "المشتري",
                "Saturn": "زحل",
                "Uranus": "أورانوس",
                "Neptune": "نبتون"
            },
            tzm: {
                "Sun": "ⵜⴰⴼⵓⴽⵜ",
                "Mercury": "ⵎⵉⵔⴽⵓⵔ",
                "Venus": "ⵒⵉⵏⵓⵙ",
                "Earth": "ⴰⵎⴰⴹⴰⵍ",
                "Moon": "ⴰⵢⵓⵔ",
                "Mars": "ⵎⴰⵔⵙ",
                "Jupiter": "ⵊⵓⵒⵉⵜⵉⵔ",
                "Saturn": "ⵙⴰⵜⵓⵔⵏ",
                "Uranus": "ⵓⵔⴰⵏⵓⵙ",
                "Neptune": "ⵏⵉⵒⵜⵓⵏ"
            },
            tzm_lat: {
                "Sun": "Tafukt",
                "Mercury": "Mirkur",
                "Venus": "Vinus",
                "Earth": "Amaḍal",
                "Moon": "Ayur",
                "Mars": "Mars",
                "Jupiter": "Jupiter",
                "Saturn": "Saturn",
                "Uranus": "Uranus",
                "Neptune": "Niptun"
            }
        };

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
        
        // Update UI with current language
        this.updateUI();
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
        if (window.solarSystem) {
            // Update names of all visible celestial bodies
            const updateBodyName = (body) => {
                if (body && body.labelMesh) {
                    const translatedName = this.translatePlanetName(body.name);
                    body.updateLabel(translatedName);
                }
            };
            
            // Update Sun
            if (window.solarSystem.sun) updateBodyName(window.solarSystem.sun);
            
            // Update planets
            for (const planetKey in window.solarSystem.planets) {
                if (window.solarSystem.planets[planetKey]) {
                    updateBodyName(window.solarSystem.planets[planetKey]);
                }
            }
            
            // Update moons
            for (const moonKey in window.solarSystem.moons) {
                if (window.solarSystem.moons[moonKey]) {
                    updateBodyName(window.solarSystem.moons[moonKey]);
                }
            }
        }
    }
}
