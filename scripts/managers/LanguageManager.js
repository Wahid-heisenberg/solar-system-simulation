class LanguageManager {
    constructor() {
        // get the current language from localStorage or default to English
        this.currentLanguage = localStorage.getItem('solarSystemLanguage') || 'en';
        this.currentOpenPlanet = null; // Track which planet info is currently shown
        this.translations = {
            en: {
                pauseBtn: 'Pause',
                resumeBtn: 'Resume',
                topViewBtn: 'Top View',
                resetViewBtn: 'Reset View',
                speedLabel: 'x',
                loadingText: 'Loading Solar System...',
                createdBy: 'Created by',
                authorName: 'Wahid Slimani',
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
                },
                quiz: {
                    startQuiz: "Start Quiz",
                    questionTitle: "Quiz about",
                    timeRemaining: "Time Remaining",
                    correct: "Correct!",
                    incorrect: "Incorrect!",
                    next: "Next",
                    cancel: "Cancel Quiz",
                    restart: "Try Again",
                    close: "Close",
                    resultsTitle: "Quiz Results",
                    excellentResult: "Excellent! You're an expert on this planet!",
                    goodResult: "Good job! You know quite a bit about this planet.",
                    averageResult: "Not bad! You've learned some facts about this planet.",
                    poorResult: "Keep learning! Visit again to improve your score."
                }
            },
            fr: {
                pauseBtn: 'Pause',
                resumeBtn: 'Reprendre',
                topViewBtn: 'Vue de Dessus',
                resetViewBtn: 'Vue par Défaut',
                speedLabel: 'x',
                loadingText: 'Chargement du Système Solaire...',
                createdBy: 'Créé par',
                authorName: 'Wahid Slimani',
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
                },
                quiz: {
                    startQuiz: "Commencer le Quiz",
                    questionTitle: "Quiz sur",
                    timeRemaining: "Temps Restant",
                    correct: "Correct !",
                    incorrect: "Incorrect !",
                    next: "Suivant",
                    cancel: "Annuler le Quiz",
                    restart: "Réessayer",
                    close: "Fermer",
                    resultsTitle: "Résultats du Quiz",
                    excellentResult: "Excellent ! Vous êtes un expert sur cette planète !",
                    goodResult: "Bon travail ! Vous connaissez bien cette planète.",
                    averageResult: "Pas mal ! Vous avez appris quelques faits sur cette planète.",
                    poorResult: "Continuez à apprendre ! Revenez pour améliorer votre score."
                }
            },
            ar: {
                pauseBtn: 'إيقاف',
                resumeBtn: 'استئناف',
                topViewBtn: 'منظر علوي',
                resetViewBtn: 'إعادة ضبط',
                speedLabel: 'x',
                loadingText: 'جاري تحميل النظام الشمسي...',
                createdBy: 'تم إنشاؤه بواسطة',
                authorName: 'وحيد سليماني',
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
                },
                quiz: {
                    startQuiz: "ابدأ الاختبار",
                    questionTitle: "اختبار حول",
                    timeRemaining: "الوقت المتبقي",
                    correct: "صحيح!",
                    incorrect: "غير صحيح!",
                    next: "التالي",
                    cancel: "إلغاء الاختبار",
                    restart: "حاول مرة أخرى",
                    close: "إغلاق",
                    resultsTitle: "نتائج الاختبار",
                    excellentResult: "ممتاز! أنت خبير في هذا الكوكب!",
                    goodResult: "عمل جيد! أنت تعرف الكثير عن هذا الكوكب.",
                    averageResult: "ليس سيئًا! لقد تعلمت بعض الحقائق عن هذا الكوكب.",
                    poorResult: "استمر في التعلم! عد مرة أخرى لتحسين درجاتك."
                }
            },
            tzm: {
                pauseBtn: 'ⵙⴱⴷ',
                resumeBtn: 'ⴽⵎⵍ',
                topViewBtn: 'ⵜⴰⵎⵓⵏⵉⵜ ⵜⴰⵎⵄⵍⴰⵢⵜ',
                resetViewBtn: 'ⴰⵔⵔⴰⵔⴰⵢ',
                speedLabel: 'x',
                loadingText: 'ⴰⵣⴷⴰⵎ ⵏ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ...',
                createdBy: 'ⵉⵙⴽⵔ ⵜ',
                authorName: 'ⵡⴰⵃⵉⴷ ⵙⵍⵉⵎⴰⵏⵉ',
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
                },
                quiz: {
                    startQuiz: "ⴱⴷⵓ ⴰⵍⵎⵓⴷ",
                    questionTitle: "ⴰⵍⵎⵓⴷ ⵖⴼ",
                    timeRemaining: "ⴰⴽⵓⴷ ⵉⵇⵇⵉⵎⵏ",
                    correct: "ⵉⵙⵃⴰ!",
                    incorrect: "ⵓⵔ ⵉⵙⵃⵉ!",
                    next: "ⵡⵉⵏ ⴷ ⵉⴹⴼⵕⵏ",
                    cancel: "ⵙⴱⴷⴷ ⴰⵍⵎⵓⴷ",
                    restart: "ⴰⵔⵎ ⴷⴰⵖ",
                    close: "ⵔⴳⵍ",
                    resultsTitle: "ⵜⵉⵄⵇⵇⴰⵢⵉⵏ ⵏ ⵓⵍⵎⵓⴷ",
                    excellentResult: "ⵉⵖⵓⴷⴰ! ⵜⴳⵉⴷ ⴰⵎⵙⵙⵉⵡⵍ ⵖⴼ ⵢⵉⵜⵔⵉ ⴰⴷ!",
                    goodResult: "ⵜⴰⵡⵓⵔⵉ ⵜⴰⴼⵓⵍⴽⵉⵜ! ⵜⵙⵙⵏⴷ ⴰⵢⵍⵍⵉ ⵖⴼ ⵢⵉⵜⵔⵉ ⴰⴷ.",
                    averageResult: "ⵓⵔ ⵢⵓⵅⵙ! ⵜⴻⵍⵎⴷⴷ ⴽⵔⴰ ⵏ ⵜⵎⵙⵍⴰⵢⵉⵏ ⵖⴼ ⵢⵉⵜⵔⵉ ⴰⴷ.",
                    poorResult: "ⵍⵎⴷ ⵓⴳⴳⴰⵔ! ⴷⵡⵍ ⴷⴰⵖ ⵢⴰⴽ ⴰⴷ ⵜⵙⵏⵏⴼⵍⵓⵍⴷ ⵜⵉⵣⵎⵎⴰⵔ ⵏⵏⴽ."
                }
            },
            tzm_lat: {
                pauseBtn: 'Sbedd',
                resumeBtn: 'Kmel',
                topViewBtn: 'Tamunit Tamaɛlayt',
                resetViewBtn: 'Arraray',
                speedLabel: 'x',
                loadingText: 'Azdam n usnglal atafukt...',
                createdBy: 'Iskr t',
                authorName: 'Wahid Slimani',
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
                },
                quiz: {
                    startQuiz: "Bdu Almud",
                    questionTitle: "Almud ɣef",
                    timeRemaining: "Akud iqqimn",
                    correct: "Isḥa!",
                    incorrect: "Ur isḥi!",
                    next: "Win d iḍfṛn",
                    cancel: "Sbedd almud",
                    restart: "Arm daɣ",
                    close: "Rgl",
                    resultsTitle: "Tiɛqqayin n ulmud",
                    excellentResult: "Iɣuda! Tgid amssiw ɣef yitri ad!",
                    goodResult: "Tawuri tafulkit! Tssnd aylli ɣef yitri ad.",
                    averageResult: "Ur yuxs! Telmddd kra n tmslayin ɣef yitri ad.",
                    poorResult: "Lmd uggar! Dwl daɣ yak ad tsnnfluld tizmmar nnk."
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
