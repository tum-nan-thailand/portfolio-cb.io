const header = document.querySelector('header');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const scrollTopBtn = document.querySelector('.scroll-top');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const skillLevels = document.querySelectorAll('.skill-level');
const contactForm = document.getElementById('contactForm');
const formMessages = document.getElementById('formMessages');
const submitButton = contactForm.querySelector('button[type="submit"]');
const aboutContent = document.querySelector('.about-content');
const skillsContent = document.querySelector('.skills-content');
const timelineContents = document.querySelectorAll('.timeline-content');
const contactContent = document.querySelector('.contact-content');
const heroSection = document.querySelector('.hero');
const achievementsSection = document.querySelector('#achievements');

document.addEventListener('DOMContentLoaded', () => {
    bootSequence();
    setActiveNavLink();
    setTimeout(addGlitchEffect, 4000);

    // Start digital rain effect after boot sequence
    setTimeout(() => {
        createDigitalRain();
    }, 4500);

    // Start interactive particle effect in hero section
    setTimeout(() => {
        createParticleEffect();
    }, 5000);

    // WOW SKILLS SCRIPT
    const skillCards = document.querySelectorAll('.skill-wow-card');
    skillCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.1
    });
    skillCards.forEach(card => {
        skillsObserver.observe(card);
    });

    // THEME TOGGLE SCRIPT
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            body.classList.remove('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    };

    // On page load, check for saved theme. Default to dark if none found.
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Add click listener for the toggle button
    themeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
});

// Digital Rain Effect (Matrix style)
function createDigitalRain() {
    const canvas = document.getElementById('digitalRainCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Fading effect
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Green characters
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(draw, 33);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Reinitialize drops for new dimensions
        drops.length = 0;
        for (let i = 0; i < canvas.width / fontSize; i++) {
            drops[i] = 1;
        }
    });
}

// Interactive Particle Effect for Hero Section
function createParticleEffect() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;
    const mouse = { x: null, y: null, radius: 100 };

    // Particle constructor
    function Particle(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Draw particle
    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    };

    // Update particle position and draw
    Particle.prototype.update = function() {
        // Check boundaries
        if (this.x + this.size > canvas.width || this.x - this.size < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.size > canvas.height || this.y - this.size < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

        // Interaction with mouse
        const distance = Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2));
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }

        this.draw();
    };

    // Initialize particles
    function init() {
        for (let i = 0; i < particleCount; i++) {
            const size = (Math.random() * 5) + 1; // Size between 1 and 6
            const x = Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2;
            const y = Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2;
            const directionX = (Math.random() * 0.5) - 0.25; // Speed between -0.25 and 0.25
            const directionY = (Math.random() * 0.5) - 0.25; // Speed between -0.25 and 0.25
            const color = 'rgba(0, 188, 212, 0.8)'; // Primary color with transparency
            particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }

        connectParticles();
    }

    // Connect particles with lines
    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const distance = Math.sqrt(Math.pow(particles[a].x - particles[b].x, 2) + Math.pow(particles[a].y - particles[b].y, 2));
                if (distance < 120) {
                    opacityValue = 1 - (distance / 120);
                    ctx.strokeStyle = `rgba(0, 188, 212, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Mouse interactivity
    canvas.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    canvas.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Resize event
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles.length = 0; // Clear particles
        init(); // Reinitialize particles for new dimensions
    });

    init();
    animate();
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
    checkAchievementsInView(); // Call directly for achievements
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

// Observer for timeline items and project cards
const observerOptions = {
    threshold: 0.1
};

const elementObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Observe timeline items
timelineContents.forEach(content => {
    elementObserver.observe(content);
});

// Observe project cards
projectCards.forEach(card => {
    elementObserver.observe(card);
});

// Observe about, skills, and contact content
if (aboutContent) elementObserver.observe(aboutContent);
if (skillsContent) elementObserver.observe(skillsContent);
if (contactContent) elementObserver.observe(contactContent);

// New observer for skill bars
const skillBarObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skill = entry.target;
            const width = skill.getAttribute('style').match(/width: (\d+)%/)?.[1];
            if (width) {
                skill.style.width = width + '%';
            }
            observer.unobserve(skill); // Stop observing once animated
        }
    });
}, observerOptions);

// Observe skill levels
skillLevels.forEach(skill => {
    skillBarObserver.observe(skill);
});

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
    if (!achievementsSection) return;

    const rect = achievementsSection.getBoundingClientRect();
    const isInView = rect.top >= 0 && rect.top <= window.innerHeight;

    if (isInView && !achievementsSection.classList.contains('animated')) {
        achievementsSection.classList.add('animated');
        animateCounters();
    }
}

// Add to scroll event listener
// const originalAnimateOnScroll = window.animateOnScroll || function () { };
// window.animateOnScroll = function () {
//     originalAnimateOnScroll();
//     checkAchievementsInView();
// };

// Form submission (you'll need to implement your own backend or use a service like Formspree)
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous messages
        formMessages.textContent = '';
        formMessages.classList.remove('success', 'error');

        // Disable button and show sending state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic client-side validation
        if (!name || !email || !subject || !message) {
            formMessages.textContent = 'Please fill in all fields.';
            formMessages.classList.add('error');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            return;
        }

        try {
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simulate success or failure
            const success = Math.random() > 0.1; // 90% chance of success

            if (success) {
                formMessages.textContent = 'Thank you for your message! I will get back to you soon.';
                formMessages.classList.add('success');
                contactForm.reset();
            } else {
                formMessages.textContent = 'Oops! Something went wrong. Please try again later.';
                formMessages.classList.add('error');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formMessages.textContent = 'An unexpected error occurred. Please try again.';
            formMessages.classList.add('error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
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

// --- CERTIFICATE MODAL FUNCTIONALITY ---

const certificateModal = document.getElementById('certificateModal');
const certModalTitle = document.getElementById('certModalTitle');
const certModalImage = document.getElementById('certModalImage');
const certModalPDF = document.getElementById('certModalPDF');
const certModalLoading = document.querySelector('.cert-modal-loading');
const certModalError = document.querySelector('.cert-modal-error');
const certDownloadBtn = document.getElementById('certDownloadBtn');
const certCloseBtn = document.querySelector('.cert-close');

let currentTab = 'image';
let currentCertData = null;

// Certificate data mapping
const certificateData = {
    'phishing-2024': {
        title: 'Phishing Attack Training (2024)',
        pdf: 'assets/certificates/Phishing Attack.pdf'
    },
    'ransomware-2024': {
        title: 'Ransomware Training (2024)',
        pdf: 'assets/certificates/Ransomware.pdf'
    },
    'incident-report-2024': {
        title: 'Cyber Incident Reporting (2024)',
        pdf: 'assets/certificates/Rise Cyber Incident.pdf'
    },
    'safe-web-2024': {
        title: 'Safe Web Browse (2024)',
        pdf: 'assets/certificates/Safe Web.pdf'
    },
    'public-wifi-2024': {
        title: 'Public Wi-Fi Security (2024)',
        pdf: 'assets/certificates/Public Wi-Fi.pdf'
    },
    'password-policy-2024': {
        title: 'Password Policy (2024)',
        pdf: 'assets/certificates/Password Policy.pdf'
    },
    'malware-2023': {
        title: 'Malware Threats (2023)',
        pdf: 'assets/certificates/Malware Threats.pdf'
    },
    'computer-law-2023': {
        title: 'Computer Law (2023)',
        pdf: 'assets/certificates/Computer Law.pdf'
    },
    'cloud-security-2024': {
        title: 'Cloud Security (2024)',
        pdf: 'assets/certificates/Cloud Security.pdf'
    },
    'data-classification-2024': {
        title: 'Data Classification (2024)',
        pdf: 'assets/certificates/Data Classification.pdf'
    },
    'mobile-device-security-2024': {
        title: 'Mobile Device Security (2024)',
        pdf: 'assets/certificates/Mobile Device Security.pdf'
    },
    'password-security-policy-2024': {
        title: 'Password Security Policy (2024)',
        pdf: 'assets/certificates/Password Security Policy.pdf'
    },
    'ransomware-training-2024': {
        title: 'Ransomware Training (2024)',
        pdf: 'assets/certificates/Ransomware Training.pdf'
    },
    'shared-password-policy-2024': {
        title: 'Shared Password Policy (2024)',
        pdf: 'assets/certificates/Shared Password Policy.pdf'
    },
    'safe-web-browsing-2024': {
        title: 'Safe Web Browsing (2024)',
        pdf: 'assets/certificates/Safe Web Browsing.pdf'
    }
};

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
    if (e.target === experienceDetailModal) {
        closeExperienceDetailModal();
    }
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && experienceDetailModal.style.display === 'block') {
        closeExperienceDetailModal();
    }
});


// Open certificate modal
function openCertificateModal(certId) {
    const cert = certificateData[certId];
    if (!cert) return;

    currentCertData = cert;

    certModalTitle.textContent = cert.title;
    resetModalViews();

    certificateModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    setActiveTab('image');

    certDownloadBtn.onclick = () => downloadCertificate(cert.pdf, cert.title);
}

function resetModalViews() {
    document.querySelectorAll('.cert-view').forEach(view => view.classList.remove('active'));
    certModalImage.src = '';
    certModalImage.style.display = 'none';
    certModalImage.classList.remove('loaded');
    certModalPDF.src = '';
    certModalLoading.style.display = 'flex';
    certModalError.style.display = 'none';
}

function setActiveTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('.cert-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.tab === tabName));
    document.querySelectorAll('.cert-view').forEach(view => view.classList.toggle('active', view.id.includes(tabName)));
    loadCertificateContent();
}

function loadCertificateContent() {
    if (!currentCertData) return;
    certModalLoading.style.display = 'flex';
    certModalError.style.display = 'none';
    if (currentTab === 'image') {
        loadImageContent();
    } else if (currentTab === 'pdf') {
        loadPDFContent();
    }
}

// Render PDF as an image
async function loadImageContent() {
    const { pdfjsLib } = globalThis;
    if (!pdfjsLib) {
        showErrorMessage("PDF library not loaded. Please check your internet connection.");
        return;
    }
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://mozilla.github.io/pdf.js/build/pdf.worker.mjs`;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    try {
        const loadingTask = pdfjsLib.getDocument(currentCertData.pdf);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        certModalLoading.style.display = 'none';
        certModalImage.src = canvas.toDataURL('image/jpeg', 0.9);
        certModalImage.style.display = 'block';
        certModalImage.classList.add('loaded');

    } catch (error) {
        console.error('Error rendering PDF to image:', error);
        certModalLoading.style.display = 'none';
        showErrorMessage(`Could not display certificate. Please try the PDF view tab.`);
    }
}

function loadPDFContent() {
    certModalLoading.style.display = 'none';
    certModalPDF.src = currentCertData.pdf;
}

function showErrorMessage(message) {
    certModalError.style.display = 'flex';
    certModalError.querySelector('p').textContent = message;
}

function closeCertificateModal() {
    certificateModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function downloadCertificate(url, title) {
    const link = document.createElement('a');
    link.href = url;
    link.download = title.replace(/\s+/g, '_') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event listeners for certificate items
document.querySelectorAll('.clickable-cert').forEach(cert => {
    cert.addEventListener('click', function () {
        openCertificateModal(this.dataset.cert);
    });
});

// Event listeners for tabs
document.querySelectorAll('.cert-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        setActiveTab(this.dataset.tab);
    });
});

// Close modal events
certCloseBtn.addEventListener('click', closeCertificateModal);
certificateModal.addEventListener('click', e => {
    if (e.target === certificateModal) closeCertificateModal();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && certificateModal.style.display === 'block') {
        closeCertificateModal();
    }
}); 