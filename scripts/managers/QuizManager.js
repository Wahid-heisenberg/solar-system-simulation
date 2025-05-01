class QuizManager {
    constructor() {
        this.languageManager = window.languageManager;
        this.currentPlanet = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 120; // 2 minutes in seconds
        this.timerInterval = null;
        this.isQuizActive = false;
        
        // Create quiz modal elements
        this.createQuizElements();
        
        // Load questions for all planets
        this.loadQuizData();
        
        // Listen for language changes to update UI immediately
        window.addEventListener('languageChange', () => {
            this.updateLanguage();
        });
        
        // Also listen for the initial language setup
        window.addEventListener('languageInitialized', () => {
            this.updateLanguage();
        });
    }
    
    createQuizElements() {
        // Create the quiz modal container
        this.quizModal = document.createElement('div');
        this.quizModal.id = 'quiz-modal';
        this.quizModal.className = 'hidden';
        
        // Create the quiz content container
        this.quizContent = document.createElement('div');
        this.quizContent.className = 'quiz-content';
        
        // Create header with timer and score
        this.quizHeader = document.createElement('div');
        this.quizHeader.className = 'quiz-header';
        
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.className = 'timer-display';
        this.timerDisplay.innerHTML = '<i class="fas fa-clock"></i> <span id="quiz-timer">03:00</span>';
        
        this.scoreDisplay = document.createElement('div');
        this.scoreDisplay.className = 'score-display';
        this.scoreDisplay.innerHTML = '<i class="fas fa-star"></i> <span id="quiz-score">0</span>';
        
        this.quizHeader.appendChild(this.timerDisplay);
        this.quizHeader.appendChild(this.scoreDisplay);
        
        // Create question section
        this.questionContainer = document.createElement('div');
        this.questionContainer.className = 'question-container';
        
        this.questionText = document.createElement('h3');
        this.questionText.id = 'question-text';
        
        this.answersContainer = document.createElement('div');
        this.answersContainer.className = 'answers-container';
        
        this.questionContainer.appendChild(this.questionText);
        this.questionContainer.appendChild(this.answersContainer);
        
        // Create buttons for controls
        this.quizControls = document.createElement('div');
        this.quizControls.className = 'quiz-controls';
        
        this.closeQuizBtn = document.createElement('button');
        this.closeQuizBtn.className = 'quiz-btn cancel-btn';
        // Don't set text here, we'll set it in updateLanguage()
        this.closeQuizBtn.addEventListener('click', () => this.closeQuiz());
        
        this.nextQuestionBtn = document.createElement('button');
        this.nextQuestionBtn.className = 'quiz-btn next-btn hidden';
        // Don't set text here, we'll set it in updateLanguage()
        this.nextQuestionBtn.addEventListener('click', () => this.nextQuestion());
        
        this.quizControls.appendChild(this.closeQuizBtn);
        this.quizControls.appendChild(this.nextQuestionBtn);
        
        // Results section (initially hidden)
        this.resultsContainer = document.createElement('div');
        this.resultsContainer.className = 'results-container hidden';
        this.resultsContainer.innerHTML = `
            <h2 id="results-title"></h2>
            <div class="final-score">
                <i class="fas fa-trophy"></i>
                <span id="final-score">0</span>
            </div>
            <p id="results-message"></p>
            <button id="restart-quiz-btn" class="quiz-btn">
                <i class="fas fa-redo"></i> <span id="restart-text"></span>
            </button>
            <button id="close-results-btn" class="quiz-btn ">
                <i class="fas fa-times"></i> <span id="close-text"></span>
            </button>
        `;
        
        // Add event listeners for results buttons
        this.resultsContainer.querySelector('#restart-quiz-btn').addEventListener('click', () => {
            this.resultsContainer.classList.add('hidden');
            this.questionContainer.classList.remove('hidden');
            this.startQuiz(this.currentPlanet);
        });
        
        this.resultsContainer.querySelector('#close-results-btn').addEventListener('click', () => {
            this.closeQuiz();
        });
        
        // Assemble the quiz modal
        this.quizContent.appendChild(this.quizHeader);
        this.quizContent.appendChild(this.questionContainer);
        this.quizContent.appendChild(this.resultsContainer);
        this.quizContent.appendChild(this.quizControls);
        this.quizModal.appendChild(this.quizContent);
        
        // Add to the document
        document.body.appendChild(this.quizModal);
        
        // Update button texts immediately after creation
        this.updateButtonTexts();
    }
    
    // Add a new method to update button texts
    updateButtonTexts() {
        if (!this.languageManager) return;
        
        this.closeQuizBtn.innerHTML = '<i class="fas fa-times"></i> ' + this.languageManager.translate('quiz.cancel');
        this.nextQuestionBtn.innerHTML = '<i class="fas fa-arrow-right"></i> ' + this.languageManager.translate('quiz.next');
        
        // Also update other text elements
        if (this.resultsContainer && !this.resultsContainer.classList.contains('hidden')) {
            document.getElementById('results-title').textContent = this.languageManager.translate('quiz.resultsTitle');
            document.getElementById('restart-text').textContent = this.languageManager.translate('quiz.restart');
            document.getElementById('close-text').textContent = this.languageManager.translate('quiz.close');
        }
    }
    
    loadQuizData() {
        // This would normally be loaded from a server, but for this demo we'll hardcode some questions
        this.quizData = quizData
        
        // For demonstration, add a default set of generic questions for each planet that doesn't have specific questions
        const planetNames = ["Mercury", "Venus", "Jupiter", "Saturn", "Uranus", "Neptune", "Moon"];
        const languages = ["en", "fr", "ar", "tzm", "tzm_lat"];
        
        planetNames.forEach(planet => {
            if (!this.quizData[planet]) {
                this.quizData[planet] = {};
                
                languages.forEach(lang => {
                    this.quizData[planet][lang] = this.generateGenericQuestions(planet, lang);
                });
            } else {
                // If the planet exists but doesn't have all language versions, add missing ones
                languages.forEach(lang => {
                    if (!this.quizData[planet][lang]) {
                        this.quizData[planet][lang] = this.generateGenericQuestions(planet, lang);
                    }
                });
            }
        });
    }
    
    generateGenericQuestions(planet, language) {
        // Generate some generic questions when specific ones aren't available
        const questions = [
            { 
                question: `What is ${planet}'s position from the Sun?`, 
                answers: ["2nd", "4th", "6th", "8th"], 
                correct: Math.floor(Math.random() * 4)
            },
            { 
                question: `Does ${planet} have any moons?`, 
                answers: ["Yes", "No", "Unknown", "Only artificial satellites"], 
                correct: Math.floor(Math.random() * 2)
            },
            { 
                question: `What is ${planet} primarily composed of?`, 
                answers: ["Rock", "Gas", "Ice", "Metal"], 
                correct: Math.floor(Math.random() * 4)
            },
            { 
                question: `How long does it take for ${planet} to orbit the Sun?`, 
                answers: ["88 days", "225 days", "687 days", "Several years"], 
                correct: Math.floor(Math.random() * 4)
            },
            { 
                question: `Which of these is a feature of ${planet}?`, 
                answers: ["Rings", "Giant storms", "Volcanoes", "Canyons"], 
                correct: Math.floor(Math.random() * 4)
            }
        ];
        
        // Duplicate some with variations to get 10 questions
        return questions.concat(questions).slice(0, 10);
    }
    
    startQuiz(planetName) {
        this.currentPlanet = planetName;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.timeLeft = 120; // 2 minutes
        this.isQuizActive = true;
        
        // Get questions for this planet in current language
        const currentLang = this.languageManager.currentLanguage;
        const planetQuestions = this.quizData[planetName] && this.quizData[planetName][currentLang] 
            ? this.quizData[planetName][currentLang] 
            : this.quizData["Earth"][currentLang]; // Fallback to Earth questions
            
        // Shuffle questions
        this.questions = [...planetQuestions].sort(() => Math.random() - 0.5);
        
        // Update UI
        document.getElementById('quiz-score').textContent = '0';
        this.updateTimerDisplay();
        
        // Show the modal
        this.quizModal.classList.remove('hidden');
        this.resultsContainer.classList.add('hidden');
        this.questionContainer.classList.remove('hidden');
        this.nextQuestionBtn.classList.add('hidden');
        
        // Show first question
        this.showQuestion(0);
        
        // Start the timer
        this.startTimer();
        
        // Ensure buttons have correct text when starting quiz
        this.updateButtonTexts();
    }
    
    showQuestion(index) {
        if (index >= this.questions.length) {
            this.endQuiz();
            return;
        }
        
        const question = this.questions[index];
        this.questionText.textContent = `${index + 1}. ${question.question}`;
        
        // Clear previous answers
        this.answersContainer.innerHTML = '';
        
        // Create answer buttons
        question.answers.forEach((answer, i) => {
            const answerBtn = document.createElement('button');
            answerBtn.className = 'answer-btn';
            answerBtn.textContent = answer;
            answerBtn.dataset.index = i;
            
            answerBtn.addEventListener('click', (e) => {
                // Check answer
                const selectedIndex = parseInt(e.target.dataset.index);
                const isCorrect = selectedIndex === question.correct;
                
                // Mark all buttons
                const buttons = this.answersContainer.querySelectorAll('.answer-btn');
                buttons.forEach((btn, idx) => {
                    btn.disabled = true;
                    if (idx === question.correct) {
                        btn.classList.add('correct');
                    } else if (idx === selectedIndex) {
                        btn.classList.add(isCorrect ? 'correct' : 'incorrect');
                    }
                });
                
                // Update score
                if (isCorrect) {
                    this.score += 10;
                    document.getElementById('quiz-score').textContent = this.score;
                }
                
                // Show next button
                this.nextQuestionBtn.classList.remove('hidden');
            });
            
            this.answersContainer.appendChild(answerBtn);
        });
    }
    
    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.showQuestion(this.currentQuestionIndex);
            this.nextQuestionBtn.classList.add('hidden');
        } else {
            this.endQuiz();
        }
    }
    
    startTimer() {
        clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.endQuiz();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        
        document.getElementById('quiz-timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running out
        if (this.timeLeft <= 30) {
            document.getElementById('quiz-timer').style.color = 'red';
        } else {
            document.getElementById('quiz-timer').style.color = '';
        }
    }
    
    endQuiz() {
        clearInterval(this.timerInterval);
        this.isQuizActive = false;
        
        // Hide questions and show results
        this.questionContainer.classList.add('hidden');
        this.resultsContainer.classList.remove('hidden');
        this.quizControls.classList.add('hidden');
        
        // Update results
        const maxScore = this.questions.length * 10;
        const percentage = (this.score / maxScore) * 100;
        
        document.getElementById('results-title').textContent = this.languageManager.translate('quiz.resultsTitle');
        document.getElementById('final-score').textContent = `${this.score}/${maxScore} (${percentage.toFixed(0)}%)`;
        
        // Set appropriate message based on score
        let messageKey;
        if (percentage >= 80) {
            messageKey = 'quiz.excellentResult';
        } else if (percentage >= 60) {
            messageKey = 'quiz.goodResult';
        } else if (percentage >= 40) {
            messageKey = 'quiz.averageResult';
        } else {
            messageKey = 'quiz.poorResult';
        }
        
        document.getElementById('results-message').textContent = this.languageManager.translate(messageKey);
        document.getElementById('restart-text').textContent = this.languageManager.translate('quiz.restart');
        document.getElementById('close-text').textContent = this.languageManager.translate('quiz.close');
    }
    
    closeQuiz() {
        clearInterval(this.timerInterval);
        this.isQuizActive = false;
        this.quizModal.classList.add('hidden');
        this.quizControls.classList.remove('hidden');
    }
    
    updateLanguage() {
        // Update all text elements when language changes
        this.updateButtonTexts();
        
        // If quiz is active, restart with the new language
        if (this.isQuizActive && this.currentPlanet) {
            this.closeQuiz();
            this.startQuiz(this.currentPlanet);
        }
    }
}
