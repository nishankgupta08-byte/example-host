document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    let currentImageIndex = 0;

    // Local images found in the 'images' directory
    const localImages = [
        "IMG_20250917_201927015_HDR.jpg", "IMG_20251207_173209228.jpg", "IMG_20251218_114541577.jpg",
        "IMG_20251218_115600762.jpg", "IMG_20251218_115605707.jpg", "IMG_20251218_213524035.jpg",
        "IMG_20251220_085716834-1.jpg", "IMG_20260101_000136736.jpg",
        "Snapchat-1066182151.jpg", "Snapchat-107591429.jpg", "Snapchat-1097579361.jpg",
        "Snapchat-1120900187.jpg", "Snapchat-134263729.jpg", "Snapchat-1460898591.jpg",
        "Snapchat-1473500563.jpg", "Snapchat-1618620178.jpg", "Snapchat-1707352871.jpg",
        "Snapchat-1739180298.jpg", "Snapchat-1739970005.jpg", "Snapchat-181123993.jpg",
        "Snapchat-2022764215.jpg", "Snapchat-2114557979.jpg", "Snapchat-236369478.jpg",
        "Snapchat-246386606.jpg", "Snapchat-303972939.jpg", "Snapchat-424861939.jpg",
        "Snapchat-457895717.jpg", "Snapchat-541833976.jpg", "Snapchat-575120482.jpg",
        "Snapchat-704974195.jpg", "Snapchat-851486902.jpg", "Snapchat-89908312.jpg",
        "Snapchat-913006698.jpg", "Snapchat-915078018.jpg", "Snapchat-989437900.jpg",
        "Screenshot 2026-01-07 105222.png", "Screenshot 2026-01-07 105315.png",
        "Screenshot 2026-01-07 105330.png", "Screenshot 2026-01-07 105344.png",
        "Screenshot 2026-01-07 105356.png", "Screenshot 2026-01-07 105408.png",
        "Screenshot 2026-01-07 105419.png", "Screenshot 2026-01-07 105431.png",
        "Screenshot 2026-01-07 105440.png", "Screenshot 2026-01-07 105450.png"
    ];

    // Helper to get random number in range
    const random = (min, max) => Math.random() * (max - min) + min;

    localImages.forEach((filename, index) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('photo-wrapper');

        const img = document.createElement('img');
        img.classList.add('photo-card');
        img.classList.add('floating');

        // Use local path
        const imgSrc = `images/${filename}`;
        img.src = imgSrc;
        img.dataset.fullSize = imgSrc; // Use same image for lightbox (high enough res)

        // Random Styling
        const rot = random(-6, 6); // Random rotation dump feel
        const animDuration = random(4, 8); // Random float speed

        // Store random rotation to re-apply it after hover
        wrapper.dataset.rotation = rot;

        // Apply Float Animation Specifics
        img.style.animationDuration = `${animDuration}s`;
        img.style.animationDelay = `${random(-5, 0)}s`; // Start at random point in cycle

        // Wrapper positioning (Transform will be managed by Observer + this initial rotation)
        wrapper.style.setProperty('--rot', `${rot}deg`);

        wrapper.appendChild(img);
        gallery.appendChild(wrapper);

        // Click to Open Lightbox
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
        });
    });

    // Close Lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        // Clear src after delays to prevent ugly flash if reopened
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    lightbox.addEventListener('click', closeLightbox);

    // Update Lightbox Image based on currentImageIndex
    function updateLightboxImage() {
        const filename = localImages[currentImageIndex];
        lightboxImg.src = `images/${filename}`;
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + localImages.length) % localImages.length;
            updateLightboxImage();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % localImages.length;
            updateLightboxImage();
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    // Scroll Observer for Slide-Up + Fade-In Reveal
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "50px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const rot = el.dataset.rotation;
                el.style.transform = `translateY(0) rotate(${rot}deg)`;
                el.classList.add('in-view');
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    const wrappers = document.querySelectorAll('.photo-wrapper');
    wrappers.forEach(w => observer.observe(w));

    // Parallax-ish Mouse Movement & Trail
    document.addEventListener('mousemove', (e) => {
        createTrail(e.pageX, e.pageY);
    });

    document.addEventListener('touchmove', (e) => {
        // Prevent default to maybe avoid scrolling interference if desired, 
        // but often we just want the visual. remove preventDefault if scrolling is blocked.
        // e.preventDefault(); 
        const touch = e.touches[0];
        createTrail(touch.pageX, touch.pageY);
    }, { passive: true });

    function createTrail(x, y) {
        const trail = document.createElement('div');
        trail.classList.add('trail');
        document.body.appendChild(trail);

        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;

        // Clean up after animation
        setTimeout(() => {
            trail.remove();
        }, 800);
    }
});
