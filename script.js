document.addEventListener('DOMContentLoaded', () => {
    
    // ─── 0. BOOK SPLASH SCREEN ──────────────────────────────────────
    const bookSplash = document.getElementById('book-splash');
    const splashTrigger = document.getElementById('splash-trigger');
    if (bookSplash && splashTrigger) {
        // Prevent scrolling while splash screen is active
        document.body.style.overflow = 'hidden';
        
        splashTrigger.addEventListener('click', () => {
            bookSplash.classList.add('is-open');
            // Allow scrolling after the pages fly away (matches the 6s total transition)
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 6000);
        });
    }

    // ─── 1. SCROLL APPEARANCE — One by one, staggered ──────────────
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px', // only fire when well inside viewport
        threshold: 0.08
    };

    // Pending queue: groups elements entering at the same scroll tick
    // and staggers them so each appears individually, not all at once
    let staggerQueue = [];
    let staggerTimer = null;

    const flushQueue = () => {
        staggerQueue.forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 130);
        });
        staggerQueue = [];
        staggerTimer = null;
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                staggerQueue.push(entry.target);
                obs.unobserve(entry.target);
            }
        });
        // Debounce: collect all entries from this scroll tick, then flush
        clearTimeout(staggerTimer);
        staggerTimer = setTimeout(flushQueue, 60);
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-left, .slide-right').forEach(el => observer.observe(el));


    // ─── 2. THEME & LANGUAGE TOGGLES ────────────────────────────────
    const themeToggleBtn = document.getElementById('theme-toggle');
    const langToggleBtn  = document.getElementById('lang-toggle');
    const body = document.body;

    // Guard: only run toggle logic when buttons exist on this page
    if (!themeToggleBtn || !langToggleBtn) return;

    // ── Apply saved preferences on load ──
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedLang  = localStorage.getItem('lang')  || 'en';

    if (savedTheme === 'light') {
        body.classList.add('light-theme');
        themeToggleBtn.textContent = '🌙';
    } else {
        body.classList.remove('light-theme');
        themeToggleBtn.textContent = '☀️';
    }

    if (savedLang === 'hi') {
        body.classList.remove('lang-en');
        body.classList.add('lang-hi');
    } else {
        body.classList.remove('lang-hi');
        body.classList.add('lang-en');
    }

    // ── Theme toggle ──
    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️';
        } else {
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙';
        }
    });

    // ── Language toggle ──
    langToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('lang-en')) {
            body.classList.remove('lang-en');
            body.classList.add('lang-hi');
            localStorage.setItem('lang', 'hi');
        } else {
            body.classList.remove('lang-hi');
            body.classList.add('lang-en');
            localStorage.setItem('lang', 'en');
        }
    });
});
