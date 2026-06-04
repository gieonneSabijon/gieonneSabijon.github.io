
let currentProjectIndex = 0;
let projects = [];
let dots = [];

// Swipe navigation coordinates for carousel
let touchStartX = 0;
let touchEndX = 0;


function onLoad() {
    initCarousel();
    setupMobileMenu();
}


function setupScrollObservers() {
    const sections = document.querySelectorAll('.contentSection');
    const navLinks = document.querySelectorAll('.linkList a');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(section => {
        revealObserver.observe(section);
    });

    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5, rootMargin: '-10% 0px -60% 0px' });

    sections.forEach(section => {
        activeNavObserver.observe(section);
    });
}


function setupMobileMenu() {
    const toggleBtn = document.querySelector('.collapseToggle');
    const linkList = document.querySelector('.linkList');
    const navLinks = document.querySelectorAll('.linkList a');

    if (toggleBtn && linkList) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBtn.classList.toggle('open');
            linkList.classList.toggle('open');
        });

        // Close menu when clicking link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleBtn.classList.remove('open');
                linkList.classList.remove('open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!linkList.contains(e.target) && !toggleBtn.contains(e.target)) {
                toggleBtn.classList.remove('open');
                linkList.classList.remove('open');
            }
        });
    }
}

function bootSystem() {
    const powerBtn = document.querySelector('.powerButton');
    const logBox = document.querySelector('.boot-logs');
    const bootScreen = document.querySelector('.powerButtonContainer');
    const page = document.querySelector('.pageContainer');

    if (!bootScreen || !page || !powerBtn) return;

    powerBtn.style.pointerEvents = 'none';
    powerBtn.style.opacity = '0.5';

    logBox.innerHTML = '';

    const logMessages = [
        'INITIALIZING CORE SYSTEM...',
        'DECRYPTING CORE INTERFACE...',
        'DECRYPTION SUCCESSFUL.',
        'INITIALIZING GRAPHICAL INTERFACE...',
        'SYSTEM READY.'
    ];

    let logIndex = 0;

    function printNextLog() {
        if (logIndex < logMessages.length) {
            const line = document.createElement('div');
            line.className = 'boot-log-line';
            line.innerHTML = `> ${logMessages[logIndex]}`;
            logBox.appendChild(line);

            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
                logIndex++;
                printNextLog();
            }, 300);
        } else {
            setTimeout(() => {
                bootScreen.classList.add('shut-off');

                // After CRT vertical collapse, collapse horizontally & hide
                setTimeout(() => {
                    bootScreen.classList.add('shut-off-complete');
                    page.style.display = 'flex';

                    setupScrollObservers();
                }, 400);
            }, 600);
        }
    }

    printNextLog();
}

/**
 * initCarousel
 * Dynamically scans DOM for projects, sets up dots, drag events, and centers active card
 */
function initCarousel() {
    const track = document.querySelector('.carousel');
    if (!track) return;

    // Prevent duplicate initialization
    if (track.classList.contains('carousel-dots-initialized')) return;

    projects = Array.from(track.querySelectorAll('.projectWrapper'));
    if (projects.length === 0) return;

    // Clear global dots array to ensure it is clean
    dots = [];

    // Create Navigation Dots
    const dotsContainer = document.getElementById('carouselDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        projects.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
            dot.addEventListener('click', () => jumpToProject(idx));
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });
    }

    // Bind click actions directly to adjacent cards for intuitive navigation
    projects.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
            if (card.classList.contains('leftProject')) {
                moveCarousel(-1);
            } else if (card.classList.contains('rightProject')) {
                moveCarousel(1);
            }
        });
    });

    // Touch Swipe Bindings for Mobile
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    // Mark as initialized
    track.classList.add('carousel-dots-initialized');

    // Run initial card update
    updateCarousel();
}

/**
 * handleSwipe
 * Decides whether to slide left/right on touch swipe
 */
function handleSwipe() {
    const swipeThreshold = 50; // pixels
    if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped Left -> Next Project
        moveCarousel(1);
    } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped Right -> Prev Project
        moveCarousel(-1);
    }
}

/**
 * moveCarousel
 * Cycles the project carousel index left (-1) or right (+1)
 */
function moveCarousel(direction) {
    if (projects.length === 0) return;

    currentProjectIndex = (currentProjectIndex + direction + projects.length) % projects.length;
    updateCarousel();
}

/**
 * jumpToProject
 * Jumps directly to a project by its index
 */
function jumpToProject(index) {
    currentProjectIndex = index;
    updateCarousel();
}

/**
 * updateCarousel
 * Refreshes card positions and active classes using CSS hardware-accelerated transforms
 */
function updateCarousel() {
    const N = projects.length;
    if (N === 0) return;

    projects.forEach((card, index) => {
        card.classList.remove('leftProject', 'focusedProject', 'rightProject', 'hiddenProject');

        if (index === currentProjectIndex) {
            card.classList.add('focusedProject');
        } else if (index === (currentProjectIndex - 1 + N) % N && N > 2) {
            card.classList.add('leftProject');
        } else if (index === (currentProjectIndex + 1) % N && N > 1) {
            card.classList.add('rightProject');
        } else if (index === (currentProjectIndex - 1 + N) % N && N === 2 && currentProjectIndex === 1) {
            // Boundary fallback for exactly 2 projects
            card.classList.add('leftProject');
        } else {
            card.classList.add('hiddenProject');
        }
    });

    // Update Dots indicator
    dots.forEach((dot, index) => {
        if (index === currentProjectIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}



// Deprecated original functions mapped to modern equivalents for HTML compatibility
function projectCycle(direction) {
    if (direction === 'left') moveCarousel(-1);
    if (direction === 'right') moveCarousel(1);
}

function toggleSite() {
    bootSystem();
}

function toggleCollapse() {
    // Kept for backward compatibility if called, but header menu is fully handled by setupMobileMenu
    const toggleBtn = document.querySelector('.collapseToggle');
    if (toggleBtn) toggleBtn.click();
}
