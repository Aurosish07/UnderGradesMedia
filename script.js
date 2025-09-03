// The UnderGrads - Main JavaScript File
(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        // Initialize intersection observer for animations
        initializeScrollAnimations();

        // Add smooth scroll behavior for any internal links
        initializeSmoothScroll();

        // Add loading states
        handlePageLoad();

        // Initialize responsive text scaling
        initializeResponsiveText();
        initializeNavigationActiveStates();

        // Initialize scroll effects
        initializeScrollEffects();

        // Initialize parallax effect for service cards
        initializeParallaxCards();

        // Initialize About section navigation
        initializeAboutNavigation();
    }

    // Intersection Observer for scroll-triggered animations
    function initializeScrollAnimations() {
        if (!window.IntersectionObserver) {
            // Fallback for browsers without IntersectionObserver
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        // Observe story text blocks
        const storyBlocks = document.querySelectorAll('.story-text-block');
        storyBlocks.forEach(function(block) {
            observer.observe(block);
        });

        // Observe service items
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach(function(item) {
            observer.observe(item);
        });

        // Observe work section
        const workSection = document.querySelector('.work-section');
        if (workSection) {
            observer.observe(workSection);
        }
    }

    // Smooth scroll for internal links
    function initializeSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without triggering page jump
                    history.pushState(null, null, targetId);
                }
            });
        });
    }

    // Handle page load states
    function handlePageLoad() {
        window.addEventListener('load', function() {
            // Animate sun drop-in
            var sun = document.querySelector('.glow-background');
            if (sun) {
                sun.classList.add('sun-drop-in');
            }

            // Animate heading first
            var heading = document.querySelector('.main-heading');
            if (heading) {
                heading.classList.add('animate-in');
            }
            // Animate subtitle after a short delay
            var subtitle = document.querySelector('.hero-subtitle');
            if (subtitle) {
                setTimeout(function() {
                    subtitle.classList.add('animate-in');
                }, 400); // 0.4s delay for subtitle
            }
            // Remove any loading classes once page is fully loaded
            document.body.classList.add('loaded');
            
            // Trigger any load-dependent animations
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.classList.add('fade-in');
            }
        });
    }

    // Responsive text scaling based on viewport
    function initializeResponsiveText() {
        function updateTextScale() {
            const viewportWidth = window.innerWidth;
            const baseWidth = 1200;
            const scale = Math.min(Math.max(viewportWidth / baseWidth, 0.7), 1.2);
            
            document.documentElement.style.setProperty('--text-scale', scale);
        }

        // Initial call
        updateTextScale();
        
        // Update on resize with debouncing
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateTextScale, 150);
        });
    }

    // Utility function to handle reduced motion preferences
    function respectsReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Add parallax effect for glowing elements (if motion is allowed)
    function initializeParallax() {
        if (respectsReducedMotion()) {
            return;
        }

        const glowElements = document.querySelectorAll('.sun-glow-primary, .sun-glow-secondary');
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            
            glowElements.forEach(function(element) {
                element.style.transform = `translateX(-50%) translateY(${rate}px)`;
            });
        });
    }

    // Error handling for missing elements
    function handleMissingElements() {
        const criticalElements = ['.hero-section', '.story-section'];
        
        criticalElements.forEach(function(selector) {
            if (!document.querySelector(selector)) {
                console.warn(`Critical element missing: ${selector}`);
            }
        });
    }

    // Performance monitoring (development only)
    function logPerformanceMetrics() {
        if (window.performance && performance.mark) {
            performance.mark('app-initialized');
            
            window.addEventListener('load', function() {
                performance.mark('page-loaded');
                
                setTimeout(function() {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    if (navigation) {
                        console.log('Page load metrics:', {
                            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                            totalTime: navigation.loadEventEnd - navigation.fetchStart
                        });
                    }
                }, 0);
            });
        }
    }

    // Initialize parallax only if user hasn't requested reduced motion
    if (!respectsReducedMotion()) {
        document.addEventListener('DOMContentLoaded', initializeParallax);
    }

    // Initialize performance monitoring in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        logPerformanceMetrics();
        handleMissingElements();
    }

    // Expose some functions globally for debugging (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.TheUnderGrads = {
            initializeScrollAnimations: initializeScrollAnimations,
            initializeSmoothScroll: initializeSmoothScroll,
            initializeParallax: initializeParallax
        };
    }

    // Enhanced navigation active states with smooth transitions
    function initializeNavigationActiveStates() {
        const sections = document.querySelectorAll('section[id], main[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!sections.length || !navLinks.length) {
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '-20% 0px -20% 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // Remove active class from all nav links with smooth transition
                    navLinks.forEach(function(link) {
                        link.classList.remove('active');
                        link.style.transform = '';
                    });

                    // Add active class to current section's nav link with enhanced effect
                    const activeLink = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
                    if (activeLink) {
                        activeLink.classList.add('active');

                        // Add a subtle pulse effect
                        setTimeout(function() {
                            if (activeLink.classList.contains('active')) {
                                activeLink.style.transform = 'translateX(4px) scale(1.02)';
                            }
                        }, 100);
                    }
                }
            });
        }, observerOptions);

        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    // Scroll effects for text blur and navigation enhancement
    function initializeScrollEffects() {
        let scrollTimer;
        let lastScrollY = window.scrollY;
        let isScrolling = false;

        const textElements = document.querySelectorAll('.story-paragraph, .main-heading, .hero-subtitle');
        const navLinks = document.querySelectorAll('.nav-link');

        function handleScrollStart() {
            if (!isScrolling) {
                isScrolling = true;

                // Add scrolling effects to text
                textElements.forEach(function(element) {
                    element.classList.add('text-blur-on-scroll');
                    element.classList.add('scrolling');
                });

                // Enhance navigation during scroll
                navLinks.forEach(function(link) {
                    if (!link.classList.contains('active')) {
                        link.style.opacity = '0.6';
                    }
                });
            }
        }

        function handleScrollEnd() {
            isScrolling = false;

            // Remove scrolling effects
            textElements.forEach(function(element) {
                element.classList.remove('scrolling');
            });

            // Restore navigation opacity
            navLinks.forEach(function(link) {
                link.style.opacity = '';
            });
        }

        window.addEventListener('scroll', function() {
            handleScrollStart();

            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(handleScrollEnd, 150);

            lastScrollY = window.scrollY;
        }, { passive: true });

        // Enhanced scroll direction detection for additional effects
        let scrollDirection = 'up';
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

            // Add different effects based on scroll direction
            const activeNavLink = document.querySelector('.nav-link.active');
            if (activeNavLink && isScrolling) {
                if (scrollDirection === 'down') {
                    activeNavLink.style.boxShadow = '0 4px 12px rgba(255, 215, 0, 0.3)';
                } else {
                    activeNavLink.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.2)';
                }
            }
        }, { passive: true });
    }

    // Parallax effect for service overlay cards
    function initializeParallaxCards() {
        if (respectsReducedMotion()) {
            return;
        }

        const serviceCards = document.querySelectorAll('[data-parallax="service-card"]');

        if (!serviceCards.length) {
            return;
        }

        function updateParallax() {
            serviceCards.forEach(function(card) {
                const rect = card.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // Check if card is in viewport (expanded range for smoother effect)
                if (rect.bottom >= -200 && rect.top <= windowHeight + 200) {
                    // Calculate scroll progress with enhanced sensitivity
                    const scrollProgress = (windowHeight - rect.top) / (windowHeight + rect.height);

                    // Strong upward movement - much more noticeable
                    const baseOffset = 100;
                    const parallaxOffset = scrollProgress * 200; // Even stronger movement

                    // Apply strong vertical movement only
                    card.style.transform = `translateX(-50%) translateY(-${baseOffset + parallaxOffset}px)`;

                    // Keep cards fully opaque - no transparency
                    card.style.opacity = 1;
                }
            });
        }

        // Throttle scroll events for performance
        let ticking = false;
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
                setTimeout(function() {
                    ticking = false;
                }, 16); // ~60fps
            }
        }

        window.addEventListener('scroll', requestTick, { passive: true });

        // Initial call
        updateParallax();
    }

    // About Section Navigation
    function initializeAboutNavigation() {
        const navLinks = document.querySelectorAll('.about-nav-link');
        const contentSections = document.querySelectorAll('.about-content-section');

        if (!navLinks.length || !contentSections.length) {
            return;
        }

        function switchToSection(targetSection) {
            // Remove active class from all nav links
            navLinks.forEach(function(link) {
                link.classList.remove('active');
            });

            // Hide all content sections
            contentSections.forEach(function(section) {
                section.classList.remove('active');
            });

            // Add active class to clicked nav link
            const activeLink = document.querySelector('.about-nav-link[data-section="' + targetSection + '"]');
            if (activeLink) {
                activeLink.classList.add('active');
            }

            // Show target content section
            const targetContent = document.querySelector('.about-content-section[data-content="' + targetSection + '"]');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }

        // Add click event listeners to nav links
        navLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetSection = this.getAttribute('data-section');
                if (targetSection) {
                    switchToSection(targetSection);

                    // Add visual feedback
                    this.style.transform = 'translateX(6px) scale(1.02)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 200);
                }
            });

            // Add hover effects
            link.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateX(4px)';
                }
            });

            link.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = '';
                }
            });
        });

        // Initialize with first section active (About)
        switchToSection('about');

        // Add keyboard navigation support
        navLinks.forEach(function(link, index) {
            link.addEventListener('keydown', function(e) {
                let targetIndex = index;

                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    targetIndex = (index + 1) % navLinks.length;
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    targetIndex = (index - 1 + navLinks.length) % navLinks.length;
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                    return;
                }

                if (targetIndex !== index) {
                    navLinks[targetIndex].focus();
                }
            });
        });

        // Note: Experience section navigation is handled by the main initializeNavigationActiveStates function
    }

})();
