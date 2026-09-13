/* ==============================================
   BABY ELEGANCE THEME — theme.js
   ============================================== */

(function () {
  'use strict';

  /* ---- Header Scroll ----
     (removed) This used to toggle `.is-scrolled` on #site-header, but no
     CSS rule ever matched `.site-header.is-scrolled` — the only shadow
     rule is `#sticky-bar.is-scrolled .site-header`, driven by the
     rAF-throttled handler in the GLOBAL UI block below. This listener was
     dead weight: an unthrottled DOM write on every scroll event that,
     together with the other scroll listeners, caused layout thrash and
     the transparent→solid header flicker. All scroll-driven header state
     now lives in one rAF-throttled handler further down this file. */

  /* ---- Mobile Menu ---- */
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', open);
    });
  }

  /* ---- Search Overlay ---- */
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', () => searchOverlay.classList.add('is-open'));
    searchClose && searchClose.addEventListener('click', () => searchOverlay.classList.remove('is-open'));
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) searchOverlay.classList.remove('is-open');
    });
  }

  /* ---- Cart Drawer ---- */
  const cartToggle = document.getElementById('cart-toggle');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartClose = document.getElementById('cart-drawer-close');

  function openCart() {
    cartDrawer && cartDrawer.setAttribute('aria-hidden', 'false');
    cartOverlay && cartOverlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    fetchCart();
  }

  function closeCart() {
    cartDrawer && cartDrawer.setAttribute('aria-hidden', 'true');
    cartOverlay && cartOverlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  }

  cartToggle && cartToggle.addEventListener('click', openCart);
  cartClose && cartClose.addEventListener('click', closeCart);
  cartOverlay && cartOverlay.addEventListener('click', closeCart);

  /* ---- Cart API ---- */
  async function fetchCart() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      renderCart(cart);
      updateDiscountUI(cart);
    } catch (e) { console.error('Cart fetch error:', e); }
  }

  function renderCart(cart) {
    const itemsEl  = document.getElementById('cart-drawer-items');
    const emptyEl  = document.getElementById('cart-empty');
    const footer   = document.getElementById('cart-drawer-footer');
    const countEl  = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('cart-subtotal-price');

    if (countEl) {
      const prevCount = countEl.textContent;
      countEl.textContent = cart.item_count;
      if (cart.item_count > 0 && String(cart.item_count) !== prevCount) {
        countEl.classList.remove('cart-count--bump');
        void countEl.offsetWidth; // restart animation if already mid-bump
        countEl.classList.add('cart-count--bump');
      }
    }

    // Remove all existing cart-item elements first
    itemsEl && itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

    if (!cart.item_count) {
      // Cart is empty: show empty state, hide footer
      if (emptyEl)  { emptyEl.style.display  = 'flex'; }
      if (footer)   { footer.style.display   = 'none'; }
      return;
    }

    // Cart has items: hide empty state, show footer
    if (emptyEl)  { emptyEl.style.display  = 'none'; }
    if (footer)   { footer.style.display   = 'flex'; }
    if (subtotalEl) subtotalEl.textContent = formatMoney(cart.total_price);

    // Render each cart item BEFORE the emptyEl node
    cart.items.forEach(item => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.dataset.key = item.key;
      itemEl.innerHTML = `
        <div class="cart-item__image">
          ${item.image ? `<img src="${item.image}" alt="${escHtml(item.product_title)}" loading="lazy">` : ''}
        </div>
        <div class="cart-item__info">
          <p class="cart-item__title">${escHtml(item.product_title)}</p>
          ${item.variant_title && item.variant_title !== 'Default Title' ? `<p class="cart-item__variant">${escHtml(item.variant_title)}</p>` : ''}
          <div class="cart-item__controls">
            <div class="cart-item__qty">
              <button class="qty-btn qty-btn--minus" data-key="${item.key}" data-qty="${item.quantity - 1}" aria-label="Remove one">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn qty-btn--plus" data-key="${item.key}" data-qty="${item.quantity + 1}" aria-label="Add one">+</button>
            </div>
            <span class="cart-item__price">${formatMoney(item.final_line_price)}</span>
          </div>
        </div>
      `;
      // Insert before emptyEl so empty state stays at the bottom of the DOM
      if (emptyEl && emptyEl.parentNode === itemsEl) {
        itemsEl.insertBefore(itemEl, emptyEl);
      } else {
        itemsEl && itemsEl.appendChild(itemEl);
      }
    });

    // Attach quantity button handlers
    itemsEl && itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const key = btn.dataset.key;
        const qty = Math.max(0, parseInt(btn.dataset.qty, 10));
        await updateCartItem(key, qty);
      });
    });
  }

  function escHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  async function updateCartItem(key, quantity) {
    try {
      const res = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity })
      });
      const cart = await res.json();
      renderCart(cart);
      updateDiscountUI(cart);
    } catch (e) { console.error('Update error:', e); }
  }

  /* ---- Quick Add ---- */
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-quick-add');
    if (!btn) return;
    const variantId = btn.dataset.variantId;
    if (!variantId) return;

    btn.textContent = 'Adding...';
    btn.disabled = true;

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      });
      if (res.ok) {
        btn.textContent = 'Added ✓';
        await fetchCart();
        openCart();
        setTimeout(() => { btn.textContent = 'Quick Add'; btn.disabled = false; }, 2000);
      }
    } catch (e) {
      btn.textContent = 'Quick Add';
      btn.disabled = false;
    }
  });

  /* ---- Discount Engine ----
     Only items with metafield custom.discount = "BXGY" count toward
     bundle tiers. Eligible product IDs are injected into the page as
     window.bxgyProductIds by cart-drawer.liquid using Liquid.
     If the list is empty or not defined, ALL items count (fallback). */
  const DISCOUNT_TIERS = [
    { qty: 2, pct: 5,  label: '5% off',  code: 'BUNDLE5'  },
    { qty: 3, pct: 10, label: '10% off', code: 'BUNDLE10' },
    { qty: 5, pct: 20, label: '20% off', code: 'BUNDLE20' },
  ];

  function getBxgyCount(cart) {
    const eligible = window.bxgyProductIds;
    // If metafield list is not set or empty, count all items (graceful fallback)
    if (!eligible || eligible.length === 0) return cart.item_count;
    let count = 0;
    (cart.items || []).forEach(item => {
      if (eligible.includes(item.product_id)) count += item.quantity;
    });
    return count;
  }

  function getCurrentTier(qty) {
    let tier = null;
    for (const t of DISCOUNT_TIERS) { if (qty >= t.qty) tier = t; }
    return tier;
  }

  function getNextTier(qty) {
    for (const t of DISCOUNT_TIERS) { if (qty < t.qty) return t; }
    return null;
  }

  // Maps the 3 tier nodes in the cart drawer to their unlock quantities
  const TIER_NODES = [
    { id: 'tier-node-1', unlockAt: 2  },  // 5% off at 2 items
    { id: 'tier-node-2', unlockAt: 3  },  // 10% off at 3 items
    { id: 'tier-node-3', unlockAt: 5  },  // 20% off at 5 items
  ];

  function updateDiscountUI(cart) {
    // Use BXGY-eligible count for tier calculation, not total item_count
    const qty = getBxgyCount(cart);
    const currentTier = getCurrentTier(qty);
    const nextTier = getNextTier(qty);

    // -- Tier node icons — light up when threshold is reached --
    TIER_NODES.forEach(node => {
      const el = document.getElementById(node.id);
      if (el) el.classList.toggle('is-unlocked', qty >= node.unlockAt);
    });

    // -- Progress bar message (fill% set after PBN block above) --
    const msgEl  = document.getElementById('cart-discount-message');
    const fillEl = document.getElementById('cart-discount-fill');
    if (msgEl) {
      if (currentTier && !nextTier) {
        msgEl.innerHTML = `🎉 <strong>${currentTier.label}</strong> applied to your order!`;
      } else if (nextTier) {
        const need = nextTier.qty - qty;
        const verb = currentTier ? 'unlock' : 'get';
        msgEl.innerHTML = `Add <strong>${need}</strong> more item${need !== 1 ? 's' : ''} to ${verb} <strong>${nextTier.label}</strong>`;
      } else {
        msgEl.innerHTML = '';
      }
    }

    // -- Discount applied badge --
    const appliedEl = document.getElementById('cart-discount-applied');
    const labelEl   = document.getElementById('cart-discount-label');
    if (appliedEl && labelEl) {
      if (currentTier) {
        appliedEl.style.display = 'block';
        labelEl.textContent = currentTier.label;
      } else {
        appliedEl.style.display = 'none';
      }
    }

    // -- Pre-fill discount code in checkout URL --
    // Shopify accepts /checkout?discount=CODE and auto-applies it at checkout.
    // This way the customer sees the discount already applied when they land
    // on the checkout page — no manual entry required.
    //
    // For TRUE automatic discounts (no code at all), create Automatic Discounts
    // in Shopify Admin → Discounts → Create → Automatic discount.
    // --
    const checkoutBtns = document.querySelectorAll(
      '#checkout-btn, .cart-page__checkout-btn, .cps-checkout'
    );
    checkoutBtns.forEach(btn => {
      if (currentTier && currentTier.code) {
        btn.href = `/checkout?discount=${currentTier.code}`;
        btn.setAttribute('aria-label', `Checkout with ${currentTier.label} applied`);
      } else {
        btn.href = '/checkout';
        btn.removeAttribute('aria-label');
      }
    });

    // -- PDP bundle nudge tier pills — light up with cart progress --
    const PBN_TIERS = [
      { id: 'pbn-tier-1', threshold: 2 },
      { id: 'pbn-tier-2', threshold: 3 },
      { id: 'pbn-tier-3', threshold: 5 },
    ];
    PBN_TIERS.forEach(t => {
      const el = document.getElementById(t.id);
      if (el) el.classList.toggle('is-active', qty >= t.threshold);
    });

    // -- Progress bar fill: maps qty to 0-100% across the 3 nodes --
    // Node positions: 0%=node1(2items), 50%=node2(3items), 100%=node3(5items)
    if (fillEl) {
      let fillPct = 0;
      if (qty >= 5)      fillPct = 100;
      else if (qty >= 3) fillPct = 50 + ((qty - 3) / (5 - 3)) * 50;
      else if (qty >= 2) fillPct = ((qty - 2) / (3 - 2)) * 50;
      else               fillPct = (qty / 2) * 8; // tiny pre-tier-1 hint
      fillEl.style.width = Math.min(100, fillPct) + '%';
    }

    // Section progress bar
    const progText = document.getElementById('discount-progress-text');
    const progFill = document.getElementById('discount-progress-fill');
    if (progText && progFill) {
      if (!qty) {
        progText.textContent = 'Add items to unlock savings';
        progFill.style.width = '0%';
      } else if (currentTier && !nextTier) {
        progText.textContent = `Maximum discount unlocked — ${currentTier.label} applied!`;
        progFill.style.width = '100%';
      } else if (nextTier) {
        const need = nextTier.qty - qty;
        progText.textContent = `${qty} in cart — add ${need} more for ${nextTier.label}`;
        progFill.style.width = `${(qty / nextTier.qty) * 100}%`;
      }
    }

    // Show popup when close to a tier
    if (nextTier && (nextTier.qty - qty) === 1) {
      showDiscountPopup(nextTier, cart.total_price);
    }
  }

  /* ---- Discount Popup ---- */
  const discountPopup = document.getElementById('discount-popup');
  const discountPopupClose = document.getElementById('discount-popup-close');
  let popupTimeout;

  function showDiscountPopup(tier, totalPrice) {
    const headingEl = document.getElementById('discount-popup-heading');
    const textEl = document.getElementById('discount-popup-text');
    const fillEl = document.getElementById('discount-popup-fill');

    if (headingEl) headingEl.textContent = `You're so close!`;
    if (textEl) textEl.textContent = `Add 1 more item to unlock ${tier.label} on your order`;
    if (fillEl) fillEl.style.width = `${((tier.qty - 1) / tier.qty) * 100}%`;

    if (discountPopup) {
      discountPopup.setAttribute('aria-hidden', 'false');
      clearTimeout(popupTimeout);
      popupTimeout = setTimeout(() => {
        discountPopup && discountPopup.setAttribute('aria-hidden', 'true');
      }, 6000);
    }
  }

  discountPopupClose && discountPopupClose.addEventListener('click', () => {
    discountPopup.setAttribute('aria-hidden', 'true');
  });

  /* ---- Generic Carousel ---- */
  function initCarousel({ trackId, prevId, nextId, dotsId, slidesPerView = 1 }) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsId);
    if (!track) return;

    const slides = Array.from(track.children);
    if (!slides.length) return;

    let current = 0;
    let autoplayInterval;
    let isDragging = false;
    let startX = 0;
    let dragDelta = 0;

    function totalSlides() {
      return Math.ceil(slides.length / slidesPerView);
    }

    function goTo(index) {
      const total = totalSlides();
      current = ((index % total) + total) % total;
      const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(track).gap || 0);
      track.style.transform = `translateX(-${current * slideWidth * slidesPerView}px)`;
      updateDots();
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides(); i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      }
      updateDots();
    }

    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === current);
      });
    }

    function startAutoplay() {
      clearInterval(autoplayInterval); // avoid stacking intervals if hover/focus overlap
      autoplayInterval = setInterval(() => goTo(current + 1), 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }

    prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); stopAutoplay(); startAutoplay(); });
    nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1); stopAutoplay(); startAutoplay(); });

    // Touch/drag
    track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) { delta < 0 ? goTo(current + 1) : goTo(current - 1); }
      startAutoplay();
    }, { passive: true });

    // Pause auto-advance while the user is hovering or has keyboard focus
    // inside the carousel (slides or arrow controls); resume on leave.
    const carouselWrap = track.parentElement;
    if (carouselWrap) {
      carouselWrap.addEventListener('mouseenter', stopAutoplay);
      carouselWrap.addEventListener('mouseleave', startAutoplay);
      carouselWrap.addEventListener('focusin', stopAutoplay);
      carouselWrap.addEventListener('focusout', (e) => {
        if (!carouselWrap.contains(e.relatedTarget)) startAutoplay();
      });
    }

    buildDots();
    startAutoplay();

    window.addEventListener('resize', () => {
      buildDots();
      goTo(current);
    });
  }

  /* ---- Init Carousels ---- */
  initCarousel({
    trackId: 'discount-track',
    prevId: 'discount-prev',
    nextId: 'discount-next',
    dotsId: 'discount-dots',
    slidesPerView: 1
  });

  initCarousel({
    trackId: 'testimonials-track',
    prevId: 'testimonials-prev',
    nextId: 'testimonials-next',
    dotsId: 'testimonials-dots',
    slidesPerView: 1
  });

  /* ---- Utilities ---- */
  // ============================================================
  // FORMAT MONEY — uses shop currency from Shopify Markets
  // ============================================================
  // window.moneyFormat is set in layout/theme.liquid from
  // {{ shop.money_format }}, which Shopify automatically
  // localises when you have Markets / multi-currency enabled.
  // Format string looks like: "₹{{amount}}" or "${{amount}}"
  // ============================================================
  function formatMoney(cents) {
    const amount = (cents / 100).toFixed(2);
    const fmt = window.moneyFormat || '{{amount}}';

    // Shopify format tokens: {{amount}}, {{amount_no_decimals}},
    // {{amount_with_comma_separator}}, {{amount_no_decimals_with_comma_separator}}
    return fmt
      .replace('{{amount_no_decimals_with_comma_separator}}', Math.round(cents / 100).toLocaleString('en-IN'))
      .replace('{{amount_with_comma_separator}}', (cents / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 }))
      .replace('{{amount_no_decimals}}', Math.round(cents / 100).toString())
      .replace('{{amount}}', amount);
  }

  /* ---- Animate on Scroll ---- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.product-card, .collection-card, .testimonial-card, .discount-card, .trust-card').forEach((el, i) => {
    if (prefersReducedMotion) return;   // leave fully visible, no animated reveal
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    el.style.transitionDelay = (Math.min(i, 6) * 80) + 'ms';   // slight stagger instead of firing all at once
    observer.observe(el);
  });

  document.addEventListener('is-visible', () => {}, true);

  const styleObserver = new MutationObserver(() => {});

  // Manual visibility toggle
  const visibleStyle = document.createElement('style');
  visibleStyle.textContent = `.is-visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(visibleStyle);

  /* ---- Expose cart functions globally for use by other scripts ---- */
  window.fetchCart = fetchCart;
  window.renderCart = renderCart;

  /* ---- Initial Cart Load ---- */
  fetchCart();

})();

/* ================================================================
   GLOBAL UI — Search, Mobile Drawer, Back-to-Top, Lightbox
   ================================================================
   This block wires up all the interactive header + page elements.
   It runs once on every page.
   ================================================================ */
(function () {
  'use strict';

  /* -- Measure #sticky-bar height so sidebar top-offset is correct -- */
  function setStickyBarHeight() {
    const bar = document.getElementById('sticky-bar');
    if (bar) {
      document.documentElement.style.setProperty(
        '--sticky-bar-height', bar.offsetHeight + 'px'
      );
    }
  }
  setStickyBarHeight();
  window.addEventListener('resize', setStickyBarHeight, { passive: true });

  /* ============================================================
     SCROLL STATE — one rAF-throttled handler for all header /
     page-chrome state that reacts to scroll position:
       1. Sticky-bar shadow after 4px            (all pages)
       2. Transparent-header solidify past hero  (home page only)
       3. Back-to-top button visibility          (all pages)
     ============================================================
     WHY ONE HANDLER: previously these were three separate
     unthrottled scroll listeners (plus a dead fourth on
     #site-header). Each scroll tick did interleaved layout
     reads/writes — including reading hero.offsetHeight *every
     tick* — which forced repeated reflows and, together with the
     old .hero-bg parallax transform writes, made
     body.header-scrolled toggle on/off right at the threshold:
     the transparent→solid header flicker.

     FIX: cache the hero threshold (recompute on load/resize only),
     and run a single passive listener that batches every read +
     class write into one requestAnimationFrame callback.
     ============================================================ */
  const stickyBar   = document.getElementById('sticky-bar');
  const heroSection = document.getElementById('hero-section');
  const backToTop   = document.getElementById('back-to-top');
  const isTransparentHeader = document.body.classList.contains('has-transparent-header');

  // Cached layout value — hero height minus sticky-bar height, i.e.
  // the scrollY at which the hero image has fully left the viewport.
  // Recomputed only on load/resize, never inside the scroll handler.
  let heroThreshold = 80; // fallback until measured
  function measureHeroThreshold() {
    const stickyH = stickyBar ? stickyBar.offsetHeight : 0;
    if (heroSection) heroThreshold = heroSection.offsetHeight - stickyH;
  }
  measureHeroThreshold();
  window.addEventListener('resize', measureHeroThreshold, { passive: true });
  window.addEventListener('load', measureHeroThreshold);

  let scrollTicking = false;
  function applyScrollState() {
    scrollTicking = false;
    const scrollY = window.scrollY;

    // 1. Sticky-bar shadow (all pages)
    if (stickyBar) {
      stickyBar.classList.toggle('is-scrolled', scrollY > 4);
    }

    // 2. Transparent header → solid once the hero has scrolled past
    //    (home page only). Compared against the cached threshold so
    //    this branch does zero layout reads.
    if (isTransparentHeader) {
      document.body.classList.toggle('header-scrolled', scrollY >= heroThreshold);
    }

    // 3. Back-to-top button — visible past 70% of page height
    if (backToTop) {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      backToTop.classList.toggle('is-visible', total > 0 && scrollY / total >= 0.7);
    }
  }
  function onScroll() {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(applyScrollState);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once immediately in case the page loads mid-scroll (e.g. back navigation)
  applyScrollState();

  /* -- SEARCH BAR --
     Clicking the search icon reveals a 100px bar below the header.
     The search icon itself always stays visible; a small filled dot
     appears on top of it to indicate the bar is open.
     Pressing Escape or clicking the icon again closes the bar.
  -- */
  const searchToggle = document.getElementById('search-toggle');
  const searchBar    = document.getElementById('header-search-bar');
  const searchInput  = document.getElementById('header-search-input');
  const searchClear  = document.getElementById('header-search-clear');

  /* Add indicator dot to the search button */
  if (searchToggle) {
    const dot = document.createElement('span');
    dot.className = 'search-open-dot';
    dot.setAttribute('aria-hidden', 'true');
    searchToggle.appendChild(dot);
  }

  function openSearch() {
    searchBar && searchBar.classList.add('is-open');
    searchBar && searchBar.setAttribute('aria-hidden', 'false');
    searchToggle && searchToggle.setAttribute('aria-expanded', 'true');
    searchToggle && searchToggle.classList.add('is-open');

    // Focus immediately — must be synchronous within the click handler so iOS
    // recognises it as a user gesture and opens the virtual keyboard.
    // A setTimeout (even 0ms) would break the gesture chain on mobile browsers.
    if (searchInput) {
      searchInput.focus({ preventScroll: true });
      // Belt-and-suspenders for older iOS: also trigger focus after the CSS
      // transition frame in case the element wasn't yet layout-visible.
      requestAnimationFrame(() => searchInput.focus({ preventScroll: true }));
    }
  }
  function closeSearch() {
    searchBar && searchBar.classList.remove('is-open');
    searchBar && searchBar.setAttribute('aria-hidden', 'true');
    searchToggle && searchToggle.setAttribute('aria-expanded', 'false');
    searchToggle && searchToggle.classList.remove('is-open');
  }

  searchToggle && searchToggle.addEventListener('click', () => {
    searchBar && searchBar.classList.contains('is-open') ? closeSearch() : openSearch();
  });
  searchClear && searchClear.addEventListener('click', () => {
    if (searchInput) { searchInput.value = ''; searchInput.focus(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  /* -- MOBILE DRAWER --
     The 3-line hamburger opens a panel from the LEFT side.
     Tap the × or the dark overlay to close it.
  -- */
  const mobileToggle  = document.getElementById('mobile-menu-toggle');
  const drawer        = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('mobile-drawer-overlay');
  const drawerClose   = document.getElementById('mobile-drawer-close');

  function openDrawer() {
    drawer && drawer.setAttribute('aria-hidden', 'false');
    drawerOverlay && drawerOverlay.classList.add('is-visible');
    mobileToggle && mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer && drawer.setAttribute('aria-hidden', 'true');
    drawerOverlay && drawerOverlay.classList.remove('is-visible');
    mobileToggle && mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  mobileToggle  && mobileToggle.addEventListener('click', openDrawer);
  drawerClose   && drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay && drawerOverlay.addEventListener('click', closeDrawer);

  /* Sub-menus inside the drawer accordion */
  document.querySelectorAll('.mobile-nav-group__trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      const grp = btn.closest('.mobile-nav-group');
      grp && grp.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', grp.classList.contains('is-open'));
    });
  });

  /* -- BACK TO TOP --
     Visibility (shows past 70% of page height) is handled by the
     shared rAF-throttled scroll handler in the SCROLL STATE block
     above. Here we only wire the click-to-scroll behaviour. -- */
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* -- REVIEW LIGHTBOX --
     Clicking a .review-image-thumb opens it full-screen.
  -- */
  const lightbox      = document.getElementById('review-lightbox');
  const lightboxImg   = document.getElementById('review-lightbox-img');
  const lightboxClose = document.getElementById('review-lightbox-close');

  document.addEventListener('click', e => {
    const thumb = e.target.closest('.review-image-thumb');
    if (thumb && lightbox && lightboxImg) {
      const img = thumb.querySelector('img');
      if (img) {
        lightboxImg.src = img.src.replace('300x300', '1200x');
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      }
    }
  });
  const closeLightbox = () => {
    lightbox && lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightbox && lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

})();

/* ================================================================
   SCROLLABLE PRODUCT IMAGE DOTS
   ================================================================
   Watches each scrollable image strip and updates the dot
   indicators as the user swipes/scrolls through images.
   Uses IntersectionObserver for smooth, performant updates.
   ================================================================ */
(function () {
  'use strict';

  function initImageScrollDots(scrollEl, dotsEl) {
    if (!scrollEl || !dotsEl) return;
    const images = Array.from(scrollEl.querySelectorAll('.product-card__image-link, .cpc-image-link'));
    const dots   = Array.from(dotsEl.querySelectorAll('.scroll-dot'));
    if (!images.length || !dots.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = images.indexOf(entry.target);
          if (idx === -1) return;
          dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
        }
      });
    }, { root: scrollEl, threshold: 0.6 });

    images.forEach(img => observer.observe(img));
  }

  /* Wire up all product cards on the current page */
  function initAllCards() {
    /* Homepage / snippet cards */
    document.querySelectorAll('.product-card__image-wrap').forEach(wrap => {
      const scroll = wrap.querySelector('.product-card__image-scroll');
      const dots   = wrap.querySelector('.product-card__scroll-dots');
      initImageScrollDots(scroll, dots);
    });

    /* Collection page cards */
    document.querySelectorAll('.cpc-image-wrap').forEach(wrap => {
      const scroll = wrap.querySelector('.cpc-image-scroll');
      const dots   = wrap.querySelector('.cpc-scroll-dots');
      initImageScrollDots(scroll, dots);
    });
  }

  /* Run on load and again after any dynamic content changes */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllCards);
  } else {
    initAllCards();
  }

})();

/* ================================================================
   COLLECTION CARDS — Carousel, Swatch Image Mapping, Arrow Keys
   ================================================================ */
(function () {
  'use strict';

  function initCarousel(wrap) {
    let images;
    try { images = JSON.parse(wrap.dataset.images || '[]'); } catch(e) { return; }
    if (!images.length) return;

    let idx = 0;
    let activeImages = images.slice();
    const img     = wrap.querySelector('.cpc-img');
    const dotsEl  = wrap.querySelector('.cpc-dots-container');
    const prevBtn = wrap.querySelector('.cpc-arrow--prev');
    const nextBtn = wrap.querySelector('.cpc-arrow--next');

    function renderDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = activeImages.map((_, i) =>
        `<span class="cpc-dot${i === idx ? ' is-active' : ''}"></span>`
      ).join('');
    }

    function goTo(newIdx) {
      if (!img || !activeImages.length) return;
      idx = ((newIdx % activeImages.length) + activeImages.length) % activeImages.length;
      img.style.opacity = '0';
      setTimeout(() => { img.src = activeImages[idx]; img.style.opacity = '1'; }, 200);
      renderDots();
    }

    prevBtn && prevBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); goTo(idx - 1); });
    nextBtn && nextBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); goTo(idx + 1); });

    renderDots();
    wrap._carousel = {
      goTo,
      setImages(arr) { activeImages = arr.slice(); idx = 0; renderDots(); if (img && arr[0]) goTo(0); },
      get defaultImages() { return images.slice(); }
    };
  }

  function initAll() {
    document.querySelectorAll('.cpc-image-wrap[data-images]').forEach(initCarousel);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initAll) : initAll();

  // Arrow key nav when hovering image container
  let hoveredCard = null;
  document.addEventListener('mouseover', e => {
    const w = e.target.closest('.cpc-image-wrap');
    hoveredCard = w ? w.closest('.collection-product-card') : null;
  });
  document.addEventListener('keydown', e => {
    if (!hoveredCard || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    const swatches = Array.from(hoveredCard.querySelectorAll('.cpc-color-swatch'));
    if (swatches.length < 2) return;
    const ai = swatches.findIndex(s => s.classList.contains('is-selected'));
    swatches[e.key === 'ArrowRight' ? (ai + 1) % swatches.length : (ai - 1 + swatches.length) % swatches.length].click();
    e.preventDefault();
  });

})();

/* ================================================================
   COLLECTION CARDS — Add to Cart + Size Sheet
   ================================================================ */
(function () {
  'use strict';

  const backdrop        = document.getElementById('size-sheet-backdrop');
  const sheet           = document.getElementById('size-sheet');
  const sheetThumb      = document.getElementById('size-sheet-thumb');
  const sheetName       = document.getElementById('size-sheet-name');
  const sheetColorDot   = document.getElementById('size-sheet-color-dot');
  const sheetColorLabel = document.getElementById('size-sheet-color-label');
  const sheetGrid       = document.getElementById('size-sheet-grid');

  let currentAddBtn = null;

  async function updateCartBadge() {
    try {
      const cart = await fetch('/cart.js').then(r => r.json());
      const count = cart.item_count || 0;
      document.querySelectorAll('[data-cart-count]').forEach(el => {
        el.textContent = count > 0 ? count : '';
        el.style.display = count > 0 ? 'flex' : 'none';
      });
    } catch(e) {}
  }

  async function confirmAddToCart(variantId, btn) {
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Adding…';
    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: [{ id: parseInt(variantId, 10), quantity: 1 }] })
      });
      if (res.ok) {
        const cartData = await fetch('/cart.js').then(r => r.json());
        if (typeof window.renderCart === 'function') window.renderCart(cartData);
        await updateCartBadge();
        const cartDrawer  = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartDrawer) void cartDrawer.offsetHeight;
        if (cartDrawer)  { cartDrawer.setAttribute('aria-hidden', 'false'); cartDrawer.classList.add('is-open'); }
        if (cartOverlay) cartOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
        btn.textContent = 'Added ✓';
        setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 2000);
      } else {
        btn.innerHTML = original; btn.disabled = false;
      }
    } catch(e) { btn.innerHTML = original; btn.disabled = false; }
  }

  function closeSheet() {
    if (!sheet || !backdrop) return;
    sheet.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
  }

  function openSheet(card, btn) {
    if (!sheet || !backdrop) return;

    currentAddBtn = btn;

    // Populate product context synchronously before animation
    const title = (card.querySelector('.cpc-title a') || card.querySelector('.cpc-title'))?.textContent?.trim() || '';
    const activeSwatch = card.querySelector('.cpc-color-swatch.is-selected');
    const colorName = activeSwatch ? (activeSwatch.dataset.color || '') : '';
    const activeImg = card.querySelector('.cpc-img');

    if (sheetName)       sheetName.textContent        = title;
    if (sheetColorLabel) sheetColorLabel.textContent   = colorName;
    if (sheetThumb && activeImg) { sheetThumb.src = activeImg.src; sheetThumb.alt = title; }
    if (sheetColorDot && activeSwatch) {
      sheetColorDot.style.backgroundColor = activeSwatch.style.backgroundColor || colorName.toLowerCase().replace(/\s+/g, '');
      sheetColorDot.style.borderColor = activeSwatch.style.borderColor || 'rgba(0,0,0,0.12)';
    }

    // Extract sizes from variants data
    const sizeIdx = parseInt(card.dataset.sizeOptionIndex ?? '-1', 10);
    let variants = [];
    try { variants = JSON.parse(card.dataset.variants || '[]'); } catch(e) {}

    const seenSizes = new Set();
    const sizes = [];
    variants.forEach(v => {
      let size;
      if (sizeIdx >= 0 && Array.isArray(v.options) && v.options[sizeIdx] !== undefined) {
        size = v.options[sizeIdx];
      } else if (v.title && v.title !== 'Default Title') {
        size = v.title;
      }
      if (size && !seenSizes.has(size)) {
        seenSizes.add(size);
        sizes.push({ size, variantId: v.id, available: v.available !== false });
      }
    });

    if (!sizes.length) {
      ['NB', '0-3M', '3-6M', '6-12M', '12-18M', '18-24M'].forEach(s => {
        sizes.push({ size: s, variantId: btn.dataset.variantId, available: true });
      });
    }

    // Build size pills synchronously
    if (sheetGrid) {
      sheetGrid.innerHTML = '';
      sizes.forEach(({ size, variantId, available }) => {
        const pill = document.createElement('button');
        pill.className = 'size-sheet__pill' + (available ? '' : ' is-unavailable');
        pill.textContent = size;
        pill.dataset.size = size;
        if (!available) pill.disabled = true;
        pill.addEventListener('click', () => {
          // Select instantly — no transition delay
          sheetGrid.querySelectorAll('.size-sheet__pill').forEach(p => p.classList.remove('is-selected'));
          pill.classList.add('is-selected');
          // Capture refs before closeSheet clears them
          const capturedVariantId = variantId;
          const capturedBtn = currentAddBtn;
          // Close immediately, fire add-to-cart non-blocking
          closeSheet();
          if (capturedVariantId && capturedBtn) confirmAddToCart(capturedVariantId, capturedBtn);
        });
        sheetGrid.appendChild(pill);
      });
    }

    // Start both transitions simultaneously in a single rAF
    requestAnimationFrame(() => {
      backdrop.classList.add('is-visible');
      sheet.classList.add('is-open');
    });
  }

  backdrop && backdrop.addEventListener('click', closeSheet);

  document.addEventListener('click', async e => {
    const btn = e.target.closest('.cpc-add-btn');
    if (!btn) return;
    e.stopPropagation();
    const card = btn.closest('.collection-product-card');
    if (!card) return;
    if (btn.dataset.hasVariants) {
      openSheet(card, btn);
    } else {
      if (btn.dataset.variantId) await confirmAddToCart(btn.dataset.variantId, btn);
    }
  });

  // Swatch click — ring toggle + variant update + carousel image filter
  function normColor(str) {
    return str.toLowerCase().replace(/[-_\s]+/g, '');
  }

  document.addEventListener('click', e => {
    const swatch = e.target.closest('.cpc-color-swatch');
    if (!swatch) return;
    const card = swatch.closest('.collection-product-card');
    if (!card) return;
    card.querySelectorAll('.cpc-color-swatch').forEach(s => {
      s.classList.remove('is-selected'); s.setAttribute('aria-pressed', 'false');
    });
    swatch.classList.add('is-selected');
    swatch.setAttribute('aria-pressed', 'true');
    const addBtn = card.querySelector('.cpc-add-btn');
    if (addBtn && swatch.dataset.variantId) addBtn.dataset.variantId = swatch.dataset.variantId;
    const wrap = card.querySelector('.cpc-image-wrap');
    if (!wrap || !wrap._carousel) return;
    const colorNorm = normColor(swatch.dataset.color || '');
    const all = wrap._carousel.defaultImages;
    const filtered = colorNorm ? all.filter(u => normColor(u).includes(colorNorm)) : [];
    wrap._carousel.setImages(filtered.length ? filtered : all);
  });

})();
