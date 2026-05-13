/* ==============================================
   BABY ELEGANCE — product-page.js
   Handles: gallery, variants, pair-with, reviews
   ============================================== */

(function () {
  'use strict';

  /* =============================================
     IMAGE GALLERY — two configurable modes
     ─────────────────────────────────────────────
     Mode is set in Theme Editor → Product Hero
       → Gallery Mode setting (section.settings.gallery_mode).
     The value is written to data-gallery-mode on .product-gallery.
     JS reads that attribute and activates the correct mode.
     The two modes share the thumbnail strip but handle
     clicks and state completely independently.
     ============================================= */

  const galleryEl   = document.querySelector('.product-gallery');
  const isScrollMode = galleryEl && galleryEl.dataset.galleryMode === 'scroll';
  const thumbs      = document.querySelectorAll('.gallery-thumb');

  /* ── SLIDESHOW MODE ──────────────────────────────────────────
     - One image visible at a time in a fixed aspect-ratio box
     - Thumbnail click → switch active image
     - Arrow buttons → prev / next
     - Touch swipe → prev / next
     Active state: .gallery-slide.is-active
  ──────────────────────────────────────────────────────────── */
  if (!isScrollMode) {
    const slides    = document.querySelectorAll('.gallery-slide');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    const galleryMain = document.getElementById('gallery-main');
    let currentSlide  = 0;

    function showSlide(index) {
      const total = slides.length;
      if (total === 0) return;
      currentSlide = ((index % total) + total) % total;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === currentSlide));
      thumbs.forEach((t, i) => t.classList.toggle('is-active', i === currentSlide));
    }

    /* Thumbnail clicks */
    thumbs.forEach(t => {
      t.addEventListener('click', () => showSlide(parseInt(t.dataset.index)));
    });

    /* Arrow buttons */
    galleryPrev && galleryPrev.addEventListener('click', () => showSlide(currentSlide - 1));
    galleryNext && galleryNext.addEventListener('click', () => showSlide(currentSlide + 1));

    /* Touch swipe on gallery main */
    let touchStartX = 0;
    galleryMain && galleryMain.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    galleryMain && galleryMain.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) showSlide(delta < 0 ? currentSlide + 1 : currentSlide - 1);
    });
  }

  /* ── SCROLL STACK MODE ───────────────────────────────────────
     - All images stacked vertically at full width
     - User scrolls naturally through them (standard page scroll)
     - Thumbnail click → smooth scroll to that image
     - IntersectionObserver → highlights the thumbnail of the
       image currently most visible in the viewport
     Active state: .gallery-thumb.is-active (via observer)
  ──────────────────────────────────────────────────────────── */
  if (isScrollMode) {
    const scrollItems = document.querySelectorAll('.gallery-scroll-item');

    /* Thumbnail click → scroll to that image */
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx    = parseInt(thumb.dataset.index);
        const target = document.getElementById('gallery-scroll-' + idx);
        if (target) {
          /* Offset by sticky header height so image isn't hidden behind header */
          const headerH = parseInt(
            getComputedStyle(document.documentElement)
              .getPropertyValue('--sticky-bar-height')
          ) || 80;
          const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    /* IntersectionObserver: sync thumbnail highlight to visible image */
    if ('IntersectionObserver' in window) {
      const scrollObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const idx = parseInt(entry.target.dataset.index);
              thumbs.forEach((t, i) => t.classList.toggle('is-active', i === idx));
            }
          });
        },
        {
          /* Image is "active" when its top 30% is in the middle band of screen */
          rootMargin: '-15% 0px -55% 0px',
          threshold: 0
        }
      );
      scrollItems.forEach(item => scrollObserver.observe(item));
    }
  }

  /* =============================================
     VARIANT SELECTOR
     ============================================= */
  const variantsData = JSON.parse(document.getElementById('product-variants-json')?.textContent || '[]');
  const variantIdInput = document.getElementById('variant-id');
  const productPriceEl = document.getElementById('product-price');
  const comparePriceEl = document.getElementById('product-compare-price');
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  const addToCartText = document.getElementById('add-to-cart-text');

  let selectedOptions = {};

  // Init from checked inputs
  document.querySelectorAll('.size-btn-input, .color-swatch-input').forEach(input => {
    const idx = parseInt(input.dataset.optionIndex);
    if (input.checked) selectedOptions[idx] = input.value;
  });

  document.querySelectorAll('.size-btn-input, .color-swatch-input').forEach(input => {
    input.addEventListener('change', () => {
      const idx = parseInt(input.dataset.optionIndex);
      selectedOptions[idx] = input.value;

      // Update displayed value labels
      const block = input.closest('.option-block');
      if (block) {
        const label = block.querySelector('.option-selected-value');
        if (label) label.textContent = input.value;
      }

      findVariant();
    });
  });

  function findVariant() {
    const selectedValues = Object.values(selectedOptions);
    const match = variantsData.find(v => {
      return selectedValues.every((val, i) => v.options[i] === val);
    });

    if (!match) return;

    if (variantIdInput) variantIdInput.value = match.id;

    // Update price
    if (productPriceEl) productPriceEl.textContent = formatMoney(match.price);
    if (comparePriceEl) {
      if (match.compare_at_price > match.price) {
        comparePriceEl.textContent = formatMoney(match.compare_at_price);
        comparePriceEl.style.display = 'inline';
      } else {
        comparePriceEl.style.display = 'none';
      }
    }

    // Update availability
    var qtyAtcRow    = document.getElementById('qty-atc-row');
    var notifyMeRow  = document.getElementById('notify-me-row');

    if (match.available) {
      // Variant in stock: show qty + ATC, hide Notify Me
      if (qtyAtcRow)   qtyAtcRow.style.display   = '';
      if (notifyMeRow) notifyMeRow.style.display  = 'none';
      if (addToCartBtn) addToCartBtn.disabled = false;
      if (addToCartText) addToCartText.textContent = 'Add to Basket';
    } else {
      // Variant out of stock: hide qty + ATC, show Notify Me
      if (qtyAtcRow)   qtyAtcRow.style.display   = 'none';
      if (notifyMeRow) notifyMeRow.style.display  = '';
    }

    // Update gallery to show variant image if available
    if (match.featured_image) {
      const targetThumb = [...thumbs].find(t => {
        const img = t.querySelector('img');
        return img && img.src.includes(match.featured_image.id);
      });
      if (targetThumb) showSlide(parseInt(targetThumb.dataset.index));
    }
  }

  /* =============================================
     ADD TO CART (PRODUCT FORM)
     ============================================= */
  const productForm = document.getElementById('product-form');
  productForm && productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = document.getElementById('add-to-cart-btn');
    const btnText = document.getElementById('add-to-cart-text');
    const formData = new FormData(productForm);
    const items = [{ id: formData.get('id'), quantity: parseInt(formData.get('quantity')) || 1 }];

    btn.disabled = true;
    if (btnText) btnText.textContent = 'Adding...';

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      if (res.ok) {
        if (btnText) btnText.textContent = 'Added ✓';
        setTimeout(() => {
          if (btnText) btnText.textContent = 'Add to Basket';
          btn.disabled = false;
        }, 2000);

        // Open cart drawer and refresh
        if (typeof fetchCart === 'function') fetchCart();
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartDrawer) cartDrawer.setAttribute('aria-hidden', 'false');
        if (cartOverlay) cartOverlay.classList.add('is-visible');
        document.body.style.overflow = 'hidden';
      }
    } catch (err) {
      btn.disabled = false;
      if (btnText) btnText.textContent = 'Add to Basket';
    }
  });

  /* =============================================
     QUANTITY SELECTOR
     ============================================= */
  const qtyInput = document.getElementById('product-quantity');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');

  qtyMinus && qtyMinus.addEventListener('click', () => {
    const val = parseInt(qtyInput.value);
    if (val > 1) qtyInput.value = val - 1;
  });

  qtyPlus && qtyPlus.addEventListener('click', () => {
    const val = parseInt(qtyInput.value);
    if (val < 99) qtyInput.value = val + 1;
  });

  /* =============================================
     ACCORDIONS
     ============================================= */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const accordion = trigger.closest('.accordion');
      const body = accordion.querySelector('.accordion-body');
      const isOpen = accordion.classList.contains('is-open');

      // Toggle this accordion
      accordion.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen);
      body.style.display = isOpen ? 'none' : 'block';
    });
  });

  /* =============================================
     WISHLIST BUTTON
     ============================================= */
  const wishlistBtn = document.getElementById('wishlist-btn');
  wishlistBtn && wishlistBtn.addEventListener('click', () => {
    wishlistBtn.classList.toggle('is-active');
    const icon = wishlistBtn.querySelector('svg');
    if (wishlistBtn.classList.contains('is-active')) {
      icon.style.fill = 'currentColor';
    } else {
      icon.style.fill = 'none';
    }
  });

  /* =============================================
     PAIR WITH – BUNDLE LOGIC
     ============================================= */
  const pairChecks = document.querySelectorAll('.pair-check');
  const bundlePriceEl = document.getElementById('pair-bundle-price');
  const bundleSavingsEl = document.getElementById('pair-bundle-savings');
  const addBundleBtn = document.getElementById('add-bundle-btn');

  const baseProductPrice = parseInt(
    document.querySelector('[data-product-id]')?.dataset?.basePrice ||
    productPriceEl?.textContent?.replace(/[^0-9]/g, '') || 0
  );

  function updateBundlePrice() {
    let total = 0;
    let itemCount = 1; // main product

    // Main product price from DOM
    const mainPriceText = productPriceEl?.textContent;
    if (mainPriceText) {
      const num = parseFloat(mainPriceText.replace(/[^0-9.]/g, ''));
      if (!isNaN(num)) total += num;
    }

    pairChecks.forEach(check => {
      if (check.checked) {
        const price = parseInt(check.dataset.price || 0) / 100;
        total += price;
        itemCount++;
      }
    });

    if (bundlePriceEl) bundlePriceEl.textContent = `$${total.toFixed(2)}`;

    // Apply discount tiers
    const tiers = window.DiscountEngine?.TIERS || [];
    let tier = null;
    for (const t of tiers) {
      if (itemCount >= t.qty) tier = t;
    }

    if (tier && bundleSavingsEl) {
      const saving = (total * tier.pct / 100).toFixed(2);
      bundleSavingsEl.textContent = `Save $${saving} (${tier.pct}% bundle discount)`;
      bundleSavingsEl.style.display = 'block';
    } else if (bundleSavingsEl) {
      bundleSavingsEl.style.display = 'none';
    }
  }

  pairChecks.forEach(c => c.addEventListener('change', updateBundlePrice));
  updateBundlePrice();

  addBundleBtn && addBundleBtn.addEventListener('click', async () => {
    const items = [];

    // Main product
    const mainVariantId = variantIdInput?.value || document.querySelector('[name="id"]')?.value;
    const mainQty = parseInt(qtyInput?.value) || 1;
    if (mainVariantId) items.push({ id: mainVariantId, quantity: mainQty });

    // Pair with products
    pairChecks.forEach(check => {
      if (check.checked && check.dataset.variantId) {
        items.push({ id: check.dataset.variantId, quantity: 1 });
      }
    });

    if (!items.length) return;

    addBundleBtn.disabled = true;
    addBundleBtn.innerHTML = 'Adding Bundle...';

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      if (res.ok) {
        addBundleBtn.innerHTML = '✓ Bundle Added!';
        if (typeof fetchCart === 'function') fetchCart();
        setTimeout(() => {
          addBundleBtn.disabled = false;
          addBundleBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Add Bundle to Basket`;
        }, 2500);
      }
    } catch (err) {
      addBundleBtn.disabled = false;
    }
  });

  /* =============================================
     SIMILAR PRODUCTS CAROUSEL
     ============================================= */
  const similarTrack = document.getElementById('similar-track');
  const similarPrev = document.getElementById('similar-prev');
  const similarNext = document.getElementById('similar-next');
  const similarDotsContainer = document.getElementById('similar-dots');

  if (similarTrack) {
    const cards = Array.from(similarTrack.children);
    let simCurrent = 0;
    let slidesPerView = getSlidesPerView();

    function getSlidesPerView() {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 2;
      return 4;
    }

    function buildSimDots() {
      if (!similarDotsContainer) return;
      const pages = Math.ceil(cards.length / slidesPerView);
      similarDotsContainer.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', `Page ${i + 1}`);
        dot.addEventListener('click', () => goToSim(i));
        similarDotsContainer.appendChild(dot);
      }
    }

    function goToSim(page) {
      const pages = Math.ceil(cards.length / slidesPerView);
      simCurrent = ((page % pages) + pages) % pages;
      const cardWidth = cards[0].offsetWidth + 20; // gap
      similarTrack.style.transform = `translateX(-${simCurrent * slidesPerView * cardWidth}px)`;
      similarDotsContainer?.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('is-active', i === simCurrent));
    }

    similarPrev && similarPrev.addEventListener('click', () => goToSim(simCurrent - 1));
    similarNext && similarNext.addEventListener('click', () => goToSim(simCurrent + 1));

    // Touch
    let simStartX = 0;
    similarTrack.addEventListener('touchstart', e => { simStartX = e.touches[0].clientX; }, { passive: true });
    similarTrack.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].clientX - simStartX;
      if (Math.abs(delta) > 40) goToSim(delta < 0 ? simCurrent + 1 : simCurrent - 1);
    });

    buildSimDots();
    window.addEventListener('resize', () => {
      slidesPerView = getSlidesPerView();
      buildSimDots();
      goToSim(0);
    });
  }

  /* =============================================
     REVIEWS
     ============================================= */
  const writeReviewBtn = document.getElementById('write-review-btn');
  const reviewFormWrap = document.getElementById('review-form-wrap');
  const reviewFormClose = document.getElementById('review-form-close');
  const cancelReview = document.getElementById('cancel-review');
  const reviewForm = document.getElementById('review-form');

  function openReviewForm() {
    reviewFormWrap && reviewFormWrap.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeReviewForm() {
    reviewFormWrap && reviewFormWrap.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  writeReviewBtn && writeReviewBtn.addEventListener('click', openReviewForm);
  reviewFormClose && reviewFormClose.addEventListener('click', closeReviewForm);
  cancelReview && cancelReview.addEventListener('click', closeReviewForm);

  reviewFormWrap && reviewFormWrap.addEventListener('click', e => {
    if (e.target === reviewFormWrap) closeReviewForm();
  });

  // Star picker
  const starPicks = document.querySelectorAll('.star-pick');
  const ratingInput = document.getElementById('review-rating');

  starPicks.forEach((star, idx) => {
    star.addEventListener('mouseenter', () => {
      starPicks.forEach((s, i) => s.classList.toggle('is-filled', i <= idx));
    });
    star.addEventListener('mouseleave', () => {
      const current = parseInt(ratingInput?.value || 0);
      starPicks.forEach((s, i) => s.classList.toggle('is-filled', i < current));
    });
    star.addEventListener('click', () => {
      if (ratingInput) ratingInput.value = idx + 1;
      starPicks.forEach((s, i) => s.classList.toggle('is-filled', i <= idx));
    });
  });

  // Fit selector
  document.querySelectorAll('.fit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fit-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const fitInput = document.getElementById('review-fit');
      if (fitInput) fitInput.value = btn.dataset.value;
    });
  });

  // Helpful buttons
  document.querySelectorAll('.helpful-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-voted')) return;
      btn.classList.add('is-voted');
      const countText = btn.textContent.match(/\d+/);
      const count = countText ? parseInt(countText[0]) + 1 : 1;
      btn.innerHTML = btn.innerHTML.replace(/\d+/, count);
    });
  });

  // Review form submission
  reviewForm && reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = reviewForm.querySelector('[type="submit"]');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Simulate submission (integrate with Shopify Product Reviews or Judge.me)
    await new Promise(r => setTimeout(r, 1200));

    const formData = Object.fromEntries(new FormData(reviewForm));

    // Inject new review into DOM
    const reviewsList = document.getElementById('reviews-list');
    const newReview = buildReviewCard(formData);
    reviewsList && reviewsList.insertAdjacentHTML('afterbegin', newReview);

    closeReviewForm();
    reviewForm.reset();
    starPicks.forEach(s => s.classList.remove('is-filled'));

    submitBtn.textContent = 'Submit Review';
    submitBtn.disabled = false;

    // Scroll to reviews
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  function buildReviewCard(data) {
    const stars = parseInt(data.rating) || 5;
    const starsHtml = Array.from({ length: 5 }, (_, i) =>
      `<span class="star ${i < stars ? 'star--filled' : ''}">★</span>`
    ).join('');

    return `
      <article class="review-card review-card--new">
        <div class="review-card__header">
          <div class="review-card__author-avatar">
            <span>${(data.name || 'A').slice(0, 1).toUpperCase()}</span>
          </div>
          <div class="review-card__author-info">
            <p class="review-card__author-name">${escapeHtml(data.name || 'Anonymous')}</p>
            <p class="review-card__author-meta">
              <span class="verified-badge">✓ Verified Purchase</span>
              <span class="review-date">Just now</span>
            </p>
          </div>
          <div class="review-card__stars">${starsHtml}</div>
        </div>
        ${data.title ? `<h4 class="review-card__title">${escapeHtml(data.title)}</h4>` : ''}
        <p class="review-card__body">${escapeHtml(data.body || '')}</p>
        <div class="review-card__footer">
          <button class="helpful-btn">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            Helpful (0)
          </button>
        </div>
      </article>
    `;
  }

  // Filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.review-card').forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          card.style.display = card.dataset.stars === filter ? '' : 'none';
        }
      });
    });
  });

  // Compute rating breakdown from existing review cards
  function computeRatings() {
    const cards = document.querySelectorAll('.review-card[data-stars]');
    if (!cards.length) return;

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    let sum = 0;

    cards.forEach(c => {
      const stars = parseInt(c.dataset.stars);
      if (stars >= 1 && stars <= 5) {
        counts[stars]++;
        sum += stars;
        total++;
      }
    });

    if (!total) return;
    const avg = (sum / total).toFixed(1);

    // Update average score
    const avgEl = document.getElementById('avg-score');
    if (avgEl) avgEl.textContent = avg;

    const summaryStars = document.getElementById('summary-stars');
    if (summaryStars) {
      const filled = Math.round(parseFloat(avg));
      summaryStars.querySelectorAll('.star').forEach((s, i) => {
        s.classList.toggle('star--filled', i < filled);
      });
    }

    const totalEl = document.getElementById('total-reviews-count');
    if (totalEl) totalEl.textContent = `Based on ${total} review${total !== 1 ? 's' : ''}`;

    const countSummaryEl = document.getElementById('review-count-summary');
    if (countSummaryEl) countSummaryEl.textContent = `${total} review${total !== 1 ? 's' : ''}`;

    // Fill breakdown bars
    for (let i = 1; i <= 5; i++) {
      const pct = total ? (counts[i] / total * 100).toFixed(0) : 0;
      const fill = document.querySelector(`.breakdown-fill[data-stars="${i}"]`);
      const count = document.querySelector(`.breakdown-count[data-stars="${i}"]`);
      if (fill) setTimeout(() => { fill.style.width = pct + '%'; }, 300);
      if (count) count.textContent = counts[i];
    }

    // Update rating summary on product title
    const ratingSummary = document.getElementById('product-rating-summary');
    const summaryStarsDisplay = ratingSummary?.querySelector('.stars-display');
    if (summaryStarsDisplay) {
      const filled = Math.round(parseFloat(avg));
      summaryStarsDisplay.querySelectorAll('.star').forEach((s, i) => {
        s.classList.toggle('star--filled', i < filled);
      });
    }
  }

  // Run after DOM is ready
  setTimeout(computeRatings, 100);

  /* =============================================
     HELPERS
     ============================================= */
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();

/* ================================================================
   SIZE GUIDE POPUP
   ================================================================
   Opens when the customer clicks "Size Guide" next to the size
   selector on the product page. Shows a full measurement table.
   Closed by the × button or pressing Escape.
   ================================================================ */
(function () {
  'use strict';
  const trigger  = document.getElementById('size-guide-trigger');
  const overlay  = document.getElementById('size-guide-overlay');
  const closeBtn = document.getElementById('size-guide-close');

  const open  = () => { overlay && overlay.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const close = () => { overlay && overlay.setAttribute('aria-hidden', 'true');  document.body.style.overflow = ''; };

  trigger  && trigger.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay  && overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ================================================================
   PAIR WITH — CAROUSEL & VARIANT POPUP
   ================================================================
   CAROUSEL: Slides paired product cards left/right.
   • Desktop: 4 cards visible
   • Tablet:  2–3 cards
   • Mobile:  1 card, touch swipe enabled

   VARIANT POPUP: When a paired product has multiple sizes/colours,
   tapping "Select Options" opens a small modal. The customer picks
   options and confirms before the item is added to cart.
   ================================================================ */
(function () {
  'use strict';

  /* -- Carousel -- */
  const track   = document.getElementById('pair-track');
  const prevBtn = document.getElementById('pair-prev');
  const nextBtn = document.getElementById('pair-next');
  const dotsEl  = document.getElementById('pair-dots');

  if (track) {
    const cards = Array.from(track.children);
    let page = 0;

    const perView = () => {
      const w = window.innerWidth;
      return w <= 480 ? 1 : w <= 768 ? 2 : w <= 1100 ? 3 : 4;
    };

    const totalPages = () => Math.max(1, Math.ceil(cards.length / perView()));

    const buildDots = () => {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      for (let i = 0; i < totalPages(); i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' is-active' : '');
        d.setAttribute('aria-label', 'Page ' + (i + 1));
        d.addEventListener('click', () => go(i));
        dotsEl.appendChild(d);
      }
    };

    const go = (p) => {
      page = ((p % totalPages()) + totalPages()) % totalPages();
      const pv  = perView();
      const gap = 20;
      const cw  = cards[0] ? cards[0].offsetWidth + gap : 0;
      track.style.transform = `translateX(-${page * pv * cw}px)`;
      dotsEl && dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('is-active', i === page));
    };

    prevBtn && prevBtn.addEventListener('click', () => go(page - 1));
    nextBtn && nextBtn.addEventListener('click', () => go(page + 1));

    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 45) go(dx < 0 ? page + 1 : page - 1); });

    buildDots();
    window.addEventListener('resize', () => { buildDots(); go(0); }, { passive: true });
  }

  /* -- Variant popup -- */
  const vpOverlay = document.getElementById('variant-popup-overlay');
  const vpClose   = document.getElementById('variant-popup-close');
  const vpTitle   = document.getElementById('variant-popup-title');
  const vpPrice   = document.getElementById('variant-popup-price');
  const vpImage   = document.getElementById('variant-popup-image');
  const vpBody    = document.getElementById('variant-popup-body');
  const vpAdd     = document.getElementById('variant-popup-add');

  let variants = [], options = [], selected = {};

  const openVP = btn => {
    try { variants = JSON.parse(btn.dataset.variants || '[]'); options = JSON.parse(btn.dataset.options || '[]'); } catch { return; }
    selected = {};
    if (vpTitle)  vpTitle.textContent  = btn.dataset.productTitle  || '';
    if (vpPrice)  vpPrice.textContent  = btn.dataset.productPrice  || '';
    if (vpImage && btn.dataset.productImage) { vpImage.src = btn.dataset.productImage; vpImage.alt = vpTitle.textContent; }
    if (vpAdd) { vpAdd.disabled = true; vpAdd.textContent = 'Select an option to continue'; delete vpAdd.dataset.variantId; }
    renderOptions();
    vpOverlay && vpOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };
  const closeVP = () => { vpOverlay && vpOverlay.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };

  const renderOptions = () => {
    if (!vpBody) return;
    vpBody.innerHTML = '';
    options.forEach((opt, oi) => {
      const wrap = document.createElement('div');
      wrap.className = 'variant-popup-option';
      const row = document.createElement('div');
      row.className = 'variant-popup-option__label';
      row.innerHTML = `${opt.name} <span class="variant-popup-option__selected" id="vp-sel-${oi}"></span>`;
      wrap.appendChild(row);
      const isColor = ['color','colour'].includes(opt.name.toLowerCase());
      const btns = document.createElement('div');
      btns.className = isColor ? 'color-swatches' : 'size-buttons';
      opt.values.forEach(val => {
        const lbl = document.createElement('label');
        lbl.className = isColor ? 'color-swatch-label' : 'size-btn-label';
        lbl.innerHTML = isColor
          ? `<input type="radio" name="vp-${oi}" value="${val}" data-oi="${oi}" class="color-swatch-input"><span class="color-swatch-dot" style="background:${val.toLowerCase().replace(/\s+/g,'')}" aria-hidden="true"><span class="swatch-tooltip">${val}</span></span>`
          : `<input type="radio" name="vp-${oi}" value="${val}" data-oi="${oi}" class="size-btn-input"><span class="size-btn">${val}</span>`;
        btns.appendChild(lbl);
      });
      wrap.appendChild(btns);
      vpBody.appendChild(wrap);
    });
    vpBody.querySelectorAll('input[type="radio"]').forEach(inp => {
      inp.addEventListener('change', () => {
        const oi = parseInt(inp.dataset.oi);
        selected[oi] = inp.value;
        const el = document.getElementById(`vp-sel-${oi}`);
        if (el) el.textContent = inp.value;
        updateBtn();
      });
    });
  };

  const updateBtn = () => {
    if (!vpAdd) return;
    if (Object.keys(selected).length < options.length) { vpAdd.disabled = true; vpAdd.textContent = 'Select all options'; return; }
    const match = variants.find(v => v.options.every((o, i) => o === selected[i]));
    if (match && match.available) { vpAdd.disabled = false; vpAdd.dataset.variantId = match.id; vpAdd.textContent = 'Add to Basket'; }
    else { vpAdd.disabled = true; vpAdd.textContent = match ? 'Sold Out' : 'Unavailable'; }
  };

  vpAdd && vpAdd.addEventListener('click', async () => {
    const id = vpAdd.dataset.variantId; if (!id) return;
    vpAdd.disabled = true; vpAdd.textContent = 'Adding…';
    try {
      const r = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: [{ id: parseInt(id), quantity: 1 }] }) });
      if (r.ok) { vpAdd.textContent = 'Added ✓'; if (typeof fetchCart === 'function') fetchCart(); setTimeout(closeVP, 1100); }
      else { vpAdd.disabled = false; vpAdd.textContent = 'Add to Basket'; }
    } catch { vpAdd.disabled = false; vpAdd.textContent = 'Try again'; }
  });

  vpClose  && vpClose.addEventListener('click', closeVP);
  vpOverlay && vpOverlay.addEventListener('click', e => { if (e.target === vpOverlay) closeVP(); });
  document.addEventListener('click', e => { const b = e.target.closest('.btn-pair-variants'); if (b) openVP(b); });


  /* ============================================================
     PDP GALLERY FULLSCREEN LIGHTBOX
     ============================================================
     Click any product image (slideshow, scroll stack, or grid)
     to open the fullscreen lightbox. Arrow buttons and keyboard
     left/right navigate between images. Escape or X closes it.
     ============================================================ */
  (function () {
    var lb        = document.getElementById('gallery-lightbox');
    var lbImg     = document.getElementById('gallery-lightbox-img');
    var lbClose   = document.getElementById('gallery-lightbox-close');
    var lbPrev    = document.getElementById('gallery-lightbox-prev');
    var lbNext    = document.getElementById('gallery-lightbox-next');
    var lbCounter = document.getElementById('gallery-lightbox-counter');

    if (!lb || !lbImg) return;

    // Collect all product images on the page from whatever mode is active
    function getImages() {
      // Try slideshow slides first
      var imgs = Array.from(document.querySelectorAll('.gallery-slide img'));
      // Scroll stack
      if (imgs.length === 0) imgs = Array.from(document.querySelectorAll('.gallery-scroll-item img'));
      // Grid
      if (imgs.length === 0) imgs = Array.from(document.querySelectorAll('.gallery-grid-item img'));
      return imgs;
    }

    var images = [];
    var currentIndex = 0;

    function openLightbox(index) {
      images = getImages();
      if (images.length === 0) return;
      currentIndex = Math.max(0, Math.min(index, images.length - 1));
      showImage(currentIndex);
      lb.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }

    function closeLightbox() {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    function showImage(index) {
      var src = images[index].getAttribute('data-zoom') ||
                images[index].src.replace(/(_\d+x\d*|_\d*x\d+)/, '_2000x');
      lbImg.src = src;
      lbImg.alt = images[index].alt || '';
      lbCounter.textContent = (index + 1) + ' / ' + images.length;
      lbPrev.style.display = images.length > 1 ? '' : 'none';
      lbNext.style.display = images.length > 1 ? '' : 'none';
    }

    function prev() { currentIndex = (currentIndex - 1 + images.length) % images.length; showImage(currentIndex); }
    function next() { currentIndex = (currentIndex + 1) % images.length; showImage(currentIndex); }

    // Attach click to every gallery image
    function attachClickHandlers() {
      var allImgs = document.querySelectorAll(
        '.gallery-slide img, .gallery-scroll-item img, .gallery-grid-item img'
      );
      allImgs.forEach(function (img, idx) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () { openLightbox(idx); });
      });
    }
    attachClickHandlers();

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', prev);
    lbNext.addEventListener('click', next);

    // Click outside image closes
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
    });

    // Touch swipe support in lightbox
    var swipeStartX = 0;
    lb.addEventListener('touchstart', function (e) { swipeStartX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].clientX - swipeStartX;
      if (Math.abs(delta) > 50) { delta < 0 ? next() : prev(); }
    });
  })();


  /* ── Notify Me button ── */
  var notifyMeBtn = document.getElementById('notify-me-btn');
  if (notifyMeBtn) {
    notifyMeBtn.addEventListener('click', function () {
      var title   = document.querySelector('.product-title') && document.querySelector('.product-title').textContent.trim();
      var subject = encodeURIComponent('Notify me when available: ' + title);
      var body    = encodeURIComponent('Hi, I would like to be notified when this product is back in stock: ' + window.location.href);
      window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
    });
  }

})();
