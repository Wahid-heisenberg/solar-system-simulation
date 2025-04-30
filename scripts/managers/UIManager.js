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
        this.planetData = {
            "Sun": {
                diameter: "1,392,700",
                mass: "1.989 × 10^30 kg (333,000 Earths)",
                temperature: "5,500°C (surface), 15,000,000°C (core)",
                rotationPeriod: "25-35 days (varies by latitude)",
                atmosphere: "Photosphere, chromosphere and corona"
            },
            "Mercury": {
                diameter: "4,879",
                mass: "3.3011 × 10^23 kg (0.055 Earths)",
                distance: "0.39",
                orbitPeriod: "88 days",
                rotationPeriod: "58.6 days",
                atmosphere: "Minimal - sodium, potassium, oxygen",
                temperature: "-173°C to 427°C"
            },
            "Venus": {
                diameter: "12,104",
                mass: "4.8675 × 10^24 kg (0.815 Earths)",
                distance: "0.72",
                orbitPeriod: "225 days",
                rotationPeriod: "243 days (retrograde)",
                atmosphere: "Carbon dioxide, nitrogen",
                temperature: "462°C (average)"
            },
            "Earth": {
                diameter: "12,756",
                mass: "5.97237 × 10^24 kg",
                distance: "1.00",
                orbitPeriod: "365.25 days",
                rotationPeriod: "23.93 hours",
                moons: ["Moon"],
                atmosphere: "Nitrogen, oxygen, argon",
                temperature: "-88°C to 58°C"
            },
            "Moon": {
                diameter: "3,475",
                mass: "7.342 × 10^22 kg (0.012 Earths)",
                distance: "384,400 km from Earth",
                orbitPeriod: "27.3 days",
                rotationPeriod: "27.3 days (tidally locked to Earth)",
                atmosphere: "Very thin - helium, neon, hydrogen",
                temperature: "-233°C to 123°C"
            },
            "Mars": {
                diameter: "6,792",
                mass: "6.4171 × 10^23 kg (0.107 Earths)",
                distance: "1.52",
                orbitPeriod: "687 days",
                rotationPeriod: "24.6 hours",
                moons: ["Phobos", "Deimos"],
                atmosphere: "Carbon dioxide, nitrogen, argon",
                temperature: "-153°C to 20°C"
            },
            "Jupiter": {
                diameter: "142,984",
                mass: "1.8982 × 10^27 kg (317.8 Earths)",
                distance: "5.20",
                orbitPeriod: "11.86 years",
                rotationPeriod: "9.93 hours",
                moons: ["Io", "Europa", "Ganymede", "Callisto", "and 75+ others"],
                atmosphere: "Hydrogen, helium",
                temperature: "-108°C (cloud top)"
            },
            "Saturn": {
                diameter: "120,536",
                mass: "5.6834 × 10^26 kg (95.16 Earths)",
                distance: "9.58",
                orbitPeriod: "29.46 years",
                rotationPeriod: "10.7 hours",
                moons: ["Titan", "Enceladus", "Mimas", "and 80+ others"],
                atmosphere: "Hydrogen, helium",
                temperature: "-138°C (cloud top)"
            },
            "Uranus": {
                diameter: "51,118",
                mass: "8.6810 × 10^25 kg (14.54 Earths)",
                distance: "19.22",
                orbitPeriod: "84.01 years",
                rotationPeriod: "17.2 hours (retrograde)",
                moons: ["Titania", "Oberon", "Umbriel", "Ariel", "Miranda", "and 22+ others"],
                atmosphere: "Hydrogen, helium, methane",
                temperature: "-195°C (cloud top)"
            },
            "Neptune": {
                diameter: "49,528",
                mass: "1.02413 × 10^26 kg (17.15 Earths)",
                distance: "30.05",
                orbitPeriod: "164.8 years",
                rotationPeriod: "16.1 hours",
                moons: ["Triton", "Nereid", "Proteus", "and 10+ others"],
                atmosphere: "Hydrogen, helium, methane",
                temperature: "-214°C (cloud top)"
            }
        };
        
        // Store descriptions in different languages
        this.planetDescriptions = {
            en: {
                "Sun": "The Sun is the star at the center of the Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.",
                "Mercury": "Mercury is the smallest and innermost planet in the Solar System. It has no atmosphere to retain heat, resulting in surface temperatures varying diurnally more than any other planet.",
                "Venus": "Venus is the second planet from the Sun and the hottest planet in our solar system with a thick atmosphere consisting mainly of carbon dioxide, which traps heat in a runaway greenhouse effect.",
                "Earth": "Earth is the third planet from the Sun and the only astronomical object known to harbor life. It's the densest major body in the Solar System and the largest of the four terrestrial planets.",
                "Moon": "The Moon is Earth's only natural satellite. It is the fifth-largest satellite in the Solar System and the largest and most massive relative to its parent planet.",
                "Mars": "Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System. It is often referred to as the 'Red Planet' due to its reddish appearance.",
                "Jupiter": "Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass more than two and a half times that of all the other planets combined.",
                "Saturn": "Saturn is the sixth planet from the Sun and the second-largest in the Solar System. It is a gas giant with an average radius about nine times that of Earth, best known for its prominent ring system.",
                "Uranus": "Uranus is the seventh planet from the Sun. It has the third-largest diameter and fourth-largest mass in the Solar System and rotates on its side with an axial tilt of 98 degrees.",
                "Neptune": "Neptune is the eighth and farthest planet from the Sun. It is the fourth-largest planet by diameter and the third-largest by mass. Neptune is similar in composition to Uranus, and both have compositions that differ from those of Jupiter and Saturn."
            },
            fr: {
                "Sun": "Le Soleil est l'étoile au centre du Système solaire. C'est une sphère presque parfaite de plasma chaud, chauffée à incandescence par des réactions de fusion nucléaire dans son noyau.",
                "Mercury": "Mercure est la planète la plus petite et la plus proche du Soleil dans le Système solaire. Elle n'a pas d'atmosphère pour retenir la chaleur, ce qui entraîne des variations de température plus importantes que sur n'importe quelle autre planète.",
                "Venus": "Vénus est la deuxième planète à partir du Soleil et la plus chaude de notre système solaire avec une atmosphère épaisse composée principalement de dioxyde de carbone, qui piège la chaleur dans un effet de serre incontrôlé.",
                "Earth": "La Terre est la troisième planète à partir du Soleil et le seul objet astronomique connu pour abriter la vie. C'est le corps majeur le plus dense du Système solaire et la plus grande des quatre planètes telluriques.",
                "Moon": "La Lune est le seul satellite naturel de la Terre. C'est le cinquième plus grand satellite du Système solaire et le plus grand et le plus massif par rapport à sa planète mère.",
                "Mars": "Mars est la quatrième planète à partir du Soleil et la deuxième plus petite planète du Système solaire. Elle est souvent appelée la 'Planète rouge' en raison de son apparence rougeâtre.",
                "Jupiter": "Jupiter est la cinquième planète à partir du Soleil et la plus grande du Système solaire. C'est une géante gazeuse avec une masse plus de deux fois et demie supérieure à celle de toutes les autres planètes réunies.",
                "Saturn": "Saturne est la sixième planète à partir du Soleil et la deuxième plus grande du Système solaire. C'est une géante gazeuse avec un rayon moyen environ neuf fois celui de la Terre, connue pour son système d'anneaux proéminent.",
                "Uranus": "Uranus est la septième planète à partir du Soleil. Elle a le troisième plus grand diamètre et la quatrième plus grande masse du Système solaire et tourne sur le côté avec une inclinaison axiale de 98 degrés.",
                "Neptune": "Neptune est la huitième planète et la plus éloignée du Soleil. C'est la quatrième planète par le diamètre et la troisième par la masse. Neptune est similaire en composition à Uranus, et les deux ont des compositions qui diffèrent de celles de Jupiter et Saturne."
            },
            ar: {
                "Sun": "الشمس هي النجم الذي يقع في مركز النظام الشمسي. وهي كرة شبه مثالية من البلازما الساخنة، تسخن إلى التوهج بواسطة تفاعلات الاندماج النووي في نواتها.",
                "Mercury": "عطارد هو أصغر كوكب في النظام الشمسي وأقربها إلى الشمس. ليس له غلاف جوي للاحتفاظ بالحرارة، مما يؤدي إلى تفاوت درجات الحرارة السطحية يوميًا أكثر من أي كوكب آخر.",
                "Venus": "الزهرة هي ثاني كوكب من الشمس وأكثر كوكب حرارة في نظامنا الشمسي مع غلاف جوي سميك يتكون أساسًا من ثاني أكسيد الكربون، الذي يحبس الحرارة في تأثير الاحتباس الحراري الجامح.",
                "Earth": "الأرض هي الكوكب الثالث من الشمس والجسم الفلكي الوحيد المعروف بإيواء الحياة. إنها الجسم الرئيسي الأكثر كثافة في النظام الشمسي وأكبر الكواكب الأرضية الأربعة.",
                "Moon": "القمر هو القمر الطبيعي الوحيد للأرض. إنه خامس أكبر قمر في النظام الشمسي وأكبرها وأكثرها كتلة بالنسبة لكوكبه الأم.",
                "Mars": "المريخ هو الكوكب الرابع من الشمس وثاني أصغر كوكب في النظام الشمسي. غالبًا ما يشار إليه باسم 'الكوكب الأحمر' بسبب مظهره المحمر.",
                "Jupiter": "المشتري هو الكوكب الخامس من الشمس والأكبر في النظام الشمسي. إنه عملاق غازي بكتلة تزيد عن ضعفين ونصف عن كتلة جميع الكواكب الأخرى مجتمعة.",
                "Saturn": "زحل هو الكوكب السادس من الشمس وثاني أكبر كوكب في النظام الشمسي. إنه عملاق غازي بمتوسط نصف قطر حوالي تسعة أضعاف نصف قطر الأرض، معروف بنظام حلقاته البارز.",
                "Uranus": "أورانوس هو الكوكب السابع من الشمس. له ثالث أكبر قطر ورابع أكبر كتلة في النظام الشمسي ويدور على جانبه بميل محوري يبلغ 98 درجة.",
                "Neptune": "نبتون هو الكوكب الثامن والأبعد عن الشمس. إنه رابع أكبر كوكب من حيث القطر والثالث من حيث الكتلة. نبتون مشابه في التكوين لأورانوس، وكلاهما لهما تركيبات تختلف عن تركيبات المشتري وزحل."
            },
            tzm: {
                "Sun": "ⵜⴰⴼⵓⴽⵜ ⵜⴳⴰ ⵉⵜⵔⵉ ⴳ ⵜⵓⵎⵔⵜ ⵏ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ. ⵜⴳⴰ ⵜⴰⴽⵓⵔⵜ ⵏ ⵓⵎⵍⴰⵙⵎⴰ ⵢⵓⵎⴰⵏ, ⵉⵥⵥⴰⵏ ⵙ ⵜⵔⴽⴰⵙⵉⵏ ⵏ ⵓⵙⴼⵙⵉ ⴰⵏⴰⴽⵍⵉ ⴷⴳ ⵓⵍ ⵏⵙ.",
                "Mercury": "ⵎⵉⵔⴽⵓⵔ ⴷ ⴰⵎⵥⵥⵢⴰⵏ ⴷ ⵉⵔⵉⵡⵏ ⵉⵜⵔⴰⵏ ⴷⴳ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ. ⵓⵔ ⵉⵍⵉ ⴰⵀⵡⴰ ⵢⴰⴽ ⴰⴷ ⵢⴰⵎⵥ ⵜⴰⵥⵓⵖⵉ, ⴰⵢⵏⵏⴰ ⵢⵜⵜⴰⵊⵊⴰⵏ ⵜⴰⴽⵓⵙⵜ ⵏ ⵜⵉⴼⵔⵉⵢⵉⵏ ⵜⴱⴷⴷⴰⵍ ⵢⴰⵏⵉⴼ ⵉⵜⵔⴰⵏ ⵢⴰⴹⵏ.",
                "Venus": "ⵒⵉⵏⵓⵙ ⴷ ⴰⵎⵙⵉⵏ ⵉⵜⵔⵉ ⵥⴳ ⵜⴰⴼⵓⴽⵜ ⴷ ⴰⵀⵎⵎⴰⵢ ⵉⵜⵔⵉ ⴳ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ ⵙ ⵢⴰⵏ ⵓⵀⵡⴰ ⵉⵥⵥⴰⵢⵏ ⵉⵍⵍⴰⵏ ⴷⴰⵢⴙ ⴰⴼⵓⴹ ⵏ ⵜⴽⴰⵔⴱⵓⵏⵜ, ⵉⵜⵜⴰⵎⵥⵏ ⵜⴰⵥⵓⵖⵉ.",
                "Earth": "ⴰⵎⴰⴹⴰⵍ ⴷ ⴽⵔⴰⴹ ⵉⵜⵔⵉ ⵥⴳ ⵜⴰⴼⵓⴽⵜ ⴷ ⵢⴰⵏ ⵉⵎⵓⴷⴰⵔ ⴰⵎⵀⴰⵡⴰⵛ ⵉⵍⵍⴰⵏ ⴷⴰⵢⵙ ⵜⵓⴷⵔⵜ. ⴰⵢⴰ ⴷ ⴰⵙⵍⵖⵏ ⴰⵙⴰⵜⵓⵔ ⴳ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ ⴷ ⴰⵎⵇⵇⵔⴰⵏ ⵏ ⴽⵕⴰⴹ ⵉⵜⵔⴰⵏ ⵉⵎⴰⴹⴰⵍⴰⵏⵏ.",
                "Moon": "ⴰⵢⵓⵔ ⴷ ⴰⵎⴷⴷⴰⴽⵍ ⴰⵎⴰⴹⴰⵍⴰⵏ ⵏ ⵓⵎⴰⴹⴰⵍⴰⵏ. ⴷ ⵡⵉⵙⵙ ⵙⵎⵎⵓⵙ ⴰⵎⵇⵇⵔⴰⵏ ⵏ ⵡⴰⵢⵓⵔⵏ ⴳ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ.",
                "Mars": "ⵎⴰⵔⵙ ⴷ ⵉⵜⵔⵉ ⵡⵉⵙⵙ ⴽⴽⵓⵥ ⵥⴳ ⵜⴰⴼⵓⴽⵜ ⴷ ⵡⵉⵙⵙ ⵙⵉⵏ ⴰⵎⵥⵥⵢⴰⵏ ⴳ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ. ⵉⵜⵜⵓⵙⵍⴰ ⵙ ⵢⵉⵙⵎ ⵉⵜⵔⵉ ⴰⵣⴳⴳⵯⴰⵖ ⵎⵉⵏⵥⵉ ⵉⵥⵉⵍ ⵣⴳⴳⵯⴰⵖⵏ.",
                "Jupiter": "ⵊⵓⵒⵉⵜⵉⵔ ⴷ ⵉⵜⵔⵉ ⵡⵉⵙⵙ ⵙⵎⵎⵓⵙ ⵥⴳ ⵜⴰⴼⵓⴽⵜ ⴷ ⴰⵎⵇⵇⵔⴰⵏ ⴳ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ. ⴷ ⴰⵡⴷⵉⵢ ⵏ ⵜⴳⵓⵜ ⵙ ⵢⴰⵏ ⵜⴰⴽⵜⵉⵡⵜ ⵓⴳⴰⵔ ⵏ ⵙⵉⵏ ⵜⴰⴽⵜⵉⵡⵜ ⵏ ⵉⵜⵔⴰⵏ ⴰⴽⴽ ⵉⵙⵎⵓⵏⵏ.",
                "Saturn": "ⵙⴰⵜⵓⵔⵏ ⴷ ⵉⵜⵔⵉ ⵡⵉⵙⵙ ⵚⴹⵉⵚ ⵥⴳ ⵜⴰⴼⵓⴽⵜ ⴷ ⵡⵉⵙⵙ ⵙⵉⵏ ⴰⵎⵇⵇⵔⴰⵏ ⴳ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ. ⴷ ⴰⵡⴷⵉⵢ ⵏ ⵜⴳⵓⵜ ⵙ ⵜⴰⵣⵍⴰⵢⵜ ⵏ ⵜⵉⵣⵉ ⵓⴳⴰⵔ ⵏ ⵜⵣⴰ ⵜⵡⴰⵍⴰⵜⵉⵏ ⵏ ⵓⵎⴰⴹⴰⵍ, ⵉⵜⵜⵡⴰⵙⵙⵏ ⵙ ⵓⵖⴰⵡⴰⵙ ⵏ ⵜⵔⴰⵡⵉⵏ.",
                "Uranus": "ⵓⵔⴰⵏⵓⵙ ⴷ ⵉⵜⵔⵉ ⵡⵉⵙⵙ ⴰ ⵥⴳ ⵜⴰⴼⵓⴽⵜ. ⴷⴰⵢⵙ ⵜⴰⵣⵍⴰⵢⵜ ⵜⵉⵙⵙ ⴽⵔⴰⴹⵜ ⵜⴰⵎⵇⵇⵔⴰⵏⵜ ⴷ ⵜⴰⴽⵜⵉⵡⵜ ⵜⵉⵙⵙ ⴽⴽⵓⵥⵜ ⵜⴰⵎⵇⵇⵔⴰⵏⵜ ⴳ ⵓⵙⵏⴳⵍⴰⵍ ⴰⵜⴰⴼⵓⴽⵜ ⴷ ⵉⵏⵏⵓⵕⵥⵎ ⵖⵔ ⵜⴰⵎⴰ ⵙ ⵓⵙⵓⵔⴼ ⵏ 98 ⵜⵡⴰⵍⴰⵜⵉⵏ.",
                "Neptune": "ⵏⵉⵒⵜⵓⵏ ⴷ ⵉⵜⵔⵉ ⵡⵉⵙⵙ ⵜⴰⵎ ⴷ ⴰⴳⴳⵓⴳⵏ ⵥⴳ ⵜⴰⴼⵓⴽⵜ. ⴷ ⵉⵜⵔⵉ ⵡⵉⵙⵙ ⴽⴽⵓⵥ ⴰⵎⵇⵇⵔⴰⵏ ⵙ ⵜⴰⵣⵍⴰⵢⵜ ⴷ ⵡⵉⵙⵙ ⴽⵔⴰⴹ ⴰⵎⵇⵇⵔⴰⵏ ⵙ ⵜⴰⴽⵜⵉⵡⵜ. ⵏⵉⵒⵜⵓⵏ ⵉⵜⵜⵎⵛⴰⴱⴰⵀ ⴷ ⵓⵔⴰⵏⵓⵙ ⴳ ⵓⵙⵎⵓⵏ, ⴷ ⵙⵉⵏ ⵉⴷⵙⵏ ⴷⴰⵔⵙⵏ ⵉⵙⵎⵓⵏⵏ ⵉⵅⵜⴰⵍⴼⵏ ⵅⴼ ⵓⵊⵓⵒⵉⵜⵏ ⴷ ⵙⴰⵜⵓⵔⵏ."
            },
            tzm_lat: {
                "Sun": "Tafukt tga itri g tumrt n usnglal atafukt. Tga takurt n umlasma yuman, iẓẓan s trkassin n usfsi anakli deg ul ns.",
                "Mercury": "Mirkur d amẓẓyan d iriwn itran deg usnglal atafukt. Ur ili ahwa yak ad yamẓ taẓuɣi, aynna yttajjan takust n tifriyin tbddal yanif itran yaḍn.",
                "Venus": "Vinus d amsin itri ẓeg tafukt d ahmmay itri g usnglal atafukt s yan uhwa iẓẓayn illan days afuḍ n tkarbunt, ittamẓn taẓuɣi.",
                "Earth": "Amaḍal d kraḍ itri ẓeg tafukt d yan imudar amhawac illan days tudrt. Aya d aslɣn asatur g usnglal atafukt d amqqran n kṛaḍ itran imaḍalann.",
                "Moon": "Ayur d amddakl amaḍalan n umaḍal. D wiss smmus amqqran n wayurn g usnglal atafukt.",
                "Mars": "Mars d itri wiss kkuẓ ẓeg tafukt d wiss sin amẓẓyan g usnglal atafukt. Ittusla s yism itri azggwaɣ minẓi iẓil zggwaɣn.",
                "Jupiter": "Jupiter d itri wiss smmus ẓeg tafukt d amqqran g usnglal atafukt. D awdiy n tgut s yan taktiwt ugar n sin iwlafn n taktiwt n itran akk ismun.",
                "Saturn": "Saturn d itri wiss ṣḍiṣ ẓeg tafukt d wiss sin amqqran g usnglal atafukt. D awdiy n tgut s tazlayt n tizi ugar n tza twalainn n umaḍal, ittwassn s uɣawas n trawin.",
                "Uranus": "Uranus d itri wiss sa ẓeg tafukt. Days tazlayt tiss kraḍt tamqqrant d taktiwt tiss kkuẓt tamqqrant g usnglal atafukt d innuṛẓm ɣr tama s usurf n 98 twalainn.",
                "Neptune": "Niptun d itri wiss tam d aggugn ẓeg tafukt. D itri wiss kkuẓ amqqran s tazlayt d wiss kraḍ amqqran s taktiwt. Niptun ittmcabah d uranus g usmun, d sin idsn darsn ismun ixtalfn xf ujupitn d saturn."
            }
        };
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
}
