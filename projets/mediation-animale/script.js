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
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Récupérer les données du formulaire
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');
        
        // Créer le mailto
        const subject = encodeURIComponent('Demande de contact - Médiation Animale');
        const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone || 'Non renseigné'}\n\nMessage:\n${message}`);
        
        // Ouvrir le client email
        window.location.href = `mailto:buckine32@gmail.com?subject=${subject}&body=${body}`;
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
        // Message de confirmation
        alert('Votre client email va s\'ouvrir. Merci de votre message !');
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
