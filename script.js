document.addEventListener('DOMContentLoaded', function() {
    // --- 1. LIGHTBOX MEDIA LOGIC ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVideo = document.getElementById('lightbox-video');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Collect images from masonry and videos from the grid into one list
    const mediaElements = document.querySelectorAll('.masonry img, .video-grid video');
    let currentIndex = 0;

    mediaElements.forEach((el, index) => {
        el.onclick = () => {
            currentIndex = index;
            showMedia(currentIndex);
        };
    });

    function showMedia(index) {
        const element = mediaElements[index];
        if (!lightbox) return;

        lightbox.style.display = 'flex';

        if (element.tagName === 'IMG') {
            // Display Image, Hide Video
            if (lightboxVideo) {
                lightboxVideo.style.display = 'none';
                lightboxVideo.pause();
            }
            lightboxImg.style.display = 'block';
            lightboxImg.src = element.src;
        } else if (element.tagName === 'VIDEO') {
            // Display Video, Hide Image
            lightboxImg.style.display = 'none';
            if (lightboxVideo) {
                lightboxVideo.style.display = 'block';
                // Pull source from the inner <source> tag
                const videoSrc = element.querySelector('source').src;
                lightboxVideo.src = videoSrc;
                lightboxVideo.play();
            }
        }
    }

    // --- 2. NAVIGATION & CLOSING ---
    if (closeBtn) {
        closeBtn.onclick = () => {
            lightbox.style.display = 'none';
            if (lightboxVideo) {
                lightboxVideo.pause();
                lightboxVideo.src = ""; // Stop loading video
            }
        };
    }

    if (nextBtn) {
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % mediaElements.length;
            showMedia(currentIndex);
        };
    }

    if (prevBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + mediaElements.length) % mediaElements.length;
            showMedia(currentIndex);
        };
    }

    if (lightbox) {
        lightbox.onclick = (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                if (lightboxVideo) lightboxVideo.pause();
            }
        };
    }

    // --- 3. PAGE VIDEO AUTO-PAUSE LOGIC ---
    // Pauses other videos on the page when one is started manually
    const allPageVideos = document.querySelectorAll('.video-grid video');

    allPageVideos.forEach(selectedVideo => {
        selectedVideo.addEventListener('play', () => {
            allPageVideos.forEach(video => {
                if (video !== selectedVideo) {
                    video.pause();
                }
            });
        });
    });

}); // End of DOMContentLoaded

// --- 4. TAB LOGIC (GLOBAL SCOPE) ---
function openTab(evt, tabName) {
    let i, tabContent, tabBtns;

    // Hide all tab sections
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
        tabContent[i].style.display = "none";
    }

    // Deactivate all tab buttons
    tabBtns = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.remove("active");
    }

    // Show the current tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add("active");
        selectedTab.style.display = "block";
        evt.currentTarget.classList.add("active");

        // Pause all page videos when switching tabs to prevent audio bleed
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(v => v.pause());
    }
}