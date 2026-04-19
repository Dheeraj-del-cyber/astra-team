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

    const finishInitialization = () => {
        isInitComplete = true; // Mark system as active
        preloader.style.transition = 'opacity 0.8s ease';
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            document.querySelector('.hero-content').classList.add('start-animation');
            
            // Explicitly start the hero video now
            heroVideo.play();
            
            // Unmute and handle audio sequence
            startAudioOnInteraction();
        }, 800);
    };

    if (startOverlay && initVideo) {
        startOverlay.addEventListener('click', () => {
            startOverlay.style.display = 'none'; // Hide overlay
            initVideo.style.display = 'block'; // Show video
            
            initVideo.play().then(() => {
                // Video is playing
                initVideo.onended = () => {
                    finishInitialization();
                };
            }).catch(err => {
                console.log("Initialization video failed:", err);
                finishInitialization(); // Fallback
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
            heroVideo.muted = false;
            heroVideo.play().then(() => {
                isPlaying = true;
                soundIcon.classList.remove('fa-volume-mute');
                soundIcon.classList.add('fa-volume-up');
                soundToggle.style.borderColor = 'var(--primary-blue)';
                console.log("Hero video sound initiated via user interaction.");
                
                // Remove listeners ONLY after successful playback
                document.removeEventListener('click', startAudioOnInteraction);
                document.removeEventListener('touchstart', startAudioOnInteraction);
                document.removeEventListener('touchend', startAudioOnInteraction);
            }).catch(err => console.log("Interaction playback failed, waiting for next touch:", err));
        }
    };

    document.addEventListener('click', startAudioOnInteraction);
    document.addEventListener('touchstart', startAudioOnInteraction);
    document.addEventListener('touchend', startAudioOnInteraction);

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update Scroll Progress Bar
        const scrollProgress = document.getElementById('scroll-progress');
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // --- Sound Control ---
    const soundToggle = document.getElementById('sound-toggle');
    const heroVideo = document.getElementById('hero-video');
    const soundIcon = soundToggle.querySelector('i');
    let isPlaying = false;

    soundToggle.addEventListener('click', () => {
        if (!isPlaying) {
            heroVideo.muted = false;
            heroVideo.play().then(() => {
                isPlaying = true;
                soundIcon.classList.remove('fa-volume-mute');
                soundIcon.classList.add('fa-volume-up');
                soundToggle.style.borderColor = 'var(--primary-blue)';
            }).catch(err => console.log("Audio playback failed:", err));
        } else {
            heroVideo.muted = true;
            isPlaying = false;
            soundIcon.classList.remove('fa-volume-up');
            soundIcon.classList.add('fa-volume-mute');
            soundToggle.style.borderColor = 'var(--glass-border)';
        }
    });

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

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightbox.style.display = 'block';
            lightboxImg.src = item.getAttribute('data-src');
            captionText.innerHTML = item.querySelector('img').alt;
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Resume scrolling
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active'); // Optional: can be used to animate hamburger
    });

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
