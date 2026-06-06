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
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// ---------- Navbar scroll effect ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.style.background = window.scrollY > 30
      ? 'rgba(13,13,13,0.98)'
      : 'rgba(13,13,13,0.92)';
  }
}, { passive: true });

// ---------- Fade-up scroll animations ----------
const fadeTargets = document.querySelectorAll(
  '.about-grid, .project-overview-grid, .cta-inner, ' +
  '.section-heading, .hero-content, .contact-grid'
);
fadeTargets.forEach(el => el.classList.add('fade-up'));

const staggerParents = document.querySelectorAll(
  '.skills-grid, .features-grid, .screenshots-grid, ' +
  '.arch-flow, .contact-links, .projects-grid, .project-list-item'
);
staggerParents.forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.classList.add('fade-up');
    child.style.transitionDelay = `${i * 0.07}s`;
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ============================================================
// LIGHTBOX
// ============================================================

// Build the lightbox DOM once
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.innerHTML = `
  <div id="lb-backdrop"></div>
  <div id="lb-box">
    <button id="lb-close" aria-label="Close">✕</button>
    <button id="lb-prev" aria-label="Previous">&#8592;</button>
    <button id="lb-next" aria-label="Next">&#8594;</button>
    <div id="lb-img-wrap">
      <img id="lb-img" src="" alt="" />
    </div>
    <p id="lb-caption"></p>
  </div>
`;
document.body.appendChild(lightbox);

const lb         = document.getElementById('lightbox');
const lbImg      = document.getElementById('lb-img');
const lbCaption  = document.getElementById('lb-caption');
const lbClose    = document.getElementById('lb-close');
const lbPrev     = document.getElementById('lb-prev');
const lbNext     = document.getElementById('lb-next');
const lbBackdrop = document.getElementById('lb-backdrop');

let lbImages = []; // [{src, alt, caption}]
let lbIndex  = 0;

function openLightbox(index) {
  lbIndex = index;
  showImage(lbIndex);
  lb.classList.add('lb-open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lb.classList.remove('lb-open');
  document.body.style.overflow = '';
}

function showImage(index) {
  const item = lbImages[index];
  lbImg.style.opacity = '0';
  setTimeout(() => {
    lbImg.src     = item.src;
    lbImg.alt     = item.alt;
    lbCaption.textContent = item.caption || '';
    lbImg.style.opacity = '1';
  }, 150);

  // Show/hide arrows
  lbPrev.style.display = lbImages.length > 1 ? 'flex' : 'none';
  lbNext.style.display = lbImages.length > 1 ? 'flex' : 'none';
}

function prevImage() {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  showImage(lbIndex);
}

function nextImage() {
  lbIndex = (lbIndex + 1) % lbImages.length;
  showImage(lbIndex);
}

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevImage);
lbNext.addEventListener('click', nextImage);

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('lb-open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   prevImage();
  if (e.key === 'ArrowRight')  nextImage();
});

// Collect all clickable images on the page and wire them up.
// We look for:
//   1. Real <img> tags inside .screenshot-placeholder or .proj-card-img
//   2. The proj-card image (homepage cards) — but those are links,
//      so we intercept the click to open lightbox instead of navigating.
function initLightboxImages() {
  // --- Screenshot grids (project detail pages) ---
  const screenshotCards = document.querySelectorAll('.screenshot-card');
  screenshotCards.forEach((card, i) => {
    const img = card.querySelector('img');
    if (!img) return; // placeholder, skip

    const caption = card.querySelector('.screenshot-caption')?.textContent || '';
    lbImages.push({ src: img.src, alt: img.alt, caption });

    // Make it look clickable
    img.classList.add('lb-trigger');
    img.parentElement.classList.add('lb-trigger-wrap');

    img.addEventListener('click', () => {
      // Find the index within lbImages for this card
      const idx = lbImages.findIndex(item => item.src === img.src);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });

  // --- Homepage / projects-page proj-cards ---
  // The card is an <a> tag. We want click on the image area to open
  // lightbox, and click elsewhere (title, cta text) to navigate normally.
  const projCards = document.querySelectorAll('.proj-card');
  projCards.forEach(card => {
    const img = card.querySelector('.proj-card-img:not(.proj-card-placeholder)');
    if (!img || img.tagName !== 'IMG') return;

    const title   = card.querySelector('.proj-card-title')?.textContent || img.alt;
    const caption = card.querySelector('.proj-card-type')?.textContent  || '';
    const src     = img.src;

    // Check if already added (avoid duplicates)
    if (lbImages.find(item => item.src === src)) return;
    lbImages.push({ src, alt: title, caption });

    img.classList.add('lb-trigger');
    img.parentElement?.classList.add('lb-trigger-wrap');

    img.addEventListener('click', e => {
      e.preventDefault(); // stop the card <a> from navigating
      e.stopPropagation();
      const idx = lbImages.findIndex(item => item.src === src);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLightboxImages);
} else {
  initLightboxImages();
}
