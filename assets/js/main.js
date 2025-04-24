/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

// Improved event handling
if(navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    }, { passive: true });
}

if(navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    }, { passive: true });
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link');

function linkAction() {
    navMenu.classList.remove('show-menu');
}
navLink.forEach(n => n.addEventListener('click', linkAction, { passive: true }));

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader() {
    const header = document.getElementById('header');
    // Performance optimization - use requestAnimationFrame
    if(!header._headerChangeScheduled) {
        header._headerChangeScheduled = true;
        window.requestAnimationFrame(() => {
            if(this.scrollY >= 100) {
                header.classList.add('scroll-header');
            } else {
                header.classList.remove('scroll-header');
            }
            header._headerChangeScheduled = false;
        });
    }
}
window.addEventListener('scroll', scrollHeader, { passive: true });

/*==================== SWIPER DISCOVER ====================*/
// Lazy initialize Swiper for better performance
let swiper;
function initSwiper() {
    if(!swiper) {
        swiper = new Swiper(".discover__container", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            loop: true,
            spaceBetween: 32,
            coverflowEffect: {
                rotate: 0,
            },
        });
    }
}

// Initialize Swiper when relevant section is visible
const discoverSection = document.querySelector('#discover');
if(discoverSection) {
    const observer = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            initSwiper();
            observer.disconnect();
        }
    }, { threshold: 0.1 });
    observer.observe(discoverSection);
}

/*==================== VIDEO ====================*/
const videoFile = document.getElementById('video-file'),
      videoButton = document.getElementById('video-button'),
      videoIcon = document.getElementById('video-icon');

function playPause(){ 
    if (videoFile.paused) {
        videoFile.play();
        videoIcon.classList.add('ri-pause-line');
        videoIcon.classList.remove('ri-play-line');
    } else {
        videoFile.pause(); 
        videoIcon.classList.remove('ri-pause-line');
        videoIcon.classList.add('ri-play-line');
    }
}

if(videoButton) {
    videoButton.addEventListener('click', playPause, { passive: true });
}

function finalVideo() {
    videoIcon.classList.remove('ri-pause-line');
    videoIcon.classList.add('ri-play-line');
}

if(videoFile) {
    videoFile.addEventListener('ended', finalVideo, { passive: true });
}

/*==================== SHOW SCROLL UP ====================*/ 
function scrollUp() {
    const scrollUp = document.getElementById('scroll-up');
    // Performance optimization - use requestAnimationFrame
    if(!scrollUp._scrollUpChangeScheduled) {
        scrollUp._scrollUpChangeScheduled = true;
        window.requestAnimationFrame(() => {
            if(this.scrollY >= 200) {
                scrollUp.classList.add('show-scroll');
            } else {
                scrollUp.classList.remove('show-scroll');
            }
            scrollUp._scrollUpChangeScheduled = false;
        });
    }
}
window.addEventListener('scroll', scrollUp, { passive: true });

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    // Performance optimization - use requestAnimationFrame
    if(!window._scrollActiveScheduled) {
        window._scrollActiveScheduled = true;
        window.requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute('id');
                
                if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('.nav__menu a[href*=' + sectionId + ']')?.classList.add('active-link');
                } else {
                    document.querySelector('.nav__menu a[href*=' + sectionId + ']')?.classList.remove('active-link');
                }
            });
            window._scrollActiveScheduled = false;
        });
    }
}
window.addEventListener('scroll', scrollActive, { passive: true });

/*==================== DARK LIGHT THEME ====================*/ 
const themeButton = document.getElementById('theme-button');
const darkTheme = 'dark-theme';
const iconTheme = 'ri-sun-line';

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light';
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

// We validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
    themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
}

// Activate / deactivate the theme manually with the button
if(themeButton) {
    themeButton.addEventListener('click', () => {
        // Add or remove the dark / icon theme
        document.body.classList.toggle(darkTheme);
        themeButton.classList.toggle(iconTheme);
        // We save the theme and the current icon that the user chose
        localStorage.setItem('selected-theme', getCurrentTheme());
        localStorage.setItem('selected-icon', getCurrentIcon());
    }, { passive: true });
}

/*==================== SCROLL REVEAL ANIMATION ====================*/
const sr = ScrollReveal({
    distance: '60px',
    duration: 2800,
    // reset: true,
});

// Optimized animations for better performance
sr.reveal(`.home__data, .home__social-link, .home__info,
           .footer__data, .footer__rights`,{
    origin: 'top',
    interval: 100,
});

sr.reveal(`.about__data, 
           .video__description,
           .subscribe__description`,{
    origin: 'left',
    interval: 100,
    distance: '90px',
    duration: 2000,
});

sr.reveal(`.about__img-overlay, 
           .video__content,
           .subscribe__form`,{
    origin: 'right',
    interval: 100,
    distance: '90px',
    duration: 2000,
});

sr.reveal(`.discover__card`,{
    origin: 'bottom',
    interval: 100,
    distance: '30px',
    duration: 1800,
});

sr.reveal(`.place__card`,{
    origin: 'bottom',
    interval: 200,
    distance: '40px',
    duration: 2000,
});

sr.reveal(`.experience__data`,{
    origin: 'bottom',
    interval: 300,
    distance: '30px',
    duration: 1500,
});

sr.reveal(`.sponsor__content`,{
    origin: 'bottom',
    interval: 100,
    distance: '20px',
    duration: 1500,
});

// Image loading optimization 
document.addEventListener('DOMContentLoaded', () => {
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('.place__img:not(.img-loaded), .discover__img:not(.img-loaded), .experience__img-one:not(.img-loaded), .experience__img-two:not(.img-loaded), .about__img-one:not(.img-loaded), .about__img-two:not(.img-loaded)');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('img-loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without Intersection Observer
            images.forEach(img => {
                img.classList.add('img-loaded');
            });
        }
    };
    
    setTimeout(lazyLoadImages, 100);
});