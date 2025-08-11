const header = document.querySelector('header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const scrollTopBtn = document.querySelector('.scroll-top');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const skillLevels = document.querySelectorAll('.skill-level');
const contactForm = document.getElementById('contactForm');
const aboutContent = document.querySelector('.about-content');
const skillsContent = document.querySelector('.skills-content');
const timelineContents = document.querySelectorAll('.timeline-content');
const contactContent = document.querySelector('.contact-content');
const heroSection = document.querySelector('.hero');
const aboutToggles = document.querySelectorAll('.about-toggle');
const aboutReadMore = document.querySelector('.about-readmore');

aboutToggles.forEach(btn => {
    btn.addEventListener('click', () => {
        const detail = btn.nextElementSibling;
        const isOpen = detail.classList.toggle('open');
        detail.style.maxHeight = isOpen ? detail.scrollHeight + 'px' : '0';
        btn.textContent = isOpen ? 'Hide Details' : 'Show Details';
        btn.setAttribute('aria-expanded', isOpen);
    });
});

if (aboutReadMore) {
    aboutReadMore.addEventListener('click', () => {
        const aboutText = document.querySelector('.about-text');
        const expanded = aboutText.classList.toggle('expanded');
        aboutReadMore.textContent = expanded ? 'Show Less' : 'Read More';
        aboutReadMore.setAttribute('aria-expanded', expanded);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bootSequence();
    setActiveNavLink();
    setTimeout(() => {
        animateOnScroll();
    }, 4000);
    setTimeout(addGlitchEffect, 4000);
    setTimeout(() => {
        createDigitalNoiseOverlay();
        createScanlines();
        createMatrixRain();
    }, 3800);
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('.project-card, .skill-wow-card'), {
            max: 15,
            speed: 400,
            glare: true,
            'max-glare': 0.2
        });
    }
});


// Create galaxy stars overlay
function createDigitalNoiseOverlay() {
    // Create a canvas for galaxy particles
    const galaxyCanvas = document.createElement('canvas');
    galaxyCanvas.classList.add('galaxy-canvas');
    galaxyCanvas.style.position = 'fixed';
    galaxyCanvas.style.top = '0';
    galaxyCanvas.style.left = '0';
    galaxyCanvas.style.width = '100%';
    galaxyCanvas.style.height = '100%';
    galaxyCanvas.style.pointerEvents = 'none';
    galaxyCanvas.style.zIndex = '9999';
    galaxyCanvas.style.opacity = '0.3';
    document.body.appendChild(galaxyCanvas);

    // Set canvas size
    galaxyCanvas.width = window.innerWidth;
    galaxyCanvas.height = window.innerHeight;

    // Get canvas context
    const ctx = galaxyCanvas.getContext('2d');

    // Create stars
    const stars = [];
    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * galaxyCanvas.width,
            y: Math.random() * galaxyCanvas.height,
            radius: Math.random() * 1.5,
            color: i % 3 === 0 ? '#ffde59' : (i % 2 === 0 ? '#4dc9ff' : '#ffffff'),
            speed: Math.random() * 0.5
        });
    }

    // Animation function
    function animateGalaxy() {
        // Clear canvas
        ctx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

        // Draw stars
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.fill();

            // Move star
            star.x += star.speed;

            // Reset star position if it goes off screen
            if (star.x > galaxyCanvas.width) {
                star.x = 0;
            }
        });

        // Request next frame
        requestAnimationFrame(animateGalaxy);
    }

    // Start animation
    animateGalaxy();

    // Handle window resize
    window.addEventListener('resize', () => {
        galaxyCanvas.width = window.innerWidth;
        galaxyCanvas.height = window.innerHeight;
    });
}


// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Scroll Events
window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Show/hide scroll to top button
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }

    // Animate elements when in viewport
    animateOnScroll();
});

// Project Filtering
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Animate elements when in viewport
function animateOnScroll() {
    // Animate skill bars
    skillLevels.forEach(skill => {
        const skillPosition = skill.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (skillPosition < screenPosition) {
            const width = skill.getAttribute('style').match(/width: (\d+)%/)[1];
            skill.style.width = width + '%';
        } else {
            skill.style.width = '0';
        }
    });

    // Animate about content
    if (aboutContent) {
        const position = aboutContent.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (position < screenPosition) {
            aboutContent.classList.add('animate');
        }
    }

    // Animate skills content
    if (skillsContent) {
        const position = skillsContent.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (position < screenPosition) {
            skillsContent.classList.add('animate');
        }
    }

    // Animate timeline content
    timelineContents.forEach(content => {
        const position = content.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (position < screenPosition) {
            content.classList.add('animate');
        }
    });

    // Animate project cards
    projectCards.forEach(card => {
        const position = card.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (position < screenPosition) {
            card.classList.add('animate');
        }
    });

    // Animate contact content
    if (contactContent) {
        const position = contactContent.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;

        if (position < screenPosition) {
            contactContent.classList.add('animate');
        }
    }
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }

            // Format number based on target
            if (target >= 100000) {
                counter.textContent = Math.floor(current).toLocaleString() + '+';
            } else if (target === 99.9) {
                counter.textContent = current.toFixed(1) + '%';
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 20);
    });
}

// Check if achievements section is in viewport
function checkAchievementsInView() {
    const achievementsSection = document.querySelector('#achievements');
    if (!achievementsSection) return;

    const rect = achievementsSection.getBoundingClientRect();
    const isInView = rect.top >= 0 && rect.top <= window.innerHeight;

    if (isInView && !achievementsSection.classList.contains('animated')) {
        achievementsSection.classList.add('animated');
        animateCounters();
    }
}

// Add to scroll event listener
const originalAnimateOnScroll = window.animateOnScroll || function () { };
window.animateOnScroll = function () {
    originalAnimateOnScroll();
    checkAchievementsInView();
};

// Form submission (you'll need to implement your own backend or use a service like Formspree)
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Here you would typically send the data to your backend or a service
        // For now, we'll just log it and show a success message
        console.log({ name, email, subject, message });

        // Show success message
        alert('Thank you for your message! I will get back to you soon.');

        // Reset form
        contactForm.reset();
    });
}

// Galaxy shimmer effect for text elements
function addGlitchEffect() {
    const glitchElements = document.querySelectorAll('.hero h1, .hero h2, .section-title, .logo, .btn');

    glitchElements.forEach(element => {
        // Random chance to apply shimmer effect
        if (Math.random() < 0.05) {
            element.style.textShadow = `0 0 10px var(--primary-color), 0 0 20px var(--accent-color), 0 0 30px var(--accent-color-2)`;
            element.style.transform = `translate(${(Math.random() * 2) - 1}px, ${(Math.random() * 2) - 1}px)`;

            // Add a glow effect occasionally
            if (Math.random() < 0.3) {
                element.style.color = 'white';
                element.style.filter = 'brightness(1.5)';
            }

            // Reset after a short delay
            setTimeout(() => {
                element.style.textShadow = '';
                element.style.transform = '';
                element.style.color = '';
                element.style.filter = '';
            }, 300 + Math.random() * 500);
        }
    });

    // Add shimmer effect to buttons
    document.querySelectorAll('.btn-glitch').forEach(btn => {
        if (Math.random() < 0.1) {
            btn.style.boxShadow = `0 0 10px var(--primary-color), 0 0 20px var(--accent-color), 0 0 30px var(--accent-color-2)`;
            setTimeout(() => {
                btn.style.boxShadow = '';
            }, 300);
        }
    });
}

// Run glitch effect periodically
setInterval(addGlitchEffect, 2000);

// Add cosmic dust effect
function createScanlines() {
    const cosmicDust = document.createElement('div');
    cosmicDust.classList.add('cosmic-dust');
    cosmicDust.style.position = 'fixed';
    cosmicDust.style.top = '0';
    cosmicDust.style.left = '0';
    cosmicDust.style.width = '100%';
    cosmicDust.style.height = '100%';
    cosmicDust.style.pointerEvents = 'none';
    cosmicDust.style.zIndex = '9998';
    cosmicDust.style.backgroundImage = 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)';
    cosmicDust.style.backgroundSize = '15px 15px';
    cosmicDust.style.opacity = '0.3';
    document.body.appendChild(cosmicDust);

    // Animate cosmic dust
    let dustX = 0;
    let dustY = 0;
    setInterval(() => {
        dustX += 0.2;
        dustY += 0.1;
        cosmicDust.style.backgroundPosition = `${dustX}px ${dustY}px`;
    }, 50);
}

// Matrix-style digital rain effect
function createMatrixRain() {
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.classList.add('matrix-rain');
    matrixCanvas.style.position = 'fixed';
    matrixCanvas.style.top = '0';
    matrixCanvas.style.left = '0';
    matrixCanvas.style.width = '100%';
    matrixCanvas.style.height = '100%';
    matrixCanvas.style.pointerEvents = 'none';
    matrixCanvas.style.zIndex = '-2';
    document.body.insertBefore(matrixCanvas, document.body.firstChild);

    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const characters = '01';
    const fontSize = 16;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = '#4dc9ff';
        ctx.font = fontSize + 'px monospace';

        drops.forEach((y, index) => {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, index * fontSize, y * fontSize);
            if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                drops[index] = 0;
            }
            drops[index]++;
        });
    }

    setInterval(draw, 50);

    window.addEventListener('resize', () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    });
}

// Add galaxy boot sequence
function bootSequence() {
    const boot = document.createElement('div');
    boot.classList.add('boot-sequence');
    boot.style.position = 'fixed';
    boot.style.top = '0';
    boot.style.left = '0';
    boot.style.width = '100%';
    boot.style.height = '100%';
    boot.style.backgroundColor = '#000';
    boot.style.color = '#8a2be2';
    boot.style.fontFamily = '"Share Tech Mono", monospace';
    boot.style.padding = '50px';
    boot.style.boxSizing = 'border-box';
    boot.style.zIndex = '10000';
    boot.style.overflow = 'hidden';
    boot.style.transition = 'opacity 0.5s ease';

    boot.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <p style="color: #4dc9ff;">COSMIC NAVIGATION SYSTEM INITIALIZING...</p>
            <p>Scanning celestial bodies............. OK</p>
            <p>Calibrating star maps................ OK</p>
            <p>Connecting to galactic network....... OK</p>
            <p>Loading nebula visualization......... OK</p>
            <p>Initializing cosmic interface........ OK</p>
            <p style="color: #ff6b9e;">GALAXY EXPLORER SYSTEM READY</p>
            <p style="color: #ffde59;">LAUNCHING INTO COSMOS IN 3...2...1...</p>
        </div>
    `;

    document.body.appendChild(boot);

    // Simulate typing effect
    const lines = boot.querySelectorAll('p');
    lines.forEach((line, index) => {
        line.style.opacity = '0';
        setTimeout(() => {
            line.style.opacity = '1';
        }, index * 400);
    });

    // Remove boot screen after delay
    setTimeout(() => {
        boot.style.opacity = '0';
        setTimeout(() => {
            boot.remove();
        }, 500);
    }, 3500);
}

// Set active nav link based on scroll position
function setActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;

            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}


// Work Experience Data
const experienceDetails = {
    'carabao-senior-backend': {
        title: 'Senior Backend Developer at CARABAO TAWANDANG CO.LTD',
        description: 'As a Senior Backend Developer, I am responsible for designing, developing, and maintaining scalable and high-performance backend systems critical to the company\'s core operations. I collaborate closely with cross-functional teams including frontend, CMS, and mobile application developers to ensure seamless integration and delivery of robust solutions. My work involves architectural design of microservices, implementing agile development methodologies, and conducting thorough root cause analysis to continuously improve system reliability and performance. I also play a key role in mentoring junior developers, fostering their growth, and ensuring adherence to coding standards and best practices.',
        skills: ['NestJS', 'Node.js', 'TypeScript', 'Microservices', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Agile', 'Problem Solving', 'Team Leadership'],
        webApps: [
            { name: 'Internal Logistics Platform', url: '#' },
            { name: 'Sales Analytics Dashboard', url: '#' }
        ]
    },
    'cpg-software-developer': {
        title: 'Software Developer at CHAROEN POKPHAND GROUP CO.LTD (CPG)',
        description: 'During my tenure as a Software Developer in the Sustainability Unit, I was instrumental in designing and developing web applications focused on environmental and social governance. My responsibilities included implementing and tracking compliance with governance policies across various regional and global entities, including operations in China, Malaysia, and Taiwan. I worked closely with diverse stakeholders to ensure that all developed applications were meticulously aligned with the company\'s overarching sustainability goals and regulatory requirements.',
        skills: ['PHP', 'Laravel', 'MySQL', 'Vue.js', 'RESTful APIs', 'Data Analysis', 'Compliance Management', 'Stakeholder Collaboration'],
        webApps: [
            { name: 'ESG Reporting System', url: '#' },
            { name: 'Sustainability Dashboard', url: '#' }
        ]
    },
    'carabao-fullstack-developer': {
        title: 'Full Stack Developer at CARABAO TAWANDANG CO.LTD',
        description: 'As a Full Stack Developer, I was responsible for the end-to-end development and maintenance of the ERP (Enterprise Resource Planning) system for CBD. My role encompassed both frontend and backend tasks, including the creation of intuitive user interfaces, development of robust backend functionalities, and ensuring seamless system integration across various modules. I collaborated actively with team members to enhance cross-platform compatibility and optimize the overall user experience. Additionally, I provided ongoing support and maintenance to ensure the smooth operation and continuous improvement of the ERP system.',
        skills: ['PHP', 'CodeIgniter', 'JavaScript', 'jQuery', 'SQL Server', 'HTML/CSS', 'ERP Systems', 'System Integration', 'UI/UX Design'],
        webApps: [
            { name: 'Internal ERP System (CBD)', url: '#' },
            { name: 'Inventory Management Module', url: '#' }
        ]
    },
    'pcc-junior-developer': {
        title: 'Junior Developer (Contract) at PROFESSIONAL COMPUTER CO.LTD (PCC)',
        description: 'In my role as a Junior Developer, I focused on the development and optimization of the Wht service system software. My key responsibilities included implementing technical solutions to enhance system maintenance, efficiently resolving existing software issues, and ensuring system stability. I also played a crucial role in preparing detailed technical reports and documentation during my contract period, specifically for the Phayathai Revenue Department, demonstrating strong analytical and reporting skills.',
        skills: ['PHP', 'JavaScript', 'MySQL', 'System Optimization', 'Bug Fixing', 'Technical Reporting'],
        webApps: [
            { name: 'Wht Service System', url: '#' },
            { name: 'Tax Reporting Application', url: '#' }
        ]
    }
};

const experienceDetailModal = document.getElementById('experienceDetailModal');
const expModalTitle = document.getElementById('expModalTitle');
const expModalDescription = document.getElementById('expModalDescription');
const expModalSkills = document.getElementById('expModalSkills');
const expModalWebApps = document.getElementById('expModalWebApps');
const expCloseBtns = document.querySelectorAll('.experience-close, .exp-modal-close-btn');

function openExperienceDetailModal(experienceId) {
    const exp = experienceDetails[experienceId];
    if (!exp) {
        console.error(`Experience details not found for ID: ${experienceId}`);
        return;
    }

    expModalTitle.textContent = exp.title;
    expModalDescription.textContent = exp.description;

    expModalSkills.innerHTML = '';
    exp.skills.forEach(skill => {
        const span = document.createElement('span');
        span.classList.add('exp-modal-tag');
        span.textContent = skill;
        expModalSkills.appendChild(span);
    });

    expModalWebApps.innerHTML = '';
    exp.webApps.forEach(app => {
        const linkItem = document.createElement('span');
        linkItem.classList.add('exp-modal-link-item');
        const link = document.createElement('a');
        link.href = app.url;
        link.textContent = app.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        linkItem.appendChild(link);
        expModalWebApps.appendChild(linkItem);
    });

    experienceDetailModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeExperienceDetailModal() {
    experienceDetailModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event listeners for opening experience modal
document.querySelectorAll('.view-details-btn').forEach(button => {
    button.addEventListener('click', function () {
        openExperienceDetailModal(this.dataset.experienceId);
    });
});

// Event listeners for closing experience modal
expCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeExperienceDetailModal);
});

experienceDetailModal.addEventListener('click', e => {
