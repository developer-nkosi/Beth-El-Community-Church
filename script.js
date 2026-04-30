/**
 * BETH-EL COMMUNITY CHURCH
 * Interactive JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mark as JS active for animations
    document.documentElement.classList.add('js-active');

    // Initialize all modules
    initThemeToggle();
    initNavigation();
    initSmoothScroll();
    initScrollToTop();
    initContactOverlay();
    initScrollAnimations();
    initContactForm();
    initDailyScripture();
    initPrayerModal();
});

/**
 * Theme Toggle - Light/Dark Mode
 */
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Add rotation animation
        toggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            toggle.style.transform = '';
        }, 300);
    });
}

/**
 * Scroll to Top Button Logic
 */
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');

    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Navigation - Scroll Effect
 */
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;

    const handleScroll = () => {
        const currentScroll = window.pageYOffset;

        // Add scrolled class when not at top
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial state
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close contact overlay if clicking contact link
                if (href === '#contact') {
                    closeContactOverlay();
                }
            }
        });
    });
}

/**
 * Contact Overlay - Full Screen Form
 */
function initContactOverlay() {
    const overlay = document.getElementById('contactOverlay');
    const closeBtn = document.getElementById('overlayClose');
    const contactBtn = document.getElementById('navContactBtn');
    const contactLinks = document.querySelectorAll('a[href="#contact"]');

    // Open overlay when clicking contact button in nav
    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openContactOverlay();
        });
    }

    // Open overlay when clicking contact links in content
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openContactOverlay();
        });
    });

    // Close overlay
    if (closeBtn) {
        closeBtn.addEventListener('click', closeContactOverlay);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeContactOverlay();
        }
    });

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeContactOverlay();
        }
    });
}

function openContactOverlay() {
    const overlay = document.getElementById('contactOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first input
        const firstInput = overlay.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }
}

function closeContactOverlay() {
    const overlay = document.getElementById('contactOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Scroll Animations - Fade In Elements
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.about-content, .about-image, .scripture-card, .event-card, .sermon-card, .kids-content, .kids-image, .giving-content, .contact-form'
    );

    // Add initial state
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Stagger animation for grid items
                if (entry.target.classList.contains('event-card') ||
                    entry.target.classList.contains('sermon-card')) {
                    const index = Array.from(entry.target.parentNode.children)
                        .indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * Contact Form Handler
 */
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Get button and show loading state
            const submitBtn = form.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Real form submission via Formspree
            try {
                const response = await fetch('https://formspree.io/f/mehim375@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Show success message
                    submitBtn.textContent = 'Message Sent!';
                    submitBtn.style.backgroundColor = 'var(--accent)';
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                }, 3000);

                console.log('Form submitted successfully');
            } catch (error) {
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.disabled = false;

                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 3000);

                console.error('Form submission error:', error);
            }
        });
    }

    // Overlay form handler
    const overlayForm = document.querySelector('.overlay-form');
    if (overlayForm) {
        overlayForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(overlayForm);
            const submitBtn = overlayForm.querySelector('.btn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                const response = await fetch('https://formspree.io/f/mehim375@gmail.com', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    submitBtn.textContent = 'Message Sent!';
                    overlayForm.reset();
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        closeContactOverlay();
                    }, 1500);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 3000);
            }
        });
    }
}

/**
 * Prayer Modal - Random Verse then Contact
 */
function initPrayerModal() {
    const modal = document.getElementById('prayerModal');
    const openBtn = document.getElementById('prayerRequestBtn');
    const closeBtn = document.getElementById('prayerModalClose');
    const nextBtn = document.getElementById('prayerNextBtn');
    const verseText = document.getElementById('prayerVerse');
    const verseRef = document.getElementById('prayerReference');

    const prayerVerses = [
        { text: '"The Lord is near to all who call on him, to all who call on him in truth."', ref: "Psalm 145:18" },
        { text: '"Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you."', ref: "Isaiah 41:10" },
        { text: '"Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God."', ref: "Philippians 4:6" },
        { text: '"Cast all your anxiety on him because he cares for you."', ref: "1 Peter 5:7" },
        { text: '"The prayer of a righteous person has great power as it is working."', ref: "James 5:16" },
        { text: '"Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you."', ref: "Deuteronomy 31:6" }
    ];

    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const randomVerse = prayerVerses[Math.floor(Math.random() * prayerVerses.length)];
            verseText.textContent = randomVerse.text;
            verseRef.textContent = randomVerse.ref;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Use existing contact overlay
            openContactOverlay();
        });
    }

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/**
 * Daily Scripture Rotator - Rotates daily based on the day of the year
 */
function initDailyScripture() {
    const scriptures = [
        { text: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future."', reference: 'Jeremiah 29:11' },
        { text: '"The Lord is my shepherd, I lack nothing."', reference: 'Psalm 23:1' },
        { text: '"But those who hope in the Lord will renew their strength. They will soar on wings like eagles."', reference: 'Isaiah 40:31' },
        { text: '"I can do all this through him who gives me strength."', reference: 'Philippians 4:13' },
        { text: '"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."', reference: 'John 3:16' },
        { text: '"Come to me, all you who are weary and burdened, and I will give you rest."', reference: 'Matthew 11:28' },
        { text: '"Trust in the Lord with all your heart and lean not on your own understanding."', reference: 'Proverbs 3:5' },
        { text: '"In all your ways submit to him, and he will make your paths straight."', reference: 'Proverbs 3:6' },
        { text: '"Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go."', reference: 'Joshua 1:9' },
        { text: '"And we know that in all things God works for the good of those who love him, who have been called according to his purpose."', reference: 'Romans 8:28' },
        { text: '"The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?"', reference: 'Psalm 27:1' },
        { text: '"But seek first his kingdom and his righteousness, and all these things will be given to you as well."', reference: 'Matthew 6:33' },
        { text: '"Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own."', reference: 'Matthew 6:34' },
        { text: '"Cast all your anxiety on him because he cares for you."', reference: '1 Peter 5:7' },
        { text: '"The name of the Lord is a fortified tower; the righteous run to it and are safe."', reference: 'Proverbs 18:10' },
        { text: '"He gives strength to the weary and increases the power of the weak."', reference: 'Isaiah 40:29' },
        { text: '"Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me."', reference: 'Psalm 23:4' },
        { text: '"Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you."', reference: 'Ephesians 4:32' },
        { text: '"The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing."', reference: 'Zephaniah 3:17' },
        { text: '"Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid."', reference: 'John 14:27' },
        { text: '"The Lord is faithful, and he will strengthen you and protect you from the evil one."', reference: '2 Thessalonians 3:3' },
        { text: '"Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up."', reference: 'Galatians 6:9' },
        { text: '"Give thanks to the Lord, for he is good; his love endures forever."', reference: 'Psalm 107:1' },
        { text: '"God is our refuge and strength, an ever-present help in trouble."', reference: 'Psalm 46:1' },
        { text: '"The steadfast love of the Lord never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness."', reference: 'Lamentations 3:22-23' }
    ];

    const scriptureSection = document.querySelector('.scripture-section');

    if (scriptureSection) {
        // Daily Rotation: One consistent verse per day
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        const dailyScripture = scriptures[dayOfYear % scriptures.length];

        const scriptureText = scriptureSection.querySelector('.scripture-text');
        const scriptureRef = scriptureSection.querySelector('.scripture-reference');

        if (scriptureText && scriptureRef) {
            scriptureText.textContent = dailyScripture.text;
            scriptureRef.textContent = `— ${dailyScripture.reference}`;

            scriptureText.style.opacity = '1';
            scriptureRef.style.opacity = '1';
        }
    }
}

/**
 * Parallax Effect for Hero (Optional Enhancement)
 */
function initParallax() {
    const heroBg = document.querySelector('.hero-bg');

    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.querySelector('.hero').offsetHeight;

            if (scrolled < heroHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }, { passive: true });
    }
}

/**
 * Active Navigation Link Highlighter
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const observer = new IntersectionObserver((entries) => {
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
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    initActiveNavHighlight();
});
