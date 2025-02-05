document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
        });

        // Fermer le menu quand on clique sur un lien
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // Animation des cartes de fonctionnalités au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Ajouter la classe d'animation de chargement
            contactForm.classList.add('sending');
            
            const formData = {
                name: contactForm.querySelector('input[type="text"]').value,
                email: contactForm.querySelector('input[type="email"]').value,
                message: contactForm.querySelector('textarea').value
            };

            try {
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    // Retirer la classe d'animation de chargement
                    contactForm.classList.remove('sending');
                    
                    // Afficher le message de succès avec animation
                    const successMessage = document.querySelector('.success-message');
                    successMessage.classList.add('show');
                    
                    // Réinitialiser le formulaire
                    contactForm.reset();
                    
                    // Cacher le message après 3 secondes
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                    }, 3000);
                } else {
                    contactForm.classList.remove('sending');
                    alert('Erreur lors de l\'envoi du message : ' + data.message);
                }
            } catch (error) {
                contactForm.classList.remove('sending');
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de l\'envoi du message.');
            }
        });
    }

    // Gestion du défilement fluide pour les liens de navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80; // Hauteur du header fixe
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Mise à jour de la classe active
                document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Mise à jour de la classe active pendant le défilement
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Curseur personnalisé
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorLine = document.querySelector('.cursor-line');
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let drawTimeout;

    document.addEventListener('mousemove', (e) => {
        // Animation du point principal
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';

        // Création de l'effet de trait
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTime;
        if (lastX && lastY) {
            const distance = Math.hypot(e.clientX - lastX, e.clientY - lastY);
            const speed = distance / timeDiff; // Vitesse en pixels par milliseconde

            if (speed > 0.2) { // Seuil de vitesse plus bas pour plus de réactivité
                // Calculer l'angle du trait
                const angle = Math.atan2(e.clientY - lastY, e.clientX - lastX);
                const length = Math.min(distance * 1.5, 100); // Retour à la longueur originale
                const thickness = Math.min(speed * 2, 3); // Retour à l'épaisseur originale

                cursorLine.style.width = length + 'px';
                cursorLine.style.left = lastX + 'px';
                cursorLine.style.top = lastY + 'px';
                cursorLine.style.transform = `rotate(${angle}rad) scaleY(${thickness})`; // Épaisseur variable selon la vitesse
                cursorLine.style.opacity = Math.min(speed * 0.8, 0.8); // Retour à l'opacité originale

                // Effet de disparition progressive
                clearTimeout(drawTimeout);
                drawTimeout = setTimeout(() => {
                    cursorLine.style.opacity = '0';
                }, 100);
            }
        }

        lastX = e.clientX;
        lastY = e.clientY;
        lastTime = currentTime;
    });

    // Gestion des éléments interactifs
    document.querySelectorAll('a, button, input, textarea').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorDot.style.transform = 'scale(2.5)';
        });

        element.addEventListener('mouseleave', () => {
            cursorDot.style.transform = 'scale(1)';
        });

        element.addEventListener('mousedown', () => {
            cursorDot.style.transform = 'scale(1.5)';
        });

        element.addEventListener('mouseup', () => {
            cursorDot.style.transform = 'scale(2.5)';
        });
    });

    // Masquer le curseur quand il quitte la fenêtre
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorLine.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
    });
}); 