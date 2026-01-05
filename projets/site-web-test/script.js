// Gestion du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    // Le formulaire s'enverra automatiquement via Formsubmit.co
    // On affiche juste un message avant la redirection
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.textContent = 'Envoi en cours...';
    submitButton.disabled = true;
});

// Roue de l'intimité
const suggestions = [
    { titre: "Communication", description: "Prenez 20 minutes pour discuter ouvertement de vos désirs et besoins avec votre partenaire." },
    { titre: "Tendresse", description: "Concentrez-vous sur les caresses et la tendresse, sans rechercher la performance." },
    { titre: "Nouveauté", description: "Essayez quelque chose de nouveau ensemble : une ambiance différente, des bougies, de la musique..." },
    { titre: "Temps pour vous", description: "Accordez-vous un moment de qualité en couple, loin des écrans et des obligations." },
    { titre: "Sensualité", description: "Explorez les sensations tactiles : massage, effleurements, découverte du corps de l'autre." },
    { titre: "Jeu et légèreté", description: "Apportez de la légèreté et du jeu dans votre intimité, riez ensemble." },
    { titre: "Lenteur", description: "Prenez votre temps, ralentissez, savourez chaque instant sans vous presser." },
    { titre: "Écoute active", description: "Écoutez vraiment les besoins de votre partenaire et exprimez les vôtres." },
    { titre: "Connexion émotionnelle", description: "Renforcez votre lien émotionnel avant la dimension physique." },
    { titre: "Bien-être personnel", description: "Prenez soin de vous d'abord : relaxation, méditation, reconnexion à votre corps." }
];

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('roueResult');

let currentRotation = 0;
let isSpinning = false;

// Couleurs de la roue
const colors = ['#764ba2', '#667eea', '#9b6fd4', '#8b7ec8', '#a57fd6', '#7d6fb3', '#8e76c4', '#9d82d4', '#7169ab', '#8673bc'];

// Dessiner la roue
function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    const sliceAngle = (2 * Math.PI) / suggestions.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);
    
    suggestions.forEach((suggestion, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = (i + 1) * sliceAngle;
        
        // Dessiner la tranche
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.lineTo(0, 0);
        ctx.fill();
        
        // Bordure
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Texte
        ctx.save();
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(suggestion.titre, radius * 0.65, 0);
        ctx.restore();
    });
    
    // Centre de la roue
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.arc(0, 0, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#764ba2';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.restore();
}

// Faire tourner la roue
function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    spinButton.disabled = true;
    resultDiv.classList.remove('show');
    
    const spinDuration = 3000; // 3 secondes
    const spinRotations = 5 + Math.random() * 3; // 5 à 8 tours
    const totalRotation = spinRotations * 2 * Math.PI;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Fonction d'easing pour ralentir progressivement
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentRotation = easeOut * totalRotation;
        
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Déterminer le résultat
            const normalizedRotation = currentRotation % (2 * Math.PI);
            const sliceAngle = (2 * Math.PI) / suggestions.length;
            const selectedIndex = Math.floor((2 * Math.PI - normalizedRotation + sliceAngle / 2) / sliceAngle) % suggestions.length;
            
            showResult(suggestions[selectedIndex]);
            isSpinning = false;
            spinButton.disabled = false;
        }
    }
    
    animate();
}

function showResult(suggestion) {
    resultDiv.innerHTML = `
        <h3>🌟 ${suggestion.titre}</h3>
        <p>${suggestion.description}</p>
        <p style="margin-top: 1.5rem; font-style: italic; color: #764ba2;">Prenez le temps d'explorer cette suggestion à votre rythme, dans le respect et l'écoute mutuelle.</p>
    `;
    resultDiv.classList.add('show');
}

// Initialiser la roue
drawWheel();

spinButton.addEventListener('click', spinWheel);

// Gestion du Quiz
let quizScore = 0;
let currentQuestion = 1;

document.querySelectorAll('.quiz-answer').forEach(button => {
    button.addEventListener('click', function() {
        const points = parseInt(this.getAttribute('data-points'));
        quizScore += points;
        
        // Cacher la question actuelle
        document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.remove('active');
        
        currentQuestion++;
        
        if (currentQuestion <= 5) {
            // Afficher la question suivante
            document.querySelector(`.quiz-question[data-question="${currentQuestion}"]`).classList.add('active');
        } else {
            // Afficher le résultat
            showQuizResult();
        }
    });
});

function showQuizResult() {
    const resultDiv = document.getElementById('resultContent');
    let resultText = '';
    
    if (quizScore >= 12) {
        resultText = `
            <h4>🌟 Excellent bien-être intime (${quizScore}/15 points)</h4>
            <p>Vous semblez avoir une vie intime épanouie et équilibrée. Vous communiquez bien, vous prenez soin de vous et de votre relation. Continuez ainsi !</p>
            <p>Une consultation pourrait vous aider à maintenir cet équilibre ou explorer de nouvelles dimensions de votre intimité.</p>
        `;
    } else if (quizScore >= 8) {
        resultText = `
            <h4>💫 Bien-être satisfaisant (${quizScore}/15 points)</h4>
            <p>Votre vie intime est globalement satisfaisante, mais il existe des aspects qui pourraient être améliorés. Quelques ajustements pourraient vous aider à vous sentir encore mieux.</p>
            <p>Un accompagnement en sexothérapie pourrait vous donner des outils pour renforcer votre épanouissement.</p>
        `;
    } else if (quizScore >= 4) {
        resultText = `
            <h4>🌱 Des défis à relever (${quizScore}/15 points)</h4>
            <p>Vous rencontrez des difficultés dans votre vie intime. C'est une situation courante et il existe des solutions. Ne restez pas seul(e) face à ces questionnements.</p>
            <p>Une consultation en sexothérapie pourrait vraiment vous aider à surmonter ces obstacles et retrouver du bien-être.</p>
        `;
    } else {
        resultText = `
            <h4>💙 Un soutien serait bénéfique (${quizScore}/15 points)</h4>
            <p>Vous traversez une période difficile concernant votre vie intime. Il est important de ne pas rester isolé(e) avec ces difficultés.</p>
            <p>Un accompagnement professionnel en sexothérapie peut vous aider à comprendre ce qui se passe et à trouver des solutions adaptées à votre situation.</p>
        `;
    }
    
    resultText += `<p style="margin-top: 2rem;"><strong>N'hésitez pas à prendre rendez-vous pour en discuter dans un cadre bienveillant et confidentiel.</strong></p>`;
    
    resultDiv.innerHTML = resultText;
    document.getElementById('quizResult').style.display = 'block';
    document.getElementById('quizContainer').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('restartQuiz').addEventListener('click', function() {
    quizScore = 0;
    currentQuestion = 1;
    document.getElementById('quizResult').style.display = 'none';
    document.querySelectorAll('.quiz-question').forEach(q => q.classList.remove('active'));
    document.querySelector('.quiz-question[data-question="1"]').classList.add('active');
});


// Animation au scroll
const sections = document.querySelectorAll('.section, .hero');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Smooth scroll pour les liens de navigation
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
