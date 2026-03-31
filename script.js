// Preloader Hiding
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        preloader.classList.add("loaded");
        setTimeout(() => {
            preloader.style.display = "none";
        }, 800);
    }
});

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
                // Use a constant offset (80px) to match the final scrolled navbar height
                // This prevents the "gap" when the navbar changes its padding during scroll
                const navOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;
  
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

    // Physics Hero Logic (Matter.js)
    function initPhysicsHero() {
        const Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Events = Matter.Events,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        const sceneContainer = document.getElementById("scene-container");
        if (!sceneContainer) return;

        const engine = Engine.create();
        const world = engine.world;

        const render = Render.create({
            element: sceneContainer,
            engine: engine,
            options: {
                width: sceneContainer.offsetWidth,
                height: sceneContainer.offsetHeight,
                wireframes: false,
                background: "transparent"
            }
        });

        Render.run(render);
        const runner = Runner.create();
        Runner.run(runner, engine);

        // Data Source
        const colorListItems = document.querySelectorAll("#color-source li");
        const colorsList = Array.from(colorListItems).map((li) => li.textContent.trim());
        const bodiesDOM = [];

        // Collision Handling (No Sound)
        Events.on(engine, "collisionStart", (event) => {
            // Can add visual effects here if needed in the future
        });


        function createWalls() {
            const thickness = 100;
            const width = sceneContainer.offsetWidth;
            const height = sceneContainer.offsetHeight;
            const spawnHeight = 4000;

            const existing = Composite.allBodies(world).filter(b => b.label === "wall" || b.label === "floor");
            Composite.remove(world, existing);

            const walls = [
                Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { isStatic: true, label: "floor", friction: 0.5 }),
                Bodies.rectangle(0 - thickness / 2, height - (height + spawnHeight) / 2, thickness, height + spawnHeight, { isStatic: true, label: "wall", friction: 0 }),
                Bodies.rectangle(width + thickness / 2, height - (height + spawnHeight) / 2, thickness, height + spawnHeight, { isStatic: true, label: "wall", friction: 0 })
            ];
            Composite.add(world, walls);
        }

        function spawnColors() {
            const width = sceneContainer.offsetWidth;
            const padding = 50;
            const shuffled = colorsList.sort(() => 0.5 - Math.random());
            const selectedColors = shuffled.slice(0, 50);

            selectedColors.forEach((colorName) => {
                const x = Math.random() * (width - padding * 2) + padding;
                const y = -Math.random() * 2000 - 200;

                const charWidth = 9;
                const boxPad = 34;
                const boxWidth = colorName.length * charWidth + boxPad;
                const boxHeight = 40;

                const body = Bodies.rectangle(x, y, boxWidth, boxHeight, {
                    angle: Math.random() * 0.5 - 0.25,
                    restitution: 0.5,
                    friction: 0.05,
                    label: colorName
                });

                const elem = document.createElement("div");
                elem.classList.add("color-body");
                elem.textContent = colorName;
                elem.style.width = `${boxWidth}px`;
                elem.style.height = `${boxHeight}px`;
                elem.style.backgroundColor = colorName;
                sceneContainer.appendChild(elem);

                requestAnimationFrame(() => {
                    const computedColor = window.getComputedStyle(elem).backgroundColor;
                    const rgb = computedColor.match(/\d+/g);
                    if (rgb) {
                        const brightness = Math.round((parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000);
                        if (brightness > 140) {
                            elem.style.color = "#1a1a1a";
                            elem.style.textShadow = "none";
                            elem.style.border = "1px solid rgba(0,0,0,0.1)";
                        } else {
                            elem.style.color = "#ffffff";
                        }
                    }
                });

                bodiesDOM.push({ body, elem });
                Composite.add(world, body);
            });
        }

        function updateLoop() {
            bodiesDOM.forEach((pair) => {
                const { body, elem } = pair;
                const { position, angle } = body;
                elem.style.transform = `translate(${position.x - elem.offsetWidth / 2}px, ${position.y - elem.offsetHeight / 2}px) rotate(${angle}rad)`;
            });
            requestAnimationFrame(updateLoop);
        }

        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: { stiffness: 0.2, render: { visible: false } }
        });
        Composite.add(world, mouseConstraint);

        // Allow right-click and scrolling over the interaction layer
        render.mouse = mouse;
        
        // Remove listeners that block scrolling
        mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
        mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

        createWalls();
        spawnColors();
        updateLoop();

        window.addEventListener("resize", () => {
            render.canvas.width = sceneContainer.offsetWidth;
            render.canvas.height = sceneContainer.offsetHeight;
            createWalls();
        });

        const btnGravity = document.getElementById("btn-gravity");
        const btnExplode = document.getElementById("btn-explode");
        let gravityOn = true;

        if (btnGravity) {
            btnGravity.addEventListener("click", () => {
                gravityOn = !gravityOn;
                engine.gravity.y = gravityOn ? 1 : 0;
                btnGravity.textContent = gravityOn ? "Zero Gravity" : "Restore Gravity";
                if (!gravityOn) {
                    bodiesDOM.forEach(({ body }) => {
                        Matter.Body.applyForce(body, body.position, {
                            x: (Math.random() - 0.5) * 0.005,
                            y: (Math.random() - 0.5) * 0.005
                        });
                    });
                }
            });
        }

        if (btnExplode) {
            btnExplode.addEventListener("click", () => {
                bodiesDOM.forEach(({ body }) => {
                    const forceMagnitude = 0.05 * body.mass;
                    const angle = Math.random() * Math.PI * 2;
                    Matter.Body.applyForce(body, body.position, {
                        x: Math.cos(angle) * forceMagnitude,
                        y: Math.sin(angle) * forceMagnitude
                    });
                });
            });
        }
    }

    // Disable physics hero on mobile for performance
    if (window.innerWidth > 768) {
        initPhysicsHero();
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
});

