// Scroll Reveal Animation Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Reveal elements on scroll
    const reveals = document.querySelectorAll(".reveal, .reveal-scale");
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Handle Navbar scrolled state
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            if(navLinks.classList.contains("active")) {
                menuToggle.innerHTML = "&#10005;"; // Cross icon
            } else {
                menuToggle.innerHTML = "&#9776;"; // Hamburger icon
            }
        });
    }

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if(this.getAttribute('href') === '#') return;
            e.preventDefault();
            
            if (navLinks && menuToggle) {
                navLinks.classList.remove("active");
                menuToggle.innerHTML = "&#9776;";
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Form submission animation mock
    const contactForm = document.getElementById("contactForm");
    if(contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            // Prepare data
            const data = new FormData(contactForm);
            
            btn.innerText = "Sending...";
            btn.style.opacity = "0.7";
            btn.style.cursor = "not-allowed";
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                const responseMsg = document.getElementById("responseMsg");
                
                if (response.ok) {
                    btn.innerText = "Message Sent!";
                    btn.style.backgroundColor = "#00e5ff"; // Cyan success color
                    btn.style.color = "#07070a";
                    btn.style.boxShadow = "0 0 20px rgba(0, 229, 255, 0.4)";
                    contactForm.reset();
                    
                    if (responseMsg) {
                        responseMsg.innerHTML = "✅ Message sent successfully!";
                        responseMsg.className = "contact-redesign-msg success";
                        responseMsg.style.display = "block";
                    }
                } else {
                    const errorData = await response.json();
                    btn.innerText = "Error: Please Try Again";
                    btn.style.backgroundColor = "#ff4d4d"; // Error red
                    console.error("Formspree Error:", errorData);
                    
                    if (responseMsg) {
                        responseMsg.innerHTML = "❌ Failed to send message. Try again!";
                        responseMsg.className = "contact-redesign-msg error";
                        responseMsg.style.display = "block";
                    }
                }
            } catch (error) {
                btn.innerText = "Failed to Send";
                btn.style.backgroundColor = "#ff4d4d"; // Error red
                console.error("Submission error:", error);
                
                const responseMsg = document.getElementById("responseMsg");
                if (responseMsg) {
                    responseMsg.innerHTML = "⚠️ Network error. Please try later.";
                    responseMsg.className = "contact-redesign-msg error";
                    responseMsg.style.display = "block";
                }
            } finally {
                // Reset form button and message after showing status
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = "";
                    btn.style.color = "";
                    btn.style.opacity = "1";
                    btn.style.boxShadow = "";
                    btn.style.cursor = "pointer";
                    
                    const responseMsg = document.getElementById("responseMsg");
                    if (responseMsg) {
                        responseMsg.style.display = "none";
                    }
                }, 4500);
            }
        });
    }

    // Carousel Logic
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    let slideInterval;

    function initCarousel() {
        if(slides.length === 0) return;
        showSlide(currentSlideIndex);
        startSlideTimer();
    }

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (slides[index]) slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
    }

    window.changeSlide = function(direction) {
        currentSlideIndex += direction;
        if(currentSlideIndex >= slides.length) currentSlideIndex = 0;
        if(currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
        showSlide(currentSlideIndex);
        resetSlideTimer();
    };

    window.goToSlide = function(index) {
        currentSlideIndex = index;
        showSlide(currentSlideIndex);
        resetSlideTimer();
    };

    function startSlideTimer() {
        if (slides.length > 0) {
            slideInterval = setInterval(() => {
                changeSlide(1);
            }, 6000);
        }
    }

    function resetSlideTimer() {
        clearInterval(slideInterval);
        startSlideTimer();
    }
    
    // Back to Top functionality
    const backToTopBtn = document.getElementById("backToTop");
    if(backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
    
    initCarousel();
});

