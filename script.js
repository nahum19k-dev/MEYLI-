// ============ YOUTUBE IFRAME API (Aladdin - A Whole New World) ============
let ytPlayer;
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '1',
        width: '1',
        videoId: 'hZ1Rb9hC4JY', // A Whole New World - Aladdin
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'loop': 1,
            'playlist': 'hZ1Rb9hC4JY'
        }
    });
}

// ============ MAIN APP ============
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-btn');
    const landingScreen = document.getElementById('landing-screen');
    const constellationScreen = document.getElementById('constellation-screen');
    const muteBtn = document.getElementById('mute-btn');
    const nodesContainer = document.getElementById('nodes-container');
    const canvas = document.getElementById('star-canvas');
    const ctx = canvas.getContext('2d');
    const contentModal = document.getElementById('content-modal');
    const modalBody = document.getElementById('modal-body');
    const nextBtn = document.getElementById('next-btn');
    const instruction = document.getElementById('instruction');

    let isMuted = false;
    let width, height;
    let bgStars = [];
    let shootingStars = [];
    let constellationNodes = [];
    let currentNodeIndex = 0;
    let showMeyliName = false;
    let nebulaHue = 0;

    // ============ LETTER CONTENT ============
    const letterSteps = [
        {
            html: '<div class="photo-container"><img src="meyli.jpg" alt="Meyli" class="meyli-photo"></div><p>Hay personas que llegan a tu vida en los momentos m\u00e1s inesperados... como en una entrevista de trabajo donde supuestamente uno deber\u00eda estar concentrado en otras cosas. Pero entonces alguien te habla, te pregunta algo, y sin darte cuenta ya capt\u00f3 toda tu atenci\u00f3n.</p>'
        },
        {
            html: '<p>Lo primero que not\u00e9 fueron tus ojos. Esos ojos chinitos y llenos de ternura que tienen algo dif\u00edcil de explicar... no s\u00e9 si es la forma en que miran o simplemente lo que hay detr\u00e1s de ellos, pero desde ese momento algo me dijo que val\u00eda la pena conocerte mejor.</p>'
        },
        {
            html: '<p>Y mientras m\u00e1s te conozco, m\u00e1s confirmo que detr\u00e1s de esa mirada hay una persona disciplinada, inteligente, segura de s\u00ed misma, que se levanta a las 6am a cycling sin falta, que sufre con las pel\u00edculas sangrientas pero ama las rom\u00e1nticas, que tiene buen gusto para la comida porque el saltado no falla...</p>'
        },
        {
            html: '<p>...y que hace que las conversaciones no quieran terminar... incluso cuando ya son las 4am y ambos deber\u00edamos estar durmiendo \ud83d\ude0f</p>'
        },
        {
            html: '<p>Hablar contigo se siente como hablar con alguien que conoces de toda la vida. Hay una amabilidad en ti que no es com\u00fan, algo genuino que hace que las horas pasen sin que uno se d\u00e9 cuenta... y no me arrepiento para nada \ud83d\ude0f</p><p>No s\u00e9 exactamente qu\u00e9 es esto todav\u00eda, pero s\u00ed s\u00e9 que hay algo en ti que me genera curiosidad, que me hace querer seguir descubriendo m\u00e1s... y eso no le pasa a cualquiera.</p>'
        },
        {
            html: '<p>As\u00ed que solo quer\u00eda que supieras que me importas, que disfruto cada conversaci\u00f3n contigo, y que me gustar\u00eda seguir conoci\u00e9ndote... en persona, sin pantallas de por medio \ud83d\ude0a</p>'
        }
    ];

    // ============ MEYLI CONSTELLATION SHAPE ============
    const meyliLines = [
        // M
        [{x:0,y:2},{x:0,y:0}], [{x:0,y:0},{x:0.5,y:1}], [{x:0.5,y:1},{x:1,y:0}], [{x:1,y:0},{x:1,y:2}],
        // E
        [{x:1.5,y:0},{x:2.5,y:0}], [{x:1.5,y:0},{x:1.5,y:1}], [{x:1.5,y:1},{x:2.3,y:1}], [{x:1.5,y:1},{x:1.5,y:2}], [{x:1.5,y:2},{x:2.5,y:2}],
        // Y
        [{x:3,y:0},{x:3.5,y:1}], [{x:4,y:0},{x:3.5,y:1}], [{x:3.5,y:1},{x:3.5,y:2}],
        // L
        [{x:4.5,y:0},{x:4.5,y:2}], [{x:4.5,y:2},{x:5.5,y:2}],
        // I
        [{x:6,y:0},{x:6,y:2}]
    ];

    // ============ CANVAS SETUP ============
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initBgStars();
    }
    window.addEventListener('resize', resize);

    // ============ REALISTIC STARS ============
    function initBgStars() {
        bgStars = [];
        // Multiple star layers for depth
        for (let i = 0; i < 250; i++) {
            const layer = Math.random();
            let r, baseAlpha;
            if (layer < 0.7) { r = Math.random() * 0.8 + 0.2; baseAlpha = Math.random() * 0.5 + 0.2; }
            else if (layer < 0.92) { r = Math.random() * 1.2 + 0.8; baseAlpha = Math.random() * 0.4 + 0.5; }
            else { r = Math.random() * 1.5 + 1.2; baseAlpha = Math.random() * 0.3 + 0.7; }

            // Star color variety
            const colors = ['255,255,255', '255,240,220', '200,220,255', '255,220,180', '220,200,255'];
            const color = colors[Math.floor(Math.random() * colors.length)];

            bgStars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: r,
                baseAlpha: baseAlpha,
                alpha: baseAlpha,
                twinkleSpeed: Math.random() * 0.03 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                color: color
            });
        }
    }

    // ============ SHOOTING STARS ============
    function spawnShootingStar() {
        shootingStars.push({
            x: Math.random() * width,
            y: Math.random() * height * 0.4,
            length: Math.random() * 80 + 40,
            speed: Math.random() * 6 + 4,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
            alpha: 1,
            life: 0
        });
    }

    // Random shooting stars
    setInterval(() => {
        if (Math.random() < 0.4) spawnShootingStar();
    }, 3000);

    // ============ DRAW LOOP ============
    let frameCount = 0;
    function draw() {
        ctx.clearRect(0, 0, width, height);
        frameCount++;

        // Subtle nebula glow
        nebulaHue += 0.1;
        const nebulaGrad = ctx.createRadialGradient(width*0.3, height*0.4, 0, width*0.3, height*0.4, width*0.5);
        nebulaGrad.addColorStop(0, 'rgba(60, 20, 80, 0.03)');
        nebulaGrad.addColorStop(0.5, 'rgba(20, 30, 80, 0.02)');
        nebulaGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nebulaGrad;
        ctx.fillRect(0, 0, width, height);

        const nebulaGrad2 = ctx.createRadialGradient(width*0.75, height*0.6, 0, width*0.75, height*0.6, width*0.4);
        nebulaGrad2.addColorStop(0, 'rgba(80, 20, 50, 0.025)');
        nebulaGrad2.addColorStop(1, 'transparent');
        ctx.fillStyle = nebulaGrad2;
        ctx.fillRect(0, 0, width, height);

        // Background stars with realistic twinkle
        bgStars.forEach(star => {
            star.twinklePhase += star.twinkleSpeed;
            star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.25;
            if (star.alpha < 0.05) star.alpha = 0.05;
            if (star.alpha > 1) star.alpha = 1;

            // Star glow
            if (star.r > 1) {
                ctx.fillStyle = "rgba(" + star.color + ", " + (star.alpha * 0.15) + ")";
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r * 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Star core
            ctx.fillStyle = "rgba(" + star.color + ", " + star.alpha + ")";
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
            ctx.fill();

            // Cross-shaped diffraction spikes for bright stars
            if (star.r > 1.5 && star.alpha > 0.6) {
                ctx.strokeStyle = "rgba(" + star.color + ", " + (star.alpha * 0.3) + ")";
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(star.x - star.r * 3, star.y);
                ctx.lineTo(star.x + star.r * 3, star.y);
                ctx.moveTo(star.x, star.y - star.r * 3);
                ctx.lineTo(star.x, star.y + star.r * 3);
                ctx.stroke();
            }
        });

        // Shooting stars
        shootingStars.forEach((s, i) => {
            s.life++;
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.alpha -= 0.015;

            if (s.alpha > 0) {
                const tailX = s.x - Math.cos(s.angle) * s.length;
                const tailY = s.y - Math.sin(s.angle) * s.length;

                const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
                grad.addColorStop(0, "rgba(255,255,255,0)");
                grad.addColorStop(1, "rgba(255,255,255," + s.alpha + ")");

                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(s.x, s.y);
                ctx.stroke();

                // Head glow
                ctx.fillStyle = "rgba(255,255,255," + s.alpha + ")";
                ctx.beginPath();
                ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                shootingStars.splice(i, 1);
            }
        });

        // ============ CONSTELLATION LINES ============
        if (!showMeyliName) {
            if (currentNodeIndex > 0) {
                for (let i = 1; i <= currentNodeIndex && i < constellationNodes.length; i++) {
                    const prev = constellationNodes[i-1];
                    const curr = constellationNodes[i];

                    // Glow line
                    ctx.strokeStyle = "rgba(255, 215, 0, 0.15)";
                    ctx.lineWidth = 6;
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(curr.x, curr.y);
                    ctx.stroke();

                    // Core line
                    ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(curr.x, curr.y);
                    ctx.stroke();
                }
            }
        } else {
            // MEYLI name constellation
            const nameAlpha = Math.min(1, frameCount * 0.005);
            const scale = Math.min(width / 8, 80);
            const totalWidth = 6 * scale;
            const startX = (width - totalWidth) / 2;
            const startY = height / 2 - scale;

            // Glow lines
            ctx.strokeStyle = "rgba(255, 75, 130, " + (nameAlpha * 0.12) + ")";
            ctx.lineWidth = 8;
            ctx.beginPath();
            meyliLines.forEach(line => {
                ctx.moveTo(startX + line[0].x * scale, startY + line[0].y * scale);
                ctx.lineTo(startX + line[1].x * scale, startY + line[1].y * scale);
            });
            ctx.stroke();

            // Core lines
            ctx.strokeStyle = "rgba(255, 75, 130, " + (nameAlpha * 0.8) + ")";
            ctx.lineWidth = 2;
            ctx.beginPath();
            meyliLines.forEach(line => {
                ctx.moveTo(startX + line[0].x * scale, startY + line[0].y * scale);
                ctx.lineTo(startX + line[1].x * scale, startY + line[1].y * scale);
            });
            ctx.stroke();

            // Vertex stars
            meyliLines.forEach(line => {
                [line[0], line[1]].forEach(p => {
                    const px = startX + p.x * scale;
                    const py = startY + p.y * scale;

                    // Glow
                    ctx.fillStyle = "rgba(255, 215, 0, " + (nameAlpha * 0.2) + ")";
                    ctx.beginPath();
                    ctx.arc(px, py, 10, 0, Math.PI * 2);
                    ctx.fill();

                    // Core
                    ctx.fillStyle = "rgba(255, 255, 255, " + nameAlpha + ")";
                    ctx.beginPath();
                    ctx.arc(px, py, 3, 0, Math.PI * 2);
                    ctx.fill();
                });
            });
        }

        requestAnimationFrame(draw);
    }

    // ============ CONSTELLATION NODES ============
    function setupConstellation() {
        const paddingX = width * 0.12;
        const paddingY = height * 0.15;
        const usableW = width - paddingX * 2;
        const usableH = height - paddingY * 2;

        for (let i = 0; i < letterSteps.length; i++) {
            const progress = i / (letterSteps.length - 1);
            const x = paddingX + (usableW * progress);

            let yProgress;
            if (i % 2 === 0) {
                yProgress = 0.15 + (Math.random() * 0.2);
            } else {
                yProgress = 0.55 + (Math.random() * 0.2);
            }
            const y = paddingY + (usableH * yProgress);

            const div = document.createElement('div');
            div.className = 'constellation-node';
            div.style.left = x + "px";
            div.style.top = y + "px";

            div.addEventListener('click', () => {
                if (i <= currentNodeIndex && !showMeyliName) {
                    showModal(i);
                    if (instruction) instruction.classList.add('hide');
                }
            });

            nodesContainer.appendChild(div);
            constellationNodes.push({ x, y, el: div });
        }

        // Reveal first node with delay for drama
        setTimeout(() => revealNode(0), 600);
    }

    function revealNode(index) {
        if (index < constellationNodes.length) {
            constellationNodes[index].el.classList.add('visible');
        }
    }

    function showModal(index) {
        modalBody.innerHTML = letterSteps[index].html;
        contentModal.classList.remove('hidden');

        if (index === letterSteps.length - 1) {
            nextBtn.innerHTML = '<span>Cerrar</span> <span>\u2764\uFE0F</span>';
        } else {
            nextBtn.innerHTML = '<span>Siguiente</span> <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
        }
    }

    nextBtn.addEventListener('click', () => {
        contentModal.classList.add('hidden');

        if (currentNodeIndex < constellationNodes.length) {
            constellationNodes[currentNodeIndex].el.classList.add('visited');
        }

        if (currentNodeIndex < letterSteps.length - 1) {
            currentNodeIndex++;
            revealNode(currentNodeIndex);
        } else {
            setTimeout(() => {
                showMeyliName = true;
                frameCount = 0;
                constellationNodes.forEach(n => {
                    n.el.style.transition = 'opacity 2s ease';
                    n.el.style.opacity = '0';
                });
            }, 800);
        }
    });

    // ============ START EXPERIENCE ============
    openBtn.addEventListener('click', () => {
        landingScreen.classList.add('fade-out');

        setTimeout(() => {
            landingScreen.classList.remove('active');
            constellationScreen.classList.add('active');
            resize();
            setupConstellation();
            draw();
        }, 1200);

        // Play Aladdin music
        if (ytPlayer && ytPlayer.playVideo) {
            ytPlayer.setVolume(60);
            ytPlayer.playVideo();
        }

        if (typeof gtag === 'function') {
            gtag('event', 'open_letter', {
                'event_category': 'engagement',
                'event_label': 'Meyli Constellation Opened'
            });
        }
    });

    // ============ MUTE CONTROL ============
    muteBtn.addEventListener('click', () => {
        if (ytPlayer) {
            if (isMuted) {
                ytPlayer.unMute();
                muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
            } else {
                ytPlayer.mute();
                muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
            }
        }
        isMuted = !isMuted;
    });
});
