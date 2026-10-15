document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const enterButton = document.getElementById('enter-button');
    const bgMusic = document.getElementById('background-music');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeIcon = document.querySelector('#volume-control i');
    const typingText = document.getElementById('typing-text');
    const revealElements = document.querySelectorAll('[data-reveal]');
    const linkCards = document.querySelectorAll('.link-card');

    // 1. AUDIO & VOLUME CONTROL + WEB AUDIO REACTIVE
    bgMusic.volume = volumeSlider.value;
    let audioCtx, analyser, dataArray;

    function initAudioReactive() {
        if (audioCtx) return;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(bgMusic);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            analyser.connect(audioCtx.destination);
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            animateAudioReactive();
        } catch (e) {
            // Fallback jika browser membatasi CORS pada file lokal
        }
    }

    function animateAudioReactive() {
        requestAnimationFrame(animateAudioReactive);
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);
        const bass = dataArray[1] || 0;
        const scale = 1 + (bass / 255) * 0.18;
        const profileRing = document.querySelector('.profile-ring');
        if (profileRing) {
            profileRing.style.transform = `scale(${scale}) rotate(${performance.now() * 0.05}deg)`;
        }
    }

    volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        bgMusic.volume = val;
        bgMusic.muted = val === 0;
        volumeIcon.className = val === 0
            ? 'fa-solid fa-volume-xmark'
            : val < 0.5 ? 'fa-solid fa-volume-low' : 'fa-solid fa-volume-high';
    });

    volumeIcon.addEventListener('click', () => {
        bgMusic.muted = !bgMusic.muted;
        volumeIcon.className = bgMusic.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
    });

    // 2. SPLASH SCREEN INITIALIZATION & STAGGERED MOTION REVEAL
    function enterCyberdeck() {
        if (splashScreen.classList.contains('hidden')) return;
        splashScreen.classList.add('hidden');

        bgMusic.play().then(() => {
            initAudioReactive();
        }).catch(() => {});

        // Staggered Reveal untuk Header, Links, dan Footer
        revealElements.forEach((el, idx) => {
            setTimeout(() => {
                el.classList.add('revealed');
            }, 250 + idx * 180);
        });

        // Staggered Motion untuk setiap Link Card
        linkCards.forEach((card, idx) => {
            setTimeout(() => {
                card.classList.add('card-visible');
                const titleEl = card.querySelector('.card-info strong');
                if (titleEl) scrambleText(titleEl, titleEl.dataset.original || titleEl.innerText);
            }, 450 + idx * 110);
        });

        setTimeout(startTypingEffect, 400);
    }

    enterButton.addEventListener('click', enterCyberdeck);
    splashScreen.addEventListener('click', enterCyberdeck);

    // 3. CYBERPUNK TYPING EFFECT
    const phrases = [
        "welcome to my personal cyberdeck_",
        "motion graphics // creative dev",
        "all systems operational // 2025",
        "exploring digital aesthetics"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function startTypingEffect() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 35 : 75;

        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(startTypingEffect, speed);
    }

    // 4. MATRIX / CYBER TEXT SCRAMBLE ENGINE
    const chars = '!<>-_\\/[]{}—=+*^?#01';
    function scrambleText(element, finalString) {
        let iteration = 0;
        clearInterval(element._scrambleInterval);
        element._scrambleInterval = setInterval(() => {
            element.innerText = finalString
                .split('')
                .map((letter, index) => {
                    if (index < iteration) return finalString[index];
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iteration >= finalString.length) {
                clearInterval(element._scrambleInterval);
            }
            iteration += 1 / 2.5;
        }, 25);
    }

    // Simpan teks asli dan pasang efek 3D Tilt + Scramble saat Hover
    linkCards.forEach((card) => {
        const titleEl = card.querySelector('.card-info strong');
        if (titleEl) {
            titleEl.dataset.original = titleEl.innerText;
        }

        card.addEventListener('mouseenter', () => {
            if (titleEl) scrambleText(titleEl, titleEl.dataset.original);
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Hitung sudut rotasi 3D
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // 5. CUSTOM HUD CURSOR
    const hudCursor = document.querySelector('.hud-cursor');
    const hudDot = document.querySelector('.hud-cursor-dot');
    const hudRing = document.querySelector('.hud-cursor-ring');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (hudDot) {
            hudDot.style.left = `${mouseX}px`;
            hudDot.style.top = `${mouseY}px`;
        }
    });

    function renderCursor() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        if (hudRing) {
            hudRing.style.left = `${ringX}px`;
            hudRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    document.querySelectorAll('a, button, input, .profile-img-wrapper').forEach((el) => {
        el.addEventListener('mouseenter', () => hudCursor && hudCursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => hudCursor && hudCursor.classList.remove('hovering'));
    });

    // 6. INTERACTIVE CYBER PARTICLE NETWORK (CANVAS)
    const canvas = document.getElementById('cyber-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = Array.from({ length: 45 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            size: Math.random() * 1.8 + 0.5
        }));

        function drawNetwork() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Hubungkan partikel ke posisi kursor
                const dxMouse = mouseX - p.x;
                const dyMouse = mouseY - p.y;
                const distMouse = Math.hypot(dxMouse, dyMouse);
                if (distMouse < 140) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distMouse / 140) * 0.25})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.stroke();
                }

                // Hubungkan antar partikel terdekat
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 110) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 110) * 0.12})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawNetwork);
        }
        drawNetwork();
    }
});
