/* --- MAIN SCRIPT --- */
document.addEventListener('DOMContentLoaded', () => {

    /* 1. THEME MANAGER */
    const htmlEl = document.documentElement;
    const toggleBtns = document.querySelectorAll('.theme-switch-wrapper');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
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

    /* 3. HERO SLIDESHOW */
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    if(slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
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

    /* 8. VIDEO PLAY/PAUSE TOGGLE */
    const btnPlay = document.querySelector('.btn-play');
    const bgVideo = document.querySelector('.bg-video');
    
    if(btnPlay && bgVideo) {
        btnPlay.addEventListener('click', () => {
            if(bgVideo.paused) {
                bgVideo.play().then(() => {
                    btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
                    btnPlay.classList.remove('pulse-animation');
                }).catch(err => console.log('Video playback failed', err));
            } else {
                bgVideo.pause();
                btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
                btnPlay.classList.add('pulse-animation');
            }
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
