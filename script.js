document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-btn');
    const landingScreen = document.getElementById('landing-screen');
    const letterScreen = document.getElementById('letter-screen');
    const bgMusic = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const particlesContainer = document.getElementById('particles');

    let isMuted = false;

    // Generar partículas (corazones o destellos)
    function createParticles() {
        const particleCount = 20;
        const colors = ['#ff4b82', '#ff7eb3', '#ffffff', '#ff9a9e'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 15 + 5;
            const left = Math.random() * 100;
            const duration = Math.random() * 10 + 10;
            const delay = Math.random() * 10;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Usando un SVG de corazón o un círculo simple
            particle.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            
            particle.style.left = `${left}vw`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            particlesContainer.appendChild(particle);
        }
    }

    // Interacción inicial
    openBtn.addEventListener('click', () => {
        // Transición de pantallas
        landingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            landingScreen.classList.remove('active');
            letterScreen.classList.add('active');
            createParticles();
        }, 1000);

        // Reproducir música
        bgMusic.volume = 0.5;
        bgMusic.play().catch(error => {
            console.log("El autoplay fue bloqueado por el navegador:", error);
        });
        
        // Registrar evento en Google Analytics (si está configurado)
        if (typeof gtag === 'function') {
            gtag('event', 'open_letter', {
                'event_category': 'engagement',
                'event_label': 'Meyli Letter Opened'
            });
        }
    });

    // Control de volumen
    muteBtn.addEventListener('click', () => {
        if (isMuted) {
            bgMusic.muted = false;
            muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        } else {
            bgMusic.muted = true;
            muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
        }
        isMuted = !isMuted;
    });
});
