// ============================================================
// MAXIMO MATURANA — PORTFOLIO
// script.js
// ============================================================

// ---------- Mobile Hamburger Menu ----------
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // Close when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// ---------- Navbar scroll effect ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 30) {
      navbar.style.background = 'rgba(13,13,13,0.98)';
    } else {
      navbar.style.background = 'rgba(13,13,13,0.92)';
    }
  }
}, { passive: true });

// ---------- Fade-up scroll animations ----------
const fadeEls = document.querySelectorAll(
  '.about-grid, .skills-grid, .project-card, .project-list-item, ' +
  '.feature-card, .screenshot-card, .arch-step, .contact-link-card, ' +
  '.section-heading, .hero-content, .project-overview-grid, .cta-inner'
);

fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger children if the parent is a grid/list
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 0);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// Stagger grid children individually
document.querySelectorAll(
  '.skills-grid, .features-grid, .screenshots-grid, .arch-flow, .contact-links'
).forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.classList.add('fade-up');
    child.style.transitionDelay = `${i * 0.07}s`;
    observer.observe(child);
  });
});
