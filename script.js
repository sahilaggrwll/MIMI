/* ==========================================================================
   MINIMALIST FULLSCREEN BIRTHDAY WEBSITE LOGIC ("MIMI")
   - Non-Scrollable Fullscreen Viewport Slide Manager
   - 25s Auto-Play Story Timeline (Letter -> Photos 1-20 -> Midnight Gate)
   - 12:00 AM Countdown & Midnight Gift Reveal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Photo Memories Data Array (20 items) ---
    const photosData = [
        { id: 2, src: 'photos/photo2.jpg', caption: 'Random ass Photo' },
        { id: 3, src: 'photos/photo3.jpg', caption: 'One with your new Top!!' },
        { id: 4, src: 'photos/photo4.jpg', caption: 'Our Favourite Photo?????' },
        { id: 5, src: 'photos/photo5.jpg', caption: 'A gentle smile that brightens any room ✨' },
        { id: 6, src: 'photos/photo6.jpg', caption: 'My favourite picture!!' },
        { id: 7, src: 'photos/photo7.jpg', caption: 'Jaldi Kheench Awkward Ho raha hai' },
        { id: 8, src: 'photos/photo8.jpg', caption: 'Who Am I? Why I am Here?' },
        { id: 9, src: 'photos/photo9.jpg', caption: 'Influenzaaaa (Accent!! not Bimari)📸' },
        { id: 10, src: 'photos/photo10.jpg', caption: 'MCD!! 🌅' },
        { id: 11, src: 'photos/photo11.jpg', caption: 'Doctor Appointment 🎉' },
        { id: 12, src: 'photos/photo12.jpg', caption: 'You coming back to pick me up, just because u love me!!! 🌙' },
        { id: 13, src: 'photos/photo13.jpg', caption: 'Cutest Photo 💛' },
        { id: 14, src: 'photos/photo14.jpg', caption: 'Hottest, Cutest, Best Picture 🚲' }
    ];

    let currentPhotoIndex = 0;
    let isStoryPlaying = false;
    let storyTimer = null;
    let storyStartTime = null;
    const storyDurationSeconds = 25; // 20-30s story playback

    // Fullscreen Screen Navigation
    const slides = {
        letter: document.getElementById('slide-letter'),
        gallery: document.getElementById('slide-gallery'),
        finale: document.getElementById('slide-finale')
    };

    function showScreen(screenKey) {
        Object.keys(slides).forEach(key => {
            if (slides[key]) {
                slides[key].classList.toggle('active', key === screenKey);
            }
        });
    }

    // DOM Elements
    const activePhoto = document.getElementById('activePhoto');
    const bgBlurPhoto = document.getElementById('bgBlurPhoto');
    const photoBadge = document.getElementById('photoBadge');
    const photoCaption = document.getElementById('photoCaption');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsWrapper = document.getElementById('dotsWrapper');

    const startStoryBtn = document.getElementById('startStoryBtn');
    const backToLetterBtn = document.getElementById('backToLetterBtn');
    const goToFinaleBtn = document.getElementById('goToFinaleBtn');
    const backToGalleryBtn = document.getElementById('backToGalleryBtn');

    const autoPlayBtn = document.getElementById('autoPlayBtn');
    const progressContainer = document.getElementById('progressContainer');
    const progressBarFill = document.getElementById('progressBarFill');
    const progressStepText = document.getElementById('progressStepText');
    const progressTimeText = document.getElementById('progressTimeText');

    const viewGridBtn = document.getElementById('viewGridBtn');
    const photoGridModal = document.getElementById('photoGridModal');
    const closeGridBtn = document.getElementById('closeGridBtn');
    const gridContainer = document.getElementById('gridContainer');

    const openGateBtn = document.getElementById('openGateBtn');
    const gateDoors = document.getElementById('gateDoors');
    const peekModal = document.getElementById('peekModal');
    const closePeekBtn = document.getElementById('closePeekBtn');

    // --- 2. Gallery Initialization ---
    function initGallery() {
        // Build Dots
        dotsWrapper.innerHTML = '';
        photosData.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(idx));
            dotsWrapper.appendChild(dot);
        });

        // Build Grid Thumbnails
        gridContainer.innerHTML = '';
        photosData.forEach((item, idx) => {
            const thumb = document.createElement('div');
            thumb.className = 'grid-thumb';
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = `Photo ${item.id}`;
            img.onerror = () => { img.src = 'photos/photo1.jpg'; };
            thumb.appendChild(img);
            thumb.addEventListener('click', () => {
                goToSlide(idx);
                closeGridModal();
                showScreen('gallery');
            });
            gridContainer.appendChild(thumb);
        });

        updateSlide();
    }

    function updateSlide() {
        const item = photosData[currentPhotoIndex];
        if (!item) return;

        activePhoto.style.opacity = '0';
        if (bgBlurPhoto) bgBlurPhoto.style.opacity = '0';
        photoCaption.style.opacity = '0';

        setTimeout(() => {
            activePhoto.src = item.src;
            if (bgBlurPhoto) bgBlurPhoto.src = item.src;
            activePhoto.onerror = () => { 
                activePhoto.src = 'photos/photo1.jpg'; 
                if (bgBlurPhoto) bgBlurPhoto.src = 'photos/photo1.jpg';
            };
            photoBadge.textContent = `Photo ${currentPhotoIndex + 1} of ${photosData.length}`;
            photoCaption.textContent = `"${item.caption}"`;

            activePhoto.style.opacity = '1';
            if (bgBlurPhoto) bgBlurPhoto.style.opacity = '0.85';
            photoCaption.style.opacity = '1';
        }, 120);

        const dots = dotsWrapper.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentPhotoIndex);
        });

        if (dots[currentPhotoIndex]) {
            dots[currentPhotoIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    function goToSlide(index) {
        currentPhotoIndex = (index + photosData.length) % photosData.length;
        updateSlide();
    }

    function nextSlide() { goToSlide(currentPhotoIndex + 1); }
    function prevSlide() { goToSlide(currentPhotoIndex - 1); }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Touch Swipe Support for Mobile Photo Gallery
    let touchStartX = 0;
    let touchEndX = 0;
    const photoFrame = document.querySelector('.fullscreen-photo-frame');
    if (photoFrame) {
        photoFrame.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        photoFrame.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchEndX < touchStartX - 40) {
                nextSlide();
            } else if (touchEndX > touchStartX + 40) {
                prevSlide();
            }
        }, { passive: true });
    }

    // Keyboard Arrow Controls
    document.addEventListener('keydown', (e) => {
        if (slides.gallery.classList.contains('active')) {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        }
    });

    // Manual Screen Navigation Buttons
    startStoryBtn.addEventListener('click', () => showScreen('gallery'));
    backToLetterBtn.addEventListener('click', () => showScreen('letter'));
    goToFinaleBtn.addEventListener('click', () => {
        showScreen('finale');
        gateDoors.classList.add('open');
    });
    backToGalleryBtn.addEventListener('click', () => showScreen('gallery'));


    // --- 4. 25-Second Auto Story Engine (Non-Scrollable) ---
    autoPlayBtn.addEventListener('click', () => {
        if (isStoryPlaying) {
            stopStory();
        } else {
            startStory();
        }
    });

    function startStory() {
        isStoryPlaying = true;
        autoPlayBtn.classList.add('primary-pill');
        autoPlayBtn.querySelector('.btn-icon').textContent = '⏸';
        autoPlayBtn.querySelector('.btn-text').textContent = 'Pause Story';
        progressContainer.classList.add('active');

        storyStartTime = Date.now();
        currentPhotoIndex = 0;
        updateSlide();

        showScreen('letter'); // Start at opening letter

        storyTimer = setInterval(() => {
            const elapsedMs = Date.now() - storyStartTime;
            const elapsedSec = (elapsedMs / 1000).toFixed(1);
            const progressPct = Math.min(100, (elapsedMs / (storyDurationSeconds * 1000)) * 100);

            progressBarFill.style.width = `${progressPct}%`;
            progressTimeText.textContent = `${Math.min(storyDurationSeconds, Math.floor(elapsedSec))}s / ${storyDurationSeconds}s`;

            if (elapsedMs < 3000) {
                // Phase 1: Intro Letter (0 - 3s)
                progressStepText.textContent = 'Step 1/3: Reading Letter 💌';
                showScreen('letter');
            } else if (elapsedMs >= 3000 && elapsedMs < 21000) {
                // Phase 2: Photo Memories Gallery (3s - 21s)
                showScreen('gallery');

                // Calculate which photo to show
                const photoIdx = Math.floor(((elapsedMs - 3000) / 18000) * photosData.length);
                if (photoIdx !== currentPhotoIndex && photoIdx < photosData.length) {
                    currentPhotoIndex = photoIdx;
                    updateSlide();
                }
                progressStepText.textContent = `Step 2/3: Photo ${currentPhotoIndex + 1}/${photosData.length}`;
            } else if (elapsedMs >= 21000 && elapsedMs < storyDurationSeconds * 1000) {
                // Phase 3: Midnight Gate Finale (21s - 25s)
                progressStepText.textContent = 'Step 3/3: Midnight Gift Finale 🎁';
                showScreen('finale');
                gateDoors.classList.add('open');
            } else {
                // Done
                stopStory();
            }

        }, 100);
    }

    function stopStory() {
        isStoryPlaying = false;
        if (storyTimer) clearInterval(storyTimer);
        autoPlayBtn.querySelector('.btn-icon').textContent = '▶';
        autoPlayBtn.querySelector('.btn-text').textContent = 'Play Story (25s)';
        progressContainer.classList.remove('active');
        progressBarFill.style.width = '0%';
    }


    // --- 5. Grid Modal Handlers ---
    viewGridBtn.addEventListener('click', () => photoGridModal.classList.add('open'));
    closeGridBtn.addEventListener('click', closeGridModal);
    photoGridModal.addEventListener('click', (e) => {
        if (e.target === photoGridModal) closeGridModal();
    });
    function closeGridModal() { photoGridModal.classList.remove('open'); }


    // --- 6. 12:00 AM Countdown & Gate Peek ---
    function updateCountdown() {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);

        let diffMs = midnight.getTime() - now.getTime();
        if (diffMs < 0) diffMs = 0;

        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

        document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
        document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    openGateBtn.addEventListener('click', () => {
        gateDoors.classList.toggle('open');
        setTimeout(() => peekModal.classList.add('open'), 300);
    });

    closePeekBtn.addEventListener('click', () => peekModal.classList.remove('open'));
    peekModal.addEventListener('click', (e) => {
        if (e.target === peekModal) peekModal.classList.remove('open');
    });


    // --- 7. Floating Canvas Sparkles ---
    const canvas = document.getElementById('sparkleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 20;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 0.3 + 0.1;
            this.opacity = Math.random() * 0.4 + 0.2;
        }
        update() {
            this.y -= this.speedY;
            if (this.y < -10) this.reset();
        }
        draw() {
            ctx.fillStyle = `rgba(120, 134, 107, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 30; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Initialize
    initGallery();
});
