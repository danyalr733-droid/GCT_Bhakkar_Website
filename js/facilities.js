/* --- FACILITIES INTERACTIVE LOGIC --- */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Preloader
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        triggerHeroAnimations();
    }, 1200);

    // 2. Intersection Observer for Scroll Reveals
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-anim');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right, .zoom-in');
    revealElements.forEach(el => observer.observe(el));

    // 3. 3D Tilt Effect for Cards (Vanilla JS)
    const cards = document.querySelectorAll('.tilt-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });

    // 4. Theme Toggling (Synced with LocalStorage)
    const themeBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (systemDark) {
        html.setAttribute('data-theme', 'dark');
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        html.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        localStorage.setItem('theme', newTheme);
    });

    // 5. Hero Manual Trigger
    function triggerHeroAnimations() {
        // Force hero elements to animate if not caught by observer immediately
        const heroAnims = document.querySelectorAll('.hero-section .reveal-up, .hero-section .badge-pill');
        heroAnims.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active-anim');
            }, index * 200);
        });
    }
});
