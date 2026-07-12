document.addEventListener('DOMContentLoaded', function() {
    var openBtn = document.getElementById('open-btn');
    var landingScreen = document.getElementById('landing-screen');
    var constellationScreen = document.getElementById('constellation-screen');
    var muteBtn = document.getElementById('mute-btn');
    var nodesContainer = document.getElementById('nodes-container');
    var canvas = document.getElementById('star-canvas');
    var ctx = canvas.getContext('2d');
    var contentModal = document.getElementById('content-modal');
    var modalBody = document.getElementById('modal-body');
    var nextBtn = document.getElementById('next-btn');
    var ytMusic = document.getElementById('yt-music');

    var isMuted = false;
    var width, height;
    var bgStars = [];
    var shootingStars = [];
    var constellationNodes = [];
    var currentNodeIndex = 0;
    var showMeyliName = false;
    var nameAlpha = 0;

    // ===== CARTA =====
    var letterSteps = [
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

    // ===== MEYLI LINEAS =====
    var meyliLines = [
        [{x:0,y:2},{x:0,y:0}], [{x:0,y:0},{x:0.5,y:1}], [{x:0.5,y:1},{x:1,y:0}], [{x:1,y:0},{x:1,y:2}],
        [{x:1.5,y:0},{x:2.5,y:0}], [{x:1.5,y:0},{x:1.5,y:1}], [{x:1.5,y:1},{x:2.3,y:1}], [{x:1.5,y:1},{x:1.5,y:2}], [{x:1.5,y:2},{x:2.5,y:2}],
        [{x:3,y:0},{x:3.5,y:1}], [{x:4,y:0},{x:3.5,y:1}], [{x:3.5,y:1},{x:3.5,y:2}],
        [{x:4.5,y:0},{x:4.5,y:2}], [{x:4.5,y:2},{x:5.5,y:2}],
        [{x:6,y:0},{x:6,y:2}]
    ];

    // ===== CANVAS =====
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initBgStars();
    }
    window.addEventListener('resize', resize);

    function initBgStars() {
        bgStars = [];
        for (var i = 0; i < 200; i++) {
            bgStars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.5 + 0.3,
                alpha: Math.random() * 0.6 + 0.3,
                speed: Math.random() * 0.02 + 0.005
            });
        }
    }

    // ===== SHOOTING STARS =====
    setInterval(function() {
        if (Math.random() < 0.5) {
            shootingStars.push({
                x: Math.random() * width * 0.8,
                y: Math.random() * height * 0.3,
                len: Math.random() * 60 + 30,
                spd: Math.random() * 5 + 4,
                alpha: 1
            });
        }
    }, 4000);

    // ===== DRAW =====
    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Estrellas de fondo
        for (var i = 0; i < bgStars.length; i++) {
            var s = bgStars[i];
            s.alpha += (Math.random() - 0.5) * s.speed;
            if (s.alpha < 0.15) s.alpha = 0.15;
            if (s.alpha > 1) s.alpha = 1;

            ctx.fillStyle = "rgba(255, 255, 255, " + s.alpha + ")";
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Estrellas fugaces
        for (var j = shootingStars.length - 1; j >= 0; j--) {
            var ss = shootingStars[j];
            ss.x += ss.spd;
            ss.y += ss.spd * 0.6;
            ss.alpha -= 0.012;

            if (ss.alpha <= 0) {
                shootingStars.splice(j, 1);
                continue;
            }

            var tailX = ss.x - ss.len * 0.7;
            var tailY = ss.y - ss.len * 0.42;
            var grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
            grad.addColorStop(0, "rgba(255,255,255,0)");
            grad.addColorStop(1, "rgba(255,255,255," + ss.alpha + ")");

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(ss.x, ss.y);
            ctx.stroke();
        }

        // Constelacion normal
        if (!showMeyliName) {
            if (currentNodeIndex > 0) {
                // Linea glow
                ctx.strokeStyle = "rgba(255, 215, 0, 0.15)";
                ctx.lineWidth = 6;
                ctx.beginPath();
                for (var k = 1; k <= currentNodeIndex && k < constellationNodes.length; k++) {
                    ctx.moveTo(constellationNodes[k-1].x, constellationNodes[k-1].y);
                    ctx.lineTo(constellationNodes[k].x, constellationNodes[k].y);
                }
                ctx.stroke();

                // Linea core
                ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                for (var k2 = 1; k2 <= currentNodeIndex && k2 < constellationNodes.length; k2++) {
                    ctx.moveTo(constellationNodes[k2-1].x, constellationNodes[k2-1].y);
                    ctx.lineTo(constellationNodes[k2].x, constellationNodes[k2].y);
                }
                ctx.stroke();
            }
        } else {
            // MEYLI
            if (nameAlpha < 1) nameAlpha += 0.008;

            var scale = Math.min(width / 8, 80);
            var totalW = 6 * scale;
            var startX = (width - totalW) / 2;
            var startY = height / 2 - scale;

            // Glow
            ctx.strokeStyle = "rgba(255, 75, 130, " + (nameAlpha * 0.15) + ")";
            ctx.lineWidth = 8;
            ctx.beginPath();
            for (var m = 0; m < meyliLines.length; m++) {
                var p1 = meyliLines[m][0];
                var p2 = meyliLines[m][1];
                ctx.moveTo(startX + p1.x * scale, startY + p1.y * scale);
                ctx.lineTo(startX + p2.x * scale, startY + p2.y * scale);
            }
            ctx.stroke();

            // Core
            ctx.strokeStyle = "rgba(255, 75, 130, " + (nameAlpha * 0.8) + ")";
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (var n = 0; n < meyliLines.length; n++) {
                var q1 = meyliLines[n][0];
                var q2 = meyliLines[n][1];
                ctx.moveTo(startX + q1.x * scale, startY + q1.y * scale);
                ctx.lineTo(startX + q2.x * scale, startY + q2.y * scale);
            }
            ctx.stroke();

            // Vertex stars
            ctx.fillStyle = "rgba(255, 255, 255, " + nameAlpha + ")";
            for (var v = 0; v < meyliLines.length; v++) {
                var vp1 = meyliLines[v][0];
                var vp2 = meyliLines[v][1];
                ctx.beginPath();
                ctx.arc(startX + vp1.x * scale, startY + vp1.y * scale, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(startX + vp2.x * scale, startY + vp2.y * scale, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        requestAnimationFrame(draw);
    }

    // ===== CONSTELACION SETUP =====
    function setupConstellation() {
        var paddingX = width * 0.12;
        var paddingY = height * 0.15;
        var usableW = width - paddingX * 2;
        var usableH = height - paddingY * 2;

        for (var i = 0; i < letterSteps.length; i++) {
            var progress = i / (letterSteps.length - 1);
            var x = paddingX + (usableW * progress);
            var yProgress;
            if (i % 2 === 0) {
                yProgress = 0.15 + (Math.random() * 0.2);
            } else {
                yProgress = 0.55 + (Math.random() * 0.2);
            }
            var y = paddingY + (usableH * yProgress);

            var div = document.createElement('div');
            div.className = 'constellation-node';
            div.style.left = x + "px";
            div.style.top = y + "px";

            (function(idx) {
                div.addEventListener('click', function() {
                    if (idx <= currentNodeIndex && !showMeyliName) {
                        showModal(idx);
                    }
                });
            })(i);

            nodesContainer.appendChild(div);
            constellationNodes.push({ x: x, y: y, el: div });
        }

        setTimeout(function() { revealNode(0); }, 500);
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
            nextBtn.innerHTML = "Cerrar \u2764\uFE0F";
        } else {
            nextBtn.innerHTML = "Siguiente \uD83C\uDF1F";
        }
    }

    nextBtn.addEventListener('click', function() {
        contentModal.classList.add('hidden');

        if (currentNodeIndex < constellationNodes.length) {
            constellationNodes[currentNodeIndex].el.classList.add('visited');
        }

        if (currentNodeIndex < letterSteps.length - 1) {
            currentNodeIndex++;
            revealNode(currentNodeIndex);
        } else {
            setTimeout(function() {
                showMeyliName = true;
                for (var i = 0; i < constellationNodes.length; i++) {
                    constellationNodes[i].el.style.transition = 'opacity 2s ease';
                    constellationNodes[i].el.style.opacity = '0';
                }
            }, 800);
        }
    });

    // ===== INICIAR =====
    openBtn.addEventListener('click', function() {
        landingScreen.classList.add('fade-out');

        setTimeout(function() {
            landingScreen.classList.remove('active');
            constellationScreen.classList.add('active');
            resize();
            setupConstellation();
            draw();
        }, 1000);

        // Reproducir musica de Aladin via YouTube iframe
        // autoplay=1 y loop=1 aseguran la reproduccion automatica
        ytMusic.src = "https://www.youtube.com/embed/hZ1Rb9hC4JY?autoplay=1&loop=1&playlist=hZ1Rb9hC4JY&controls=0&showinfo=0&rel=0&modestbranding=1";

        if (typeof gtag === 'function') {
            gtag('event', 'open_letter', {
                'event_category': 'engagement',
                'event_label': 'Meyli Constellation Opened'
            });
        }
    });

    // ===== MUTE =====
    muteBtn.addEventListener('click', function() {
        if (isMuted) {
            ytMusic.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
            muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        } else {
            ytMusic.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
            muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
        }
        isMuted = !isMuted;
    });
});
