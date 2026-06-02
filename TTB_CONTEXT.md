# TTB_CONTEXT.md — Baby Elegance / The Tiny Bosses Theme
**Branch:** `claude/frosty-driscoll-5727ac`
**Worktree:** `C:\Hitesh Downloads\baby-elegance-updated\.claude\worktrees\frosty-driscoll-5727ac\`
**Generated:** 2026-06-02 (v9 — full read of every file)
**Purpose:** Complete codebase context — read this file only. No other file needs to be read unless a specific line must be verified.

---

## 1. REPO FILE MAP

### assets/
| File | Lines | Description |
|------|-------|-------------|
| `theme.css` | ~7924 | Master stylesheet. Base styles + TTB fix blocks v3–v9 appended at bottom. **NEVER modify existing rules — only append to the end.** |
| `theme.js` | 1181 | Master JS: 8 IIFEs — header scroll, cart drawer + discount UI + quick-add, global UI (search/drawer/back-to-top/lightbox), scroll dots, collection card carousels, size sheet + add-to-cart, TTB PDP gallery dots + variant switch, sticky ATC bar. |
| `product-page.js` | 938 | PDP-only JS: gallery slideshow & scroll, variant selector + price, ATC form, qty, accordions, wishlist, pair-with bundle + variant popup, similar products carousel, reviews, size guide popup, gallery lightbox, notify-me. |
| `animations.js` | 381 | IntersectionObserver scroll reveal (`[data-reveal]`→`.is-revealed`), stagger grids, parallax hero, animated counters (`[data-count-to]`), mega menu (desktop hover + iPad touch), card tilt, heading reveal (`.section-heading`), auto-instrument, page transitions (opt-in). |
| `collection-filters.js` | 315 | Client-side collection filtering: reads `filter-*` tags from `#collection-tags-data`, builds sidebar UI, applies filters via display:none toggle, sort via URL reload. |
| `discount-engine.js` | 57 | `window.DiscountEngine` IIFE: TIERS (2→5%, 3→10%, 4→15%, 5→20%), `getTier(itemCount)`, `applyDiscount(itemCount)` → updates cart attributes + note via `/cart/update.js`. Listens to `cart:updated` event. |
| `swatches.json` | 35 | Color swatch definitions: white (#FFFFFF/#E5E5E5), baby-pink (#F4C2C2/#E8A0A0), sage (#8E9B90/#6E7D70), oat (#D1C6B8/#B8A89A), dusty-blue (#A8B8C8/#8899AA). Fields: name, label, hex, border. Fetched by collection-products.liquid inline script. |

### sections/
| File | Description |
|------|-------------|
| `announcement-bar.liquid` | Scrolling ticker — up to 3 messages (text_1/2/3 + url_1/2/3), divider symbol, bg_color, text_color, CSS scroll speed. Items duplicated for seamless loop. |
| `blog-article.liquid` | Single blog post — hero, author, content, tags, share, sidebar, comments. |
| `blog-listing.liquid` | Blog index — featured article hero + article grid. |
| `cart-drawer.liquid` | Slide-in cart panel. Injects `window.bxgyProductIds` from `custom.discount == 'BXGY'` metafield. Renders discount tier track (`#tier-node-1/2/3`), items list (`#cart-drawer-items`), empty state (`#cart-empty`), footer with subtotal (`#cart-subtotal-price`), checkout (`#checkout-btn`), discount applied badge (`#cart-discount-applied`). |
| `cart-page.liquid` | Full /cart page — line items, subtotal, checkout. |
| `collection-products.liquid` | Collection page: hero (`.coll-hero`), sticky filter bar (`#coll-filter-bar`), sidebar (`#collection-sidebar`), product grid (`#collection-grid`). Injects tags JSON into `#collection-tags-data`. Renders `.collection-product-card` with `data-tags`, `data-variants`, `data-size-option-index`. Renders global size sheet (`#size-sheet`, `#size-sheet-backdrop`). Fetches `swatches.json` for swatch colors. |
| `customers-account.liquid` | Account dashboard — order list with `account-nav` snippet. |
| `customers-addresses.liquid` | Saved addresses management. |
| `customers-login.liquid` | Login / register / forgot-password forms. |
| `customers-order.liquid` | Individual order detail page. |
| `customers-register.liquid` | New account registration. |
| `customers-reset-password.liquid` | Password reset form. |
| `discount-carousel.liquid` | Bundle-and-save tier explainer: 4 animated discount cards, carousel (`#discount-track`, `#discount-prev/next/dots`), section progress bar (`#discount-progress-text`, `#discount-progress-fill`). |
| `discount-popup.liquid` | Fixed bottom-right popup (`#discount-popup`) — close `#discount-popup-close`, heading `#discount-popup-heading`, text `#discount-popup-text`, fill bar `#discount-popup-fill`. Auto-dismisses after 6s. |
| `featured-collections.liquid` | Homepage category grid — up to 6 collection blocks. |
| `footer.liquid` | Global footer — trust strip (5 items), brand info, social, newsletter, 5 nav columns, contact, copyright. |
| `header.liquid` | Mobile drawer (`#mobile-drawer`, `#mobile-drawer-overlay`), desktop mega menu (Girls/Boys/Family + menu-driven extras), logo (`.header-logo`), header actions (search `#search-toggle`, account `.header-account-wrap`, cart `#cart-toggle`). `#mega-backdrop` is last child inside `<header>` before search bar. Search bar: `#header-search-bar`. |
| `hero-banner.liquid` | Full-width hero. Section gets id `hero-section` from Liquid. `.hero-bg` background image, `.hero-heading`, `.hero-subheading`, 2 CTAs, scroll indicator. |
| `image-gallery.liquid` | Standalone image gallery — grid or masonry. |
| `image-with-text.liquid` | 50/50 split image + text. |
| `multi-column.liquid` | Multi-column text/icon content. |
| `newsletter-popup.liquid` | Email capture modal — `delay_seconds`, suppressed by `redisplay_days` in localStorage. |
| `page-about.liquid` | About Us — hero, story text + image, values grid, stats, team, CTA. |
| `page-contact.liquid` | Contact form + info cards. |
| `page-faq.liquid` | Accordion Q&A grouped by category, sticky sidebar. |
| `page-returns.liquid` | Returns & Exchanges policy page. |
| `pair-with.liquid` | "Complete the Look" on PDP. Data: `product.metafields.custom.pair_with.value` (list of products) OR Theme Editor blocks. **Only renders `<section>` if `pair_count > 0`** (current product excluded). Also renders `#variant-popup-overlay` modal for multi-variant paired products. |
| `product-grid.liquid` | Reusable product grid — multi-block (each block = one collection). Uses `product-card` snippet. |
| `product-hero.liquid` | Main PDP section — breadcrumb, gallery (3 modes controlled by `g_mode` Liquid var), product info panel, size guide modal (`#size-guide-overlay`), trust badge blocks, accordions, sticky ATC bar (`#sticky-atc-bar`). Outputs `<script type="application/json" id="product-variants-json">{{ product.variants | json }}</script>`. |
| `product-reviews.liquid` | PDP reviews — star display, submit form (`#review-form`), helpful votes, photo lightbox. |
| `product-spotlight.liquid` | Featured single product highlight section. |
| `promo-banner.liquid` | Promotional full-width text + CTA banner. |
| `rich-text.liquid` | Simple rich text content section. |
| `similar-products.liquid` | "Similar Pieces" on PDP. **Always renders `<section>` (no guard)**. Data: `product.metafields.custom.similar_products.value` → fallback: same collection → fallback: 4 placeholder cards. Renders via `similar-card` snippet. Carousel: `#similar-track`, `#similar-prev/next`, `#similar-dots`. |
| `subscribe-cta.liquid` | Email subscription CTA strip. |
| `testimonials.liquid` | Customer testimonials carousel (`#testimonials-track`, `#testimonials-prev/next/dots`). |
| `trust-cards.liquid` | Horizontal trust icon strip — icon blocks (shipping/returns/support/secure/star/heart), title, description. |

### snippets/
| File | Rendered by | Description |
|------|-------------|-------------|
| `account-nav.liquid` | customers-account, customers-addresses, customers-order, customers-reset-password | Sidebar nav: avatar initials (`customer.first_name/last_name`), links to My Orders, Saved Addresses, Profile & Password, Sign Out. Active via `request.path`. |
| `product-card.liquid` | product-grid.liquid | Legacy card: scrollable image strip (`.product-card__image-scroll`), scroll dots, badges, quick-add (`.btn-quick-add`), price, rating (from `metafields.reviews`), variant swatches. |
| `product-card-placeholder.liquid` | product-grid.liquid | Placeholder card when no products available. |
| `similar-card.liquid` | similar-products.liquid | Card accepting `p` variable: primary + secondary hover image, sale/new/discount badges, quick-add, price, mini swatches (up to 4 + count). |

### layout/
| File | Lines | Description |
|------|-------|-------------|
| `theme.liquid` | 383 | Global HTML wrapper. `<head>`: SEO/OG/Twitter Card meta, JSON-LD structured data (Product + BreadcrumbList for PDP, ClothingStore for index/page, Article), `{{ content_for_header }}`, Google Fonts (Cormorant Garamond + DM Sans), `theme.css` tag, `<style>:root{--radius:{{ settings.border_radius \| default:15 }}px}</style>`, `discount-engine.js` defer. `<body class="...template-{{ template \| handle }}...has-transparent-header(homepage only)">`: `#sticky-bar` (announcement-bar + header), `<main>`, footer, `#cart-drawer`, `#cart-overlay`, discount-popup, newsletter-popup, `#back-to-top`, `#review-lightbox`, globals script, `theme.js`+`animations.js` defer, conditional `product-page.js` (product template) + `collection-filters.js` (collection template), `#gallery-lightbox`. |

### templates/
| Template | Sections rendered |
|----------|------------------|
| `index.json` | hero-banner, featured-collections, discount-carousel, product-grid, trust-cards, testimonials, subscribe-cta |
| `product.liquid` | product-hero, pair-with, similar-products, product-reviews |
| `collection.liquid` | collection-products |
| `cart.liquid` | cart-page |
| `article.liquid` | blog-article |
| `blog.liquid` | blog-listing |
| `page.about.liquid` | page-about |
| `page.contact.liquid` | page-contact |
| `page.faq.liquid` | page-faq |
| `page.returns.liquid` | page-returns |
| `sitemap.liquid` | XML sitemap |
| `templates/customers/*.liquid` | Each maps to matching `customers-*.liquid` section |

### config/
| File | Description |
|------|-------------|
| `settings_schema.json` | 3 groups: **Social Media & SEO** (twitter_handle text, og_image image_picker, google_analytics_id text); **Product Pages** (global_gallery_mode select default "slideshow", grid_first_image_ratio select default "3/4", grid_secondary_ratio select default "1/1", grid_gap range 0–20 step 2 default 4); **Design** (border_radius range 0–30 step 1 unit px default 15). |
| `settings_data.json` | Live values: announcement bar bg `#2c1f18` text `#f9f3ee`; header logo `IMG_0449.png` h36 w224; **product-hero gallery_mode `"grid"`** (section-level override), add_to_cart_text `"Add to Basket"`, scroll_gap 12; footer trust 1-4 populated, brand_desc set, contact `hello@thetinybosses.com`/Delhi; newsletter-popup delay 5s redisplay 30d; collection-products grid_columns `"3"`, products_per_page 24; discount-carousel 4 tiers (2/3/4/5+). |

### locales/
| File | Content |
|------|---------|
| `en.default.json` | Single key: `products.product.add_to_cart: "Add to Cart"` |

---

## 2. KEY SELECTORS & CLASS NAMES

### Header & Navigation
| Component | Selector / Notes |
|-----------|-----------------|
| Sticky wrapper (THE sticky element) | `#sticky-bar` / `.sticky-bar` — `position:sticky; top:0; z-index:1000` |
| Shopify section wrapper | `#shopify-section-header` |
| Site header element | `header.site-header` / `#site-header` |
| Header inner flex row | `.header-inner.container` |
| Hamburger button | `#mobile-menu-toggle` / `.mobile-menu-toggle` |
| Desktop nav | `.header-nav ul.nav-list` |
| Nav item with mega | `.nav-item--mega` — IDs: `#mega-girls`, `#mega-boys`, `#mega-family` |
| Nav link | `.nav-link` |
| Nav chevron | `.nav-chevron` |
| Mega panel | `.mega-panel` |
| Mega panel inner | `.mega-panel__inner.container` |
| Mega panel hero | `.mega-panel__hero` / `.mega-panel__hero--girls/boys/family` |
| Mega panel title | `.mega-panel__title` |
| Mega panel desc | `.mega-panel__desc` |
| Mega panel CTA | `.mega-panel__cta` |
| Mega panel grid | `.mega-panel__grid` |
| Mega card | `.mega-card` |
| Mega card image wrap | `.mega-card__img-wrap` |
| Mega card image | `.mega-card__img` |
| Mega card placeholder | `.mega-card__img-placeholder` |
| Mega card label | `.mega-card__label` |
| Mega card arrow | `.mega-card__arrow` |
| **Mega backdrop** | `.mega-backdrop` / `#mega-backdrop` — `position:fixed; inset:0; z-index:1099; opacity:0; visibility:hidden` — last child in `<header>` before search bar — desktop-only, **display:none on mobile (v9)** |
| Header actions wrapper | `.header-actions` — base `gap:20px`, v9 mobile `gap:4px !important` |
| Individual action button | `.header-action` |
| Search toggle | `#search-toggle` / `.search-toggle` — also `.header-action` |
| Search open dot | `.search-open-dot` (span injected by JS) |
| Search bar panel | `#header-search-bar` / `.header-search-bar` — `aria-hidden` toggled |
| Search bar inner | `.header-search-bar__inner.container` |
| Search form | `.header-search-form` — `border-radius:var(--radius)` (v8) |
| Search input | `#header-search-input` / `.header-search-input` — name="q" |
| Search clear | `#header-search-clear` / `.header-search-clear` |
| Account wrap | `.header-account-wrap` |
| Account link | `.header-action` (links to `/account`) |
| Account dropdown | `.header-account-dropdown` |
| Account dropdown link | `.header-account-dropdown__link` / `.header-account-dropdown__link--cta` |
| Cart toggle | `#cart-toggle` / `.cart-toggle` |
| Cart badge | `#cart-count` / `.cart-count` / `[data-cart-count]` |
| Logo container | `.header-logo` |
| Logo link | `.header-logo__link` |
| Logo image | `.logo-img` — inline style `height:{{ logo_h }}px; --logo-h-mobile:{{ logo_hm }}px` |
| Logo text | `.logo-text` |
| Mobile drawer panel | `#mobile-drawer` / `.mobile-drawer` — `aria-hidden` toggled |
| Mobile drawer inner | `.mobile-drawer__inner` |
| Mobile drawer header | `.mobile-drawer__header` |
| Mobile drawer logo | `.mobile-drawer__logo` |
| Mobile drawer close | `#mobile-drawer-close` / `.mobile-drawer__close` |
| Mobile drawer overlay | `#mobile-drawer-overlay` / `.mobile-drawer__overlay` — `.is-visible` |
| Mobile drawer nav | `.mobile-drawer__nav` |
| Mobile nav group | `.mobile-nav-group` / `.mobile-nav-group.is-open` |
| Mobile nav trigger | `.mobile-nav-group__trigger` — `aria-expanded` |
| Mobile nav children | `.mobile-nav-group__children` |
| Mobile nav child link | `.mobile-nav-child` |
| Mobile nav child all | `.mobile-nav-child--all` |
| Mobile nav simple link | `.mobile-nav-link` |
| Mobile drawer pages | `.mobile-drawer__pages` |
| Mobile drawer footer | `.mobile-drawer__footer` |
| Mobile drawer footer link | `.mobile-drawer__footer-link` |
| Body: is-scrolled | `header.is-scrolled` — scrollY > 40px |
| Body: sticky scrolled | `#sticky-bar.is-scrolled` — scrollY > 4px |
| Body: scrolled past hero | `body.header-scrolled` — JS toggles when scrollY ≥ (hero.offsetHeight − stickyH) |
| Body: transparent header | `body.has-transparent-header` — homepage only (template == 'index') |
| Body: touch mode | `body.is-touch` — set by animations.js on first touchstart or coarse pointer |

### Announcement Bar
| Component | Selector |
|-----------|----------|
| Bar wrapper | `#announcement-bar` / `.announcement-bar` — inline style `background`, `color`, `--bar-speed` |
| Track | `.announcement-track` |
| Items (duplicated) | `.announcement-items` |
| Message span | `.announcement-item` |
| Message link | `.announcement-item--link` |
| Divider | `.announcement-divider` |

### Product Gallery (all modes)
| Component | Selector |
|-----------|----------|
| Gallery container | `.product-gallery` — `data-gallery-mode="slideshow\|scroll\|grid"` — inline CSS vars `--scroll-gap`, `--scroll-aspect`, `--grid-first-ratio`, `--grid-sec-ratio` |
| Sticky thumbs modifier | `.product-gallery.gallery--sticky-thumbs` (when scroll mode + sticky thumbs on) |
| Thumbnail strip | `#gallery-thumbs` / `.gallery-thumbs` — hidden mobile ≤768px (v8) |
| Individual thumb | `.gallery-thumb` / `.gallery-thumb.is-active` — `data-index` |
| Main image area | `#gallery-main` / `.gallery-main` — `border-radius:var(--radius)` (v8) + `overflow:hidden !important` on mobile (v6+v9) |
| **Slideshow track** | `#gallery-track` / `.gallery-main__inner` |
| **Slideshow slide** | `.gallery-slide` / `.gallery-slide.is-active` — `data-index`, `data-zoom` on img |
| **Scroll stack container** | `#gallery-scroll-track` / `.gallery-scroll-stack` |
| **Scroll stack item** | `.gallery-scroll-item` — `data-index`, `id="gallery-scroll-{index0}"` — `border-radius:var(--radius)` (v8) |
| **Grid stack container** | `#gallery-grid-track` / `.gallery-grid-stack` |
| **Grid item full** | `.gallery-grid-item.gallery-grid-item--full` — `data-index="0"` — first image |
| **Grid item half** | `.gallery-grid-item.gallery-grid-item--half` — `data-index` |
| Grid image | `.gallery-grid-img` |
| Generic gallery image | `.gallery-image` |
| Scroll-mode image | `.gallery-image.gallery-image--scroll` |
| Arrows | `#gallery-prev` / `#gallery-next` / `.gallery-arrow.gallery-arrow--prev/next` |
| Zoom hint | `.gallery-zoom-hint` |
| Mobile dots container | `.gallery-dots` (JS-injected into `#gallery-main`, `position:absolute`) |
| Mobile dot | `.gallery-dot` / `.gallery-dot.is-active` |
| Gallery placeholder | `.gallery-placeholder` |
| Gallery lightbox | `#gallery-lightbox` / `.gallery-lightbox` / `.gallery-lightbox.is-open` |
| Lightbox close | `#gallery-lightbox-close` / `.gallery-lightbox__close` |
| Lightbox prev | `#gallery-lightbox-prev` / `.gallery-lightbox__prev` |
| Lightbox next | `#gallery-lightbox-next` / `.gallery-lightbox__next` |
| Lightbox img | `#gallery-lightbox-img` / `.gallery-lightbox__img` |
| Lightbox counter | `#gallery-lightbox-counter` / `.gallery-lightbox__counter` |

### Product Layout & Info
| Component | Selector |
|-----------|----------|
| PDP section | `.product-hero` — `background:var(--ivory,#ffffff)` (v8) |
| Two-column grid | `.product-layout` |
| Breadcrumb | `.product-breadcrumb` |
| Product info column | `#product-info` / `.product-info` |
| Title row | `.product-title-row` |
| H1 | `.product-title` |
| Rating summary | `#product-rating-summary` / `.product-rating-summary` |
| Stars display | `.stars-display` — `data-rating` |
| Star span | `.star` / `.star--filled` |
| Review count | `#review-count-summary` |
| Rating link | `.rating-link` |
| Rating divider | `.rating-divider` |
| Price row | `.product-price-row` |
| Price wrap | `.product-price-wrap` |
| Price block | `.product-price-block` |
| Main price | `#product-price` / `.product-price` / `.product-price--sale` |
| Compare price | `#product-compare-price` / `.product-price--compare` |
| Savings badge | `.product-savings` — `border-radius:var(--radius)` (v8) |
| Tax note | `.product-tax-note` |
| Share icons row | `.product-share-inline` |
| Share buttons | `.share-btn-sm` + `.share-btn--whatsapp/facebook/twitter/pinterest/email/copy` |
| Copy link button | `#share-copy-link` — `data-url` |
| Bundle nudge | `#bundle-nudge` / `.product-bundle-nudge` — `data-bxgy="true"` when metafield = BXGY — `border-radius:var(--radius)` (v8) |
| Bundle nudge header | `.pbn-header` |
| Bundle tier | `.pbn-tier` / `#pbn-tier-1/2/3` — `.is-active` when cart qty meets threshold |
| Product form wrap | `.product-form-wrap` |
| Product form | `#product-form` / `.product-form` |
| Hidden variant input | `#variant-id` (name="id") |
| Variants JSON | `#product-variants-json` (script type="application/json") |
| Option block | `.option-block` — `data-option-index` |
| Option label row | `.option-label-row` |
| Option label | `.option-label` |
| Selected value display | `.option-selected-value` — `#selected-color`, `#selected-size` |
| Color swatch radio | `.color-swatch-input` — `data-option-index`, `name="option{N}"` |
| Color swatch label | `.color-swatch-label` |
| Color swatch dot | `.color-swatch-dot` — inline `background-color` |
| Swatch tooltip | `.swatch-tooltip` |
| Size button radio | `.size-btn-input` — `data-option-index` |
| Size button label | `.size-btn-label` / `.size-btn-label.is-sold-out` |
| Size button display | `.size-btn` |
| Size guide trigger | `#size-guide-trigger` / `.size-guide-link` |
| Qty + ATC row | `#qty-atc-row` / `.qty-atc-row` |
| Qty inline wrapper | `.qty-inline` |
| Qty label | `.qty-inline__label` |
| Qty selector | `.qty-selector` |
| Qty minus/plus | `#qty-minus` / `#qty-plus` / `.qty-selector-btn` |
| Qty input | `#product-quantity` / `.qty-selector-input` — name="quantity" |
| ATC button | `#add-to-cart-btn` / `.btn--add-to-cart` — name="add" |
| ATC text | `#add-to-cart-text` |
| Wishlist button | `#wishlist-btn` / `.btn-wishlist` / `.btn-wishlist.is-active` |
| Notify me row | `#notify-me-row` / `.notify-me-row` |
| Notify me button | `#notify-me-btn` / `.notify-me-btn` |
| Accordion | `.accordion` / `.accordion.is-open` |
| Accordion trigger | `.accordion-trigger` |
| Accordion icon | `.accordion-icon` |
| Accordion body | `.accordion-body` |
| Product trust badges | `.product-trust-badges` / `.trust-badge` |
| Sticky ATC bar | `#sticky-atc-bar` / `.sticky-atc-bar` / `.sticky-atc-bar.is-visible` — mobile only |
| Sticky ATC button | `#sticky-atc-btn` / `.sticky-atc-bar__button` |
| Variant required error | `.variant-required-error` (added by sticky ATC validation) |
| Size guide overlay | `#size-guide-overlay` / `.modal-overlay` |
| Size guide modal | `.size-guide-modal` / `.modal` |
| Modal header | `.modal__header` |
| Modal title | `#size-guide-title` / `.modal__title` |
| Modal close | `#size-guide-close` / `.modal__close` |
| Modal body | `.modal__body` |
| PDP badges | `.product-badge` + `.product-badge--new` / `.product-badge--sale` / `.product-badge--discount` — source: `product.metafields.custom.badge_text` or auto-calc % |

### Cart Drawer
| Component | Selector |
|-----------|----------|
| Drawer panel | `#cart-drawer` / `.cart-drawer` — `aria-hidden` toggled — `border-radius:var(--radius) 0 0 var(--radius)` (v8) |
| Overlay | `#cart-overlay` / `.cart-overlay.is-visible` |
| Inner | `.cart-drawer__inner` |
| Header | `.cart-drawer__header` |
| Title | `.cart-drawer__title` |
| Close | `#cart-drawer-close` / `.cart-drawer__close` |
| Discount bar | `#cart-discount-bar` / `.cart-drawer__discount-bar` |
| Discount message | `#cart-discount-message` / `.cart-discount-message` |
| Discount fill bar | `#cart-discount-fill` / `.discount-tier-progress-fill` |
| Tier nodes | `#tier-node-1/2/3` / `.discount-tier-node` / `.discount-tier-node.is-unlocked` |
| Items list | `#cart-drawer-items` / `.cart-drawer__items` |
| Empty state | `#cart-empty` / `.cart-empty` |
| Cart item | `.cart-item` — `data-key` |
| Remove btn | `.cart-remove-btn` — `data-key` |
| Qty btn | `.qty-btn.qty-btn--minus/.qty-btn--plus` — `data-key`, `data-qty` |
| Qty value | `.qty-value` |
| Cart item price | `.cart-item__price` |
| Footer | `#cart-drawer-footer` / `.cart-drawer__footer` |
| Subtotal | `#cart-subtotal-price` |
| Discount applied | `#cart-discount-applied` / `.cart-discount-applied` |
| Discount label | `#cart-discount-label` |
| Checkout btn | `#checkout-btn` — href `/checkout` or `/checkout?discount=CODE` |

### Collection Page
| Component | Selector |
|-----------|----------|
| Collection hero | `.coll-hero` |
| Filter bar | `#coll-filter-bar` / `.coll-filter-bar.filter-wrapper` |
| Filter toggle | `#filter-toggle-mobile` / `.coll-filter-toggle` |
| Filter count badge | `#filter-count-badge` / `.filter-count-badge` |
| Clear all | `#sidebar-clear-all` |
| Active chips | `#active-filter-chips` |
| Active chip | `.filter-chip` |
| Sort dropdown | `#collection-sort` / `.collection-sort` |
| Filter sidebar | `#collection-sidebar` / `.collection-sidebar` |
| Filter panel | `.coll-filter-panel` |
| Sidebar close | `#sidebar-close-btn` |
| Filter groups | `#filter-groups` |
| Filter group | `.filter-group` — `data-group` |
| Filter group head | `.filter-group__head` — `aria-expanded` |
| Filter group body | `.filter-group__body` |
| Filter option | `.filter-option` / `.filter-option.is-active` |
| Filter checkbox | `.filter-checkbox` — `data-group`, `data-value` |
| Tags data | `#collection-tags-data` (script type="application/json") |
| Collection grid | `#collection-grid` / `.collection-grid` — `data-columns="2\|3\|4"` |
| No results | `#collection-no-results` |
| No results clear | `#no-results-clear` |
| CPC card | `.collection-product-card` — `data-tags`, `data-variants='[{id,title,options,available}]'`, `data-size-option-index` |
| CPC image wrap | `.cpc-image-wrap` — `data-images='["url",...]'` — `_carousel` object attached by JS |
| CPC main image | `.cpc-img` |
| CPC discount badge | `.cpc-badge.cpc-badge--discount` |
| CPC label badge | `.cpc-badge.cpc-badge--label` |
| CPC carousel arrows | `.cpc-arrow.cpc-arrow--prev/.cpc-arrow--next` |
| CPC dots | `.cpc-dots-container` / `.cpc-dot` / `.cpc-dot.is-active` |
| CPC add button | `.cpc-add-btn` — `data-variant-id`, `data-has-variants` |
| CPC title | `.cpc-title` |
| CPC price | `.cpc-price` / `.cpc-price--compare` / `.cpc-price--sale` |
| CPC color swatch | `.cpc-color-swatch` / `.cpc-color-swatch.is-selected` — `data-color`, `data-variant-id`, `data-image`, `aria-pressed` |
| Size sheet backdrop | `#size-sheet-backdrop` / `.size-sheet-backdrop` |
| Size sheet | `#size-sheet` / `.size-sheet` / `.size-sheet.is-open` |
| Size sheet thumb | `#size-sheet-thumb` |
| Size sheet name | `#size-sheet-name` |
| Size sheet color dot | `#size-sheet-color-dot` |
| Size sheet color label | `#size-sheet-color-label` |
| Size sheet grid | `#size-sheet-grid` |
| Size pill | `.size-sheet__pill` / `.size-sheet__pill.is-selected` / `.size-sheet__pill.is-unavailable` |

### Pair With Section
| Component | Selector |
|-----------|----------|
| Section | `.pair-with-section` / `#pair-with` |
| Carousel track | `#pair-track` / `.pair-with-carousel` |
| Pair card | `.pair-card` |
| Image wrap | `.pair-card__image-wrap` |
| Primary image | `.pair-card__img.pair-card__img--primary` |
| Secondary image | `.pair-card__img.pair-card__img--secondary` |
| Tag | `.pair-card__tag` |
| Hover actions | `.pair-card__hover-actions` |
| Direct add btn | `.btn-pair-add` — `data-variant-id` |
| Multi-variant btn | `.btn-pair-variants` — `data-variants`, `data-options`, `data-product-title/price/image` |
| Carousel nav | `#pair-prev` / `#pair-next` / `#pair-dots` |
| Variant popup | `#variant-popup-overlay` — `aria-hidden` toggled |
| Popup close | `#variant-popup-close` |
| Popup title | `#variant-popup-title` |
| Popup price | `#variant-popup-price` |
| Popup image | `#variant-popup-image` |
| Popup body | `#variant-popup-body` |
| Popup add btn | `#variant-popup-add` — `data-variant-id` set when valid |

### Similar Products
| Component | Selector |
|-----------|----------|
| Section | `.similar-products` / `#similar-products` |
| Carousel track | `#similar-track` / `.similar-carousel` |
| Similar card | `.similar-card` |
| Image wrap | `.similar-card__image-wrap` — `border-radius:var(--radius)` (v8) |
| Primary image | `.similar-card__img--primary` |
| Secondary image | `.similar-card__img--secondary` |
| Quick add | `.btn-quick-add` (inside `.similar-card__quick`) |
| Info | `.similar-card__info` |
| Title | `.similar-card__title` |
| Price row | `.similar-card__price-row` |
| Mini swatch | `.mini-swatch` / `.mini-swatch-more` |
| Nav | `#similar-prev` / `#similar-next` / `#similar-dots` |

### Product Card (legacy snippet)
| Component | Selector |
|-----------|----------|
| Card | `.product-card` — `data-product-id` |
| Image wrap | `.product-card__image-wrap` |
| Image scroll | `.product-card__image-scroll` |
| Image link | `.product-card__image-link` |
| Scroll dots | `.product-card__scroll-dots` |
| Scroll dot | `.scroll-dot` / `.scroll-dot.is-active` |
| Badge | `.product-card__badge.product-card__badge--sale/new/discount` |
| Actions | `.product-card__actions` |
| Quick add | `.btn-quick-add` — `data-product-id`, `data-variant-id` |
| Info | `.product-card__info` |
| Title | `.product-card__title` |
| Price | `.product-card__price` |
| Rating | `.product-card__rating` |
| Variants | `.product-card__variants` |
| Variant swatch | `.variant-swatch` |

### Footer
| Component | Selector |
|-----------|----------|
| Trust strip | `.footer-trust` / `.footer-trust__grid` / `.footer-trust__item` |
| Footer body | `.footer-body` |
| Brand column | `.footer-brand` |
| Nav columns | `.footer-nav-cols` |
| Footer bottom | `.footer-bottom` |
| Copyright | `.footer-copyright` |

### Global
| Component | Selector |
|-----------|----------|
| Back to top | `#back-to-top` / `#back-to-top.is-visible` — scrollY/total ≥ 0.7 |
| Review lightbox | `#review-lightbox` / `.review-lightbox.is-open` |
| Review lightbox img | `#review-lightbox-img` |
| Review lightbox close | `#review-lightbox-close` |
| Review photo thumb | `.review-image-thumb` |
| Section header | `.section-header` |
| Section eyebrow | `.section-eyebrow` |
| Section heading | `.section-heading` / `.section-heading.is-revealed` |
| Section subheading | `.section-subheading` |
| Section spacing | `.section-spacing` |
| Data-reveal | `[data-reveal]` / `[data-reveal].is-revealed` |
| Stagger | `[data-stagger="0–6"]` |
| Container | `.container` — max-width:1400px, padding:0 40px desktop / 0 20px mobile |
| Quick add btn | `.btn-quick-add` — `data-variant-id`, `data-product-id` |
| Carousel dot | `.carousel-dot` / `.carousel-dot.is-active` |
| Price sale | `.price--sale` |
| Price compare | `.price--compare` |
| Account nav | `.acct-nav` / `.acct-nav__links` / `.acct-nav__link.is-active` |

---

## 3. CSS ARCHITECTURE

### CSS Variables (`:root`, theme.css lines 9–39)
```
Color:
  --ivory: #ffffff        --ivory-dk: #e8e8e8
  --blush: #d4d4d4        --blush-dk: #888888
  --rose: #333333         --sage: #555555
  --sage-lt: #cccccc      --espresso: #000000
  --espresso-lt: #333333  --gold: #000000
  --gold-lt: #dddddd      --white: #ffffff
  --accent: #FFEB3B       --accent-hover: #FDD835
  --accent-soft: #FFF9C4  --price-sale: #E8775A

Typography:
  --font-display: 'Cormorant Garamond', Georgia, serif
  --font-body:    'DM Sans', 'Jost', 'Helvetica Neue', sans-serif

Motion:
  --transition:      0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)
  --transition-slow: 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)

Shape:
  --radius:    4px  (overridden to 15px by layout/theme.liquid <style>)
  --radius-lg: 10px (fixed, not connected to Theme Editor)

Shadow:
  --shadow:    0 4px 20px rgba(0,0,0,0.07)
  --shadow-lg: 0 12px 48px rgba(0,0,0,0.13)

Set at runtime by JS:
  --sticky-bar-height  (px) — setStickyBarHeight() reads #sticky-bar.offsetHeight
  --scroll-gap         (px) — inline style on .product-gallery
  --scroll-aspect            — inline style on .product-gallery
  --grid-first-ratio         — inline style on .product-gallery
  --grid-sec-ratio           — inline style on .product-gallery
  --bar-speed          (s)  — inline style on .announcement-bar
```

### CSS Variable Override in layout/theme.liquid
```css
/* Output AFTER theme.css link — overrides :root --radius */
<style>
  :root { --radius: {{ settings.border_radius | default: 15 }}px; }
</style>
```
Current live value: `15px`.

### All Breakpoints (exact px)
| Breakpoint | Key usage |
|-----------|-----------|
| `max-width: 400px` | Auth form single column |
| `max-width: 480px` | Header tighten (`.header-actions {gap:4px}`), product grid 1-col, ATC fullwidth |
| `max-width: 560px` | Blog 1-col, newsletter 1-col |
| `max-width: 600px` | Policy grid |
| `max-width: 640px` | Footer nav, footer body, about stats |
| `max-width: 720px` | Order detail 1-col |
| `max-width: 767px` | **TTB MOBILE** — all TTB fix blocks use exactly this |
| `max-width: 768px` | **Base CSS mobile** — product-layout 1-col, gallery grid, container 20px, `.gallery-thumbs {display:none}` (v8) |
| `max-width: 800px` | FAQ layout, blog featured 1-col |
| `max-width: 900px` | PDP grid, pair-with, similar carousel, contact |
| `max-width: 960px` | Collection cards |
| `max-width: 1000px` | Policy, article layout |
| `max-width: 1024px` | Footer trust grid, about layout |
| `max-width: 1100px` | Footer body 2-col, footer nav cols |
| `min-width: 768px` | **TTB DESKTOP** — all TTB desktop fixes use exactly this |

### Major CSS Sections — Approximate Line Numbers (theme.css)
| Section | Lines |
|---------|-------|
| `:root` variables | 9–39 |
| Reset & base | 41–57 |
| Container, typography, buttons | 64–210 |
| Announcement bar | ~216 |
| Header / site-header | 233–410 |
| `.mega-backdrop` base definition | **404–411** |
| `.header-actions { gap:20px }` | **448–452** |
| Mobile drawer | ~411–500 |
| Cart drawer | 1240–1270 |
| Hero banner | ~1700+ |
| Product layout grid | 1774 |
| `.gallery-main` base (border-radius:var(--radius-lg)) | **1818–1824** |
| `.gallery-slide` base (position:absolute; opacity:0) | **1828** |
| Gallery scroll mode (desktop overflow:visible) | **6873** |
| Gallery grid mode (desktop overflow:visible) | **7050** |
| Product info | 1927+ |
| `.modal-overlay` base (z-index:3000) | **~3424** |
| `#sticky-bar { position:sticky; top:0; z-index:1000 }` | **3227** |
| Search bar | 3248–3310 |
| `max-width:480px` header tighten (gap:4px on `.header-actions`) | **~1756–1764** |
| TTB FIXES v3 (mobile gallery carousel, transparent header, cart icon) | ~6700s |
| TTB FIXES v4 (desktop transparent header, mobile double-sticky, gallery dots base) | follows v3 |
| TTB FIXES v5 (mobile sticky overlays, desktop PDP layout) | follows v4 |
| TTB FIXES v6 (gallery-slide mobile override) | follows v5 |
| `.gallery-main { overflow:hidden !important }` (v6 mobile) | **~8432** |
| TTB FIXES v7 (overflow-x:clip, sticky header desktop, desktop gallery belt-and-suspenders) | follows v6 |
| `html, body { overflow-x:clip }` | v7 (no media query) |
| `@media(min-width:768px)` desktop gallery fixes | **~8561** |
| TTB FIXES v8 (modal z-index, gallery dedup, green space, global border-radius) | follows v7 |
| `@media(max-width:480px)` cart icon + `.header-actions {gap:0!important}` | **8066–8088** |
| `.modal-overlay { z-index:500; pointer-events:none }` | v8 |
| `.modal-overlay[aria-hidden="false"] { z-index:3000; pointer-events:auto }` | v8 |
| `@media(max-width:768px) .gallery-thumbs { display:none!important }` | **~8626** |
| `.gallery-main { border-radius:var(--radius) }` | **~8672** |
| `.product-badge, .product-badge--discount { border-radius:var(--radius) }` | v8 |
| **TTB FIXES v9** (mega-backdrop mobile, header gap 767px, gallery radius belt-and-suspenders) | **~7871 onward** |
| `.mega-backdrop { display:none!important; pointer-events:none!important }` (max-width:767px) | v9 |
| `.header-actions { gap:4px!important }` (max-width:767px) | v9 |
| `.gallery-main { border-radius:var(--radius)!important; overflow:hidden!important }` (max-width:767px) | v9 |
| `.product-badge, .product-badge--discount { border-radius:var(--radius)!important }` (max-width:767px) | v9 |
| **END TTB FIXES v9** | **~7924** |

### Critical Rules — Must Never Be Removed
| Rule | Where |
|------|-------|
| `#sticky-bar { position:sticky; top:0; z-index:1000 }` | line ~3227 — THE sticky anchor |
| `html, body { overflow-x:clip }` | v7 — prevents scroll container trapping sticky |
| `#shopify-section-header { position:sticky; top:0 }` (desktop min-width:768px) | v7 — restored header stickiness |
| `#shopify-section-header { position:static !important }` (mobile max-width:767px) | v5 — removes nested sticky on mobile |
| `.gallery-main { overflow:hidden !important }` (mobile max-width:767px) | v6+v9 — clips carousel slides |
| `body.has-transparent-header #MainContent { margin-top:calc(-1*var(--sticky-bar-height)) }` | base CSS — hero behind transparent header |

---

## 4. JAVASCRIPT ARCHITECTURE

### theme.js — All 8 IIFEs (1181 lines)

---

**IIFE 1: Header Scroll (lines 5–14)**
```
header = document.getElementById('site-header')
window.scroll → header.classList.toggle('is-scrolled', scrollY > 40)
```

---

**IIFE 2: Cart Drawer + Discount UI + Quick-Add (lines 38–514)**

DOM refs: `#cart-toggle`, `#cart-drawer`, `#cart-overlay`, `#cart-drawer-close`

Functions:
- `openCart()` — aria-hidden="false" on `#cart-drawer`, `.is-visible` on `#cart-overlay`, `body.overflow='hidden'`, calls `fetchCart()`
- `closeCart()` — reverses all above
- `fetchCart()` — async GET `/cart.js` → JSON → `renderCart(cart)` + `updateDiscountUI(cart)`
- `renderCart(cart)` — removes old `.cart-item` elements; updates `#cart-count`; shows/hides `#cart-empty`/`#cart-drawer-footer`; builds `.cart-item` HTML per item (image, title, variant, qty controls, remove btn, price); inserts before `#cart-empty`; attaches `.qty-btn` click → `updateCartItem(key, qty)` and `.cart-remove-btn` click → `updateCartItem(key, 0)`
- `escHtml(str)` — `&`, `<`, `>`, `"` escaping
- `updateCartItem(key, qty)` — POST `/cart/change.js` → `renderCart` + `updateDiscountUI`
- `formatMoney(cents)` — uses `window.moneyFormat`; handles `{{amount}}`, `{{amount_no_decimals}}`, `{{amount_with_comma_separator}}`, `{{amount_no_decimals_with_comma_separator}}`
- Quick-add: event delegation `.btn-quick-add` → POST `/cart/add.js` → `fetchCart()` + `openCart()`
- `window.bxgyProductIds` — set by cart-drawer.liquid inline script (product IDs with `custom.discount == 'BXGY'`)
- `DISCOUNT_TIERS` — `[{qty:2, pct:5, label:'5% off', code:'BUNDLE5'}, {qty:3, pct:10, ...}, {qty:5, pct:20, ...}]`
- `getBxgyCount(cart)` — if `window.bxgyProductIds` empty → returns `cart.item_count`; else counts only eligible product IDs
- `getCurrentTier(qty)` / `getNextTier(qty)` — iterate DISCOUNT_TIERS
- `updateDiscountUI(cart)`:
  - Lights up `#tier-node-1/2/3.is-unlocked` when qty ≥ 2/3/5
  - Updates `#cart-discount-message` text
  - Sets `#cart-discount-applied` display + `#cart-discount-label` text
  - Updates checkout btn hrefs to `/checkout?discount=CODE`
  - Activates `#pbn-tier-1/2/3.is-active` when qty ≥ 2/3/5
  - Fills `#cart-discount-fill` width% (0%→50%→100% across 2/3/5 items)
  - Updates `#discount-progress-text` and `#discount-progress-fill` (section bar)
  - Calls `showDiscountPopup` when `nextTier.qty - qty === 1`
- `showDiscountPopup(tier, totalPrice)` — sets `#discount-popup-heading/text/fill`, shows `#discount-popup` (aria-hidden="false"), auto-hides after 6s via `popupTimeout`
- `initCarousel({trackId, prevId, nextId, dotsId, slidesPerView})`:
  - `goTo(index)` — `transform:translateX(-${idx * slideWidth * slidesPerView}px)`, `updateDots()`
  - `buildDots()` — creates `.carousel-dot` buttons in `dotsId` container
  - `startAutoplay()` / `stopAutoplay()` — 5s interval
  - Touch: `touchstart`/`touchend` swipe delta >40px → `goTo`
  - Resize → `buildDots()` + `goTo(current)`
- Inits: `#discount-track` carousel + `#testimonials-track` carousel
- Exposes `window.fetchCart = fetchCart` and `window.renderCart = renderCart`
- Calls `fetchCart()` on load

---

**IIFE 3: Global UI — Search, Mobile Drawer, Back-to-Top, Lightbox (lines 522–702)**

Functions:
- `setStickyBarHeight()` — `document.documentElement.style.setProperty('--sticky-bar-height', bar.offsetHeight + 'px')`; fires on load + resize
- `updateHeaderOnScroll()`:
  - `#sticky-bar.is-scrolled` when `scrollY > 4`
  - On `body.has-transparent-header`: `threshold = hero.offsetHeight - stickyH` (fallback 80px); `body.header-scrolled` when `scrollY >= threshold`
- `openSearch()` — `.is-open` on `#header-search-bar`, aria-hidden="false", aria-expanded="true" on `#search-toggle`, `.is-open` on toggle; `searchInput.focus({preventScroll:true})` synchronously + rAF belt-and-suspenders for iOS virtual keyboard
- `closeSearch()` — reverses all
- `searchToggle` click → toggle `openSearch`/`closeSearch`; `Escape` keydown → `closeSearch()`
- `openDrawer()` — `#mobile-drawer` aria-hidden="false", `#mobile-drawer-overlay.is-visible`, `aria-expanded="true"`, `body.overflow='hidden'`
- `closeDrawer()` — reverses
- `.mobile-nav-group__trigger` click → toggles parent `.mobile-nav-group.is-open`
- Back to top: `#back-to-top.is-visible` when `scrollY / (scrollHeight - innerHeight) >= 0.7`; click → `window.scrollTo({top:0, behavior:'smooth'})`
- Review lightbox: `.review-image-thumb` click → `#review-lightbox-img.src` = thumb img src with `300x300`→`1200x`; `#review-lightbox.is-open`; Escape/overlay click/close btn → remove `.is-open`

---

**IIFE 4: Scrollable Image Dots (lines 711–757)**
- `initImageScrollDots(scrollEl, dotsEl)` — IntersectionObserver on `.product-card__image-link` / `.cpc-image-link`; threshold 0.6; updates `.scroll-dot.is-active`
- `initAllCards()` — wires `.product-card__image-wrap` (scroll + dots) and `.cpc-image-wrap` (scroll + dots)

---

**IIFE 5: Collection Card Carousels (lines 762–823)**
- `initCarousel(wrap)` — parses `wrap.dataset.images` JSON; opacity-fade via `img.style.opacity='0'` → setTimeout 200ms → `img.src=url; opacity='1'`; renders `.cpc-dot` spans via `renderDots()`
- `wrap._carousel` = `{ goTo(idx), setImages(arr), get defaultImages() }`
- Arrow key nav when hovering: `mouseover` tracks `hoveredCard`; ArrowLeft/Right → `.cpc-color-swatch` click
- Swatch click normalization: `normColor(str)` = `str.toLowerCase().replace(/[-_\s]+/g,'')`

---

**IIFE 6: Collection Cards — Size Sheet + Add to Cart (lines 828–1002)**

DOM refs: `#size-sheet-backdrop`, `#size-sheet`, `#size-sheet-thumb`, `#size-sheet-name`, `#size-sheet-color-dot`, `#size-sheet-color-label`, `#size-sheet-grid`

Functions:
- `updateCartBadge()` — GET `/cart.js` → updates all `[data-cart-count]` (text + display)
- `confirmAddToCart(variantId, btn)` — POST `/cart/add.js` with `items:[{id:parseInt(variantId),quantity:1}]`; on success: calls `window.renderCart`, `updateCartBadge`, opens cart drawer
- `closeSheet()` — removes `.is-open` from `#size-sheet`, `.is-visible` from `#size-sheet-backdrop`
- `openSheet(card, btn)`:
  - Reads title from `.cpc-title a`
  - Gets active swatch color name and image
  - Reads `card.dataset.variants` JSON + `card.dataset.sizeOptionIndex`
  - Extracts unique sizes from variants; fallback to hardcoded NB/0-3M/.../18-24M
  - Builds `.size-sheet__pill` buttons in `#size-sheet-grid`
  - Pill click: `.is-selected`, `closeSheet()`, `confirmAddToCart(variantId, btn)`
  - `requestAnimationFrame` triggers both `.is-visible` and `.is-open` simultaneously
- `.cpc-add-btn` click: if `data-has-variants` → `openSheet`; else → `confirmAddToCart` directly
- Swatch click: ring toggle, updates `addBtn.dataset.variantId`, `normColor` filter on carousel images

---

**IIFE 7: TTB PDP Gallery (lines 1004–1123)**
- Guard: `document.querySelector('.template-product')` — only runs on product pages
- Reads `gallery.getAttribute('data-gallery-mode')` → `track` + `items`:
  - `scroll` → `#gallery-scroll-track`, `.gallery-scroll-item`
  - `grid` → `#gallery-grid-track`, `.gallery-grid-item`
  - `slideshow` (default) → `#gallery-track`, `.gallery-slide`
- `isMobile = window.innerWidth <= 767`
- `scrollToIndex(idx)` — `track.scrollTo({left: track.offsetWidth * idx, behavior:'smooth'})`
- `initDots()` — if `isMobile && items.length >= 2`: creates `.gallery-dots` div with `.gallery-dot` buttons (type="button", aria-label="Image N"); appends to `#gallery-main`; `track.scroll` (passive) → `Math.round(scrollLeft / offsetWidth)` → toggles `.is-active`
- `initVariantImageSwitch()` — parses `#product-variants-json`; listens `.color-swatch-input, .size-btn-input change`; `getSelectedOptions()` reads all checked inputs with `data-option-index`; `findVariant(opts)` matches `v['option'+(idx+1)] === opts[idx]` for all keys; on match: updates `#variant-id.value`, calls `scrollToIndex(variant.featured_image.position - 1)`

---

**IIFE 8: Sticky ATC Bar (lines 1125–1181)**
- Guard: `window.innerWidth > 767` → return (mobile only)
- DOM: `#sticky-atc-bar`, `#sticky-atc-btn`, `[name="add"]` (native ATC button)
- IntersectionObserver on native ATC btn → `#sticky-atc-bar.is-visible` + aria-hidden when btn out of view
- `#sticky-atc-btn` click: validates `fieldset[data-option-index]` (must have checked radio) and `select[data-option-index]` (must have value); invalid → `scrollIntoView({block:'center'})` + `.variant-required-error`; valid → `nativeBtn.click()`

---

### product-page.js — Functions (938 lines)

**Gallery:**
- `isScrollMode` = `galleryEl.dataset.galleryMode === 'scroll'`
- Slideshow (`!isScrollMode`): `showSlide(index)` — toggles `.is-active` on `.gallery-slide` and `.gallery-thumb`; prev/next arrows; touch swipe (>40px delta) on `#gallery-main`
- Scroll mode: thumb click → `window.scrollTo` to `#gallery-scroll-{idx}` offset by `--sticky-bar-height`; IntersectionObserver (`rootMargin:'-15% 0px -55% 0px'`) syncs active thumb

**Variants:**
- `selectedOptions` object keyed by option index
- `.size-btn-input, .color-swatch-input change` → updates `selectedOptions[idx]`, updates `.option-selected-value` label, calls `findVariant()`
- `findVariant()` — matches `variantsData` where `v.options[i] === selectedValues[i]` for all indices; updates `#variant-id`, prices (`formatMoney(cents) = '$'+(cents/100).toFixed(2)`), availability (shows/hides `#qty-atc-row`/`#notify-me-row`)

**ATC:**
- `#product-form submit` → POST `/cart/add.js` → opens cart drawer (`#cart-drawer` aria-hidden="false", `#cart-overlay.is-visible`)

**Qty:**
- `#qty-minus` / `#qty-plus` → clamp 1–99 on `#product-quantity`

**Accordions:**
- `.accordion-trigger click` → toggles `.accordion.is-open`, `aria-expanded`, `.accordion-body` display

**Wishlist:**
- `#wishlist-btn click` → toggles `.is-active`, fills SVG `fill`

**Pair-With:**
- `pairChecks` = `.pair-check` elements; `updateBundlePrice()` sums checked items + main price
- `#add-bundle-btn` → POST `/cart/add.js` with main + checked variant IDs

**Similar Carousel:**
- `getSlidesPerView()` → ≤480px: 1, ≤768px: 2, else: 4
- `goToSim(page)` → `transform:translateX(-${page * pv * cardWidth}px)` on `#similar-track`
- Prev/next + touch swipe

**Reviews:**
- `openReviewForm()` / `closeReviewForm()` — `#review-form-wrap` aria-hidden toggle
- Star picker: `.star-pick` hover/click → `.is-filled`, updates `#review-rating`
- Fit selector: `.fit-btn click` → `.is-active`, updates `#review-fit`
- Helpful: `.helpful-btn click` → `.is-voted`, increments count in text
- Form submit: simulated delay → `buildReviewCard(data)` → prepend to `#reviews-list`
- `computeRatings()` — reads `.review-card[data-stars]`, computes avg, updates `#avg-score`, `#summary-stars`, `#total-reviews-count`, `#review-count-summary`, `.breakdown-fill[data-stars]`, `.breakdown-count[data-stars]`
- Filter tabs: `.filter-tab click` → show/hide `.review-card` by `data-stars`

**Size Guide Popup (separate IIFE):**
- `#size-guide-trigger click` → `#size-guide-overlay` aria-hidden="false"
- `#size-guide-close click` / overlay click / Escape → aria-hidden="true"

**Pair-With Carousel + Variant Popup (separate IIFE):**
- `#pair-track` carousel: `perView()` → ≤480:1, ≤768:2, ≤1100:3, else:4
- `.btn-pair-variants click` → `openVP(btn)` reads `data-variants`, `data-options`, `data-product-title/price/image`; `renderOptions()` builds color swatches or size buttons; `updateBtn()` finds matching variant → enables `#variant-popup-add`
- `#variant-popup-add click` → POST `/cart/add.js`

**Gallery Lightbox (nested IIFE in pair-with IIFE):**
- `getImages()` — collects `.gallery-slide img` → `.gallery-scroll-item img` → `.gallery-grid-item img`
- `openLightbox(index)` → shows `#gallery-lightbox.is-open`
- `showImage(index)` — uses `img.dataset.zoom` or replaces size suffix with `_2000x`
- All images get `cursor:zoom-in` + click handler
- Prev/next arrows, keyboard ArrowLeft/Right/Escape, touch swipe >50px

**Notify Me (end of pair-with IIFE):**
- `#notify-me-btn click` → `mailto:` with product title + page URL

---

### animations.js — All Functions (381 lines)

| Function | What it does |
|----------|-------------|
| `initScrollReveal()` | IntersectionObserver on `[data-reveal]`; threshold 0.12, rootMargin `0px 0px -40px 0px`; adds `.is-revealed`; fires once (unobserve) |
| `initStaggerGrids()` | Finds `[data-stagger-children]`, auto-assigns `data-stagger="0–6"` to child `[data-reveal]` elements |
| `initParallax()` | `window.scroll` + rAF on `.hero-bg, .about-hero__img, .article-hero__img`; `transform:translateY(${offset}px) scale(1.1)` where offset = ±40px max |
| `initCounters()` | IntersectionObserver threshold 0.5 on `[data-count-to]`; cubic ease-out animation 0→N, uses `data-count-suffix`, `data-count-dur` |
| `initMegaMenu()` | Touch detection via `window.matchMedia('(pointer:coarse)')` + first `touchstart`→ adds `body.is-touch`. Desktop: CSS :hover drives panels, JS only updates `aria-expanded`. Touch: link click → `e.preventDefault()`, toggle `.is-open` + `aria-expanded`; `touchstart` outside `.nav-item--mega` → `closeAll()`. `Escape` → `closeAll()` |
| `initCardTilt()` | Skip if touch device. `.collection-product-card, .blog-featured` mousemove → `perspective(1000px) rotateX(${y*-5}deg) rotateY(${x*5}deg) translateY(-4px)`; mouseleave → reset |
| `initHeadingReveal()` | IntersectionObserver threshold 0.3 on `.section-heading` → adds `.is-revealed` once |
| `autoInstrument()` | Adds `data-reveal`, `data-stagger-children`, `data-stagger` attrs to: `.section-header`, grid cards, `.blog-featured`, `.testimonial-card`, `.policy-summary-card`, `.about-story__text/image`, `.contact-info-card`, `.footer-trust__item`, `.faq-item` |
| `initPageTransition()` | Body `opacity:0` → `opacity:1` on load; internal link clicks → `opacity:0` → navigate after 280ms. Only active if `body.enable-page-transitions` |
| `init()` | Calls all the above in order. Runs on `DOMContentLoaded` or immediately if already loaded. |

---

### collection-filters.js — Key Functions (315 lines)

| Function | What it does |
|----------|-------------|
| `parseTags(tags)` | `"filter-Color:White"` → `{Color:['White',...]}` |
| `countProducts(groupName, value)` | Count `.collection-product-card[data-tags]` containing `filter-GroupName:value` |
| `renderFilters(groups)` | Builds `.filter-group` with `.filter-group__head` (toggle) and `.filter-group__body` (checkboxes + color dots) |
| `toggleFilter(group, value, active)` | Updates `activeFilters` object → `applyFilters()` + `renderChips()` + `updateFilterBadge()` + `syncCheckboxStates()` |
| `applyFilters()` | Shows/hides `.collection-product-card` cards; shows `#collection-no-results` if all hidden. Logic: AND across groups, OR within group values |
| `renderChips()` | Builds `.filter-chip` buttons in `#active-filter-chips` |
| `updateFilterBadge()` | Shows/hides `#filter-count-badge` with total count |
| `syncCheckboxStates()` | Keeps `.filter-checkbox` `checked` state in sync after external clear |
| `clearAll()` | Resets `activeFilters`, calls all update functions |
| Sort dropdown | `#collection-sort change` → URL `?sort_by=VALUE` → `window.location.href` |
| Filter panel toggle | `#filter-toggle-mobile click` → `#collection-sidebar.is-mobile-open`; outside click closes |

---

### discount-engine.js (57 lines)

`window.DiscountEngine` IIFE exposing:
- `TIERS = [{qty:2,pct:5,code:'BUNDLE5'}, {qty:3,pct:10,code:'BUNDLE10'}, {qty:4,pct:15,code:'BUNDLE15'}, {qty:5,pct:20,code:'BUNDLE20'}]`
  - Note: 4-tier system (2/3/4/5) vs theme.js which uses 3-tier (2/3/5). Discount engine is the definitive source for cart attributes.
- `getTier(itemCount)` — returns highest matching tier
- `applyDiscount(itemCount)` — POST `/cart/update.js` with `attributes:{_bundle_discount_pct, _bundle_discount_items, _bundle_discount_code}` and `note`
- Listens to `cart:updated` custom event

---

### Scroll-based Class Toggles (summary)
| Class | Element | Threshold |
|-------|---------|-----------|
| `is-scrolled` | `header#site-header` | scrollY > 40 |
| `is-scrolled` | `#sticky-bar` | scrollY > 4 |
| `header-scrolled` | `body` | scrollY ≥ hero.offsetHeight − stickyBarHeight (homepage only) |
| `is-visible` | `#back-to-top` | scrollY / totalScroll ≥ 0.7 |
| `is-visible` | `#sticky-atc-bar` | native ATC btn scrolled out of viewport (IntersectionObserver, mobile only) |
| `is-revealed` | `[data-reveal]` | 12% in viewport (IntersectionObserver) |
| `is-revealed` | `.section-heading` | 30% in viewport (IntersectionObserver) |
| `is-unlocked` | `#tier-node-1/2/3` | cart BXGY qty ≥ 2/3/5 |
| `is-active` | `#pbn-tier-1/2/3` | cart BXGY qty ≥ 2/3/5 |
| `is-open` | `.nav-item--mega` | touch tap (animations.js) |
| `is-touch` | `body` | first touchstart or coarse pointer |
| `is-open` | `#size-sheet` | add btn click on multi-variant card |
| `is-mobile-open` | `#collection-sidebar` | filter toggle click |

---

## 5. LIQUID ARCHITECTURE

### layout/theme.liquid Body Classes
```
customer-logged-in    — when {{ customer }} is truthy
template-product      — always (from template handle)
template-index        — always on homepage
template-collection   — always on collection pages
...etc
has-transparent-header — only when template == 'index'
```

### Gallery Mode Resolution (product-hero.liquid lines 18–29)
```liquid
{% assign g_mode_raw = section.settings.gallery_mode | default: 'global' %}
{% if g_mode_raw == 'global' or g_mode_raw == blank %}
  {% assign g_mode = settings.global_gallery_mode | default: 'slideshow' %}
{% else %}
  {% assign g_mode = g_mode_raw %}
{% endif %}
```
**Current live: `gallery_mode = "grid"` (section-level override in settings_data.json)**

### Metafields Used
| Namespace | Key | Type | Used by |
|-----------|-----|------|---------|
| `custom` | `badge_text` | text | product-hero.liquid, collection-products.liquid, similar-card.liquid, product-card.liquid — discount % badge |
| `custom` | `discount` | text (value="BXGY") | cart-drawer.liquid — eligible for bundle tier |
| `custom` | `pair_with` | product_reference list | pair-with.liquid — "Complete the Look" |
| `custom` | `similar_products` | product_reference list | similar-products.liquid — "Similar Pieces" |
| `reviews` | `rating` | rating | product-card.liquid — star rating |
| `reviews` | `rating_count` | number | product-card.liquid — review count |

### Global JS Variables (set in layout/theme.liquid)
```javascript
window.shopName    = {{ shop.name | json }};
window.cartUrl     = {{ routes.cart_url | json }};
window.moneyFormat = {{ shop.money_format | json }};  // e.g. "₹{{amount}}"
```

### BXGY Eligible Product IDs (set in cart-drawer.liquid)
```javascript
window.bxgyProductIds = [
  // product IDs where metafields.custom.discount == 'BXGY'
];
```

### Swatch Config (set in collection-products.liquid inline script)
```javascript
window.swatchConfig = { "name": { hex, border, label }, ... }
// built from assets/swatches.json fetched at runtime
```

---

## 6. THEME SETTINGS

### settings_schema.json — Complete
**Group: Social Media & SEO**
| ID | Type | Notes |
|----|------|-------|
| `twitter_handle` | text | Default `@thetinybosses` |
| `og_image` | image_picker | Default share image for non-product pages |
| `google_analytics_id` | text | GA4 Measurement ID (G-XXXXXXXXXX) |

**Group: Product Pages**
| ID | Type | Default | Notes |
|----|------|---------|-------|
| `global_gallery_mode` | select | `"slideshow"` | slideshow / scroll / grid |
| `grid_first_image_ratio` | select | `"3/4"` | 3/4, 4/5, 1/1 |
| `grid_secondary_ratio` | select | `"1/1"` | 1/1, 3/4, 4/5 |
| `grid_gap` | range 0–20 step 2 | `4` | px |

**Group: Design**
| ID | Type | Default | Notes |
|----|------|---------|-------|
| `border_radius` | range 0–30 step 1 unit px | `15` | Controls `--radius` CSS variable site-wide |

### Settings Wired to CSS/Liquid
| Setting ID | Output | Where |
|-----------|--------|-------|
| `border_radius` | `--radius: Npx` | `layout/theme.liquid` `<style>` block |
| `global_gallery_mode` | `data-gallery-mode` attribute | `product-hero.liquid` |
| `grid_first_image_ratio` | `--grid-first-ratio` CSS var | `product-hero.liquid` inline style on `.product-gallery` |
| `grid_secondary_ratio` | `--grid-sec-ratio` CSS var | `product-hero.liquid` inline style on `.product-gallery` |
| `grid_gap` | `--scroll-gap` CSS var | `product-hero.liquid` inline style |
| `twitter_handle` | `<meta name="twitter:site">` | `layout/theme.liquid` |
| `google_analytics_id` | `gtag` script | `layout/theme.liquid` |

### Live Values (settings_data.json)
| Setting | Value |
|---------|-------|
| Announcement bar bg | `#2c1f18` |
| Announcement bar text | `#f9f3ee` |
| Header logo | `IMG_0449.png`, h:36, w:224 |
| **Product hero gallery_mode** | **`"grid"`** (section override) |
| Product hero add_to_cart_text | `"Add to Basket"` |
| Product hero scroll_gap | `12` |
| Collection products grid_columns | `"3"` |
| Collection products products_per_page | `24` |
| Newsletter popup delay | `5s` |
| Newsletter popup redisplay | `30 days` |
| Footer contact email | `hello@thetinybosses.com` |

---

## 7. GALLERY SYSTEM — Three Modes

### Mode Determination (Liquid)
1. `section.settings.gallery_mode` (per-product override in Theme Editor)
2. Falls back to `settings.global_gallery_mode` (global default)
3. Falls back to `"slideshow"`
4. **Current live: `"grid"`** (section-level override on product-hero)

### Mode 1: Slideshow (`data-gallery-mode="slideshow"`)
```
.product-gallery[data-gallery-mode="slideshow"]
  .gallery-thumbs                              ← hidden mobile ≤768px
  #gallery-main.gallery-main                   ← overflow:hidden, aspect-ratio:3/4 (mobile), border-radius:var(--radius)
    #gallery-track.gallery-main__inner         ← display:flex; overflow-x:scroll (mobile snap carousel)
      .gallery-slide.is-active                 ← position:relative; opacity:1; flex:0 0 100% (mobile)
      .gallery-slide                           ← same (all visible for scroll; CSS hides off-screen)
    .gallery-zoom-hint                         ← hidden mobile
    #gallery-prev / #gallery-next              ← hidden mobile
```
- **Desktop**: CSS cross-fade, `position:absolute; opacity:0`, only `.is-active { opacity:1 }`, JS (product-page.js) `showSlide()`
- **Mobile**: v3+v6 converts to horizontal snap-scroll carousel; dots injected by TTB Gallery IIFE

### Mode 2: Scroll (`data-gallery-mode="scroll"`)
```
.product-gallery[data-gallery-mode="scroll"]
  .gallery-thumbs                              ← vertical/horizontal strip on desktop, hidden mobile
  #gallery-main.gallery-main                   ← overflow:visible desktop; overflow:hidden!important mobile (v9)
    #gallery-scroll-track.gallery-scroll-stack ← vertical stack desktop; flex snap-scroll mobile (v3)
      .gallery-scroll-item                     ← border-radius:var(--radius) (v8)
        img.gallery-image.gallery-image--scroll
```
- **Desktop**: Vertical image stack, natural page scroll, thumb syncs via IntersectionObserver (product-page.js)
- **Mobile**: Horizontal snap-scroll carousel (v3 converts)

### Mode 3: Grid (`data-gallery-mode="grid"`) ← CURRENT LIVE MODE
```
.product-gallery[data-gallery-mode="grid"]
  .gallery-thumbs                              ← hidden on desktop (JS hides), hidden mobile
  #gallery-main.gallery-main                   ← overflow:visible desktop; overflow:hidden!important mobile (v6+v9)
    #gallery-grid-track.gallery-grid-stack     ← CSS grid desktop; flex snap-scroll mobile (v3)
      .gallery-grid-item.gallery-grid-item--full  ← first image, grid-column:1/-1 desktop
      .gallery-grid-item.gallery-grid-item--half  ← rest, 2-col grid desktop
        img.gallery-grid-img
```
- **Desktop**: CSS grid `grid-template-columns:1fr 1fr`, first item full-width
- **Mobile**: Horizontal snap-scroll carousel (v3 converts all `.gallery-grid-item` to `flex:0 0 100%`)

### Classes Shown/Hidden Per Mode (desktop)
| Container | slideshow | scroll | grid |
|-----------|-----------|--------|------|
| `.gallery-main__inner` | ✅ shown | ❌ `display:none!important` | ❌ `display:none!important` |
| `.gallery-scroll-stack` | ❌ `display:none!important` | ✅ shown | ❌ `display:none!important` |
| `.gallery-grid-stack` | ❌ not in DOM | ❌ not in DOM | ✅ shown |
| `.gallery-thumbs` | ✅ desktop | ✅ desktop | ❌ JS hides |
| `.gallery-arrow` | ✅ desktop hover | ❌ `display:none!important` | ❌ `display:none!important` |
| `.gallery-zoom-hint` | ✅ desktop | ❌ `display:none!important` | ❌ `display:none!important` |

---

## 8. ALL FIXES APPLIED

### TTB FIXES v3 — Mobile gallery carousel, transparent header, cart icon
- **Transparent header mobile**: solid white on mobile, transparent→solid on scroll desktop
- **Cart icon clip at 375/480px**: `overflow:visible` on `.header-inner`, tighter padding
- **PDP gallery mobile carousel**: converts all 3 gallery modes to horizontal snap-scroll: `.gallery-main__inner` / `.gallery-scroll-stack` / `.gallery-grid-stack` → `display:flex; overflow-x:scroll; scroll-snap-type:x mandatory`; items → `flex:0 0 100%; scroll-snap-align:start`; `.gallery-thumbs { display:none }` at max-width:767px

### TTB FIXES v4 — Desktop transparent header, mobile double-sticky, gallery dots base
- **Desktop transparent header**: `body.has-transparent-header:not(.header-scrolled)` clears background on `#sticky-bar` + `#shopify-section-header`
- **Mobile double-sticky**: `#shopify-section-header { position:static !important }` on mobile
- **Gallery dot indicators**: base CSS for `.gallery-dots` and `.gallery-dot`
- **Wishlist inline**: flex row with `order` properties
- **Product layout mobile gap**: `.product-layout { gap:12px }`

### TTB FIXES v5 — Mobile sticky overlays, desktop PDP layout
- Mobile: `#shopify-section-header { position:static }`, `.product-info { position:static }`
- Mobile: dot indicators repositioned as `position:absolute` inside `#gallery-main`, bottom-left
- Mobile: qty-inline compact
- Desktop: `#shopify-section-header { position:relative }` (later partially reversed in v7)
- Desktop PDP: `.product-breadcrumb { grid-column:1/-1 }`, `.sticky-atc-bar { display:none }`

### TTB FIXES v6 — Critical gallery carousel fix (position:absolute bug)
- **Root cause**: `.gallery-slide { position:absolute; opacity:0 }` from desktop cross-fade was never overridden for mobile; absolute children are removed from flex flow, so v3's flex carousel had no effect
- **Fix (max-width:767px)**:
  - `.gallery-main { position:relative!important; overflow:hidden!important; aspect-ratio:3/4 }` (`#8432`)
  - `.gallery-main__inner { height:100%!important; align-items:stretch!important }`
  - `.gallery-slide { position:relative!important; inset:auto!important; opacity:1!important; height:100%!important; transition:none!important }`
  - `.gallery-slide.is-active { opacity:1!important; pointer-events:auto!important }`
  - Hides `.gallery-zoom-hint` and `.gallery-arrow` on mobile

### TTB FIXES v7 — Desktop header, PDP layout, gallery belt-and-suspenders
- **Desktop header disappearing**: (a) `html, body { overflow-x:clip }` — replaces `overflow-x:hidden` to prevent scroll-container trapping sticky; (b) `#shopify-section-header { position:sticky; top:0; z-index:200 }` on desktop — overrides v5's `position:relative`; `#sticky-bar` reinforced with `!important`
- **Desktop PDP layout**: explicit `grid-column` and `grid-row` on all `.product-layout` children
- **Desktop gallery**: `@media(min-width:768px)` — `.gallery-main__inner { display:block!important }`, `.gallery-slide { position:absolute!important; opacity:0!important }`, `.gallery-slide.is-active { opacity:1!important }` — belt-and-suspenders for cross-fade

### TTB FIXES v8 — Modal z-index, gallery dedup, green space, global border-radius
- **Modal z-index**: `.modal-overlay { z-index:500; pointer-events:none }` (inactive); `.modal-overlay[aria-hidden="false"] { z-index:3000; pointer-events:auto }` (active)
- **Gallery image dedup**: extended `.gallery-thumbs { display:none!important }` to `max-width:768px`; mode-specific hide rules at `max-width:767px` (e.g. slideshow hides scroll-stack and grid-stack, etc.)
- **Green blank space**: `.product-hero { background:var(--ivory,#ffffff) }`
- **Global border-radius** via `var(--radius)` applied to: `.gallery-main`, `.gallery-scroll-item`, `.product-badge`, `.product-badge--discount`, `.collection-card`, `.pair-with-card`, `.cart-drawer`, `.header-search-form`, `.product-savings`, `.similar-card__image-wrap`, `.product-bundle-nudge`
- **settings_schema.json**: Added "Design" group with `border_radius` range setting
- **layout/theme.liquid**: Added `<style>:root{--radius:...}</style>` after theme.css link
- **Cart icon fix (max-width:480px)**: `header.site-header .header-inner { overflow:visible!important; padding:... }`, `header.site-header .header-actions { gap:0!important }`, `header.site-header .header-action { width:32px; height:32px }`

### TTB FIXES v9 — Mega-backdrop mobile, header gap, gallery radius belt-and-suspenders
- **ISSUE 1A (max-width:767px)**: `.mega-backdrop { display:none!important; pointer-events:none!important }` — prevents desktop-only mega backdrop from overlaying `.header-actions` on mobile
- **ISSUE 1B (max-width:767px)**: `.header-actions { gap:4px!important }` — reduces 20px base gap for full mobile range 481–767px (480px and below already handled by v8 gap:0)
- **ISSUE 2 (max-width:767px)**: `.gallery-main { border-radius:var(--radius)!important; overflow:hidden!important }` — belt-and-suspenders to ensure border-radius shows and grid-mode desktop `overflow:visible` cannot bleed through
- **ISSUE 2 (max-width:767px)**: `.product-badge, .product-badge--discount { border-radius:var(--radius)!important }` — ensures discount badge radius on mobile

---

## 9. SHOPIFY SECTION SCHEMA SETTINGS

### announcement-bar.liquid
`text_1/2/3` (text), `url_1/2/3` (url), `divider` (text, default "✦"), `bg_color` (color, default "#FFEB3B"), `text_color` (color, default "#F9F3EE"), `speed` (range 15–80 step 5, default 35)

### header.liquid
`logo` (image_picker), `logo_icon` (image_picker), `logo_height` (range 24–80 step 2 default 48), `logo_width` (range 0–320 step 8 default 0), `logo_height_mobile` (range 20–60 step 2 default 36), `logo_width_mobile` (range 0–240 step 8 default 0), `menu` (link_list), `girls_menu/boys_menu/family_menu` (link_list), `girls_title/desc/cta/url`, `boys_title/desc/cta/url`, `family_title/desc/cta/url`, `mega_eyebrow`, `drawer_pages_heading`, `page1–4_label/url`, `search_placeholder`. **Blocks**: `mega_image` type (limit 30): `link_title` (exact match for category name), `image` (image_picker).

### product-hero.liquid
`tax_note`, `add_to_cart_text` (default "Add to Basket"), `sold_out_text`, `quantity_label`, `bundle_label`, `write_review_text`, `bxgy_note`, `gallery_mode` (global/slideshow/scroll/grid default "global"), `scroll_aspect` (3/4/1/1/4/5/auto default "3/4"), `scroll_gap` (range 0–32 step 2 default 6), `scroll_sticky_thumbs` (checkbox default true), `new_badge_text`, `care_instructions`, `shipping_info`, `badge_size` (range 12–28 step 2 default 16), share toggles (whatsapp/facebook/twitter/pinterest/instagram/tiktok/email/copy_link). **Blocks**: `trust_badge` type: `icon` (select 10 options), `custom_icon` (image_picker), `text`.

### collection-products.liquid
`filters_label`, `clear_label`, `sort_label`, `sort_featured`, `new_badge`, `sort_newest`, `products_per_page` (range 12–48 step 4 default 24), `grid_columns` (select 2/3/4 default "4"), `show_filters` (checkbox default true), `show_product_count` (checkbox default true).

### pair-with.liquid
`eyebrow`, `heading`, `subheading`. **Blocks**: `pair_product` type: `product` (product picker), `category_label` (text default "Pairs With").

### similar-products.liquid
`eyebrow`, `heading`, `collection` (collection picker fallback), `products_count` (range 4–12 step 2 default 8).

### cart-drawer.liquid
`title`, `empty_text`, `empty_cta`, `subtotal_label`, `checkout_btn`, `view_cart_text`, `shipping_message`.

### discount-carousel.liquid
`eyebrow`, `heading`, `subheading`, `shop_url`, `shop_btn_text`, `popular_badge`, `unlock_text`, `tier1–4_title/pct/desc`.

### hero-banner.liquid
`image`, `image_mobile`, `height` (small/medium/large/full), `overlay_opacity` (0–80), `text_align`, `content_position`, `eyebrow`, `heading`, `heading_size`, `subheading`, `cta_1_text/url`, `cta_2_text/url`, `show_scroll`, `scroll_label`.

### featured-collections.liquid
`eyebrow`, `heading`, `subheading`, `cta_label`. **Blocks**: `collection` type: `collection`, `label`, `subtitle`, `url`.

### testimonials.liquid
**Blocks**: `testimonial` type: `quote`, `name`, `subtitle`, `rating` (1–5). Settings: `eyebrow`, `heading`, `subheading`, `bg_color`.

### trust-cards.liquid
**Blocks**: `card` type: `icon` (select shipping/returns/support/secure/star/heart), `title`, `description`.

### product-reviews.liquid
`eyebrow`, `heading`, `write_heading`, `submit_btn`, `cancel_btn`, `load_more_btn`, `empty_text`, `photo_label`, `verified_label`, `reviews_per_page` (3–20), `show_photos`, `show_helpful`.

### subscribe-cta.liquid
`heading`, `label`, `placeholder`, `button_text`, `success_message`.

---

## QUICK REFERENCE — Strict Rules for All Future Sessions

```
BRANCH:   claude/frosty-driscoll-5727ac only
WORKTREE: C:\Hitesh Downloads\baby-elegance-updated\.claude\worktrees\frosty-driscoll-5727ac\

CSS RULE 1:  Append ALL CSS to the END of assets/theme.css only. Never modify existing rules.
CSS RULE 2:  Mobile-only rules  → @media (max-width: 767px)
CSS RULE 3:  Desktop-only rules → @media (min-width: 768px)
CSS RULE 4:  Never mix mobile and desktop rules in the same @media block.
CSS RULE 5:  Each appended block must have a /* TTB FIXES vN */ header and /* END TTB FIXES vN */ footer.
CSS RULE 6:  Current fix version: v9. Next fix block must be v10.

GIT RULE:    Output git command as text — NEVER run it.
             Always output this exact 4-line format:
               cd "C:\Hitesh Downloads\baby-elegance-updated\.claude\worktrees\frosty-driscoll-5727ac"
               git add <files>
               git commit -m "<message>"
               git push origin HEAD:claude/frosty-driscoll-5727ac

SILENT MODE: Output git commit command then say "Changes made."

BODY CLASSES TRUTH:
  has-transparent-header → homepage only (template == 'index')
  header-scrolled        → JS adds when scrolled past hero threshold
  is-scrolled            → on #sticky-bar when scrollY > 4px
  is-touch               → on body when touch device detected

GALLERY MODE TRUTH:
  CURRENT LIVE = "grid" (section.settings.gallery_mode = "grid" in settings_data.json)
  Resolution order: section.settings.gallery_mode → settings.global_gallery_mode → "slideshow"

METAFIELD TRUTH:
  custom.badge_text      → text badge on product images (overrides auto-calc %)
  custom.discount        → value "BXGY" = eligible for bundle tier discount
  custom.pair_with       → list of products for pair-with section
  custom.similar_products → list of products for similar-products section

MEGA BACKDROP TRUTH:
  #mega-backdrop is position:fixed; inset:0; z-index:1099 — desktop-only hover overlay
  display:none!important on mobile (max-width:767px) since v9 — never makes it interactive on mobile

NEVER:
  - Modify existing CSS rules (only append)
  - Add position:sticky to #shopify-section-header on mobile (breaks double-sticky)
  - Remove overflow-x:clip from html,body (breaks sticky header)
  - Remove overflow:hidden from .gallery-main on mobile (breaks carousel)
  - Set display:flex on .gallery-main__inner on desktop (breaks slideshow cross-fade)
```
