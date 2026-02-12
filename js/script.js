/* --- MAIN SCRIPT --- */
document.addEventListener('DOMContentLoaded', () => {

    /* 1. THEME MANAGER */
    const htmlEl = document.documentElement;
    const toggleBtns = document.querySelectorAll('.theme-switch-wrapper');
    const savedTheme = localStorage.getItem('theme') || htmlEl.getAttribute('data-theme') || 'light';
    
    // Initialize Theme
    htmlEl.setAttribute('data-theme', savedTheme);

    const switchTheme = () => {
        const current = htmlEl.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        htmlEl.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        
        // Gentle Flash Effect
        document.body.style.opacity = '0.9';
        setTimeout(() => document.body.style.opacity = '1', 200);
    };

    toggleBtns.forEach(btn => btn.addEventListener('click', switchTheme));

    /* 2. LOADING SCREEN */
    const loader = document.getElementById('loader');
    if(loader) {
        window.addEventListener('load', () => {
             // Use minimal delay to ensure smooth exit after full load
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 1000);
            }, 1000);
        });
        // Fallback in case load hangs
        setTimeout(() => {
            if(document.body.contains(loader)) {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 600);
            }
        }, 3000);
    }

    /* 3. HERO CINEMATIC SLIDER LOGIC (REFINED) */
    const heroBgSlides = document.querySelectorAll('.hero-bg-slide');
    const heroTextSlides = document.querySelectorAll('.text-slide');
    const heroCinematicIndicators = document.querySelectorAll('.c-indicator');
    
    if(heroBgSlides.length > 0) {
        let currentCinematicIndex = 0;
        const cinematicIntervalTime = 6000; // 6 seconds total per slide
        let cinematicInterval;

        function updateCinematicSlider(index) {
            // A. FADE OUT CURRENT TEXT
            if(heroTextSlides.length > 0) {
                heroTextSlides.forEach(txt => txt.classList.remove('active'));
            }

            // B. CHANGE BACKGROUND (Transition: 1s)
            // We do this immediately so background starts fading
            heroBgSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });

            // C. CHANGE INDICATORS
            if(heroCinematicIndicators.length) {
                heroCinematicIndicators.forEach((ind, i) => {
                    ind.classList.toggle('active', i === index);
                });
            }

            // D. FADE IN NEW TEXT (Delayed by 800ms to sync with image appearance)
            if(heroTextSlides.length > 0) {
                setTimeout(() => {
                    heroTextSlides.forEach((txt, i) => {
                        if(i === index) txt.classList.add('active');
                    });
                }, 800); // Wait for background to be mostly visible
            }

            currentCinematicIndex = index;
        }

        function nextCinematicSlide() {
            let next = (currentCinematicIndex + 1) % heroBgSlides.length;
            updateCinematicSlider(next);
        }

        // Init
        // For first load, show text immediately
        heroBgSlides[0].classList.add('active');
        if(heroTextSlides.length > 0) heroTextSlides[0].classList.add('active');
        
        cinematicInterval = setInterval(nextCinematicSlide, cinematicIntervalTime);

        // Manual Control
        if(heroCinematicIndicators.length) {
            heroCinematicIndicators.forEach((ind, i) => {
                ind.addEventListener('click', () => {
                    clearInterval(cinematicInterval);
                    updateCinematicSlider(i);
                    cinematicInterval = setInterval(nextCinematicSlide, cinematicIntervalTime);
                });
            });
        }
    }
    
    // B. Magnetic Buttons
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Subtle movement (divide by factor to dampen)
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0) scale(1)';
        });
    });
    
    // C. Particle Effect (Lightweight)
    const particleContainer = document.getElementById('heroParticles');
    if(particleContainer) {
        for(let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.classList.add('particle-dot');
            
            // Random positioning
            const size = Math.random() * 4 + 2; // 2px to 6px
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;
            
            // Random animation delay
            dot.style.opacity = Math.random() * 0.5 + 0.1;
            const duration = Math.random() * 10 + 10; // 10s to 20s
            
            dot.animate([
                { transform: 'translate(0, 0)', opacity: 0.1 },
                { transform: `translate(${Math.random()*100 - 50}px, ${Math.random()*100 - 50}px)`, opacity: 0.8 },
                { transform: 'translate(0, 0)', opacity: 0.1 }
            ], {
                duration: duration * 1000,
                iterations: Infinity,
                easing: 'ease-in-out'
            });
            
            particleContainer.appendChild(dot);
        }
    }

    /* 4. NAVBAR SCROLL OPTIMIZATION */
    const navbar = document.querySelector('.premium-nav');
    let lastScrollY = window.scrollY;
    let ticking = false;

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if(lastScrollY > 30) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    /* 5. INTERSECTION OBSERVER FOR ANIMATIONS */
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Trigger Counters
                if(entry.target.querySelector('.counter')) {
                    runCounters(entry.target);
                }
                
                // Play Video if visible
                const vid = entry.target.querySelector('video');
                if(vid && vid.paused) vid.play().catch(()=>{});

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom').forEach(el => animateOnScroll.observe(el));

    /* 6. COUNTERS ANIMATION */
    function runCounters(section) {
        const counters = section.querySelectorAll('.counter');
        const duration = 2000;
        
        counters.forEach(cnt => {
            const target = +cnt.getAttribute('data-target');
            const inc = target / (duration / 16);
            let current = 0;
            
            const update = () => {
                current += inc;
                if(current < target) {
                    cnt.innerText = Math.floor(current).toLocaleString();
                    requestAnimationFrame(update);
                } else {
                    cnt.innerText = target.toLocaleString();
                }
            };
            requestAnimationFrame(update);
        });
    }

    /* 7. OFFCANVAS & SMOOTH SCROLLING */
    const offcanvasEl = document.getElementById('premiumOffcanvas');
    let bsOffcanvas = null;
    if(offcanvasEl) {
        bsOffcanvas = new bootstrap.Offcanvas(offcanvasEl);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            
            if(targetEl) {
                e.preventDefault();
                // Close mobile menu if open
                if(offcanvasEl && offcanvasEl.classList.contains('show')) {
                    bsOffcanvas.hide();
                }
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* 8. VIDEO MODAL LOGIC */
    const videoModal = document.getElementById('videoModal');
    const fullVideo = document.getElementById('fullScreenVideo');
    const bgVideo = document.querySelector('.bg-video');

    if(videoModal && fullVideo) {
        videoModal.addEventListener('shown.bs.modal', () => {
             // Pause background loop to save resources
            if(bgVideo) bgVideo.pause();
            // Play full video
            fullVideo.play().catch(err => console.log('Autoplay prevented:', err));
        });

        videoModal.addEventListener('hidden.bs.modal', () => {
            // Resume background loop
            if(bgVideo) bgVideo.play().catch(() => {});
            // Pause and reset full video
            fullVideo.pause();
            fullVideo.currentTime = 0;
        });
    }

    /* 9. (Magnetic Effect Removed for Stability) */

    /* 10. PREMIUM TILT EFFECT & MOUSE GLOW */
    const tiltCards = document.querySelectorAll('.tilt-card, .contact-box-premium');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Update CSS variables for mouse-following glow
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
    
    /* 11. DYNAMIC GLASS HIGHLIGHTS (Developers Page) */
    document.querySelectorAll('.dev-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

});
