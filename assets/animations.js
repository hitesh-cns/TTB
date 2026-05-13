/**
 * =
 * ANIMATIONS.JS — Baby Elegance
 * Apple-style scroll-driven animations using IntersectionObserver
 * =
 */

(function () {
  'use strict';

  // -- 1. SCROLL REVEAL --
  // Watches every [data-reveal] element. When it enters the viewport,
  // adds .is-revealed which CSS transitions to full opacity/position.
  // --
  function initScrollReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);   // fire once only
          }
        });
      },
      {
        threshold: 0.12,          // trigger when 12% visible
        rootMargin: '0px 0px -40px 0px'   // small offset from bottom
      }
    );

    els.forEach(el => observer.observe(el));
  }

  // -- 2. AUTO-STAGGER GRID CHILDREN --
  // Finds grids with [data-stagger-children] and auto-assigns
  // data-stagger="0/1/2…" to immediate children so they cascade in.
  // --
  function initStaggerGrids() {
    document.querySelectorAll('[data-stagger-children]').forEach(grid => {
      const children = grid.querySelectorAll(
        '[data-reveal]'
      );
      children.forEach((child, i) => {
        child.setAttribute('data-stagger', Math.min(i, 6));
      });
    });
  }

  // -- 3. PARALLAX HERO --
  // Subtle vertical offset on hero background images as user scrolls.
  // 30% of scroll distance = same Apple-ish depth without JS-jank.
  // --
  function initParallax() {
    const heroImgs = document.querySelectorAll('.hero-bg, .about-hero__img, .article-hero__img');
    if (!heroImgs.length) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          heroImgs.forEach(img => {
            const parent = img.closest('[data-parallax]') || img.parentElement;
            const rect   = parent.getBoundingClientRect();
            const vh     = window.innerHeight;
            if (rect.bottom < 0 || rect.top > vh) return;   // off-screen

            const progress = (vh - rect.top) / (vh + rect.height);
            const offset   = (progress - 0.5) * 80;  // ±40px max shift
            img.style.transform = `translateY(${offset}px) scale(1.1)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();   // run once on load
  }

  // -- 4. ANIMATED COUNTERS --
  // Elements with [data-count-to="N"] animate from 0 → N when revealed.
  // --
  function initCounters() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const target  = parseInt(el.dataset.countTo, 10);
        const suffix  = el.dataset.countSuffix || '';
        const dur     = parseInt(el.dataset.countDur, 10) || 1400;
        const start   = performance.now();

        function step(now) {
          const pct  = Math.min((now - start) / dur, 1);
          // Ease out cubic
          const ease = 1 - Math.pow(1 - pct, 3);
          el.textContent = Math.round(ease * target) + suffix;
          if (pct < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  // ============================================================
  // SECTION 5: MEGA MENU
  // ============================================================
  //
  // HOW IT WORKS — TWO SEPARATE MODES:
  //
  // DESKTOP (mouse pointer):
  //   CSS :hover on .nav-item--mega drives show/hide entirely.
  //   The <li> stretches to full header height (align-items:stretch
  //   on the nav-list) so the cursor moving down into the panel
  //   never exits the li's DOM subtree — no mouseleave, no flicker.
  //   body.is-touch is NOT set, so the :hover CSS rules apply.
  //
  // IPAD / TOUCH (pointer: coarse):
  //   iPad Safari has "sticky hover" — once a finger taps an element,
  //   Safari applies :hover to it and KEEPS IT even after the finger
  //   lifts. This means our "tap again to close" logic fails:
  //     - JS removes .is-open → panel should hide
  //     - BUT Safari's sticky :hover re-shows it immediately → flicker
  //
  //   Fix: as soon as ANY touch is detected, we add 'is-touch' to
  //   <body>. The CSS scopes :hover rules to body:not(.is-touch),
  //   disabling them completely on touch devices. ONLY .is-open
  //   (added/removed by this JS) controls panel visibility on touch.
  //   This eliminates the hover/JS race condition entirely.
  //
  // ============================================================
  function initMegaMenu() {
    const megaItems = document.querySelectorAll('.nav-item--mega');
    if (!megaItems.length) return;

    // ── Touch detection ──────────────────────────────────────
    // We add 'is-touch' to body on the first touchstart event.
    // This is more reliable than matchMedia('pointer:coarse')
    // because some iPads with a mouse return 'fine' pointer.
    let touchMode = false;
    function enableTouchMode() {
      if (touchMode) return;
      touchMode = true;
      document.body.classList.add('is-touch');
    }
    // Fire immediately if device is already known to be touch
    if (window.matchMedia('(pointer: coarse)').matches) {
      enableTouchMode();
    }
    window.addEventListener('touchstart', enableTouchMode, { once: true, passive: true });

    // ── Close all panels ─────────────────────────────────────
    function closeAll() {
      megaItems.forEach(item => {
        item.classList.remove('is-open');
        const link = item.querySelector('.nav-link');
        if (link) link.setAttribute('aria-expanded', 'false');
      });
    }

    // ── Per-item setup ───────────────────────────────────────
    megaItems.forEach(item => {
      const link = item.querySelector('.nav-link');
      if (!link) return;

      // TOUCH: tap nav link → toggle .is-open
      // First tap  → open panel (navigate is prevented)
      // Second tap → close panel
      // Tap outside → closeAll() via document listener below
      link.addEventListener('click', e => {
        if (!touchMode) return; // let desktop clicks navigate normally
        e.preventDefault();
        const wasOpen = item.classList.contains('is-open');
        closeAll();
        if (!wasOpen) {
          item.classList.add('is-open');
          link.setAttribute('aria-expanded', 'true');
        }
      });

      // MOUSE: update aria-expanded to mirror CSS :hover state
      // (CSS handles actual show/hide — this is for screen readers only)
      item.addEventListener('mouseenter', () => {
        if (!touchMode) link.setAttribute('aria-expanded', 'true');
      });
      item.addEventListener('mouseleave', () => {
        if (!touchMode) link.setAttribute('aria-expanded', 'false');
      });
    });

    // ── Global close triggers ────────────────────────────────
    // Touch: tapping anywhere outside a mega item closes all panels
    document.addEventListener('touchstart', e => {
      if (!e.target.closest('.nav-item--mega')) closeAll();
    }, { passive: true });

    // Keyboard: ESC closes all panels (accessibility)
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeAll();
    });
  }

  // -- 6. SMOOTH HOVER IMAGE TILT --
  // Subtle 3-D tilt on product cards — the Apple "hover depth" feel.
  // Only fires on non-touch devices.
  // --
  function initCardTilt() {
    if ('ontouchstart' in window) return;   // skip on touch devices

    const cards = document.querySelectorAll('.collection-product-card, .blog-featured');
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const r    = card.getBoundingClientRect();
        const x    = (e.clientX - r.left) / r.width  - 0.5;
        const y    = (e.clientY - r.top)  / r.height - 0.5;
        const rotX = y * -5;  // max 5° tilt
        const rotY = x *  5;
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // -- 7. SECTION HEADINGS — line-draw on reveal --
  // Headings inside sections trigger the CSS underline animation.
  // --
  function initHeadingReveal() {
    const headings = document.querySelectorAll('.section-heading');
    if (!headings.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    headings.forEach(h => observer.observe(h));
  }

  // -- 8. ADD data-reveal ATTRIBUTES TO KNOWN SECTIONS --
  // Auto-instruments the existing HTML so we don't have to touch every
  // section file individually. Targets the most impactful elements.
  // --
  function autoInstrument() {
    // Section headers
    document.querySelectorAll('.section-header').forEach(el => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'up');
    });

    // Product grid cards — stagger
    document.querySelectorAll('.collection-grid, .blog-grid, .about-values__grid, .about-team__grid').forEach(grid => {
      grid.setAttribute('data-stagger-children', '');
      grid.querySelectorAll('.collection-product-card, .blog-card, .about-value-card, .team-card').forEach(card => {
        if (!card.hasAttribute('data-reveal')) card.setAttribute('data-reveal', 'up');
      });
    });

    // Featured article hero
    document.querySelectorAll('.blog-featured').forEach(el => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'up');
    });

    // Testimonials
    document.querySelectorAll('.testimonial-card').forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'up');
        el.setAttribute('data-stagger', Math.min(i, 6));
      }
    });

    // Policy summary cards
    document.querySelectorAll('.policy-summary-card').forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'scale');
        el.setAttribute('data-stagger', Math.min(i, 6));
      }
    });

    // About story text + image
    document.querySelectorAll('.about-story__text').forEach(el => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'left');
    });
    document.querySelectorAll('.about-story__image').forEach(el => {
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'right');
    });

    // Contact info cards
    document.querySelectorAll('.contact-info-card').forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'up');
        el.setAttribute('data-stagger', Math.min(i, 6));
      }
    });

    // Trust strip items
    document.querySelectorAll('.footer-trust__item').forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'up');
        el.setAttribute('data-stagger', Math.min(i, 6));
      }
    });

    // FAQ items — blur reveal
    document.querySelectorAll('.faq-item').forEach((el, i) => {
      if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', 'up');
        el.setAttribute('data-stagger', Math.min(i % 6, 6));
      }
    });
  }

  // -- 9. PAGE TRANSITION --
  // Quick fade-in on navigation between pages (feels snappier).
  // --
  function initPageTransition() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.35s ease';
    window.addEventListener('load', () => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });

    document.querySelectorAll('a[href]').forEach(a => {
      // Only internal same-origin links, not hash/mailto/blank
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') ||
          href.startsWith('tel') || a.target === '_blank') return;
      if (href.startsWith('http') && !href.includes(location.hostname)) return;

      a.addEventListener('click', e => {
        // Skip modified clicks
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        document.body.style.opacity = '0';
        setTimeout(() => { window.location.href = a.href; }, 280);
      });
    });
  }

  // -- INIT ALL --
  function init() {
    autoInstrument();
    initStaggerGrids();
    initScrollReveal();
    initHeadingReveal();
    initParallax();
    initCounters();
    initMegaMenu();
    initCardTilt();
    // Page transitions are lovely but can interfere with cart/forms — opt-in via body class
    if (document.body.classList.contains('enable-page-transitions')) {
      initPageTransition();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
