# TTB_CONTEXT.md — Baby Elegance / The Tiny Bosses Theme
**Branch:** `claude/frosty-driscoll-5727ac`  
**Generated:** 2026-06-02  
**Purpose:** Complete codebase context for Claude Code sessions — read this before touching any file.

---

## 1. REPO FILE MAP

### assets/
| File | Description |
|------|-------------|
| `theme.css` | Master stylesheet — 8 600+ lines. All base styles + all TTB fix blocks appended at bottom. **NEVER modify existing rules — only append to the end.** |
| `theme.js` | Master JS — scroll handlers, header logic, cart drawer, mobile drawer, search bar, collection card carousels, size-sheet, sticky ATC bar, TTB gallery dots + variant switch IIFE |
| `product-page.js` | PDP-only JS — gallery slideshow & scroll modes, variant selector, ATC form, quantity selector, accordions, wishlist, pair-with bundle logic, similar products carousel, reviews |
| `animations.js` | IntersectionObserver scroll reveal, stagger grids, parallax hero, animated counters, mega menu (desktop hover + iPad touch), card tilt, heading reveal, auto-instrument |
| `collection-filters.js` | Client-side collection filtering — parses `filter-*` tags, builds sidebar UI, applies filters via display toggle, URL sync |
| `discount-engine.js` | Bundle discount engine — `window.DiscountEngine` — TIERS (Buy 2–5), applies discount via cart attributes and note on `cart:updated` event |
| `swatches.json` | Color swatch definitions (name, label, hex, border) — white, baby-pink, sage (#8E9B90), oat, dusty-blue |

### sections/
| File | Description |
|------|-------------|
| `announcement-bar.liquid` | Scrolling ticker at top of every page — up to 3 messages with links, custom bg/text color, scroll speed |
| `blog-article.liquid` | Single blog post — hero image, author, content, tags, share buttons, sidebar, comments |
| `blog-listing.liquid` | Blog index — featured article hero + grid of articles |
| `cart-drawer.liquid` | Slide-in cart panel (right side) — renders inside `#cart-drawer` in layout/theme.liquid |
| `cart-page.liquid` | Full /cart page with line items, subtotal, checkout button |
| `collection-products.liquid` | Collection page — hero banner, sticky filter bar, sidebar filters, product grid using collection-product-card snippet |
| `customers-account.liquid` | Account dashboard — order list with account-nav snippet |
| `customers-addresses.liquid` | Saved addresses management |
| `customers-login.liquid` | Login / register / forgot password forms |
| `customers-order.liquid` | Individual order detail page |
| `customers-register.liquid` | New account registration form |
| `customers-reset-password.liquid` | Password reset form |
| `discount-carousel.liquid` | Bundle-and-save tier explainer with animated discount cards |
| `discount-popup.liquid` | Fixed bottom-right popup showing cart progress toward next bundle tier |
| `featured-collections.liquid` | Homepage category grid — up to 6 collection cards |
| `footer.liquid` | Global footer — trust strip, brand info, social links, newsletter, 5 nav columns, contact, copyright |
| `header.liquid` | Global header — mobile drawer, desktop nav with 3 mega-menu panels (Girls/Boys/Family), logo, search icon, account icon, cart icon |
| `hero-banner.liquid` | Full-width hero section — image (with optional mobile image), overlay, heading, subheading, 2 CTAs, scroll indicator |
| `image-gallery.liquid` | Standalone image gallery section — grid or masonry layout |
| `image-with-text.liquid` | 50/50 split image + text section with button |
| `multi-column.liquid` | Multi-column text/icon content section |
| `newsletter-popup.liquid` | Email capture popup — fires after `delay_seconds`, suppressed for `redisplay_days`, stores flag in localStorage |
| `page-about.liquid` | About Us page — hero, story text + image, values grid, stats, team, CTA |
| `page-contact.liquid` | Contact page — contact form + info cards |
| `page-faq.liquid` | FAQ page — accordion Q&A grouped by category, sticky sidebar |
| `page-returns.liquid` | Returns & Exchanges page — policy summary cards + detailed sections |
| `pair-with.liquid` | "Complete the Look" PDP section — renders companion products from `custom.pair_with` metafield; hidden if `pair_count == 0` |
| `product-grid.liquid` | Reusable product grid section — uses collection-product-card snippet, supports multiple collections as blocks |
| `product-hero.liquid` | Main PDP section — breadcrumb, gallery (3 modes), product info, size guide modal, variants JSON, sticky ATC bar |
| `product-reviews.liquid` | PDP reviews section — star display, submit form, helpful votes, photo lightbox |
| `product-spotlight.liquid` | Featured single product highlight section |
| `promo-banner.liquid` | Promotional full-width text + CTA banner |
| `rich-text.liquid` | Simple rich text content section |
| `similar-products.liquid` | "Similar Pieces" PDP section — carousel of related products from metafield or same collection; ALWAYS renders (no guard) |
| `subscribe-cta.liquid` | Email subscription call-to-action strip |
| `testimonials.liquid` | Customer testimonials carousel |
| `trust-cards.liquid` | Horizontal trust icon strip — shipping, returns, support, security |

### snippets/
| File | Description |
|------|-------------|
| `account-nav.liquid` | Sidebar navigation for customer account pages — avatar, links to orders/addresses/profile/sign-out |
| `product-card.liquid` | Legacy product card with scrollable image strip — used in product-grid section |
| `product-card-placeholder.liquid` | Placeholder card when no products available |
| `similar-card.liquid` | Reusable similar-product card — primary + secondary hover image, badges, price, swatches, quick-add |

### layout/
| File | Description |
|------|-------------|
| `theme.liquid` | Global HTML wrapper — `<head>` with SEO/OG/JSON-LD/fonts/CSS, `<body>` with body classes, `#sticky-bar` (announcement-bar + header), `<main>`, footer, cart-drawer, popups, back-to-top, review-lightbox, gallery-lightbox, deferred scripts, CSS variable override `<style>` block |

### templates/
| File | Description |
|------|-------------|
| `index.json` | Homepage — hero-banner, featured-collections, discount-carousel, product-grid, trust-cards, testimonials, subscribe-cta |
| `product.liquid` | Product page — product-hero, pair-with, similar-products, product-reviews |
| `collection.liquid` | Collection page — collection-products |
| `cart.liquid` | Cart page — cart-page |
| `article.liquid` | Blog post — blog-article |
| `blog.liquid` | Blog index — blog-listing |
| `page.about.liquid` | About page — page-about |
| `page.contact.liquid` | Contact page — page-contact |
| `page.faq.liquid` | FAQ page — page-faq |
| `page.returns.liquid` | Returns page — page-returns |
| `sitemap.liquid` | XML sitemap |
| `templates/customers/*.liquid` | Each maps to a matching `customers-*.liquid` section |

### config/
| File | Description |
|------|-------------|
| `settings_schema.json` | Theme Editor settings definition — 3 groups: Social Media & SEO, Product Pages, Design |
| `settings_data.json` | Saved settings values for all sections and global theme settings |

### locales/
| File | Description |
|------|-------------|
| `en.default.json` | Translation strings — only `products.product.add_to_cart: "Add to Cart"` |

---

## 2. KEY SELECTORS & CLASS NAMES

### Header & Navigation
| Component | Selector |
|-----------|----------|
| Sticky wrapper (THE sticky element) | `#sticky-bar` / `.sticky-bar` |
| Shopify section wrapper | `#shopify-section-header` |
| Site header element | `header.site-header` / `#site-header` |
| Header inner flex row | `.header-inner.container` |
| Logo (image) | `.header-logo .logo-img` |
| Logo (text) | `.header-logo .logo-text` |
| Hamburger button | `#mobile-menu-toggle` / `.mobile-menu-toggle` |
| Desktop nav list | `.header-nav ul.nav-list` |
| Nav item with mega panel | `.nav-item--mega` |
| Nav link | `.nav-link` |
| Nav chevron | `.nav-chevron` |
| Mega menu panel | `.mega-panel` |
| Mega category grid | `.mega-grid` |
| Mega card | `.mega-card` |
| Header actions wrapper | `.header-actions` |
| Individual action button | `.header-action` |
| Search toggle button | `#search-toggle` / `.search-toggle` |
| Search bar panel | `#header-search-bar` / `.header-search-bar` |
| Search input | `#header-search-input` |
| Account icon | `.header-action` (links to `/account`) |
| Cart icon/toggle | `#cart-toggle` |
| Cart badge (item count) | `#cart-count` / `.cart-count` (also `[data-cart-count]`) |
| Mobile drawer panel | `#mobile-drawer` / `.mobile-drawer` |
| Mobile drawer overlay | `#mobile-drawer-overlay` |
| Mobile drawer close | `#mobile-drawer-close` / `.mobile-drawer__close` |
| Mobile nav group | `.mobile-nav-group` |
| Mobile nav group trigger | `.mobile-nav-group__trigger` |
| Mobile nav child link | `.mobile-nav-child` |
| Scrolled state on sticky bar | `#sticky-bar.is-scrolled` |
| Scrolled state on body | `body.header-scrolled` |
| Transparent header body class | `body.has-transparent-header` |
| Touch mode body class | `body.is-touch` (added by animations.js for iPad) |

### Announcement Bar
| Component | Selector |
|-----------|----------|
| Bar wrapper | `#announcement-bar` / `.announcement-bar` |
| Scroll track | `.announcement-track` |
| Items container (duplicated for loop) | `.announcement-items` |
| Individual message | `.announcement-item` |
| Clickable message | `.announcement-item--link` |
| Divider between messages | `.announcement-divider` |

### Hero Section
| Component | Selector |
|-----------|----------|
| Section wrapper | `.hero-section` / `#hero-section` |
| Background image | `.hero-bg` |
| Background placeholder | `.hero-bg--placeholder` |
| Hero content | `.hero-content` |
| Text block | `.hero-text-block` |
| Eyebrow | `.hero-eyebrow` |
| Heading | `.hero-heading` |
| Subheading | `.hero-subheading` |
| CTA buttons wrapper | `.hero-ctas` |

### Product Gallery (all modes)
| Component | Selector |
|-----------|----------|
| Gallery container (wraps thumbs + main) | `.product-gallery` |
| Gallery mode attribute | `data-gallery-mode="slideshow|scroll|grid"` |
| Thumbnail strip | `#gallery-thumbs` / `.gallery-thumbs` |
| Individual thumb button | `.gallery-thumb` / `.gallery-thumb.is-active` |
| Main image area | `#gallery-main` / `.gallery-main` |
| **Slideshow track** | `#gallery-track` / `.gallery-main__inner` |
| **Slideshow slide** | `.gallery-slide` / `.gallery-slide.is-active` |
| **Scroll stack container** | `#gallery-scroll-track` / `.gallery-scroll-stack` |
| **Scroll stack item** | `.gallery-scroll-item` |
| **Grid stack container** | `#gallery-grid-track` / `.gallery-grid-stack` |
| **Grid item (full width)** | `.gallery-grid-item.gallery-grid-item--full` |
| **Grid item (half width)** | `.gallery-grid-item.gallery-grid-item--half` |
| Grid image | `.gallery-grid-img` |
| Gallery image (any mode) | `.gallery-image` |
| Scroll-mode image specifically | `.gallery-image.gallery-image--scroll` |
| Prev/next arrow buttons | `#gallery-prev` / `#gallery-next` / `.gallery-arrow` |
| Zoom hint tooltip | `.gallery-zoom-hint` |
| Mobile dot indicators container | `.gallery-dots` (JS-injected into `#gallery-main`) |
| Mobile individual dot | `.gallery-dot` / `.gallery-dot.is-active` |
| Gallery lightbox overlay | `#gallery-lightbox` / `.gallery-lightbox` |

### Product Layout & Info
| Component | Selector |
|-----------|----------|
| PDP wrapper section | `.product-hero` |
| Two-column grid | `.product-layout` |
| Breadcrumb nav | `.product-breadcrumb` |
| Product info column | `#product-info` / `.product-info` |
| Product title row | `.product-title-row` |
| Product title h1 | `.product-title` |
| Rating summary | `#product-rating-summary` / `.product-rating-summary` |
| Price row | `.product-price-row` |
| Price block | `.product-price-block` |
| Main price | `#product-price` / `.product-price` |
| Compare (strike-through) price | `#product-compare-price` / `.product-price--compare` |
| Savings badge | `.product-savings` |
| Share icons row | `.product-share-inline` |
| Share button (sm) | `.share-btn-sm` |
| Bundle nudge | `#bundle-nudge` / `.product-bundle-nudge` |
| Product form wrapper | `.product-form-wrap` |
| Product form | `#product-form` / `.product-form` |
| Hidden variant ID input | `#variant-id` |
| Variants JSON data | `#product-variants-json` (script type="application/json") |
| Option block | `.option-block` |
| Option label row | `.option-label-row` |
| Color swatch radio input | `.color-swatch-input` |
| Color swatch button | `.color-swatch` |
| Size button radio input | `.size-btn-input` |
| Size button label | `.size-btn` |
| Quantity/ATC row | `#qty-atc-row` / `.qty-atc-row` |
| Quantity selector wrapper | `.qty-inline` / `.qty-selector` |
| Qty minus button | `#qty-minus` / `.qty-selector-btn` |
| Qty plus button | `#qty-plus` / `.qty-selector-btn` |
| Qty number input | `#product-quantity` / `.qty-selector-input` |
| ATC button | `#add-to-cart-btn` / `.btn--add-to-cart` |
| ATC button text span | `#add-to-cart-text` |
| Wishlist button | `#wishlist-btn` / `.btn-wishlist` |
| Notify me row (sold out) | `#notify-me-row` |
| Accordion wrapper | `.accordion` / `.accordion.is-open` |
| Accordion trigger button | `.accordion-trigger` |
| Accordion body | `.accordion-body` |
| Discount badge on PDP | `.product-badge` |
| New arrival badge | `.product-badge--new` |
| Sale badge | `.product-badge--sale` |
| Percent-off badge | `.product-badge--discount` |
| Trust badges (PDP) | `.product-trust-badges` / `.trust-badge` |
| Sticky ATC bar (mobile) | `#sticky-atc-bar` / `.sticky-atc-bar` / `.sticky-atc-bar.is-visible` |
| Sticky ATC button | `#sticky-atc-btn` / `.sticky-atc-bar__button` |
| Size guide trigger | `.size-guide-trigger` (opens `#size-guide-overlay`) |
| Size guide modal | `#size-guide-overlay` / `.modal-overlay` |

### Cart Drawer
| Component | Selector |
|-----------|----------|
| Cart drawer panel | `#cart-drawer` / `.cart-drawer` |
| Cart overlay (backdrop) | `#cart-overlay` / `.cart-overlay.is-visible` |
| Cart drawer inner | `.cart-drawer__inner` |
| Cart header | `.cart-drawer__header` |
| Cart title | `.cart-drawer__title` |
| Cart close button | `#cart-drawer-close` |
| Cart items list | `#cart-drawer-items` / `.cart-drawer__items` |
| Empty state | `#cart-empty` / `.cart-drawer__empty` |
| Cart footer | `#cart-drawer-footer` / `.cart-drawer__footer` |
| Subtotal price | `#cart-subtotal-price` |
| Checkout button | `.cart-drawer__checkout` |

### Collection Page
| Component | Selector |
|-----------|----------|
| Collection hero | `.coll-hero` |
| Filter bar | `#coll-filter-bar` / `.coll-filter-bar` |
| Filter toggle (mobile) | `#filter-toggle-mobile` |
| Filter sidebar | `#collection-sidebar` / `.collection-sidebar` |
| Filter group | `.filter-group` |
| Filter group head | `.filter-group__head` |
| Filter group body | `.filter-group__body` |
| Filter option | `.filter-option` / `.filter-option.is-active` |
| Filter checkbox | `.filter-checkbox` |
| Filter chip (active tag) | `.filter-chip` |
| Active chips container | `#active-filter-chips` |
| Sort dropdown | `#collection-sort` |
| Collection grid | `#collection-grid` / `.collection-grid` |
| Collection product card | `.collection-product-card` |
| CPC image wrap | `.cpc-image-wrap` |
| CPC main image | `.cpc-img` |
| CPC color swatch | `.cpc-color-swatch` / `.cpc-color-swatch.is-selected` |
| CPC add button | `.cpc-add-btn` |
| CPC dots | `.cpc-dots-container` / `.cpc-dot` / `.cpc-dot.is-active` |
| Size sheet (bottom sheet) | `#size-sheet` / `.size-sheet` / `.size-sheet.is-open` |
| Size sheet backdrop | `#size-sheet-backdrop` / `.size-sheet__backdrop` |

### Footer
| Component | Selector |
|-----------|----------|
| Trust strip | `.footer-trust` / `.footer-trust__grid` / `.footer-trust__item` |
| Footer body | `.footer-body` |
| Brand column | `.footer-brand` |
| Nav columns | `.footer-nav-cols` |
| Footer bottom bar | `.footer-bottom` |
| Copyright | `.footer-copyright` |

### Global / Misc
| Component | Selector |
|-----------|----------|
| Back to top button | `#back-to-top` / `#back-to-top.is-visible` |
| Review photo lightbox | `#review-lightbox` / `.review-lightbox.is-open` |
| Review lightbox image | `#review-lightbox-img` |
| Modal overlay (size guide) | `.modal-overlay` / `.modal-overlay[aria-hidden="false"]` |
| Modal box | `.modal` |
| Section header block | `.section-header` |
| Section eyebrow text | `.section-eyebrow` |
| Section heading h2 | `.section-heading` / `.section-heading.is-revealed` |
| Section spacing class | `.section-spacing` (padding: 100px 0 desktop, 64px 0 mobile) |
| Data-reveal elements | `[data-reveal]` / `[data-reveal].is-revealed` |
| Scroll-reveal stagger | `[data-stagger="0"]` … `[data-stagger="6"]` |
| Container | `.container` (max-width: 1400px, padding: 0 40px) |

---

## 3. CSS ARCHITECTURE

### CSS Variables (:root in theme.css lines 9–39)
```
Color palette:
  --ivory:        #ffffff   (pure white — page background)
  --ivory-dk:     #e8e8e8   (light grey border)
  --blush:        #d4d4d4   (light grey)
  --blush-dk:     #888888   (mid grey)
  --rose:         #333333   (dark grey — hover/accent)
  --sage:         #555555   (mid-dark grey)
  --sage-lt:      #cccccc   (light grey)
  --espresso:     #000000   (pure black)
  --espresso-lt:  #333333   (dark grey)
  --gold:         #000000   (black — replaces gold)
  --gold-lt:      #dddddd   (light grey)
  --white:        #ffffff

Accent layer:
  --accent:       #FFEB3B   (yellow — CTA buttons, highlights)
  --accent-hover: #FDD835   (slightly deeper yellow)
  --accent-soft:  #FFF9C4   (pale yellow backgrounds)
  --price-sale:   #E8775A   (coral — sale prices)

Typography:
  --font-display: 'Cormorant Garamond', Georgia, serif
  --font-body:    'DM Sans', 'Jost', 'Helvetica Neue', sans-serif

Motion:
  --transition:      0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
  --transition-slow: 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)

Shape (overridden by layout/theme.liquid <style> from settings.border_radius):
  --radius:    4px   (overridden by settings to 15px by default)
  --radius-lg: 10px  (not connected to settings — fixed value)

Shadow:
  --shadow:    0 4px 20px rgba(0,0,0,0.07)
  --shadow-lg: 0 12px 48px rgba(0,0,0,0.13)

Computed at runtime by JS:
  --sticky-bar-height: measured from #sticky-bar.offsetHeight (JS sets on load + resize)
```

### CSS Variables Override — layout/theme.liquid `<style>` block
```css
/* Outputs after theme.css link — overrides :root values */
:root {
  --radius: {{ settings.border_radius | default: 15 }}px;
}
```

### All Breakpoints (exact px values)
| Breakpoint | Usage |
|-----------|-------|
| `max-width: 400px` | Auth form single column |
| `max-width: 480px` | Header inner tighten; product grid 1 col; ATC button fullwidth |
| `max-width: 560px` | Blog grid 1 col; newsletter 1 col |
| `max-width: 600px` | Policy grid 2→4 col |
| `max-width: 640px` | Footer nav, footer body, about stats grid |
| `max-width: 720px` | Order detail 1 col |
| `max-width: 767px` | **MOBILE breakpoint** — all TTB fixes use exactly this |
| `max-width: 768px` | **Base CSS mobile** — product-layout 1 col, gallery grid change, section-spacing 64px, container padding 20px |
| `max-width: 800px` | FAQ layout, blog featured 1 col |
| `max-width: 900px` | PDP grid, pair-with, similar carousel, contact layout |
| `max-width: 960px` | Collection cards |
| `max-width: 1000px` | Policy layout, article layout |
| `max-width: 1024px` | Footer trust grid, about layout |
| `max-width: 1100px` | Footer body 2 col, footer nav cols |
| `min-width: 768px` | **DESKTOP breakpoint** — all TTB desktop fixes use this |
| `min-width: 768px` (4031) | Size sheet handle hidden |

### Major CSS Section Locations (approximate line numbers)
| Section | Lines |
|---------|-------|
| :root variables | 9–39 |
| Reset & base | 41–57 |
| Container, typography, buttons | 64–210 |
| Announcement bar | ~216 |
| Header / site-header | 233–410 |
| Mobile drawer | ~411–500 |
| Cart drawer | 1240–1270 |
| Hero banner | ~1700+ |
| Product page styles | 1770+ |
| Product layout grid | 1774 |
| Product gallery | 1782–1870 |
| Gallery modes (scroll/grid) | 6840–7130 |
| Product info | 1927+ |
| Modals (size guide + variant) | 3420–3490 |
| Sticky bar | 3227–3236 |
| Search bar | 3248–3310 |
| Section spacing | 70 |
| Footer | ~1500+ |
| Collection page | ~3900+ |
| Collection product card | ~3990+ |
| Size sheet (bottom sheet) | ~4000–4031 |
| Newsletter popup | ~5400+ |
| Blog | ~5260+ |
| Account | ~4980+ |
| FAQ | ~5200+ |
| Reviews | 2697+ |
| Similar products | 2613+ |
| Pair with | 2399+ |
| Hero transparent header | 6123–6252 |
| Scroll reveal / animations | ~6080 |
| TTB MOBILE FIXES (old, harmless Dawn classes) | ~7796–7967 |
| TTB FIXES v3 | 7970–8221 |
| TTB FIXES v4 | 8223–8322 |
| TTB FIXES v5 | 8324–8408 |
| TTB FIXES v6 | 8410–8468 |
| TTB FIXES v7 | 8470–8589 |
| TTB FIXES v8 | 8591–8750+ |

---

## 4. JAVASCRIPT ARCHITECTURE

### theme.js — IIFEs and Event Listeners

**IIFE 1: Header Scroll (lines 1–14)**
- `window.scroll` → toggles `header.is-scrolled` when `scrollY > 40`

**IIFE 2: Mobile Menu (lines 16–24)**
- `#mobile-menu-toggle click` → toggles `#mobile-menu.is-open`

**IIFE 3: Search Overlay (lines 26–36)**
- `searchToggle click` → `searchOverlay.classList.add('is-open')`
- `searchClose click` / `searchOverlay click` → removes `is-open`

**IIFE 4: Cart Drawer (lines 38–115)**
- `#cart-toggle click` → `openCart()` → sets `aria-hidden="false"`, adds `is-visible` to overlay, `body.overflow = 'hidden'`, calls `fetchCart()`
- `#cart-drawer-close click` / `#cart-overlay click` → `closeCart()`
- `fetchCart()` → `/cart.js` GET → `renderCart(cart)`, `updateDiscountUI(cart)`

**IIFE 5 (STICKY BAR — main scroll logic, lines 515–700)**
- `setStickyBarHeight()` → reads `#sticky-bar.offsetHeight`, sets `--sticky-bar-height` on `documentElement`; fires on load + resize
- `updateHeaderOnScroll()` on `window.scroll`:
  - Toggles `#sticky-bar.is-scrolled` when `scrollY > 4`
  - On homepage (`body.has-transparent-header`): finds `#hero-section`, computes `threshold = hero.offsetHeight - stickyH`, toggles `body.header-scrolled` when `scrollY >= threshold`
- Search bar: `#search-toggle click` → `openSearch()` / `closeSearch()`, `Escape` key closes
- Mobile drawer: `#mobile-menu-toggle click` → `openDrawer()`, sets `aria-hidden="false"`, `body.overflow = 'hidden'`; `#mobile-drawer-close` / `#mobile-drawer-overlay click` → `closeDrawer()`
- Mobile nav accordion: `.mobile-nav-group__trigger click` → toggles parent `is-open`
- Back to top: shows `#back-to-top.is-visible` when `scrollY / total >= 0.7`
- Review lightbox: `.review-image-thumb click` → `#review-lightbox.classList.add('is-open')`

**IIFE 6: Scroll Dots (lines 704–757)**
- IntersectionObserver on each `.product-card__image-link` / `.cpc-image-link` within its scroll parent
- Updates `.scroll-dot.is-active` as images scroll into view

**IIFE 7: Collection Card Carousels (lines 759–823)**
- `initCarousel(wrap)` — for each `.cpc-image-wrap[data-images]`, creates prev/next arrows, `goTo(idx)` cross-fades image with 200ms opacity transition
- Swatch click → `setImages()` to filter images by color name prefix
- Arrow key nav when hovering a card

**IIFE 8: Size Sheet (lines 825–1002)**
- `.cpc-add-btn click` → if `data-has-variants` → `openSheet(card, btn)` → populates sheet with title, thumbnail, size pills from `card.dataset.variants`
- Size pill click → `confirmAddToCart(variantId, btn)` → `/cart/add.js` POST → opens cart drawer
- Swatch click → updates `addBtn.dataset.variantId`, filters carousel images by color

**IIFE 9: TTB PDP Gallery (lines 1004–1123)**
- Reads `data-gallery-mode` from `.product-gallery`
- Mode "scroll": track = `#gallery-scroll-track`, items = `.gallery-scroll-item`
- Mode "grid": track = `#gallery-grid-track`, items = `.gallery-grid-item`
- Mode "slideshow": track = `#gallery-track`, items = `.gallery-slide`
- `isMobile = window.innerWidth <= 767`
- `scrollToIndex(idx)` → `track.scrollTo({ left: track.offsetWidth * idx })`
- `initDots()` — if mobile AND ≥2 items: creates `.gallery-dots` container with buttons, appends to `#gallery-main`, syncs active dot on track scroll
- `initVariantImageSwitch()` — reads `#product-variants-json`, listens to `.color-swatch-input, .size-btn-input change` → finds matching variant → calls `scrollToIndex(variant.featured_image.position - 1)`

**IIFE 10: Sticky ATC Bar (lines 1125–1180)**
- Only runs if `window.innerWidth <= 767`
- IntersectionObserver on `[name="add"]` (native ATC button) → toggles `#sticky-atc-bar.is-visible` and `aria-hidden` when button scrolls out of view
- `#sticky-atc-btn click` → validates all `fieldset[data-option-index]` and `select[data-option-index]` → clicks `nativeBtn` if valid, else scrolls to invalid and adds `.variant-required-error`

### product-page.js — Event Listeners

**Gallery:**
- Slideshow mode: thumb click → `showSlide(idx)`, prev/next arrows → `showSlide()`, touch start/end → swipe detection → `showSlide()`
- Scroll mode: thumb click → `window.scrollTo()` to `#gallery-scroll-{idx}`, IntersectionObserver syncs active thumb

**Variant selector:**
- `.size-btn-input, .color-swatch-input change` → `findVariant()` → updates `#variant-id`, price display, availability (shows/hides `#qty-atc-row` vs `#notify-me-row`), triggers gallery scroll to variant image

**Add to cart:**
- `#product-form submit` → `/cart/add.js` → opens `#cart-drawer`, calls `fetchCart()`

**Quantity:**
- `#qty-minus / #qty-plus click` → increments/decrements `#product-quantity`

**Accordions:**
- `.accordion-trigger click` → toggles `.is-open` on parent `.accordion`, toggles `body.style.display`

**Wishlist:**
- `#wishlist-btn click` → toggles `.is-active`, fills heart SVG

**Similar carousel:**
- `#similar-prev / #similar-next click`, touch swipe → `goToSim()` → CSS transform on `#similar-track`
- `getSlidesPerView()`: ≤480px → 1, ≤768px → 2, else → 4

**Reviews:**
- Write review: `#write-review-btn click` → sets `aria-hidden="false"` on `#review-form-wrap`
- Star picker: hover fills stars, click sets `#review-rating`
- Fit buttons: `.fit-btn click` → active state
- Helpful votes: `.helpful-btn click` → increments count

### animations.js — Event Listeners / Observers

- `IntersectionObserver` on `[data-reveal]` → adds `.is-revealed` (fires once, threshold: 0.12)
- `IntersectionObserver` on `.section-heading` → adds `.is-revealed` (threshold: 0.3)
- `IntersectionObserver` on `[data-count-to]` → animate counter 0 → N (threshold: 0.5)
- `window.scroll` + `requestAnimationFrame` → parallax on `.hero-bg, .about-hero__img, .article-hero__img` (±40px max shift)
- Mega menu: `touchstart` on document → `body.is-touch`; nav link click (touch mode) → toggle `.is-open` on `.nav-item--mega`; `mouseenter/leave` → `aria-expanded`; `touchstart` outside → `closeAll()`; `Escape` → `closeAll()`
- Card tilt: `mousemove` on `.collection-product-card` → `perspective(1000px) rotateX rotateY`
- Page transition (opt-in via `body.enable-page-transitions`): link click → fade out `body`, navigate

### Scroll-based class toggles
| Class | Element | Threshold |
|-------|---------|-----------|
| `is-scrolled` | `header#site-header` | `scrollY > 40` |
| `is-scrolled` | `#sticky-bar` | `scrollY > 4` |
| `header-scrolled` | `body` | `scrollY >= hero.offsetHeight - stickyBarHeight` (homepage only, fallback 80px) |
| `is-visible` | `#back-to-top` | `scrollY / totalScroll >= 0.7` |
| `is-visible` | `#sticky-atc-bar` (mobile only) | native ATC button out of viewport (IntersectionObserver) |
| `is-revealed` | `[data-reveal]` | 12% in viewport (IntersectionObserver) |
| `is-revealed` | `.section-heading` | 30% in viewport (IntersectionObserver) |

---

## 5. LIQUID ARCHITECTURE

### layout/theme.liquid Structure
```
<html>
  <head>
    SEO: title, meta description, canonical, robots
    Open Graph tags (product, collection, article, default)
    Twitter Card tags
    JSON-LD (Product + BreadcrumbList for PDP, ClothingStore for index/page, Article)
    {{ content_for_header }}  ← Shopify injects analytics, consent
    Google Fonts: Cormorant Garamond + DM Sans
    {{ 'theme.css' | asset_url | stylesheet_tag }}
    <style>:root { --radius: {{ settings.border_radius | default: 15 }}px; }</style>
    <script src="discount-engine.js" defer>
  </head>
  <body class="
    [customer-logged-in if logged in]
    template-{{ template | handle }}   ← e.g. template-product, template-index
    [has-transparent-header if template == 'index']
  ">
    <div id="sticky-bar" class="sticky-bar">
      {% section 'announcement-bar' %}   ← generates #shopify-section-announcement-bar
      {% section 'header' %}             ← generates #shopify-section-header
    </div>
    <main id="MainContent" role="main" tabindex="-1">
      {{ content_for_layout }}           ← renders template sections
    </main>
    {% section 'footer' %}
    <div id="cart-drawer">{% section 'cart-drawer' %}</div>
    <div class="cart-overlay" id="cart-overlay"></div>
    {% section 'discount-popup' %}
    {% section 'newsletter-popup' %}
    <button id="back-to-top">...</button>
    <div class="review-lightbox" id="review-lightbox">...</div>
    window.shopName, window.cartUrl, window.moneyFormat globals
    <script src="theme.js" defer>
    <script src="animations.js" defer>
    [if template == 'product'] <script src="product-page.js" defer>
    [if template contains 'collection'] <script src="collection-filters.js" defer>
    <div class="gallery-lightbox" id="gallery-lightbox">...</div>
  </body>
</html>
```

### Body classes applied
- `customer-logged-in` — when `{{ customer }}` is truthy
- `template-product`, `template-index`, `template-collection`, etc. — always
- `has-transparent-header` — only on homepage (`template == 'index'`)

### Templates → Sections mapping
| Template | Sections rendered |
|----------|------------------|
| `templates/index.json` | hero-banner, featured-collections, discount-carousel, product-grid, trust-cards, testimonials, subscribe-cta |
| `templates/product.liquid` | product-hero, pair-with, similar-products, product-reviews |
| `templates/collection.liquid` | collection-products |
| `templates/cart.liquid` | cart-page |
| `templates/article.liquid` | blog-article |
| `templates/blog.liquid` | blog-listing |
| `templates/page.about.liquid` | page-about |
| `templates/page.contact.liquid` | page-contact |
| `templates/page.faq.liquid` | page-faq |
| `templates/page.returns.liquid` | page-returns |
| `templates/customers/account.liquid` | customers-account |
| `templates/customers/addresses.liquid` | customers-addresses |
| `templates/customers/login.liquid` | customers-login |
| `templates/customers/order.liquid` | customers-order |
| `templates/customers/register.liquid` | customers-register |
| `templates/customers/reset_password.liquid` | customers-reset-password |

### Settings flow: schema → Liquid → CSS
1. `config/settings_schema.json` defines setting types, IDs, defaults
2. Shopify admin writes user values to `config/settings_data.json`
3. In Liquid: `{{ settings.setting_id }}` outputs the value
4. In `layout/theme.liquid` `<style>` block: `--radius: {{ settings.border_radius }}px` → overrides CSS variable
5. Gallery mode: `{{ settings.global_gallery_mode }}` used in `product-hero.liquid` to set `data-gallery-mode` attribute and conditionally render the correct gallery container

### Snippets and where rendered
| Snippet | Rendered by |
|---------|-------------|
| `account-nav.liquid` | customers-account, customers-addresses, customers-order, customers-reset-password |
| `product-card.liquid` | product-grid.liquid (legacy card) |
| `product-card-placeholder.liquid` | product-grid.liquid (when no products) |
| `similar-card.liquid` | similar-products.liquid |

---

## 6. THEME SETTINGS

### settings_schema.json — All groups and settings

**Group: Social Media & SEO**
| ID | Type | Default |
|----|------|---------|
| `twitter_handle` | text | (none) |
| `og_image` | image_picker | (none) |
| `google_analytics_id` | text | (none) |

**Group: Product Pages**
| ID | Type | Default |
|----|------|---------|
| `global_gallery_mode` | select | `"slideshow"` |
| `grid_first_image_ratio` | select | `"3/4"` |
| `grid_secondary_ratio` | select | `"1/1"` |
| `grid_gap` | range (0–20, step 2) | `4` |

**Group: Design** *(added in v8 session)*
| ID | Type | Default |
|----|------|---------|
| `border_radius` | range (0–30, step 1, unit px) | `15` |

### Settings currently wired to CSS variables
| Setting ID | CSS variable | Where output |
|-----------|-------------|-------------|
| `border_radius` | `--radius` | `layout/theme.liquid` `<style>` block |
| `global_gallery_mode` | `data-gallery-mode` attribute | `product-hero.liquid` line ~32 |

### Live values in settings_data.json (current store)
| Setting | Current value |
|---------|--------------|
| Announcement bar bg_color | `#2c1f18` (dark espresso) |
| Announcement bar text_color | `#f9f3ee` |
| Product hero gallery_mode | `"grid"` (section-level override) |
| Product hero add_to_cart_text | `"Add to Basket"` |

---

## 7. GALLERY SYSTEM

### Three Modes — Full Explanation

The gallery mode is determined by:
1. `section.settings.gallery_mode` (per-product, set in Theme Editor → Product Hero)
2. Falls back to `settings.global_gallery_mode` (global default, currently `"slideshow"`)
3. Falls back to `"slideshow"` if both are blank

**Current live mode: `"grid"` (section-level override on product-hero)**

The `data-gallery-mode` attribute is written to `.product-gallery` and read by both CSS and JS.

### Mode 1: Slideshow (`data-gallery-mode="slideshow"`)
**DOM structure:**
```
.product-gallery
  .gallery-thumbs          ← thumbnail strip (hidden on mobile)
  #gallery-main.gallery-main
    #gallery-track.gallery-main__inner   ← the scroll container on mobile
      .gallery-slide.is-active           ← first image (visible)
      .gallery-slide                     ← subsequent images (hidden)
    .gallery-zoom-hint
    #gallery-prev .gallery-arrow
    #gallery-next .gallery-arrow
```
**Desktop CSS:** Position:absolute cross-fade slideshow. All slides `position:absolute; inset:0; opacity:0`. Only `.is-active { opacity:1 }`. JS (product-page.js) toggles `is-active` on thumb/arrow click and swipe.

**Mobile CSS (v3 + v6 + v7 belt-and-suspenders):**
- `.gallery-main { overflow:hidden; aspect-ratio:3/4 }`
- `.gallery-main__inner { display:flex; flex-direction:row; overflow-x:scroll; scroll-snap-type:x mandatory }`
- `.gallery-slide { position:relative; opacity:1; flex:0 0 100%; height:100% }`
- JS `initDots()` adds `.gallery-dots` container inside `#gallery-main`

### Mode 2: Scroll (`data-gallery-mode="scroll"`)
**DOM structure:**
```
.product-gallery
  .gallery-thumbs          ← horizontal strip on mobile/tablet, vertical on desktop
  #gallery-main.gallery-main   ← aspect-ratio unset, overflow:visible on desktop
    #gallery-scroll-track.gallery-scroll-stack
      .gallery-scroll-item (each image)
```
**Desktop:** Vertical stack of all images at full width, user scrolls through them naturally. Thumbnail syncs via IntersectionObserver. `.gallery-main__inner`, arrows, and zoom hint are `display:none !important`.

**Mobile:** Converted to horizontal snap-scroll carousel by v3 CSS. Each `.gallery-scroll-item` gets `flex:0 0 100%; scroll-snap-align:start`.

### Mode 3: Grid (`data-gallery-mode="grid"`)
**DOM structure:**
```
.product-gallery
  .gallery-thumbs          ← hidden on desktop when grid mode active (via JS)
  #gallery-main.gallery-main   ← aspect-ratio unset, overflow:visible on desktop
    #gallery-grid-track.gallery-grid-stack
      .gallery-grid-item.gallery-grid-item--full  ← first image, full width
      .gallery-grid-item.gallery-grid-item--half  ← rest, 2-column grid
```
**Desktop:** CSS grid `grid-template-columns: 1fr 1fr`. First item `grid-column: 1/-1`. `.gallery-main__inner`, scroll-stack, arrows, and zoom hint are `display:none !important`.

**Mobile:** Converted to horizontal snap-scroll carousel by v3 CSS. All `.gallery-grid-item` get `flex:0 0 100%; scroll-snap-align:start`.

### Classes shown/hidden per mode
| Class | slideshow | scroll | grid |
|-------|-----------|--------|------|
| `.gallery-main__inner` | ✅ shown | ❌ `display:none!important` | ❌ `display:none!important` |
| `.gallery-scroll-stack` | ❌ `display:none!important` | ✅ shown | ❌ `display:none!important` |
| `.gallery-grid-stack` | ❌ (not in DOM) | ❌ (not in DOM) | ✅ shown |
| `.gallery-thumbs` | ✅ desktop / ❌ mobile | ✅ desktop / ❌ mobile | ❌ `display:none` (JS hides on desktop) |
| `.gallery-arrow` | ✅ desktop (CSS hover) | ❌ `display:none!important` | ❌ `display:none!important` |
| `.gallery-zoom-hint` | ✅ desktop | ❌ `display:none!important` | ❌ `display:none!important` |

### Mobile vs Desktop gallery (after all fixes)
**Desktop (≥768px):**
- Slideshow: cross-fade opacity transition, JS controls via `is-active` class
- Scroll: vertical image stack with IntersectionObserver thumb sync
- Grid: CSS grid layout with first image full-width
- All: thumbnail strip visible (v7 v8: explicitly desktop `display:block` belt-and-suspenders)

**Mobile (≤767px):**
- ALL modes: horizontal snap-scroll carousel (one image per screen)
- `.gallery-thumbs` hidden via `max-width:768px` rule (extended in v8)
- Dot indicators injected by TTB PDP Gallery IIFE inside `#gallery-main` (absolute positioned at bottom-left)
- `.gallery-main { overflow:hidden; aspect-ratio:3/4 }` (v6)
- `.gallery-slide` in slideshow mode: `position:relative; opacity:1` (v6), `flex:0 0 100%; height:100%` (v3)

---

## 8. KNOWN ISSUES & RECENT CHANGES

### All fixes applied (by version)

#### TTB FIXES v3 (file: theme.css, lines 7970–8221)
**What:** First consolidated fix block after session 1.
- ISSUE 1: Transparent header — scoped to mobile (solid white) and desktop (transparent → solid on scroll). Fixed `-webkit-text-fill-color` leak.
- ISSUE 2: Cart icon clipping at 375px/480px — `overflow:visible` on `.header-inner`, tighter padding.
- ISSUE 3: PDP gallery carousel on mobile — converts all three gallery modes (slideshow/scroll/grid) to horizontal snap-scroll carousels. Hides `.gallery-thumbs`.

#### TTB FIXES v4 (file: theme.css, lines 8223–8322)
**What:** Session 2 fixes.
- ISSUE 1: Desktop transparent header — clears background on `#sticky-bar` and `#shopify-section-header` when `body.has-transparent-header:not(.header-scrolled)`.
- ISSUE 2: Mobile header double-sticky — `#shopify-section-header { position:static !important }` on mobile.
- ISSUE 3: Gallery dot indicators — base CSS for `.gallery-dots` and `.gallery-dot`; JS injects into DOM.
- ISSUE 5: Wishlist inline with qty — flex row with `order` properties.
- ISSUE 6: `.product-layout { gap: 12px }` on mobile.

#### TTB FIXES v5 (file: theme.css, lines 8324–8408)
**What:** Session 2 fixes continued.
- ISSUE 1: Mobile — remove all sticky overlays (`#shopify-section-header { position:static }`, `.product-info { position:static }`) on mobile.
- ISSUE 2: Mobile — dot indicators repositioned as absolute inside `#gallery-main` at bottom-left.
- ISSUE 3: Mobile — qty-inline compact (`flex:0 0 auto`).
- ISSUE 4: Desktop — `#shopify-section-header { position:relative }` (removes nested sticky). **NOTE: This was later partially reversed in v7.**
- ISSUE 5: Desktop PDP layout — `.product-breadcrumb { grid-column:1/-1 }`, `.sticky-atc-bar { display:none }` on desktop.

#### TTB FIXES v6 (file: theme.css, lines 8410–8468)
**What:** Critical gallery carousel fix.
- ROOT CAUSE: `.gallery-slide { position:absolute; opacity:0 }` (desktop cross-fade) was never overridden for mobile. The v3 flex carousel had no effect because absolute children are removed from flex flow.
- FIX: On mobile → `.gallery-slide { position:relative; inset:auto; opacity:1; height:100% }`. Also hides `.gallery-zoom-hint` and `.gallery-arrow` on mobile.

#### TTB FIXES v7 (file: theme.css, lines 8470–8589)
**What:** Session 3 desktop header, PDP layout, gallery fixes.
- ISSUE 1: Desktop header disappearing after scroll — Two fixes: (a) `html, body { overflow-x:clip }` replaces `overflow-x:hidden` to prevent scroll container trapping sticky; (b) `#shopify-section-header { position:sticky; top:0; z-index:200 }` restored on desktop (overrides v5's `position:relative`). `#sticky-bar` reinforced with `!important`.
- ISSUE 2: Desktop PDP info column missing — Explicit `grid-column` and `grid-row` on all `.product-layout` children: breadcrumb→row1/1-1, gallery→row2/col1, info→row2/col2, sticky-atc→`display:none`.
- ISSUE 3: Desktop gallery stacking — Belt-and-suspenders: `.gallery-main__inner { display:block }`, `.gallery-slide { position:absolute; opacity:0 }`, `.gallery-slide.is-active { opacity:1 }` on desktop.

#### TTB FIXES v8 (file: theme.css, lines 8591+)
**What:** Session 4 fixes (modal z-index, image dedup, product-hero bg, global border-radius).
- ISSUE 1: `.modal-overlay` covering header — default `z-index:500; pointer-events:none`; restored to `z-index:3000; pointer-events:auto` when `aria-hidden="false"`.
- ISSUE 2: Image duplication on mobile — Extended `.gallery-thumbs { display:none }` to `max-width:768px` (was 767px). Added mode-specific belt-and-suspenders hiding on mobile.
- ISSUE 3: Green blank space — `.product-hero { background:var(--ivory,#ffffff) }` (explicit white background to prevent color bleed in padding area).
- ISSUE 4C: Global border-radius — applied `var(--radius)` to: `.gallery-main`, `.gallery-scroll-item`, `.product-badge`, `.product-badge--discount`, `.collection-card`, `.pair-with-card`, `.cart-drawer`, `.header-search-form`, `.product-savings`, `.similar-card__image-wrap`, `.product-bundle-nudge`.

#### TTB FIXES v8 — Additional file changes
- **`layout/theme.liquid`** — Added `<style>:root { --radius:{{ settings.border_radius | default:15 }}px; }</style>` after theme.css link.
- **`config/settings_schema.json`** — Added "Design" group with `border_radius` range setting (min:0, max:30, step:1, unit:px, default:15).

### Critical CSS Rules to be aware of
| Rule | Location | Why important |
|------|----------|---------------|
| `#sticky-bar { position:sticky; top:0; z-index:1000 }` | line 3227 | THE sticky element — all header stickiness relies on this |
| `#shopify-section-header { position:sticky; top:0; z-index:200 }` | line 7566 (no media query!) | Fallback sticky — restored on desktop in v7 |
| `#shopify-section-header { position:static !important }` | v5 mobile block | Mobile only — correctly removes nested sticky on mobile |
| `.gallery-slide { position:absolute; inset:0; opacity:0 }` | line 1828 | Desktop cross-fade slideshow — v6 overrides this for mobile |
| `body.has-transparent-header #MainContent { margin-top:calc(-1*var(--sticky-bar-height)) }` | line 6142 | Pulls hero behind header on homepage only |
| `.modal-overlay { z-index:3000 }` | line 3425 | Now overridden to 500 by v8 when modal is closed |
| `html, body { overflow-x:clip }` | v7 (no media query) | Prevents scroll container from trapping position:sticky |

### Known remaining gaps / uncertainties
- The `--sticky-bar-height` JS sets on load/resize. On first paint, the CSS variable may briefly be the fallback `80px`. Not a visible issue.
- `#hero-section` ID is used by JS to calculate transparent header threshold. If the hero section changes ID, the fallback 80px kicks in.
- `border_radius` global setting default is `15px` but the original `:root { --radius: 4px }` in theme.css will be overridden only when Liquid renders. In Shopify Theme Preview, the setting needs to be explicitly set once.

---

## 9. SHOPIFY SECTION ARCHITECTURE

### Every section, its purpose, and schema settings

#### announcement-bar.liquid
**Purpose:** Auto-scrolling ticker at very top of every page (inside `#sticky-bar`).  
**Schema settings:** `text_1, url_1, text_2, url_2, text_3, url_3` (messages with optional links), `divider` (symbol), `bg_color` (#FFEB3B default), `text_color` (#F9F3EE default), `speed` (15–80s, default 35).  
**Used in:** All pages (global via layout/theme.liquid).

#### header.liquid
**Purpose:** Main navigation — mobile drawer, desktop mega-menu, logo, actions.  
**Schema settings:** `logo` (image_picker), `logo_height/width` (range), `logo_height_mobile/width_mobile`, `menu` (link_list), `girls_menu/boys_menu/family_menu` (link_list), `girls_title/desc/cta/url`, `boys_title/desc/cta/url`, `family_title/desc/cta/url`, `mega_eyebrow`, `drawer_pages_heading`, `page1–4_label/url` (drawer extra pages), `search_placeholder`.  
**Used in:** All pages (global via layout/theme.liquid).

#### hero-banner.liquid
**Purpose:** Full-width homepage hero with background image and CTAs.  
**Schema settings:** `image` (image_picker), `image_mobile` (image_picker), `height` (small/medium/large/full), `overlay_opacity` (0–80), `text_align` (left/center/right), `content_position` (top/center/bottom), `eyebrow`, `heading`, `heading_size` (small/medium/large), `subheading`, `cta_1_text/url`, `cta_2_text/url`, `show_scroll` (bool), `scroll_label`.  
**Used in:** `templates/index.json`.

#### featured-collections.liquid
**Purpose:** Homepage category grid — up to 6 collection cards.  
**Schema blocks:** `collection` type with: `collection` (collection picker), `label`, `subtitle`, `url`.  
**Schema settings:** `eyebrow`, `heading`, `subheading`, `cta_label`.  
**Used in:** `templates/index.json`.

#### discount-carousel.liquid
**Purpose:** Bundle discount tier explainer with animated cards.  
**Schema settings:** `eyebrow`, `heading`, `subheading`, `shop_url`, `shop_btn_text`, `popular_badge`, `unlock_text`, `tier1–4_title/pct/desc`.  
**Used in:** `templates/index.json`.

#### product-grid.liquid
**Purpose:** Reusable product grid that can show multiple collections.  
**Schema blocks:** `collection` type with: `collection`, `eyebrow`, `heading`, `view_all_text`, `products_count`, `columns`.  
**Schema settings:** `eyebrow`, `heading`, `collection`, `products_count` (4–24), `columns` (2–5), `view_all_text`.  
**Used in:** `templates/index.json`, potentially other templates.

#### testimonials.liquid
**Purpose:** Customer quote carousel.  
**Schema blocks:** `testimonial` type with: `quote`, `name`, `subtitle`, `rating` (1–5).  
**Schema settings:** `eyebrow`, `heading`, `subheading`, `bg_color`.  
**Used in:** `templates/index.json`.

#### trust-cards.liquid
**Purpose:** Horizontal trust icon strip.  
**Schema blocks:** `card` type with: `icon` (select: shipping/returns/support/secure/star/heart), `title`, `description`.  
**Schema settings:** (none — all in blocks).  
**Used in:** `templates/index.json`.

#### subscribe-cta.liquid
**Purpose:** Email subscription strip.  
**Schema settings:** `heading`, `label`, `placeholder`, `button_text`, `success_message`.  
**Used in:** `templates/index.json`.

#### product-hero.liquid
**Purpose:** Main PDP section — the central product display.  
**Schema settings:** `tax_note`, `add_to_cart_text`, `sold_out_text`, `quantity_label`, `bundle_label`, `write_review_text`, `bxgy_note`, `gallery_mode` (global/slideshow/scroll/grid), `scroll_aspect` (3/4, 4/5, 1/1), `scroll_gap` (0–20), `scroll_sticky_thumbs` (bool), `new_badge_text`, `care_instructions`, `shipping_info`, `badge_size` (12–32), share toggles (whatsapp/facebook/twitter/pinterest/instagram/tiktok/email/copy_link).  
**Schema blocks:** `trust_badge` type with: `icon` (10 options), `text`, `custom_icon`.  
**Used in:** `templates/product.liquid`.

#### pair-with.liquid
**Purpose:** "Complete the Look" companion products (conditional — hidden if no pairs).  
**Data source:** `product.metafields.custom.pair_with` (list of products) OR Theme Editor blocks.  
**Schema settings:** `eyebrow`, `heading`, `subheading`.  
**Schema blocks:** `pair_product` type with: `product` (product picker).  
**Used in:** `templates/product.liquid`. Renders nothing if `pair_count == 0`.

#### similar-products.liquid
**Purpose:** "Similar Pieces" — always renders regardless of content.  
**Data source:** `product.metafields.custom.similar_products` OR `section.settings.collection`.  
**Schema settings:** `eyebrow`, `heading`, `collection` (collection picker), `products_count` (4–20).  
**Used in:** `templates/product.liquid`. **Always renders the `<section>` tag**.

#### product-reviews.liquid
**Purpose:** Customer reviews section.  
**Schema settings:** `eyebrow`, `heading`, `write_heading`, `submit_btn`, `cancel_btn`, `load_more_btn`, `empty_text`, `photo_label`, `verified_label`, `reviews_per_page` (3–20), `show_photos` (bool), `show_helpful` (bool).  
**Used in:** `templates/product.liquid`.

#### collection-products.liquid
**Purpose:** Full collection page layout with filters and product grid.  
**Filter system:** Products are filtered by tags in format `filter-{Group}:{Value}` (handled client-side by collection-filters.js).  
**Schema settings:** `filters_label`, `clear_label`, `sort_label`, `sort_featured`, `new_badge`, `sort_newest`, `products_per_page` (8–48), `grid_columns` (2/3/4), `show_filters` (bool), `show_product_count` (bool).  
**Used in:** `templates/collection.liquid`.

#### cart-page.liquid
**Purpose:** Full /cart page.  
**Schema settings:** `title`, `summary_title`, `bundle_label`, `secure_label`, `returns_label`, `empty_heading`, `empty_sub`, `empty_cta`, `empty_url`.  
**Used in:** `templates/cart.liquid`.

#### cart-drawer.liquid
**Purpose:** Slide-in cart panel. Rendered once in layout/theme.liquid inside `#cart-drawer`.  
**Schema settings:** `subtotal_label`, `checkout_btn`, `empty_cta`, `title`, `empty_text`, `view_cart_text`, `shipping_message`.  
**Used in:** layout/theme.liquid (global).

#### discount-popup.liquid
**Purpose:** Fixed bottom-right popup showing cart progress toward next bundle tier.  
**Schema settings:** `heading`, `icon`, `cta_text`, `cta_url`.  
**Used in:** layout/theme.liquid (global).

#### newsletter-popup.liquid
**Purpose:** Email capture modal popup. Fires after delay, stores suppression in localStorage.  
**Schema settings:** `image`, `eyebrow`, `heading`, `subtext`, `show_offer` (bool), `incentive_text`, `offer_code`, `offer_text`, `button_text`, `delay_seconds` (0–30), `redisplay_days` (0–90).  
**Used in:** layout/theme.liquid (global).

#### footer.liquid
**Purpose:** Global site footer.  
**Schema settings:** `trust1–5_icon/label/sub` (5 trust items), `brand_desc`, `contact_email/phone/address/hours`, `instagram/pinterest/facebook/whatsapp` (social URLs), `newsletter_label/placeholder/success`, `col1–5_menu` (link_lists), `col1–5_heading`, `copyright_suffix`.  
**Used in:** layout/theme.liquid (global).

#### blog-article.liquid
**Purpose:** Individual blog post.  
**Schema settings:** (minimal — reads `article` object directly).  
**Used in:** `templates/article.liquid`.

#### blog-listing.liquid
**Purpose:** Blog index with featured article + grid.  
**Schema settings:** (reads `blog` object directly).  
**Used in:** `templates/blog.liquid`.

#### page-about.liquid, page-contact.liquid, page-faq.liquid, page-returns.liquid
**Purpose:** Static informational pages.  
**Schema settings:** Each has relevant content settings (headings, text, images, contact details, FAQ Q&A blocks).  
**Used in:** Respective `templates/page.*.liquid`.

#### customers-*.liquid (6 files)
**Purpose:** Shopify customer account pages.  
**Schema settings:** Labels, headings, form copy.  
**Used in:** `templates/customers/*.liquid`.

#### image-gallery.liquid, image-with-text.liquid, multi-column.liquid, product-spotlight.liquid, promo-banner.liquid, rich-text.liquid
**Purpose:** Flexible content sections for any page template.  
**Used in:** Available for Theme Editor sections but not currently in any template's default order.

---

## QUICK REFERENCE — Strict Rules for Claude Code Sessions

```
BRANCH:   claude/frosty-driscoll-5727ac only
WORKTREE: C:\Hitesh Downloads\baby-elegance-updated\.claude\worktrees\frosty-driscoll-5727ac\

CSS RULE 1:  Append ALL CSS to the END of assets/theme.css only. Never modify existing rules.
CSS RULE 2:  Mobile-only rules → @media (max-width: 767px)
CSS RULE 3:  Desktop-only rules → @media (min-width: 768px)
CSS RULE 4:  Never mix mobile and desktop rules in the same block.

GIT RULE:    Output git command as text — never run it.
             Format:
               cd "C:\Hitesh Downloads\baby-elegance-updated\.claude\worktrees\frosty-driscoll-5727ac"
               git add <files>
               git commit -m "<message>"
               git push origin HEAD:claude/frosty-driscoll-5727ac

SILENT MODE: Output git commit command then say "Changes made."

BODY CLASS   has-transparent-header → homepage only (template == 'index')
TRUTH:       header-scrolled → added by JS when scrolled past hero threshold
             is-scrolled → on #sticky-bar when scrollY > 4px
             is-touch → on body when touch device detected
```
