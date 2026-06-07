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
   2. SERVICES TABS
   ────────────────────────────────────────── */

function switchTab(panelId, clickedBtn) {
  document.querySelectorAll('.services-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('panel-' + panelId)?.classList.add('active');
  clickedBtn.classList.add('active');
}

// Eksportujemy globalnie bo jest wywoływana z atrybutu onclick w HTML
window.switchTab = switchTab;


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
   INIT — uruchomienie wszystkich modułów
   ────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initModal();
  initScrollReveal();
  initImageSection();
  initContactForm();
});