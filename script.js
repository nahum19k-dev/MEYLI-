document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-btn');
    const landingScreen = document.getElementById('landing-screen');
    const constellationScreen = document.getElementById('constellation-screen');
    const bgMusic = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const nodesContainer = document.getElementById('nodes-container');
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    const contentModal = document.getElementById('content-modal');
    const modalBody = document.getElementById('modal-body');
    const nextBtn = document.getElementById('next-btn');

    let isMuted = false;
    let width, height;
    let bgStars = [];
    let constellationNodes = [];
    let currentNodeIndex = 0;
    
    // Contenido de la carta (6 pasos)
    const letterSteps = [
        {
            html: `
                <div class="photo-container">
                    <img src="meyli.jpg" alt="Meyli" class="meyli-photo">
                </div>
                <p>Hay personas que llegan a tu vida en los momentos más inesperados... como en una entrevista de trabajo donde supuestamente uno debería estar concentrado en otras cosas. Pero entonces alguien te habla, te pregunta algo, y sin darte cuenta ya captó toda tu atención.</p>
            `
        },
        {
            html: `<p>Lo primero que noté fueron tus ojos. Esos ojos grandes y llenos de ternura que tienen algo difícil de explicar... no sé si es la forma en que miran o simplemente lo que hay detrás de ellos, pero desde ese momento algo me dijo que valía la pena conocerte mejor.</p>`
        },
        {
            html: `<p>Y mientras más te conozco, más confirmo que detrás de esa mirada hay una persona disciplinada, inteligente, segura de sí misma, que se levanta a las 6am a cycling sin falta, que almuerza y muere 😂, que sufre con las películas sangrientas pero ama las románticas, que tiene buen gusto para la comida porque el saltado no falla...</p>`
        },
        {
            html: `<p>...y que hace que las conversaciones no quieran terminar... incluso cuando ya son las 4am y ambos deberíamos estar durmiendo 😏</p>`
        },
        {
            html: `<p>Hablar contigo se siente como hablar con alguien que conoces de toda la vida. Hay una amabilidad en ti que no es común, algo genuino que hace que las horas pasen sin que uno se dé cuenta... y no me arrepiento para nada 😏</p>
                   <p>No sé exactamente qué es esto todavía, pero sí sé que hay algo en ti que me genera curiosidad, que me hace querer seguir descubriendo más... y eso no le pasa a cualquiera.</p>`
        },
        {
            html: `<p>Así que solo quería que supieras que me importas, que disfruto cada conversación contigo, y que me gustaría seguir conociéndote... en persona, sin pantallas de por medio 😊</p>`
        }
    ];

    // Resize canvas
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initBgStars();
    }

    window.addEventListener('resize', resize);
    
    // Generar fondo de estrellas estáticas
    function initBgStars() {
        bgStars = [];
        for(let i=0; i<150; i++) {
            bgStars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.5,
                alpha: Math.random()
            });
        }
    }

    // Dibujar frame
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        // Estrellas de fondo
        bgStars.forEach(star => {
            ctx.fillStyle = "rgba(255, 255, 255, " + star.alpha + ")";
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI*2);
            ctx.fill();
            star.alpha += (Math.random() - 0.5) * 0.05;
            if(star.alpha < 0.1) star.alpha = 0.1;
            if(star.alpha > 1) star.alpha = 1;
        });

        // Dibujar líneas de constelación
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255, 215, 0, 0.6)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Línea punteada
        
        for (let i = 0; i <= currentNodeIndex; i++) {
            if (i >= letterSteps.length) break;
            
            const node = constellationNodes[i];
            // Animar el dibujo de la línea a la estrella actual
            if (i > 0) {
                const prevNode = constellationNodes[i-1];
                ctx.moveTo(prevNode.x, prevNode.y);
                ctx.lineTo(node.x, node.y);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);

        requestAnimationFrame(draw);
    }

    // Configurar los nodos de la constelación (estrellas clickeables)
    function setupConstellation() {
        const paddingX = width * 0.15;
        const paddingY = height * 0.15;
        const usableW = width - paddingX * 2;
        const usableH = height - paddingY * 2;
        
        // Distribuimos los nodos visualmente en zig-zag suave
        for(let i = 0; i < letterSteps.length; i++) {
            // Un patrón en forma de M o W (ejemplo)
            const progress = i / (letterSteps.length - 1); // 0 a 1
            const x = paddingX + (usableW * progress);
            
            // Alternamos la Y para hacer un zig-zag
            let yProgress;
            if (i % 2 === 0) {
                yProgress = 0.2 + (Math.random() * 0.2); // Arriba
            } else {
                yProgress = 0.6 + (Math.random() * 0.2); // Abajo
            }
            const y = paddingY + (usableH * yProgress);

            const div = document.createElement('div');
            div.className = 'constellation-node';
            div.style.left = x + "px";
            div.style.top = y + "px";
            
            div.addEventListener('click', () => {
                if (i <= currentNodeIndex) {
                    showModal(i);
                }
            });

            nodesContainer.appendChild(div);
            
            constellationNodes.push({x, y, el: div});
        }
        
        // Mostrar el primer nodo
        revealNode(0);
    }

    function revealNode(index) {
        if (index < constellationNodes.length) {
            constellationNodes[index].el.classList.add('visible');
        }
    }

    function showModal(index) {
        modalBody.innerHTML = letterSteps[index].html;
        contentModal.classList.remove('hidden');
        
        // Cambiamos el texto del botón en el último paso
        if (index === letterSteps.length - 1) {
            nextBtn.innerText = "Cerrar ❤️";
        } else {
            nextBtn.innerText = "Siguiente 🌟";
        }
    }

    nextBtn.addEventListener('click', () => {
        contentModal.classList.add('hidden');
        
        // Marcar nodo actual como visitado
        if (currentNodeIndex < constellationNodes.length) {
            constellationNodes[currentNodeIndex].el.classList.add('visited');
        }
        
        // Avanzar la constelación si fue el nodo más reciente
        if (currentNodeIndex < letterSteps.length - 1) {
            currentNodeIndex++;
            revealNode(currentNodeIndex);
        }
    });

    // Iniciar experiencia
    openBtn.addEventListener('click', () => {
        landingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            landingScreen.classList.remove('active');
            constellationScreen.classList.add('active');
            resize();
            setupConstellation();
            draw();
        }, 1000);

        bgMusic.volume = 0.5;
        bgMusic.play().catch(e => console.log("Audio autoplay blocked", e));
        
        if (typeof gtag === 'function') {
            gtag('event', 'open_letter', {
                'event_category': 'engagement',
                'event_label': 'Meyli Constellation Opened'
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
