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

function toggleAcc(id) {
  const item   = document.getElementById(id);
  if (!item) return;
  const isOpen = item.classList.contains('is-open');
  document.querySelectorAll('.acc-item').forEach(el => el.classList.remove('is-open'));
  if (!isOpen) item.classList.add('is-open');
}

window.toggleAcc      = toggleAcc;
window.toggleAccordion = toggleAcc; // backward compat


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
  const hero     = document.querySelector('.hero');
  const slot     = document.getElementById('hero-heading-slot');
  const eyebrow  = document.getElementById('hero-eyebrow');
  const h0       = document.getElementById('hero-h0');
  const h1       = document.getElementById('hero-h1');
  const parallax = document.getElementById('hero-parallax');
  if (!hero || !h0 || !h1) return;

  const INTERVAL = 4000;
  const EASE     = 'cubic-bezier(0.76, 0, 0.24, 1)';
  const DUR      = '0.75s';

  const slides = [
    { eyebrow: 'Boutique Event Agency · Warszawa', el: h0 },
    { eyebrow: 'Firmy i zespoły premium',           el: h1 },
  ];

  let current   = 0;
  let animating = false;

  /* ── Setup pozycji ── */
  h0.style.cssText = 'position:relative;transform:translateY(0);opacity:1;';
  h1.style.cssText = 'position:absolute;top:0;left:0;width:100%;transform:translateY(110%);opacity:0;';
  if (slot) slot.style.height = h0.scrollHeight + 'px';

  /* ── Parallax ── */
  if (parallax) {
    let ticking = false;
    hero.addEventListener('mousemove', e => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const r  = hero.getBoundingClientRect();
        const cx = (e.clientX - r.left)  / r.width  - 0.5;
        const cy = (e.clientY - r.top)   / r.height - 0.5;
        parallax.style.transform = `translate(${cx * 24}px, ${cy * 16}px)`;
        ticking = false;
      });
    });
    hero.addEventListener('mouseleave', () => {
      parallax.style.transition = 'transform 0.7s ease';
      parallax.style.transform  = 'translate(0,0)';
      setTimeout(() => { parallax.style.transition = ''; }, 700);
    });
  }

  /* ── Rotacja nagłówka ── */
  function goTo(next) {
    if (animating || next === current) return;
    animating = true;

    const curH = slides[current].el;
    const nxtH = slides[next].el;

    nxtH.style.transition = 'none';
    nxtH.style.position   = 'absolute';
    nxtH.style.top = '0'; nxtH.style.left = '0'; nxtH.style.width = '100%';
    nxtH.style.transform  = 'translateY(110%)';
    nxtH.style.opacity    = '0';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const tr = `transform ${DUR} ${EASE}, opacity 0.6s ease`;
        curH.style.transition = tr;
        curH.style.transform  = 'translateY(-110%)';
        curH.style.opacity    = '0';
        nxtH.style.transition = tr;
        nxtH.style.transform  = 'translateY(0)';
        nxtH.style.opacity    = '1';

        if (slot) {
          slot.style.transition = `height ${DUR} ${EASE}`;
          slot.style.height     = nxtH.scrollHeight + 'px';
        }

        if (eyebrow) {
          eyebrow.style.transition = 'opacity 0.35s ease';
          eyebrow.style.opacity    = '0';
          setTimeout(() => {
            eyebrow.textContent   = slides[next].eyebrow;
            eyebrow.style.opacity = '1';
          }, 280);
        }

        hero.classList.toggle('is-active', next === 1);
        setTimeout(() => { animating = false; }, 800);
        current = next;
      });
    });
  }

  setInterval(() => goTo(current === 0 ? 1 : 0), INTERVAL);
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