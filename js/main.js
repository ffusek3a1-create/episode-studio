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
    entries.forEach((entry, i) => {
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

    /* ─────────────────────────────────────────
       Tu podłączasz swój backend formularza.

       Opcja A — Formspree (najprostsze):
         1. Załóż konto na formspree.io
         2. Dodaj action="https://formspree.io/f/TWOJ_ID"
            do <form> w index.html
         3. Usuń e.preventDefault() wyżej

       Opcja B — fetch do własnego API:
         const data = new FormData(form);
         fetch('/api/contact', { method: 'POST', body: data })
           .then(r => r.ok ? showSuccess() : showError());

       Opcja C — EmailJS (bez backendu):
         emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', form)
           .then(() => showSuccess());
    ───────────────────────────────────────── */

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

  // Odczyt preferencji: localStorage → domyślnie zawsze dark
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
   8. HERO — rotujący nagłówek
   ────────────────────────────────────────── */

function initHeroRotation() {
  const headingTrack = document.getElementById('hero-heading-track');
  const tagTrack     = document.getElementById('hero-tag-track');
  const headingSlot  = document.getElementById('hero-heading-slot');
  if (!headingTrack || !tagTrack) return;

  const INTERVAL = 3800;
  const EASE     = 'cubic-bezier(0.76, 0, 0.24, 1)';
  const DUR      = '0.7s';

  const headings = Array.from(headingTrack.querySelectorAll('.hero-h1'));
  const tags     = Array.from(tagTrack.querySelectorAll('.hero-eyebrow'));
  let current    = 0;
  let animating  = false;

  // Setup — wszystkie elementy absolute, pierwszy relative
  headings.forEach((h, i) => {
    if (i === 0) {
      h.style.position  = 'relative';
      h.style.transform = 'translateY(0)';
      h.style.opacity   = '1';
    } else {
      h.style.position  = 'absolute';
      h.style.top       = '0';
      h.style.left      = '0';
      h.style.transform = 'translateY(110%)';
      h.style.opacity   = '0';
    }
  });

  tags.forEach((t, i) => {
    t.style.transform = i === 0 ? 'translateY(0)' : 'translateY(110%)';
    t.style.opacity   = i === 0 ? '1' : '0';
  });

  // Slot height = wysokość aktywnego h1
  function syncHeight() {
    headingSlot.style.height = headings[current].scrollHeight + 'px';
  }
  syncHeight();

  function nextSlide() {
    if (animating) return;
    animating = true;

    const next = (current + 1) % headings.length;
    const curH = headings[current];
    const nxtH = headings[next];
    const curT = tags[current];
    const nxtT = tags[next];

    // Przygotuj następny — bez animacji
    nxtH.style.transition = 'none';
    nxtH.style.position   = 'absolute';
    nxtH.style.top        = '0';
    nxtH.style.left       = '0';
    nxtH.style.transform  = 'translateY(110%)';
    nxtH.style.opacity    = '0';

    nxtT.style.transition = 'none';
    nxtT.style.transform  = 'translateY(110%)';
    nxtT.style.opacity    = '0';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const trans = `transform ${DUR} ${EASE}, opacity 0.5s ease`;

        // Wyjście
        curH.style.transition = trans;
        curH.style.transform  = 'translateY(-110%)';
        curH.style.opacity    = '0';

        curT.style.transition = trans;
        curT.style.transform  = 'translateY(-110%)';
        curT.style.opacity    = '0';

        // Wejście
        nxtH.style.transition = trans;
        nxtH.style.transform  = 'translateY(0)';
        nxtH.style.opacity    = '1';

        nxtT.style.transition = trans;
        nxtT.style.transform  = 'translateY(0)';
        nxtT.style.opacity    = '1';

        // Slot height
        headingSlot.style.transition = `height ${DUR} ${EASE}`;
        headingSlot.style.height     = nxtH.scrollHeight + 'px';

        setTimeout(() => {
          current   = next;
          animating = false;
        }, 750);
      });
    });
  }

  setInterval(nextSlide, INTERVAL);
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