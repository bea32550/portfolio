// Navigation mobile
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
    });
}

// Fermer le menu au clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        burger.classList.remove('active');
    });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.15)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Form submission
const contactForm = document.querySelector('#contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formSuccess = document.getElementById('form-success');
        
        // Désactiver le bouton pendant l'envoi
        submitButton.disabled = true;
        submitButton.textContent = 'Envoi en cours...';
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Afficher le message de succès
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Réinitialiser le formulaire
                contactForm.reset();
                
                // Réafficher le formulaire après 5 secondes
                setTimeout(() => {
                    contactForm.style.display = 'block';
                    formSuccess.style.display = 'none';
                }, 5000);
            } else {
                alert('Une erreur est survenue. Veuillez réessayer ou m\'envoyer un email directement à buckine32@gmail.com');
            }
        } catch (error) {
            alert('Une erreur est survenue. Veuillez réessayer ou m\'envoyer un email directement à buckine32@gmail.com');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer le message';
        }
    });
}

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les éléments
document.querySelectorAll('.benefit-card, .service-card, .public-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Jeu de mémoire
const animals = ['🐶', '🐱', '🐼', '🦊', '🐯', '🦁', '🐰', '🐻'];
let cards = [...animals, ...animals];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;

const memoryGame = document.getElementById('memory-game');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const gameMessage = document.getElementById('game-message');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const pairsDisplay = document.getElementById('pairs');

// Mélanger les cartes
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Créer les cartes
function createCards() {
    memoryGame.innerHTML = '';
    const shuffledCards = shuffle([...cards]);
    
    shuffledCards.forEach((animal, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.animal = animal;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-front">
                <i class="fas fa-paw"></i>
            </div>
            <div class="card-back">${animal}</div>
        `;
        
        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card);
    });
}

// Retourner une carte
function flipCard() {
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    if (flippedCards.length < 2 && !this.classList.contains('flip') && !this.classList.contains('matched')) {
        this.classList.add('flip');
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            moves++;
            movesDisplay.textContent = moves;
            checkMatch();
        }
    }
}

// Vérifier si les cartes correspondent
function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.animal === card2.dataset.animal;
    
    if (match) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        pairsDisplay.textContent = `${matchedPairs}/8`;
        flippedCards = [];
        
        if (matchedPairs === 8) {
            setTimeout(endGame, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            flippedCards = [];
        }, 1000);
    }
}

// Démarrer le chronomètre
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Arrêter le chronomètre
function stopTimer() {
    clearInterval(timerInterval);
}

// Fin de la partie
function endGame() {
    stopTimer();
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const timeText = minutes > 0 ? `${minutes} min ${seconds} sec` : `${seconds} secondes`;
    
    document.querySelector('.final-stats').textContent = `Temps: ${timeText} | Coups: ${moves}`;
    gameMessage.classList.add('show');
}

// Recommencer le jeu
function restartGame() {
    stopTimer();
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    gameStarted = false;
    
    timerDisplay.textContent = '0:00';
    movesDisplay.textContent = '0';
    pairsDisplay.textContent = '0/8';
    gameMessage.classList.remove('show');
    
    createCards();
}

// Événements
restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', restartGame);

// Initialiser le jeu
createCards();

// Quiz
const quizQuestions = [
    {
        question: "Qu'est-ce que la médiation animale ?",
        options: [
            "Une méthode de dressage d'animaux",
            "Une thérapie utilisant la relation humain-animal pour le bien-être",
            "Un sport équestre",
            "Une formation pour devenir vétérinaire"
        ],
        correct: 1
    },
    {
        question: "Quel est un bienfait reconnu de la médiation animale ?",
        options: [
            "Augmentation du stress",
            "Réduction de l'anxiété et amélioration de l'humeur",
            "Développement de phobies",
            "Isolation sociale"
        ],
        correct: 1
    },
    {
        question: "Pour qui la médiation animale est-elle bénéfique ?",
        options: [
            "Uniquement pour les enfants",
            "Seulement pour les personnes âgées",
            "Pour tous : enfants, adultes, seniors, personnes en situation de handicap",
            "Uniquement pour les personnes en bonne santé"
        ],
        correct: 2
    },
    {
        question: "Quel type d'animal peut être utilisé en médiation animale ?",
        options: [
            "Uniquement les chiens",
            "Uniquement les chats",
            "Divers animaux : chiens, chats, chevaux, lapins, etc.",
            "Aucun animal domestique"
        ],
        correct: 2
    },
    {
        question: "Quelle compétence peut être développée grâce à la médiation animale ?",
        options: [
            "La confiance en soi et les compétences sociales",
            "La méfiance envers les autres",
            "L'agressivité",
            "L'isolement"
        ],
        correct: 0
    }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

const questionText = document.getElementById('question-text');
const quizOptions = document.getElementById('quiz-options');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const questionNumber = document.getElementById('question-number');
const quizScore = document.getElementById('quiz-score');
const quizCard = document.getElementById('quiz-card');
const quizResult = document.getElementById('quiz-result');
const restartQuizBtn = document.getElementById('restart-quiz-btn');

function loadQuestion() {
    const question = quizQuestions[currentQuestion];
    questionText.textContent = question.question;
    quizOptions.innerHTML = '';
    selectedAnswer = null;
    nextBtn.style.display = 'none';
    
    const letters = ['A', 'B', 'C', 'D'];
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.innerHTML = `
            <span class="option-letter">${letters[index]}</span>
            <span>${option}</span>
        `;
        optionDiv.addEventListener('click', () => selectAnswer(index, optionDiv));
        quizOptions.appendChild(optionDiv);
    });
    
    updateProgress();
}

function selectAnswer(index, optionElement) {
    if (selectedAnswer !== null) return;
    
    selectedAnswer = index;
    const question = quizQuestions[currentQuestion];
    const allOptions = document.querySelectorAll('.quiz-option');
    
    allOptions.forEach(opt => opt.classList.add('disabled'));
    
    if (index === question.correct) {
        optionElement.classList.add('correct');
        score++;
        quizScore.textContent = `🎯 Score: ${score}`;
    } else {
        optionElement.classList.add('wrong');
        allOptions[question.correct].classList.add('correct');
    }
    
    nextBtn.style.display = 'inline-flex';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function updateProgress() {
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
    questionNumber.textContent = `Question ${currentQuestion + 1}/${quizQuestions.length}`;
}

function showResults() {
    quizCard.style.display = 'none';
    quizResult.style.display = 'block';
    
    const finalScore = document.getElementById('final-score');
    const resultMessage = document.getElementById('result-message');
    const correctAnswers = document.getElementById('correct-answers');
    const wrongAnswers = document.getElementById('wrong-answers');
    
    finalScore.textContent = score;
    correctAnswers.textContent = score;
    wrongAnswers.textContent = quizQuestions.length - score;
    
    if (score === quizQuestions.length) {
        resultMessage.textContent = "Parfait ! Vous êtes un expert de la médiation animale ! 🌟";
    } else if (score >= quizQuestions.length * 0.6) {
        resultMessage.textContent = "Très bien ! Vous avez de bonnes connaissances sur la médiation animale ! 👏";
    } else {
        resultMessage.textContent = "Pas mal ! Continuez à en apprendre davantage sur la médiation animale ! 📚";
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    quizScore.textContent = '🎯 Score: 0';
    quizCard.style.display = 'block';
    quizResult.style.display = 'none';
    loadQuestion();
}

nextBtn.addEventListener('click', nextQuestion);
restartQuizBtn.addEventListener('click', restartQuiz);

// Initialiser le quiz
loadQuestion();
