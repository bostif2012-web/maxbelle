const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const yearTarget = document.querySelector("[data-year]");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

function updateHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.classList.contains("is-open")) {
      menu.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    }
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 280)}ms`;
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas || prefersReducedMotion.matches) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationFrame = 0;

  function particleCount() {
    return Math.min(90, Math.max(36, Math.floor(window.innerWidth / 22)));
  }

  function resize() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    particles = Array.from({ length: particleCount() }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.16,
      speedY: Math.random() * -0.22 - 0.05,
      opacity: Math.random() * 0.44 + 0.14
    }));
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.y < -10) {
        particle.y = height + 10;
        particle.x = Math.random() * width;
      }

      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;

      const gradient = context.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 7
      );
      gradient.addColorStop(0, `rgba(240, 221, 175, ${particle.opacity})`);
      gradient.addColorStop(0.45, `rgba(216, 160, 152, ${particle.opacity * 0.42})`);
      gradient.addColorStop(1, "rgba(216, 160, 152, 0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius * 7, 0, Math.PI * 2);
      context.fill();
    });

    animationFrame = window.requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });

  prefersReducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      window.cancelAnimationFrame(animationFrame);
      context.clearRect(0, 0, width, height);
    } else {
      resize();
      draw();
    }
  });
}

initParticles();
