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

    // ─── 3. MODAL LOGIC FOR EVENTS ──────────────────────────────────
    const eventBlocks = document.querySelectorAll('.events-section .feature-block');
    if (eventBlocks.length > 0) {
        // Create modal container
        const modalHtml = `
            <div id="event-modal" class="event-modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="modal-body">
                        <div class="modal-img-container">
                            <img id="modal-img" src="" alt="">
                            <div id="modal-values" class="values"></div>
                        </div>
                        <div class="modal-text">
                            <h3 id="modal-title"></h3>
                            <div id="modal-desc"></div>
                            <div id="modal-extended"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const modal = document.getElementById('event-modal');
        const modalImg = document.getElementById('modal-img');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalValues = document.getElementById('modal-values');
        const modalExtended = document.getElementById('modal-extended');
        const closeModalBtn = document.querySelector('.close-modal');

        const openModal = (block) => {
            const img = block.querySelector('img');
            const title = block.querySelector('h3');
            const desc = block.querySelector('p');
            const values = block.querySelector('.values');
            const extended = block.querySelector('.modal-extended-content');

            if (img) {
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                modalImg.style.display = 'block';
            } else {
                modalImg.style.display = 'none';
            }
            
            modalTitle.innerHTML = title ? title.innerHTML : '';
            modalDesc.innerHTML = desc ? desc.innerHTML : '';
            modalValues.innerHTML = values ? values.innerHTML : '';
            modalExtended.innerHTML = extended ? extended.innerHTML : '';

            // Add slight delay to allow display:flex to take effect before opacity transition
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        };

        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => {
                modal.style.display = 'none';
            }, 400); // Wait for transition
        };

        eventBlocks.forEach(block => {
            block.addEventListener('click', () => openModal(block));
            // Ensure style reflects clickability
            block.style.cursor = 'pointer';
        });

        closeModalBtn.addEventListener('click', closeModal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });
    }
});
