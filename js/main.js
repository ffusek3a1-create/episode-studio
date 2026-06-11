/* ============================================================
   main.js — Logika interakcji Episode Studio
   ============================================================
   Plik podzielony na moduły funkcyjne.
   Każdy moduł możesz włączyć / wyłączyć niezależnie.
   ============================================================ */


/* ──────────────────────────────────────────
   1. NAV — border przy scrollu
   ────────────────────────────────────────── */

function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 40
      ? 'rgba(180,232,198,0.18)'
      : 'rgba(180,232,198,0.10)';
  }, { passive: true });
}


/* ──────────────────────────────────────────
   2. SERVICES ACCORDION
   ────────────────────────────────────────── */

function toggleAccordion(id) {
  const item = document.getElementById(id);
  if (!item) return;
  const isOpen = item.classList.contains('is-open');
  document.querySelectorAll('.service-item').forEach(el => el.classList.remove('is-open'));
  if (!isOpen) item.classList.add('is-open');
}

window.toggleAccordion = toggleAccordion;


/* ──────────────────────────────────────────
   3. MODAL (Calendly)
   ────────────────────────────────────────── */

function initModal() {
  const overlay = document.getElementById('modal');
  if (!overlay) return;

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal() {
  document.getElementById('modal')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal')?.classList.remove('open');
  document.body.style.overflow = '';
}

window.openModal  = openModal;
window.closeModal = closeModal;


/* ──────────────────────────────────────────
   4. SCROLL REVEAL
   ────────────────────────────────────────── */

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => observer.observe(el));
}


/* ──────────────────────────────────────────
   5. IMAGE SECTION — parallax + reveal
   ────────────────────────────────────────── */

function initImageSection() {
  const section = document.getElementById('image-parallax');
  const bg      = document.getElementById('parallax-bg');
  if (!section || !bg) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.15 });

  revealObserver.observe(section);

  function updateParallax() {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      bg.style.transform = `translateY(${(progress - 0.5) * 80}px)`;
    }
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();
}


/* ──────────────────────────────────────────
   6. CONTACT FORM
   ────────────────────────────────────────── */

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showFormSuccess();
  });
}

function showFormSuccess() {
  const success = document.getElementById('form-success');
  const form    = document.getElementById('contact-form');
  if (!success || !form) return;

  success.style.display = 'block';
  form.querySelectorAll('input, select, textarea, button')
    .forEach(el => {
      el.disabled      = true;
      el.style.opacity = '0.4';
    });
}


/* ──────────────────────────────────────────
   7. THEME TOGGLE — jasny / ciemny
   ────────────────────────────────────────── */

function initThemeToggle() {
  const btn  = document.getElementById('theme-toggle');
  const html = document.documentElement;
  if (!btn) return;

  const saved  = localStorage.getItem('es-theme');
  const initial = saved ?? 'dark';
  applyTheme(initial);

  btn.addEventListener('click', () => {
    const next = html.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('es-theme', next);
  });

  function applyTheme(theme) {
    html.classList.remove('dark', 'light');
    html.classList.add(theme);
  }
}


/* ──────────────────────────────────────────
   8. HERO — Płynna, asymetryczna wymiana nagłówków (Scroll-Driven)
   ────────────────────────────────────────── */

function initHeroRotation() {
  const hero    = document.querySelector('.hero');
  const track   = document.getElementById('hero-heading-track');
  const eyebrow = document.getElementById('hero-eyebrow');
  const h0      = document.getElementById('hero-h0');
  const h1      = document.getElementById('hero-h1');
  if (!hero || !track || !h0 || !h1) return;

  // AKTUALIZACJA: Zmiana z Warszawy na Wrocław w tablicy konfiguracyjnej skryptu
  const slides = [
    { eyebrow: 'Boutique Event Agency · Wrocław' },
    { eyebrow: 'Dla marek, zespołów i wymagających osobowości' },
  ];

  // WYMUSZENIE UKŁADU ASYMETRYCZNEGO W JAVASCRIPT
  track.style.setProperty('position', 'relative', 'important');
  track.style.setProperty('display', 'block', 'important');

  // Całkowite odpięcie domyślnych animacji wchodzących CSS (fadeUp), aby nie blokowały scrolla
  h0.style.setProperty('animation', 'none', 'important');
  h1.style.setProperty('animation', 'none', 'important');

  // NAGŁÓWEK 1 (#hero-h0): Po lewej stronie
  h0.style.setProperty('position', 'relative', 'important');
  h0.style.setProperty('top', '0', 'important');
  h0.style.setProperty('left', '0', 'important');
  h0.style.setProperty('text-align', 'left', 'important');
  h0.style.setProperty('margin', '0', 'important');
  h0.style.setProperty('width', '100%', 'important');

  // NAGŁÓWEK 2 (#hero-h1): W prawym dolnym rogu kontenera track
  h1.style.setProperty('position', 'absolute', 'important');
  h1.style.setProperty('bottom', '0', 'important');
  h1.style.setProperty('right', '0', 'important');
  h1.style.setProperty('text-align', 'right', 'important');
  h1.style.setProperty('margin', '0', 'important');
  h1.style.setProperty('width', 'auto', 'important');
  
  // Ukrycie wizualne i fizyczne drugiego nagłówka na samym starcie strony
  h1.style.setProperty('opacity', '0', 'important');
  h1.style.setProperty('visibility', 'hidden', 'important');

  // Funkcja obliczająca przestrzeń dla asymetrycznego układu
  function adjustTrackHeight() {
    const baseHeight = h0.scrollHeight;
    const secondHeight = h1.scrollHeight;
    track.style.height = (baseHeight + secondHeight * 0.4) + 'px';
  }

  window.addEventListener('resize', adjustTrackHeight);
  adjustTrackHeight();

  // Obsługa scrolla — precyzyjne sterowanie widocznością i przemieszczaniem
  function handleHeroScroll() {
    const scrollY = window.scrollY;
    
    const transitionDistance = 280; 
    let progress = Math.min(Math.max(scrollY / transitionDistance, 0), 1);
    const moveDistance = 25; 

    // REAKCJA PIERWSZEGO NAGŁÓWKA (#hero-h0) — Zanika
    h0.style.setProperty('opacity', (1 - progress).toFixed(3), 'important');
    h0.style.transform = `translate(${-progress * (moveDistance / 2)}px, ${-progress * moveDistance}px)`;
    
    if (progress >= 0.98) {
      h0.style.setProperty('visibility', 'hidden', 'important');
    } else {
      h0.style.setProperty('visibility', 'visible', 'important');
    }

    // REAKCJA DRUGIEGO NAGŁÓWKA (#hero-h1) — Pojawia się w prawym dolnym rogu
    if (progress > 0.02) {
      h1.style.setProperty('visibility', 'visible', 'important');
      h1.style.setProperty('opacity', progress.toFixed(3), 'important');
    } else {
      h1.style.setProperty('opacity', '0', 'important');
      h1.style.setProperty('visibility', 'hidden', 'important');
    }
    h1.style.transform = `translateY(${(1 - progress) * moveDistance}px)`;

    // Płynna, synchroniczna wymiana tekstu nadtytułu (eyebrow) z uwzględnieniem Wrocławia
    if (eyebrow) {
      if (progress < 0.5) {
        eyebrow.textContent = slides[0].eyebrow;
        eyebrow.style.opacity = ((0.5 - progress) * 2).toFixed(2);
      } else {
        eyebrow.textContent = slides[1].eyebrow;
        eyebrow.style.opacity = ((progress - 0.5) * 2).toFixed(2);
      }
    }

    hero.classList.toggle('is-active', progress > 0.5);
  }

  window.addEventListener('scroll', handleHeroScroll, { passive: true });
  handleHeroScroll();
  
  window.addEventListener('load', adjustTrackHeight);
}


/* ──────────────────────────────────────────
   INIT — uruchomienie wszystkich modułów
   ────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeroRotation();
  initNav();
  initModal();
  initScrollReveal();
  initImageSection();
  initContactForm();
});