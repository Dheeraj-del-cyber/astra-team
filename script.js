/* 
    ASTRA – Tech Student Team
    Logic: Scroll animations, Sound Control, Lightbox
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Preloader & Initialization Video ---
    const preloader = document.getElementById('preloader');
    const initVideo = document.getElementById('init-video');
    const startOverlay = document.getElementById('start-overlay');
    
    // Pulse animation keyframes for the text
    const styleSheet = document.createElement('style');
    styleSheet.innerText = `@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }`;
    document.head.appendChild(styleSheet);

    let isInitComplete = false;

    // --- Check for Skip Intro Parameter ---
    const urlParams = new URLSearchParams(window.location.search);
    const skipIntro = urlParams.get('skipIntro') === 'true';

    const finishInitialization = () => {
        isInitComplete = true; // Mark system as active
        if (preloader) {
            preloader.style.transition = 'opacity 0.8s ease';
            preloader.style.opacity = '0';
        }
        setTimeout(() => {
            if (preloader) preloader.style.display = 'none';
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) heroContent.classList.add('start-animation');
            
            // Explicitly start the hero video now
            if (heroVideo) heroVideo.play().catch(() => {});
            
            // Unmute and handle audio sequence
            startAudioOnInteraction();
        }, 800);
    };

    if (skipIntro) {
        // FAST PATH: Return from Team page
        if (preloader) preloader.style.display = 'none';
        if (startOverlay) startOverlay.style.display = 'none';
        isInitComplete = true;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) heroContent.classList.add('start-animation');
        // Start background ripples
        setTimeout(() => {
            if (typeof $ !== 'undefined' && $('body').ripples) {
                $('body').ripples('updateSize');
            }
        }, 500);
    } else if (startOverlay && initVideo) {
        // STANDARD PATH: First visit
        startOverlay.addEventListener('click', () => {
            startOverlay.style.display = 'none'; 
            initVideo.style.display = 'block'; 
            
            // Warm up the hero video (muted) so it's ready to go after the intro
            const heroVid = document.getElementById('hero-video');
            if (heroVid) {
                heroVid.muted = true;
                heroVid.play().catch(e => console.log("Hero warm-up blocked:", e));
            }

            initVideo.play().then(() => {
                initVideo.onended = () => {
                    finishInitialization();
                };
            }).catch(err => {
                console.log("Initialization video failed:", err);
                finishInitialization(); 
            });
        });
    } else {
        // Fallback for missing elements
        window.addEventListener('load', () => {
            setTimeout(finishInitialization, 1000);
        });
    }

    // --- Global User Interaction to Play Sound ---
    const startAudioOnInteraction = () => {
        if (!isInitComplete) return; // Prevent background music from overlapping the initialization video!

        if (!isPlaying) {
            if (heroVideo) {
                heroVideo.muted = false;
                heroVideo.play().then(() => {
                    isPlaying = true;
                    if (soundIcon) {
                        soundIcon.classList.remove('fa-volume-mute');
                        soundIcon.classList.add('fa-volume-up');
                    }
                    if (soundToggle) soundToggle.style.borderColor = 'var(--primary-blue)';
                    console.log("Hero video sound initiated via user interaction.");
                    
                    // Remove listeners ONLY after successful playback
                    document.removeEventListener('click', startAudioOnInteraction);
                    document.removeEventListener('touchstart', startAudioOnInteraction);
                    document.removeEventListener('touchend', startAudioOnInteraction);
                }).catch(err => console.log("Interaction playback failed, waiting for next touch:", err));
            }
        }
    };

    document.addEventListener('click', startAudioOnInteraction);
    document.addEventListener('touchstart', startAudioOnInteraction);
    document.addEventListener('touchend', startAudioOnInteraction);

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    let scrollProgress = document.getElementById('scroll-progress');
    let isScrolling = false;

    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                // Update Scroll Progress Bar
                if (scrollProgress) {
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrolled = (window.scrollY / scrollHeight) * 100;
                    scrollProgress.style.width = scrolled + '%';
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // --- Sound Control ---
    const soundToggle = document.getElementById('sound-toggle');
    const heroVideo = document.getElementById('hero-video');
    const soundIcon = soundToggle.querySelector('i');
    let isPlaying = false;

    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            if (!isPlaying) {
                if (heroVideo) {
                    heroVideo.muted = false;
                    heroVideo.play().then(() => {
                        isPlaying = true;
                        if (soundIcon) {
                            soundIcon.classList.remove('fa-volume-mute');
                            soundIcon.classList.add('fa-volume-up');
                        }
                        soundToggle.style.borderColor = 'var(--primary-blue)';
                    }).catch(err => console.log("Audio playback failed:", err));
                }
            } else {
                if (heroVideo) heroVideo.muted = true;
                isPlaying = false;
                if (soundIcon) {
                    soundIcon.classList.remove('fa-volume-up');
                    soundIcon.classList.add('fa-volume-mute');
                }
                soundToggle.style.borderColor = 'var(--glass-border)';
            }
        });
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-delay, .reveal-delay-2, .reveal-delay-3');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Gallery Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const captionText = document.getElementById('caption');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const closeLightbox = document.querySelector('.close-lightbox');

    if (lightbox && closeLightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                lightbox.style.display = 'block';
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = item.getAttribute('data-src') || img.src;
                    captionText.innerHTML = img.alt;
                }
                document.body.style.overflow = 'hidden'; 
            });
        });

        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (window.innerWidth <= 992) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // Console Log for "Hacker" Vibe
    console.log("%c ASTRA SYSTEM INITIALIZED ", "background: #00d2ff; color: #000; font-weight: bold; font-size: 20px;");
    console.log("%c All systems operational. Waiting for user input... ", "color: #00d2ff;");

});
