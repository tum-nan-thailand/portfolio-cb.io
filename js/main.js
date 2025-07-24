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

document.addEventListener('DOMContentLoaded', () => {
    // Start boot sequence
    bootSequence();

    // Set active nav link based on current section
    setActiveNavLink();

    // Animate elements if they're in the viewport
    setTimeout(() => {
        animateOnScroll();
    }, 4000); // Delay until after boot sequence

    // Start glitch effect after page load
    setTimeout(addGlitchEffect, 4000);

    // Create digital noise overlay
    setTimeout(() => {
        createDigitalNoiseOverlay();
        createScanlines();
    }, 3800);
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
const originalAnimateOnScroll = window.animateOnScroll || function() {};
window.animateOnScroll = function() {
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
    }
};


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
    cert.addEventListener('click', function() {
        openCertificateModal(this.dataset.cert);
    });
});

// Event listeners for tabs
document.querySelectorAll('.cert-tab').forEach(tab => {
    tab.addEventListener('click', function() {
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