document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation Menu ---
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu state on mobile view
    const toggleMenu = () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });


    // --- Dark & Light Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check saved system/preference setting
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = 'dark';
        if (!body.hasAttribute('data-theme') || body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            theme = 'light';
        } else {
            body.removeAttribute('data-theme');
            theme = 'dark';
        }
        localStorage.setItem('theme', theme);
        updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }


    // --- Smooth Scroll Spy: Highlights Active Link on Scroll ---
    const sections = document.querySelectorAll('section[id], header[class="hero"]');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // offset top navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

});