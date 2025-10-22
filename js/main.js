// ==========================================
// JAVA DEVELOPER PORTFOLIO - SCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', function() {

    const debounce = (func, delay) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // ==========================================
    // GSAP CUSTOM CURSOR (DESKTOP ONLY)
    // ==========================================
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
        const cursor = document.querySelector('.cursor');
        const cursorFollower = document.querySelector('.cursor-follower');

        if (cursor && cursorFollower) {
            gsap.set(cursor, { xPercent: -50, yPercent: -50 });
            gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

            window.addEventListener('mousemove', e => {
                gsap.to(cursor, { duration: 0.2, x: e.clientX, y: e.clientY });
                gsap.to(cursorFollower, { duration: 0.6, x: e.clientX, y: e.clientY });
            });

            document.querySelectorAll('.clickable').forEach(el => {
                el.addEventListener('mouseenter', () => cursorFollower.classList.add('grow'));
                el.addEventListener('mouseleave', () => cursorFollower.classList.remove('grow'));
            });
        }
    }

    // ==========================================
    // CODE BACKGROUND ANIMATION (OPTIMIZED)
    // ==========================================
    const canvas = document.getElementById('code-bg');
    if (canvas) {
        if (isTouchDevice || window.innerWidth < 768) {
            canvas.style.display = 'none';
        } else {
            const ctx = canvas.getContext('2d');
            let particles = [];
            let isAnimationRunning = true;

            const setupCanvas = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                particles = [];
                const particleCount = 60;
                for (let i = 0; i < particleCount; i++) particles.push(new Particle());
            };

            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * 0.5;
                    this.vy = (Math.random() - 0.5) * 0.5;
                    this.radius = 2;
                }
                update() {
                    this.x += this.vx;
                    this.y += this.vy;
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                }
                draw() {
                    const color = document.body.classList.contains('contact-page-body') ? 'rgba(45, 42, 38, 0.5)' : 'rgba(83, 130, 161, 0.5)';
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            const connectParticles = () => {
                const lineColor = document.body.classList.contains('contact-page-body') ? '45, 42, 38' : '83, 130, 161';
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const distance = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                        if (distance < 150) {
                            ctx.strokeStyle = `rgba(${lineColor}, ${1 - distance / 150})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            };

            const animate = () => {
                if (!isAnimationRunning) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => { p.update(); p.draw(); });
                connectParticles();
                requestAnimationFrame(animate);
            };

            window.pauseCanvasAnimation = () => { isAnimationRunning = false; };
            window.resumeCanvasAnimation = () => {
                if (!isAnimationRunning) {
                    isAnimationRunning = true;
                    animate();
                }
            };

            setupCanvas();
            animate();
            window.addEventListener('resize', debounce(setupCanvas, 250));
        }
    }

    // ==========================================
    // NAVIGATION & ACTIVE LINK HIGHLIGHTING
    // ==========================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinksList = document.querySelector('.nav-links');

    if (navbar) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) navbar.classList.toggle('hidden', currentScroll > lastScroll && currentScroll > 0);
            lastScroll = currentScroll <= 0 ? 0 : currentScroll;

            if (document.body.matches('.contact-page-body')) return;

            let activeSection = 'home';
            document.querySelectorAll('main section[id]').forEach(section => {
                if (window.pageYOffset >= section.offsetTop - navbar.offsetHeight - 50) {
                    activeSection = section.id;
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href.includes(`#${activeSection}`)) {
                    link.classList.add('active');
                }
            });
        });
    }

    if (hamburger && navLinksList) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksList.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => {
                    hamburger.classList.remove('active');
                    navLinksList.classList.remove('active');
                }, 300);
            });
        });
    }

    // ==========================================
    // TYPING EFFECT
    // ==========================================
    const typedTextSpan = document.querySelector('.typed-text');
    if (typedTextSpan) {
        const textArray = ['Java Developer', 'Spring Boot Specialist', 'Backend Engineer', 'Problem Solver'];
        let textArrayIndex = 0, charIndex = 0;
        const type = () => {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex++);
                setTimeout(type, 100);
            } else {
                setTimeout(erase, 2000);
            }
        };
        const erase = () => {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, --charIndex);
                setTimeout(erase, 50);
            } else {
                textArrayIndex = (textArrayIndex + 1) % textArray.length;
                setTimeout(type, 600);
            }
        };
        setTimeout(type, 2000);
    }

    // ==========================================
    // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
    // ==========================================
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                if (target.matches('.stat-number')) {
                    const targetNum = +target.dataset.target;
                    const symbol = target.dataset.symbol || '';
                    let count = 0;
                    const updateCount = () => {
                        const increment = targetNum / 100;
                        count += increment;
                        if (count < targetNum) {
                            target.textContent = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            target.textContent = targetNum + symbol;
                        }
                    };
                    updateCount();
                    observer.unobserve(target);
                }
                if (target.matches('.timeline-item, .project-card, .recognition-card')) {
                    target.classList.add('visible');
                    observer.unobserve(target);
                }
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.stat-number, .timeline-item, .project-card, .recognition-card').forEach(el => {
        if (el) animationObserver.observe(el);
    });

    // ==========================================
    // SKILL BAR ANIMATION (INTERACTIVE VERSION)
    // ==========================================
    document.querySelectorAll('.skill-category, .language-card').forEach(parentBlock => {
        const container = parentBlock.querySelector('.skill-bars, .lang-bars');
        if (!container) return;

        const animateBars = () => {
            gsap.fromTo(container.querySelectorAll('.fill'),
                { width: '0%' },
                {
                    width: (i, el) => `${el.dataset.level}%`,
                    duration: 1.5,
                    ease: 'power2.out',
                    stagger: 0.1,
                    overwrite: 'auto'
                }
            );
        };

        // Animate once on scroll
        const observer = new IntersectionObserver((entries, observer) => {
            if (entries[0].isIntersecting) {
                animateBars();
                observer.unobserve(parentBlock);
            }
        }, { threshold: 0.5 });

        observer.observe(parentBlock);

        // Re-animate on hover (desktop) or tap (mobile)
        parentBlock.addEventListener('mouseenter', animateBars);
        parentBlock.addEventListener('touchstart', animateBars, { passive: true });
    });

    // ==========================================
    // KEYWORD SCROLLER LOGIC
    // ==========================================
    const scrollers = document.querySelectorAll(".scroller");
    if (scrollers.length > 0) {
        scrollers.forEach(scroller => {
            scroller.setAttribute("data-animated", true);

            const scrollerInner = scroller.querySelector('.scroller-inner');
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach(item => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute('aria-hidden', true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }

    // ==========================================
    // MAGNETIC BUTTON LOGIC
    // ==========================================
    const magneticButton = document.querySelector('.magnetic-btn');
    if (magneticButton && !isTouchDevice) {
        const journeyContainer = document.getElementById('journey');

        journeyContainer.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = magneticButton.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;

            gsap.to(magneticButton, {
                x: deltaX * 0.4,
                y: deltaY * 0.4,
                duration: 0.8,
                ease: 'elastic.out(1, 0.75)'
            });
        });

        journeyContainer.addEventListener('mouseleave', () => {
            gsap.to(magneticButton, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    // ==========================================
    // MODAL LOGIC
    // ==========================================
    const modalData = {
        'beetalogic': {
            type: 'detail',
            logo: 'images/Beetalogic.soln.png',
            title: 'Java Developer',
            company: 'Beetalogic Software Solutions',
            description: '<p><strong>Duration:</strong> Present</p><p>Currently working on Java-based projects using Core Java, Spring Boot, and MySQL. Involved in backend development and API creation for ongoing projects at Beetalogic Solutions.</p>',
            linkHref: 'https://beetalogic.com/'
        },
        'rinex': {
            type: 'detail',
            logo: 'images/rinex.png',
            title: 'Java Developer Intern',
            company: 'Rinex Techno Solutions',
            description: '<p><strong>Duration:</strong> Nov 2023 – Apr 2024</p><p>Gained hands-on experience in Core Java, OOPS concepts, and exception handling through guided training sessions and real-time tasks. Worked on mini-projects using Java, JDBC, and MySQL to understand database integration.</p>',
            linkHref: 'https://rinex.ai/'
        },
        'gce': {
            type: 'detail',
            logo: 'images/GCE-Erode.png',
            title: 'B.E. in Electronics and Communication',
            company: 'Government College of Engineering, Erode',
            description: '<p><strong>Duration:</strong> 2020 – 2024</p><p>Completed Bachelor of Engineering with a CGPA of 7.8. Gained strong foundation in engineering principles and problem-solving skills.</p>',
            linkHref: 'https://www.gcee.ac.in/'
        },
        'kongu': {
            type: 'detail',
            logo: 'images/Kongu-School.png',
            title: 'Higher Secondary (HSC)',
            company: 'Kongu Matriculation Hr. Sec. School',
            description: '<p><strong>Completed:</strong> 2020</p><p>Grade: 80%</p>',
            linkHref: 'https://www.instagram.com/explore/locations/138452983279938/kongu-matriculation-higher-secondary-school-karumandampalayam/'
        },
        'kongu-sslc': {
            type: 'detail',
            logo: 'images/Kongu-School.png',
            title: 'SSLC',
            company: 'Kongu Matriculation School',
            description: '<p><strong>Completed:</strong> 2018</p><p>Grade: 89%</p>',
            linkHref: 'https://www.instagram.com/explore/locations/138452983279938/kongu-matriculation-higher-secondary-school-karumandampalayam/'
        },
        'travelo': {
            type: 'project',
            image: 'images/travel_11zon.png',
            title: 'Travelo',
            description: 'A comprehensive travel booking application built on the SpringBoot framework. Features robust backend logic for searching and booking travel services with a clean, user-friendly interface.',
            tech: ['SpringBoot', 'MySQL', 'HTML/CSS', 'JavaScript'],
            cta: '<a href="https://github.com/pradeepprp" target="_blank" class="btn btn-primary clickable">View on GitHub</a>'
        },
        'car-access': {
            type: 'project',
            image: 'images/car_11zon.png',
            title: 'Car Access Hub',
            description: 'A web platform designed for managing car rentals and vehicle sharing. Allows users to book, track, and manage vehicle access through a clean interface with proper backend functionality.',
            tech: ['PHP', 'MySQL', 'HTML/CSS', 'JavaScript'],
            cta: '<a href="https://github.com/pradeepprp" target="_blank" class="btn btn-primary clickable">View on GitHub</a>'
        },
        'ascentz': {
            type: 'project',
            image: 'images/ascentz_11zon.png',
            title: 'Ascentz Technologies Website',
            description: 'Developed the official static website for Ascentz Technologies. Focused on creating a responsive, mobile-first design to clearly present company services and information.',
            tech: ['PHP', 'HTML/CSS', 'JavaScript', 'Bootstrap'],
            cta: '<a href="https://github.com/pradeepprp" target="_blank" class="btn btn-primary clickable">View on GitHub</a>'
        },
        'boutique': {
            type: 'project',
            image: 'images/botique_11zon.png',
            title: 'Boutique Shop',
            description: 'A dynamic e-commerce site for a small boutique. Implemented product listings, a shopping cart, and user account management using Java Servlets for the backend with proper database integration.',
            tech: ['Java Servlet', 'JSP', 'MySQL', 'HTML/CSS'],
            cta: '<a href="https://github.com/pradeepprp" target="_blank" class="btn btn-primary clickable">View on GitHub</a>'
        }
    };

    const modalOverlay = document.getElementById('modal-overlay');
    const modalContainer = document.getElementById('modal-container');

    if (modalOverlay && modalContainer) {
        function openModal(data) {
            let contentHTML = '';
            const key = data.title ? data.title.replace(/\s+/g, '+') : 'Project';
            let ctaHTML = data.cta || (data.link ? `<div class="modal-cta-group"><a href="${data.link}" target="_blank" class="btn btn-primary clickable">Visit Project</a></div>` : '');

            if (data.type === 'project') {
                contentHTML = `
                    <button class="modal-close clickable">&times;</button>
                    <div class="modal-content-wrapper">
                        <img src="${data.image}" alt="${data.title}" class="modal-image" onerror="this.onerror=null;this.src='https://placehold.co/800x500/FFF8F0/5382A1?text=${key}';">
                        <h2 class="modal-title">${data.title}</h2>
                        <p class="modal-description">${data.description}</p>
                        <div class="modal-tech">${(data.tech || []).map(t => `<span>${t}</span>`).join('')}</div>
                        ${ctaHTML}
                    </div>
                `;
            } else if (data.type === 'detail') {
                const logoHTML = data.logo ? `<img src="${data.logo}" alt="${data.company} Logo" class="detail-modal-logo" onerror="this.style.display='none'"/>` : '';
                const linkHTML = data.linkHref ? `<a href="${data.linkHref}" ${data.linkHref.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="detail-modal-link clickable">${data.linkText || 'Visit Website'} →</a>` : '';
                contentHTML = `
                    <button class="modal-close clickable">&times;</button>
                    <div class="modal-content-wrapper">
                        <div class="detail-modal-header">
                            ${logoHTML}
                            <div class="detail-modal-title">
                                <h3>${data.title}</h3>
                                <h4>${data.company}</h4>
                            </div>
                        </div>
                        <div class="detail-modal-body">
                            ${data.description}
                            ${ctaHTML || linkHTML}
                        </div>
                    </div>
                `;
            }
            modalContainer.innerHTML = contentHTML;
            modalOverlay.classList.add('active');

            document.documentElement.classList.add('no-scroll');
            if (window.pauseCanvasAnimation) window.pauseCanvasAnimation();
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
            document.documentElement.classList.remove('no-scroll');
            if (window.resumeCanvasAnimation) window.resumeCanvasAnimation();
        }

        document.querySelectorAll('[data-modal-key]').forEach(el => {
            el.addEventListener('click', () => {
                const key = el.dataset.modalKey;
                if (modalData[key]) openModal(modalData[key]);
            });
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay || e.target.closest('.modal-close')) closeModal();
        });
    }

    // ==========================================
    // GO TO TOP BUTTON
    // ==========================================
    const goTopBtn = document.querySelector('.go-top-btn');
    if (goTopBtn) {
        window.addEventListener('scroll', () => {
            goTopBtn.classList.toggle('visible', window.scrollY > 600);
        });

        goTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // CONTACT FORM HANDLING (Updated for Formspree)
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Keep validation if you want client-side checks before submitting
            const formStatus = document.getElementById('form-status');
            let isValid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            
            // Reset previous error styles and messages
            formStatus.textContent = '';
            formStatus.className = '';
            requiredFields.forEach(field => field.style.borderColor = '');

            // Perform validation
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#f87171'; // Highlight invalid field
                }
            });

            if (!isValid) {
                e.preventDefault(); // *** STOP submission ONLY if validation fails ***
                formStatus.textContent = 'Please fill in all required fields.';
                formStatus.className = 'error';
                // Clear error message after a few seconds
                setTimeout(() => {
                   formStatus.textContent = '';
                   formStatus.className = '';
                }, 4000);
            } else {
                // Validation passed, display temporary "Sending..." message
                // and let the form submit normally to Formspree.
                formStatus.textContent = 'Sending message...';
                formStatus.className = ''; // Use default styling or a specific 'sending' class
                // *** DO NOT call e.preventDefault() here ***
            }
        });
    }
}); // End DOMContentLoaded