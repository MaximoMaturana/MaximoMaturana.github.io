// ============================================================
// MAXIMO MATURANA — PORTFOLIO  |  script.js
// ============================================================

// ---------- Mobile Hamburger ----------
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a:not(.nav-dropdown-trigger)').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

// ---------- Projects dropdown — hover with delay so gap doesn't close it ----------
const dropdownWrap    = document.querySelector('.nav-dropdown-wrap');
const dropdownTrigger = document.querySelector('.nav-dropdown-trigger');
const dropdownPanel   = document.querySelector('.nav-dropdown');

if (dropdownWrap && dropdownPanel) {
  let closeTimer = null;

  function openDropdown() {
    clearTimeout(closeTimer);
    dropdownPanel.classList.add('dd-open');
  }

  function scheduleClose() {
    closeTimer = setTimeout(() => {
      dropdownPanel.classList.remove('dd-open');
    }, 120); // 120ms grace period — cursor can cross any gap
  }

  // Hover on the wrapper (trigger + panel both live inside it)
  dropdownWrap.addEventListener('mouseenter', openDropdown);
  dropdownWrap.addEventListener('mouseleave', scheduleClose);

  // If cursor re-enters the panel before the timer fires, cancel close
  dropdownPanel.addEventListener('mouseenter', openDropdown);
  dropdownPanel.addEventListener('mouseleave', scheduleClose);

  // Mobile: tap trigger to toggle
  if (dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      if (window.getComputedStyle(hamburger).display !== 'none') {
        e.preventDefault();
        dropdownWrap.classList.toggle('open');
      }
    });
  }
}

// ---------- Navbar scroll shadow ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (!navbar) return;
  navbar.style.background = window.scrollY > 30
    ? 'rgba(13,13,13,0.98)'
    : 'rgba(13,13,13,0.92)';
}, { passive: true });

// ---------- Scroll fade-up animations ----------
document.querySelectorAll(
  '.about-grid, .project-overview-grid, .cta-inner, .section-heading, .hero-content, .contact-grid'
).forEach(el => el.classList.add('fade-up'));

document.querySelectorAll(
  '.skills-grid, .features-grid, .screenshots-grid, .arch-flow, .contact-links, .projects-grid'
).forEach(parent =>
  Array.from(parent.children).forEach((child, i) => {
    child.classList.add('fade-up');
    child.style.transitionDelay = `${i * 0.07}s`;
  })
);

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


// ============================================================
// LIGHTBOX
// ============================================================
const lb = document.createElement('div');
lb.id = 'lightbox';
lb.innerHTML = `
  <div id="lb-backdrop"></div>
  <div id="lb-box">
    <button id="lb-close" aria-label="Close image">✕</button>
    <button id="lb-prev" aria-label="Previous image">&#8592;</button>
    <button id="lb-next" aria-label="Next image">&#8594;</button>
    <div id="lb-img-wrap">
      <img id="lb-img" src="" alt="" />
    </div>
    <div id="lb-footer">
      <p id="lb-caption"></p>
      <p id="lb-counter"></p>
    </div>
  </div>
`;
document.body.appendChild(lb);

const lbEl      = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbCaption = document.getElementById('lb-caption');
const lbCounter = document.getElementById('lb-counter');
const lbClose   = document.getElementById('lb-close');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');
const lbBack    = document.getElementById('lb-backdrop');

let images = [];
let current = 0;

function buildImageList() {
  images = [];
  document.querySelectorAll('img.screenshot-img').forEach(img => {
    if (img.naturalWidth > 0) {
      const card    = img.closest('.screenshot-card');
      const caption = card ? card.querySelector('.screenshot-caption')?.textContent : '';
      images.push({ src: img.src, alt: img.alt, caption: caption || img.alt });
      img.classList.add('lb-ready');
    }
  });
  updateArrows();
}

function updateArrows() {
  const show = images.length > 1;
  lbPrev.style.display = show ? 'flex' : 'none';
  lbNext.style.display = show ? 'flex' : 'none';
}

function openLB(index) {
  current = index;
  render();
  lbEl.classList.add('lb-open');
  document.body.style.overflow = 'hidden';
}

function closeLB() {
  lbEl.classList.remove('lb-open');
  document.body.style.overflow = '';
}

function render() {
  const item = images[current];
  lbImg.style.opacity = '0';
  lbImg.style.transform = 'scale(0.97)';
  setTimeout(() => {
    lbImg.src = item.src;
    lbImg.alt = item.alt;
    lbCaption.textContent = item.caption || '';
    lbCounter.textContent = images.length > 1 ? `${current + 1} / ${images.length}` : '';
    lbImg.style.opacity = '1';
    lbImg.style.transform = 'scale(1)';
  }, 120);
}

function prev() { current = (current - 1 + images.length) % images.length; render(); }
function next() { current = (current + 1) % images.length; render(); }

lbClose.addEventListener('click', closeLB);
lbBack.addEventListener('click', closeLB);
lbPrev.addEventListener('click', prev);
lbNext.addEventListener('click', next);

document.addEventListener('keydown', e => {
  if (!lbEl.classList.contains('lb-open')) return;
  if (e.key === 'Escape')     closeLB();
  if (e.key === 'ArrowLeft')  prev();
  if (e.key === 'ArrowRight') next();
});

let touchStartX = 0;
lbEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lbEl.addEventListener('touchend',   e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
});

function attachClickListeners() {
  document.querySelectorAll('img.lb-ready').forEach(img => {
    img.addEventListener('click', () => {
      const idx = images.findIndex(item => item.src === img.src);
      openLB(idx >= 0 ? idx : 0);
    });
  });
}

function init() {
  buildImageList();
  attachClickListeners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(init, 200));
} else {
  setTimeout(init, 200);
}

document.querySelectorAll('img.screenshot-img').forEach(img => {
  img.addEventListener('load', () => { buildImageList(); attachClickListeners(); });
});