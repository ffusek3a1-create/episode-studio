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
  // Zamknij wszystkie
  document.querySelectorAll('.service-item').forEach(el => el.classList.remove('is-open'));
  // Otwórz kliknięty (jeśli nie był otwarty)
  if (!isOpen) item.classList.add('is-open');
}

window.toggleAccordion = toggleAccordion;


/* ──────────────────────────────────────────
   3. MODAL (Calendly)
   ────────────────────────────────────────── */

function initModal() {
  const overlay = document.getElementById('modal');
  if (!overlay) return;

  // zamknięcie klikiem w tło
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // zamknięcie klawiszem Escape
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

// Globalnie — wywoływane z atrybutów onclick
window.openModal  = openModal;
window.closeModal = closeModal;


/* ──────────────────────────────────────────
   4. SCROLL REVEAL
   Obserwuje elementy z klasą .reveal i dodaje
   klasę .visible gdy wejdą w viewport.
   ────────────────────────────────────────── */

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // staggered delay dla elementów wchodzących razem
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

  // reveal przy wejściu w viewport
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('is-visible');
    });
  }, { threshold: 0.15 });

  revealObserver.observe(section);

  // parallax przy scrollu
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
   8. HERO — Przewijany Nagłówek (Zanikanie Scroll-Driven)
   ────────────────────────────────────────── */

function initHeroRotation() {
  const hero    = document.querySelector('.hero');
  const slot    = document.getElementById('hero-heading-slot');
  const eyebrow = document.getElementById('hero-eyebrow');
  const h0      = document.getElementById('hero-h0');
  const h1      = document.getElementById('hero-h1');
  if (!hero || !slot || !h0 || !h1) return;

  const slides = [
    { eyebrow: 'Boutique Event Agency · Warszawa', el: h0 },
    { eyebrow: 'Firmy i zespoły premium',           el: h1 },
  ];

  // Wymuszenie kontenera jako punktu odniesienia (relative) i wyczyszczenie flexa/gridu
  slot.style.setProperty('position', 'relative', 'important');
  slot.style.setProperty('display', 'block', 'important');

  // RESET ANIMACJI Z PLIKU CSS
  h0.style.setProperty('animation', 'none', 'important');
  h1.style.setProperty('animation', 'none', 'important');

  // PIERWSZY NAGŁÓWEK (Pozycja bazowa)
  h0.style.setProperty('position', 'relative', 'important');
  h0.style.setProperty('top', '0', 'important');
  h0.style.setProperty('left', '0', 'important');
  h0.style.setProperty('margin', '0', 'important');
  h0.style.setProperty('width', '100%', 'important');

  // DRUGI NAGŁÓWEK (Nakładamy go dokładnie NA pierwszy i wyrywamy z dokumentu)
  h1.style.setProperty('position', 'absolute', 'important');
  h1.style.setProperty('top', '0', 'important');
  h1.style.setProperty('left', '0', 'important');
  h1.style.setProperty('margin', '0', 'important');
  h1.style.setProperty('width', '100%', 'important');
  
  // Całkowite ukrycie fizyczne i wizualne drugiego nagłówka na starcie strony
  h1.style.setProperty('opacity', '0', 'important');
  h1.style.setProperty('visibility', 'hidden', 'important');

  // Dynamiczne ustawianie wysokości slotu, żeby nic na dole nie skakało
  function adjustSlotHeight() {
    const maxHeight = Math.max(h0.scrollHeight, h1.scrollHeight);
    slot.style.height = maxHeight + 'px';
  }

  window.addEventListener('resize', adjustSlotHeight);
  adjustSlotHeight();

  // Przetwarzanie przewijania
  function handleHeroScroll() {
    const scrollY = window.scrollY;
    
    // Dystans skrolowania w px, na którym zachodzi transformacja
    const transitionDistance = 250; 
    let progress = Math.min(Math.max(scrollY / transitionDistance, 0), 1);
    const moveDistance = 25; 

    // Sterowanie pierwszym nagłówkiem (Zanika)
    h0.style.setProperty('opacity', (1 - progress).toFixed(3), 'important');
    h0.style.transform = `translateY(${-progress * moveDistance}px)`;
    if (progress >= 0.95) {
      h0.style.setProperty('visibility', 'hidden', 'important');
    } else {
      h0.style.setProperty('visibility', 'visible', 'important');
    }

    // Sterowanie drugim nagłówkiem (Pojawia się)
    if (progress > 0.02) {
      h1.style.setProperty('visibility', 'visible', 'important');
      h1.style.setProperty('opacity', progress.toFixed(3), 'important');
    } else {
      h1.style.setProperty('opacity', '0', 'important');
      h1.style.setProperty('visibility', 'hidden', 'important');
    }
    h1.style.transform = `translateY(${(1 - progress) * moveDistance}px)`;

    // Płynna wymiana tekstu eyebrow
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
  
  window.addEventListener('load', adjustSlotHeight);
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