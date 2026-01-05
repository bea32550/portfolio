// Menu mobile toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('active');
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Fermer le menu mobile après clic
            nav.classList.remove('active');
        }
    });
});

// Animation au scroll
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

// Observer tous les éléments à animer
document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Animation des barres de compétences
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const width = entry.target.style.width;
            entry.target.style.width = '0';
            setTimeout(() => {
                entry.target.style.width = width;
            }, 100);
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// Gestion du formulaire de contact
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les valeurs du formulaire
    const formData = new FormData(contactForm);
    
    // Afficher un message de succès (à remplacer par votre logique d'envoi)
    alert('Merci pour votre message ! Je vous répondrai dès que possible.');
    
    // Réinitialiser le formulaire
    contactForm.reset();
});

// Effet de parallaxe sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 500;
    }
});

// Navbar transparente au scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--dark-bg)';
        navbar.style.backdropFilter = 'none';
    }
    
    lastScroll = currentScroll;
});

// Animation du curseur personnalisé (optionnel)
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Ajouter une classe au hover sur les liens
document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// Effet de typing pour le titre (optionnel)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Activer l'effet au chargement de la page
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Décommenter pour activer l'effet typing
        // typeWriter(heroTitle, originalText, 50);
    }
});

// EmailJS - Gestion du formulaire de contact
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const statusDiv = document.getElementById('form-status');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    // Désactiver le bouton et afficher un message de chargement
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    statusDiv.textContent = '';
    statusDiv.style.color = '#3498db';
    
    // Envoyer l'email via EmailJS
    emailjs.sendForm('service_6tti4co', 'template_6p51lv7', this)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            statusDiv.textContent = '✅ Message envoyé avec succès !';
            statusDiv.style.color = '#27ae60';
            
            // Réinitialiser le formulaire
            document.getElementById('contact-form').reset();
            
            // Réactiver le bouton
            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer le message';
            
            // Effacer le message de succès après 5 secondes
            setTimeout(() => {
                statusDiv.textContent = '';
            }, 5000);
        }, function(error) {
            console.log('FAILED...', error);
            statusDiv.textContent = '❌ Erreur lors de l\'envoi. Veuillez réessayer.';
            statusDiv.style.color = '#e74c3c';
            
            // Réactiver le bouton
            submitButton.disabled = false;
            submitButton.textContent = 'Envoyer le message';
        });
});
