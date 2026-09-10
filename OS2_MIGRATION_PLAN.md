# Online Store 2.0 Migration Assessment — Baby Elegance / The Tiny Bosses

**Scope:** read-only assessment of `templates/`, `sections/`, `snippets/`, `layout/`, `config/`, and the coupled JS in `assets/`.
**Goal:** a future-proof theme — JSON templates, schema-backed sections visible in the Theme Editor, and app-block support (so the reviews app and similar install without code edits) — migrated with **zero change to how the storefront currently looks or behaves**.
**Note:** `TTB_CONTEXT.md` does not exist in the repo; this assessment is built directly from the theme files.

---

## 1. Template inventory

| Template | Type | Statically includes | `{% include %}`? |
|---|---|---|---|
| `templates/index.json` | **OS 2.0 JSON** | sections (in `order`): `hero-banner`, `featured-collections`, `discount-carousel`, `product-grid`, `trust-cards`, `testimonials`, `subscribe-cta` | n/a |
| `templates/product.liquid` | Legacy `.liquid` | `{% section 'product-hero' %}`, `{% section 'pair-with' %}`, `{% section 'similar-products' %}`, `{% section 'product-reviews' %}` | none |
| `templates/collection.liquid` | Legacy `.liquid` | `{% section 'collection-products' %}` | none |
| `templates/cart.liquid` | Legacy `.liquid` | `{% section 'cart-page' %}` | none |
| `templates/blog.liquid` | Legacy `.liquid` | `{% section 'blog-listing' %}` | none |
| `templates/article.liquid` | Legacy `.liquid` | `{% section 'blog-article' %}` | none |
| `templates/page.about.liquid` | Legacy `.liquid` (suffixed) | `{% section 'page-about' %}` | none |
| `templates/page.contact.liquid` | Legacy `.liquid` (suffixed) | `{% section 'page-contact' %}` | none |
| `templates/page.faq.liquid` | Legacy `.liquid` (suffixed) | `{% section 'page-faq' %}` | none |
| `templates/page.returns.liquid` | Legacy `.liquid` (suffixed) | `{% section 'page-returns' %}` | none |
| `templates/sitemap.liquid` | Legacy `.liquid`, `{% layout none %}` | none (pure XML, iterates `pages`/`collections`/`products`/`blogs`) | none |
| `templates/customers/account.liquid` | Legacy `.liquid` | `{% section 'customers-account' %}` | none |
| `templates/customers/addresses.liquid` | Legacy `.liquid` | `{% section 'customers-addresses' %}` | none |
| `templates/customers/login.liquid` | Legacy `.liquid` | `{% section 'customers-login' %}` | none |
| `templates/customers/order.liquid` | Legacy `.liquid` | `{% section 'customers-order' %}` | none |
| `templates/customers/register.liquid` | Legacy `.liquid` | `{% section 'customers-register' %}` | none |
| `templates/customers/reset_password.liquid` | Legacy `.liquid` | `{% section 'customers-reset-password' %}` | none |

**Deprecated `{% include %}`:** **none anywhere in the theme.** Every partial call already uses `{% render %}` (`product-grid` → `product-card` / `product-card-placeholder`; `similar-products` → `similar-card`; `customers-account`/`-addresses`/`-order` → `account-nav`). No hygiene work needed on this front.

**Only `templates/index.json` is OS 2.0 today.** All other routes are legacy `.liquid` "one section" wrappers (product = four sections). `sitemap.liquid` is intentionally standalone and is **not** an OS 2.0 candidate.

**Missing templates (routes currently served by Shopify defaults, not theme-controlled, not app-block-ready):** generic `page`, `search`, `404`, `list-collections`, `gift_card`, `password`, `customers/activate_account`, `robots.txt.liquid`. Adding JSON stubs is recommended (item 8) but is outside the parity-critical path.

---

## 2. Section inventory

**All 37 section files contain a `{% schema %}` block.** **None declares `{"type": "@app"}`.** There are therefore **no "no-schema" static-only sections** — but many are *static in practice*: they are only reachable through a legacy `.liquid` template and/or have **no `presets`**, so today they cannot be added, removed, or reordered in the editor, and cannot be placed in a JSON template as-is.

| Section | schema | blocks (type) | `@app` blocks | `presets` | Notes / editor-usability |
|---|---|---|---|---|---|
| `announcement-bar` | ✅ | — | ✗ | ✗ | Global (layout). Fully setting-driven. |
| `header` | ✅ | `mega_image` | ✗ | ✗ | Global (layout). Mega menu partly hardcoded (see §3). |
| `footer` | ✅ | `nav_group` *(declared, **never rendered** — dead schema)* | ✗ | ✅ | Global (layout). Nav columns largely hardcoded (see §3). |
| `hero-banner` | ✅ | — | ✗ | ✅ | In `index.json`. OS 2.0-ready. |
| `featured-collections` | ✅ | `collection` | ✗ | ✅ | In `index.json`. OS 2.0-ready. |
| `discount-carousel` | ✅ | — | ✗ | ✅ | In `index.json`. Tier cards hardcoded (see §3). |
| `product-grid` | ✅ | `collection` | ✗ | ✅ | In `index.json`. OS 2.0-ready. |
| `testimonials` | ✅ | `testimonial` | ✗ | ✅ | In `index.json`. OS 2.0-ready. |
| `trust-cards` | ✅ | `card` | ✗ | ✅ | In `index.json` only. OS 2.0-ready. |
| `subscribe-cta` | ✅ | — | ✗ | ✅ | In `index.json` only. OS 2.0-ready. |
| `product-hero` | ✅ | `trust_badge` | ✗ | ✗ | **Only via `product.liquid`.** Dense JS coupling (see §5). |
| `pair-with` | ✅ | `pair_product` | ✗ | ✅ | **Only via `product.liquid`.** Block-fallback branch renders no cards (bug). |
| `similar-products` | ✅ | — | ✗ | ✅ | **Only via `product.liquid`.** |
| `product-reviews` | ✅ | `review` | ✗ | ✅ | **Only via `product.liquid`.** Live reviews are JS-simulated — natural home for the reviews **app block**. |
| `collection-products` | ✅ | — | ✗ | ✅ | **Only via `collection.liquid`.** Heavy `collection-filters.js` coupling. |
| `cart-page` | ✅ | — | ✗ | ✗ | **Only via `cart.liquid`.** Emits inline `<script>` + Liquid tier math. |
| `cart-drawer` | ✅ | — | ✗ | ✗ | Global (layout, outside `content_for_layout`). Populated by `theme.js`. Keep as layout include. |
| `discount-popup` | ✅ | — | ✗ | ✗ | Global (layout). Nodes updated by `theme.js`. |
| `newsletter-popup` | ✅ | — | ✗ | ✗ | Global (layout). Inline `<script>` + `localStorage`. |
| `page-about` | ✅ | — | ✗ | ✗ | **Only via `page.about.liquid`.** Monolithic (hero+mission+story+values+stats+cta in one schema). |
| `page-contact` | ✅ | — | ✗ | ✗ | **Only via `page.contact.liquid`.** |
| `page-faq` | ✅ | `question` | ✗ | ✅ | **Only via `page.faq.liquid`.** Inline `<script>` for category tabs. |
| `page-returns` | ✅ | — | ✗ | ✗ | **Only via `page.returns.liquid`.** |
| `blog-listing` | ✅ | — | ✗ | ✗ | **Only via `blog.liquid`.** |
| `blog-article` | ✅ | — | ✗ | ✗ | **Only via `article.liquid`.** |
| `customers-login` | ✅ | — | ✗ | ✗ | **Only via `customers/login.liquid`.** Inline `<script>` + `{% if recover %}` guard. |
| `customers-register` | ✅ | — | ✗ | ✗ | **Only via `customers/register.liquid`.** Inline `<script>`. |
| `customers-account` | ✅ | — | ✗ | ✗ | **Only via `customers/account.liquid`.** |
| `customers-addresses` | ✅ | — | ✗ | ✗ | **Only via `customers/addresses.liquid`.** Inline `<script>`. |
| `customers-order` | ✅ | — | ✗ | ✗ | **Only via `customers/order.liquid`.** |
| `customers-reset-password` | ✅ | — | ✗ | ✗ | **Only via `customers/reset_password.liquid`.** Inline `<script>`. |
| `product-spotlight` | ✅ | — | ✗ | ✅ | **Unused** — has preset, ready to drop into any JSON template. |
| `promo-banner` | ✅ | — | ✗ | ✅ | **Unused** — ready. Inline countdown `<script>`. |
| `rich-text` | ✅ | — | ✗ | ✅ | **Unused** — ready. |
| `image-with-text` | ✅ | — | ✗ | ✅ | **Unused** — ready. |
| `image-gallery` | ✅ | `image` | ✗ | ✅ | **Unused** — ready. |
| `multi-column` | ✅ | `column` | ✗ | ✅ | **Unused** — ready. |

**"Static-only / not usable in a JSON template or the editor as-is" — flagged:**
`product-hero`, `pair-with`, `similar-products`, `product-reviews`, `collection-products`, `cart-page`, `page-about`, `page-contact`, `page-faq`, `page-returns`, `blog-listing`, `blog-article`, and all six `customers-*`. Every one of these is reachable only through a legacy `.liquid` template. `header`, `footer`, `announcement-bar` are static in a different way (hard-wired into `layout/theme.liquid`); `cart-drawer`, `discount-popup`, `newsletter-popup` are layout-injected outside `content_for_layout` and should **stay** that way.
Sections with a `{% schema %}` but **no `presets`** (cannot be added via "Add section" even once templates are JSON): `announcement-bar`, `header`, `cart-drawer`, `cart-page`, `discount-popup`, `newsletter-popup`, `product-hero`, `page-about`, `page-contact`, `page-returns`, `blog-listing`, `blog-article`, all `customers-*`.

---

## 3. Hardcoded content that should become editor-editable section settings

Per section (only meaningful gaps listed; sections not listed are already adequately setting/block-driven):

**`header.liquid`**
- Girls / Boys / Family are three hardcoded `<li class="nav-item--mega">` with **hardcoded top-level labels** ("Girls"/"Boys"/"Family") and **hardcoded URLs** (`/collections/girls`, `/collections/boys`, `/collections/family`).
- Mega-panel column links are hardcoded pipe-delimited strings in Liquid: `girls_links = "Tops & T-Shirts,/collections/girls-tops|Dresses & Frocks,/collections/girls-dresses|…"` (and `boys_links`, `family_links`). Only the panel **title / description / CTA text / CTA url / eyebrow**, an optional per-category `link_list`, and per-link images (`mega_image` blocks matched by exact title string) are settings.
- Mobile drawer repeats the same hardcoded fallback child links for each category.
- **Should be:** one `link_list` (or blocks) per mega column + editable label/url per category, so the primary navigation is fully merchant-controlled.

**`footer.liquid`**
- **Four nav columns.** Only column 1 (Shop) and column 2 (Help) have a `link_list` setting (`col1_menu`, `col2_menu`); when blank they fall back to **hardcoded link lists**. **Columns 3 (Company) and 4 (My Account) have no menu setting at all** — fully hardcoded (`/pages/about`, `/blogs/news`, `/account`, `/account/addresses`, …).
- Bottom-bar legal links (`/policies/privacy-policy`, `/policies/terms-of-service`, `/policies/shipping-policy`, returns) hardcoded.
- The `nav_group` **block type is declared in the schema but never rendered** — dead. Intended design was clearly block-driven columns.
- **Should be:** a `link_list` per column (3–5) or wire the existing `nav_group` blocks; expose the legal links.

**`discount-carousel.liquid`**
- The four tier cards are **hardcoded HTML**: `data-qty`/`data-pct` = `2/5`, `3/10`, `4/15`, `5/20`; display text "Buy 2"…"Buy 5+", "5% Off"…"20% Off"; icons; the progress-bar markers (`left:40% "2"`, `60% "3"`, `80% "4"`, `100% "5+"`).
- The schema **defines `tier1_title`/`tier1_pct` … `tier4_title`/`tier4_pct` but the template only renders `tierN_desc`** and `shop_btn_text`. The tier quantities, percentages and labels are effectively hardcoded.
- **Should be:** one block per tier (qty, %, label, description, featured flag), or at minimum wire the existing `tierN_*` settings.

**`cart-drawer.liquid` / `cart-page.liquid`**
- Milestone thresholds and discount-code names (`5% @ 2`, `10% @ 3`, `20% @ 5`; `BUNDLE5`/`BUNDLE10`/`BUNDLE20`) are hardcoded in markup (`cart-drawer`) and in Liquid + inline `<script>` (`cart-page`). Only visible **labels** are settings.

**`product-hero.liquid`**
- The **size-guide modal table** (8 rows: Newborn…3-4Y with age / height / weight / chest) is hardcoded.
- The **bundle-nudge pills** ("5% / off / Buy 2", "10% / Buy 3", "20% / Buy 5+") are hardcoded and duplicate `discount-carousel`.
- Breadcrumb "Home", accordion labels "Description" / "Care Instructions" / "Shipping & Returns" (bodies *are* settings: `care_instructions`, `shipping_info`).
- **Should be:** size-guide rows as blocks or a metaobject; bundle pills sourced from the same setting/blocks as `discount-carousel`.

**`page-about.liquid`**
- Story fallback paragraphs, the four value-card **icons**, the mission SVG, and `about-cta__title` ("Ready to dress your little one?") are hardcoded. Stats and values are fixed at four each (settings, not blocks).

**`page-returns.liquid`**
- Summary-card numbers "15 Days", "Free", "5–7 Days", "24h" are hardcoded; only `card1_num`/`card1_label` are wired. `card2_val`…`card4_val` are **defined but unused**.

**`page-contact.liquid`**
- Subject `<option>` values ("Return / Exchange", "Wholesale / Bulk Order", "Something Else") partly hardcoded (only option 1 and the product option are settings).

**`page-faq.liquid`** — category enum (5 categories) is fixed in the schema; questions themselves are blocks ✅.

**`layout/theme.liquid`** — `twitter:site` default `@thetinybosses`, JSON-LD `"priceRange": "₹₹"`, `theme-color #f9f3ee`, Google Fonts `<link>` hardcoded. Minor; safe to leave for parity.

**Already fine (settings/block-driven):** `announcement-bar`, `hero-banner`, `featured-collections`, `product-grid`, `testimonials`, `trust-cards`, `subscribe-cta`, `similar-products`, `product-spotlight`, `promo-banner`, `rich-text`, `image-with-text`, `image-gallery`, `multi-column`, `collection-products`, all `customers-*`.

> Also note: `config/settings_data.json` currently holds stale values that disagree with section defaults (e.g. announcement bar `"Free shipping on orders over $75"`, `bg_color #2c1f18`; `footer.contact_phone "xxx.xxxx.xxx"`; `product-grid` blocks pointing at `girls-tops` / `girls`). That is **data, not code** — carry it forward verbatim during migration (see Parity Checklist).

---

## 4. App-block readiness

**Where an app can be inserted through the editor today: nowhere.**
- Only `templates/index.json` is a JSON template. None of its sections (`hero-banner`, `featured-collections`, `discount-carousel`, `product-grid`, `trust-cards`, `testimonials`, `subscribe-cta`) list `{"type": "@app"}` in `blocks` (three of them define no `blocks` at all). So even on the home page a theme-app-extension **section block** cannot be dropped in.
- Every other route is a legacy `.liquid` template. Legacy templates **cannot host app section blocks**.
- **App *embed* blocks** (floating widgets, tracking pixels, chat) still work — they live in `settings_data.json > current.blocks` and are template-independent. The reviews app's inline star-rating / review-widget is a **section block**, which is what is blocked.

**What each template needs to accept app blocks:**
1. Convert the `.liquid` template to `.json`.
2. In the JSON, reference the existing section(s) with their current settings.
3. In the section's `{% schema %}`, add `{"type": "@app"}` to `blocks`, and render app blocks in the body:
   ```liquid
   {% for block in section.blocks %}
     {% case block.type %}
       {% when '@app' %}{% render block %}
     {% endcase %}
   {% endfor %}
   ```
   (or add a dedicated, clearly-placed "Apps" slot).

| Template | Section(s) to expose `@app` | Placement |
|---|---|---|
| **product** (do first) | `product-hero` **and** `product-reviews` | `product-hero`: a slot under the price row (compact star rating) and a slot after the buy form; `product-reviews`: where the JS-simulated list renders, so the reviews app widget augments/replaces it |
| collection | `collection-products` | above the grid and/or in the sidebar (filter / merchandising apps) |
| cart | `cart-page` (+ `cart-drawer` as a layout include) | above the order summary (cart upsell / rewards) |
| pages / blog | the single main section per template | end of the article / page body |
| home | the seven `index.json` sections that should accept apps | additive only; not required for the reviews goal |

Global header/footer app-embed blocks need no template work.

---

## 5. Custom / fragile systems to preserve (behaviour must not change)

### 5.1 "OTP login" — **there is no OTP system in this theme**
`sections/customers-login.liquid` uses the standard Shopify `{% form 'customer_login' %}` plus an inline `{% form 'recover_customer_password' %}` toggled by **inline `onclick`** DOM show/hide between hardcoded IDs `#auth-login-form` / `#auth-recover-form`, a small `<script>` for the password-eye toggle, and a `{% if recover %}` Liquid guard that re-reveals the recovery form after a failed/attempted reset. Register/reset use `{% form 'create_customer' %}` / `{% form 'reset_customer_password' %}` with their own inline eye-toggle scripts.
- **Risk on migration:** the inline `onclick` strings and the `{% if recover %}` guard must survive byte-for-byte; the eye-toggle scripts are inline in the section and will **not** re-run on `shopify:section:load`.
- If a third-party **passwordless / OTP login app** is installed on this store, it is an **app embed** and is unaffected by template conversion — but disturbing `customers/login` markup could still break the app's selectors.
- **Recommendation: do not migrate `customers/*` during the parity-critical phases** (Phase 6 / optional, or skip).

### 5.2 Bundle / volume discount engine — spread across **six** files, with **inconsistent tier tables**
| File | Tiers (qty → %) | Role |
|---|---|---|
| `assets/discount-engine.js` | 2→5, 3→10, **4→15**, 5→20 (`BUNDLE5/10/15/20`) | `window.DiscountEngine`; writes `/cart/update.js` `note` + `_bundle_discount_*` attributes. Listens for **`cart:updated`**, which **nothing dispatches** → currently dormant. |
| `assets/theme.js` (`DISCOUNT_TIERS`, `updateDiscountUI`, `getBxgyCount`) | 2→5, 3→10, 5→20 (**no 15**) | Live drawer UI. Reads `window.bxgyProductIds`. Updates `#cart-discount-message/-fill/-label/-applied` and `#discount-progress-*` / `#discount-popup-*`. |
| `sections/cart-drawer.liquid` | 2 / 3 / 5 milestone DOM | Injects `window.bxgyProductIds` from `item.product.metafields.custom.discount == 'BXGY'` **before** `theme.js` runs. |
| `sections/cart-page.liquid` | 2→5, 3→10, 5→20 (`BUNDLE5/10/20`) | **Independent** Liquid tier math + inline `<script>` (qty change via `/cart/change.js` + full reload). |
| `sections/discount-carousel.liquid` | 2 / 3 / 4 / 5+ display cards | Home-page marketing (`data-qty`/`data-pct`). |
| `sections/product-hero.liquid` | 2 / 3 / 5 nudge pills + `data-bxgy` | PDP bundle nudge. |

- **Parity = preserve each file's current numbers.** Do **not** unify the tiers during migration (that is a separate, deliberate change).
- Migration risks: `cart-page` → `cart.json` must keep its inline `<script>` **and** Liquid math; `cart-drawer` must stay a layout include so `window.bxgyProductIds` is defined before `theme.js`; `discount-popup` / `cart-drawer` must remain layout-injected outside `content_for_layout`.

### 5.3 Custom cart drawer
`sections/cart-drawer.liquid` is rendered by `layout/theme.liquid` inside `<div id="cart-drawer">`, **outside `content_for_layout`**. `theme.js` `fetchCart()` / `renderCart()` / `updateDiscountUI()` build `.cart-item` markup as an **innerHTML string** and hard-depend on IDs: `#cart-drawer-items`, `#cart-empty`, `#cart-drawer-footer`, `#cart-count`, `#cart-subtotal-price`, `#cart-discount-applied` / `-fill` / `-label` / `-message`, `#cart-toggle`, `#cart-overlay`, `#cart-drawer-close`. `window.fetchCart` / `window.renderCart` are exposed globally and reused by `product-page.js` and the quick-add handler.
- **Keep as a direct layout include. Do not move into a JSON template.**

### 5.4 Variant / price selection JS (`assets/product-page.js`)
Hard-depends on `sections/product-hero.liquid` markup:
- `<script type="application/json" id="product-variants-json">{{ product.variants | json }}</script>`
- `#variant-id` (hidden input), `#product-price`, `#product-compare-price`, `#add-to-cart-btn` (+ `data-add-label` / `data-sold-out-label`), `#add-to-cart-text`
- `.size-btn-input` / `.color-swatch-input` with `data-option-index`; `.option-block` / `.option-selected-value`
- `#qty-atc-row`, `#notify-me-row`, `#product-quantity`, `#qty-minus` / `#qty-plus`
- gallery: `#gallery-main`, `#gallery-track` / `#gallery-scroll-track` / `#gallery-grid-track`, `.gallery-slide`, `.gallery-thumb`, `#gallery-scroll-{i}`, three modes selected by `data-gallery-mode` (from `section.settings.gallery_mode` + global `settings.global_gallery_mode`)
- `.accordion-trigger` / `.accordion-body`; size guide `#size-guide-trigger` / `#size-guide-overlay` / `#size-guide-close`
- `pair-with` variant popup: `#variant-popup-overlay` / `-title` / `-price` / `-image` / `-body` / `-add`; `.btn-pair-variants` with `data-variants` / `data-options`
- fullscreen lightbox: `#gallery-lightbox*` (lives in `layout/theme.liquid`)
- **Any product migration must keep this markup byte-for-byte, or update `product-page.js` in the same commit.**
- `product-page.js` is loaded by `layout/theme.liquid` only when `template == 'product'` — the `template` value is unchanged by JSON conversion, so this keeps working.

### 5.5 Mega menu (`sections/header.liquid` + `assets/animations.js` `initMegaMenu`)
- Desktop: pure CSS `:hover` on `.nav-item--mega` → `.mega-panel`. Touch/iPad: JS adds `body.is-touch` on first `touchstart` (kills sticky-hover), then `.is-open` toggling. `.mega-backdrop` dims the page. Keyboard: `focus-within` + `Esc`.
- Depends on classes `.nav-item--mega`, `.mega-panel`, `.nav-link`, `.mega-backdrop`, `.nav-chevron`, and `body.is-touch`.
- **Header stays a layout-level section (or a header section group). Do not JSON-templatize the header in the parity phase.**

### 5.6 Other JS ↔ static-markup coupling (migration could break)
- **`collection-filters.js`** hard-depends on `collection-products.liquid`: `#filter-groups`, `#collection-tags-data` (JSON `<script>`), `#collection-grid`, `#collection-sort`, `#active-filter-chips`, `#filter-count-badge`, `#sidebar-clear-all`, `#collection-no-results`, `#no-results-clear`, `#filter-toggle-mobile`, `#collection-sidebar`, and `.collection-product-card[data-tags][data-variants][data-size-option-index]`. Client-side tag filtering model: product tags `filter-Group:Value`. Loaded when `template contains 'collection'` (unchanged by JSON conversion).
- **`collection-products.liquid` inline `<script>`** fetches `swatches.json` and hydrates `[data-color]` swatches + `initCardImages()`. Inline scripts in a JSON-rendered section run once but **do not re-run on `shopify:section:load`**.
- **Transparent header:** `theme.js` reads `#hero-section` `offsetHeight` and toggles `body.header-scrolled` — only active on `template == 'index'` (`body.has-transparent-header`, set in `layout/theme.liquid`). Home is already JSON; keep the section id `hero-section` on `hero-banner`.
- **No `Shopify.designMode` / `shopify:section:load` / `shopify:section:select` handlers anywhere.** After a settings edit in the Theme Editor, any re-rendered section loses its JS listeners until a full reload. This already affects the home page; converting more templates widens the exposure. Add re-init shims (item 8 / Phase 0).
- Sections emitting their own `<script>` (won't re-run on section reload): `cart-page`, `page-faq`, `newsletter-popup`, `promo-banner`, `collection-products`, `customers-login`, `customers-register`, `customers-addresses`, `customers-reset-password`.
- `discount-engine.js` is loaded early (`defer`, in `<head>`) by `layout/theme.liquid`; `theme.js` / `animations.js` / `product-page.js` / `collection-filters.js` load `defer` at end of `<body>`.

---

## 6. Migration plan — phased, one template at a time

**Ordering principle:** start with **product** (unblocks the reviews app as an app block and exercises the hardest JS coupling early), then the other high-traffic commerce routes, then low-risk content routes, then cart, then optional global/customer work. The home page is already OS 2.0.

### Phase 0 — Safety net & hygiene (no template conversion)
- Add `.theme-check.yml`; run `shopify theme check`; fix **non-behavioural** lint only (JSON formatting, unused `assign`s, `{% # %}` comments). Separate commits from conversions.
- `{% include %}` → `{% render %}`: **nothing to do** (zero `{% include %}`).
- Add `shopify:section:load` (and `:select` / `:deselect`) re-init shims to `theme.js`, `product-page.js`, `collection-filters.js`, `animations.js` — wrap each `init()` and rebind on the event. This de-risks every later phase.
- Capture before-migration snapshots (DOM + screenshots + network) for every route (see §7).
- **Do not touch** tier numbers, element IDs, or section markup in this phase.

### Phase 1 — Product  →  `templates/product.json`   *(do first)*
- Create `product.json` referencing, **in the current order**, `product-hero`, `pair-with`, `similar-products`, `product-reviews`, each with `settings` copied verbatim from `config/settings_data.json > current.sections`.
- Leave `sections/product-hero.liquid` markup **unchanged** (see §5.4). Additive only: append `{"type": "@app"}` to `product-hero.blocks` (render in a slot under the price row and a slot after the buy form) and to `product-reviews.blocks` (render where the JS-simulated list is).
- **Effort: M. Risk: med.**
- Parity risks: variant-change price / currency / OOS / per-size sold-out logic; 3 gallery modes (`grid` / `scroll` / `slideshow`) via `settings.gallery_mode` + global `settings.global_gallery_mode`; `#product-variants-json`; sticky info panel; size-guide modal; bundle-nudge pills + `data-bxgy`; `pair-with` metafield vs block path (block-fallback branch is already a no-op); `product-reviews` seed blocks must still render when the app has no data; `product-page.js` still gated on `template == 'product'`; JSON-LD / OG tags in `layout` unaffected.

### Phase 2 — Collection  →  `templates/collection.json`
- `collection.json` → one section `collection-products`, settings from `settings_data.json`.
- Optionally append `{"type": "@app"}` for filter / merchandising apps.
- **Effort: M. Risk: med.**
- Parity risks: client-side tag filtering (`#collection-tags-data`), filter chips + count badge, no-results state, `data-columns` / per-page, `swatches.json` hydration + `initCardImages`, sort dropdown (server reload), pagination, collection hero background image, size sheet.

### Phase 3 — Content pages  →  `page.about.json`, `page.contact.json`, `page.faq.json`, `page.returns.json`
- Each → its single existing section. FAQ keeps `question` blocks and its inline category-tab `<script>`. About / Returns keep their monolithic schema (splitting into sub-sections is **optional future work, not parity**).
- **Effort: S each. Risk: low.**
- Parity risks: FAQ category nav + block order; About stats/values; Returns default body vs `custom_content`; contact form field names (`contact[...]`).

### Phase 4 — Blog  →  `blog.json`, `article.json`
- Each → one section (`blog-listing`, `blog-article`).
- **Effort: S. Risk: low.** Pagination, tag pills, comment form (`{% form 'new_comment' %}`), related-articles loop — all Liquid, no fragile JS.

### Phase 5 — Cart  →  `templates/cart.json`
- `cart.json` → one section `cart-page`. Keep its inline `<script>` and Liquid tier math **verbatim**. `cart-drawer` stays a layout include.
- **Effort: S. Risk: med.**
- Parity risks: discount-banner states (no items / has a tier / max tier), milestone nodes, `BUNDLE5/10/20` codes, order-summary rows, qty-change → `/cart/change.js` → full reload, must not diverge from drawer behaviour.

### Phase 6 — Optional / later
- **Global section groups:** `sections/header-group.json` + `footer-group.json` (+ announcement), wired via `{% sections 'header-group' %}` / `{% sections 'footer-group' %}` in `layout/theme.liquid`, so header/footer/announcement become editable & reorderable. **Risk: med** (mega menu, transparent header, `#sticky-bar`, `body.is-touch`).
- **`customers/*.json`:** low value, high churn. **Do last or skip.** **Risk: med** for `customers/login` if a passwordless/OTP app is installed — leave it legacy.
- **Home:** `index.json` is already OS 2.0 — only add `{"type": "@app"}` to its sections if app blocks are wanted there.
- **Missing-template stubs:** add JSON `page`, `search`, `404`, `list-collections`, `gift_card`, `password`, `customers/activate_account` so those routes are theme-controlled and app-block-ready.

### Effort / risk summary

| Template | Phase | Effort | Risk | Main parity risks |
|---|---|---|---|---|
| `index` | done | — | — | already OS 2.0 (add `@app` only if desired) |
| `product` | 1 | **M** | **med** | variant/price/OOS JS, 3 gallery modes, `#product-variants-json`, size sheet, bundle nudge, reviews seed blocks |
| `collection` | 2 | **M** | **med** | tag filtering, `#collection-tags-data`, swatch hydration, sort reload, pagination |
| `page.about` | 3 | S | low | monolithic section, stats/values, story fallback text |
| `page.contact` | 3 | S | low | Shopify contact form field names |
| `page.faq` | 3 | S | low | inline category-tab script, `question` block order |
| `page.returns` | 3 | S | low | default body vs `custom_content` |
| `blog` | 4 | S | low | pagination, tag pills |
| `article` | 4 | S | low | comments form, related loop |
| `cart` | 5 | S | **med** | tier math + inline script, `BUNDLE*` codes, qty-change reload, drawer parity |
| header/footer groups | 6 | **L** | **med** | mega menu, transparent header, sticky bar, `is-touch` |
| `customers/*` | 6 | M | **med** | inline scripts, `{% if recover %}`, possible OTP/passwordless app |
| missing-template stubs | 6 | S | low | none (new routes) |

---

## 7. Parity checklist (per template)

**Every phase, before → after:** same rendered HTML structure & class names, same section order, **every setting value carried over from `config/settings_data.json > current.sections`** (including the stale/odd values), no new console errors, no new network requests, Lighthouse/CLS unchanged, and the JS behaviours in §5 verified.

**Global (all templates)**
- [ ] `layout/theme.liquid` unchanged: SEO/OG/Twitter/JSON-LD, GA gate, fonts, `body` class string (`template-…`, `has-transparent-header` on index), script `defer` order and `template == 'product'` / `template contains 'collection'` gates.
- [ ] `cart-drawer`, `discount-popup`, `newsletter-popup`, back-to-top, review lightbox, gallery lightbox still injected outside `content_for_layout`.
- [ ] Header: mega menu opens on hover (desktop) and tap (touch, `body.is-touch`), `.mega-backdrop`, `Esc`, transparent→solid on scroll past `#hero-section`, sticky `#sticky-bar`, search bar, mobile drawer, cart count.
- [ ] Footer: 5-badge trust strip, 4 nav columns (hardcoded fallbacks intact), newsletter form, payment icons, legal links.

**product**
- [ ] Section order `product-hero → pair-with → similar-products → product-reviews`.
- [ ] Price renders in shop currency on load **and** after variant change; compare-at + "Save" behaviour.
- [ ] Per-size sold-out/disabled reflects `(selected colour + size)`; ATC disables + "Sold Out" label on unavailable variant; Notify-Me row.
- [ ] Gallery mode matches `settings.gallery_mode` (else global `settings.global_gallery_mode`) — grid / scroll / slideshow; thumbnails; arrows; swipe; zoom hint; fullscreen lightbox.
- [ ] Size-guide modal (table + open/close/Esc); accordions (Description only when `product.description` present; Care/Shipping); bundle-nudge pills + `data-bxgy`.
- [ ] `pair-with` renders from `custom.pair_with` metafield; variant popup for multi-variant paired items.
- [ ] `product-reviews` seed `review` blocks render; star summary/breakdown; write-review form; **reviews app block slot present and empty-safe**.
- [ ] `product-page.js` loads and all IDs in §5.4 resolve.

**collection**
- [ ] Collection hero (title, description truncation, background image).
- [ ] Filter sidebar builds from `filter-*` tags; checkboxes; active chips; count badge; clear-all; no-results state; mobile toggle.
- [ ] `data-columns` grid, products-per-page, pagination, sort dropdown (URL reload).
- [ ] Card swatches hydrate from `swatches.json`; swatch → image switch; size sheet (`#size-sheet*`) instant-add.

**cart**
- [ ] Discount banner: 0 items / partial tier / max tier copy; milestone nodes `2 / 3 / 5`; codes `BUNDLE5/10/20`.
- [ ] Items table; qty ± and remove via `/cart/change.js` + full reload; order summary rows; empty state.
- [ ] Matches `cart-drawer` discount behaviour.

**page.about / page.contact / page.faq / page.returns**
- [ ] All hero/eyebrow/heading/body settings; About stats & values (4 each); Returns default body vs `custom_content`; FAQ category nav + block order + inline tab script; contact form submits (`contact[...]`).

**blog / article**
- [ ] Featured-first-article toggle; tag pills; pagination; article body RTE; share links; prev/next; comments form + moderation notice; related articles; sidebar newsletter.

**customers/* (if/when migrated)**
- [ ] Login form + inline recovery toggle + `{% if recover %}` reveal + eye toggle; register form + eye toggle + marketing checkbox; addresses add/edit/delete/default + confirm dialog; account orders table + profile; order detail totals/tracking; reset-password confirm match.

---

## 8. Supporting recommendations (keep separate from the risky template conversions)

**Linting / CI**
- Add `.theme-check.yml` and a CI step running `shopify theme check`. Expect warnings for: sections with no `presets`, unused `assign`s, large inline `<script>`/`<style>` in sections, `img_url` (deprecated in favour of `image_url` + `image_tag`), missing template files. Address **formatting/dead-code** warnings in Phase 0; leave anything behavioural for its own ticket.

**Quick structural hygiene to fold into Phase 0 (separate commits, no behaviour change):**
- `{% include %}` → `{% render %}`: **not applicable** — the theme already uses `{% render %}` exclusively.
- Add `shopify:section:load` / `:select` re-init to `theme.js`, `product-page.js`, `collection-filters.js`, `animations.js` (and re-run section-local inline scripts). Biggest single risk-reducer for the whole migration.
- `assets/discount-engine.js`: the `cart:updated` listener is **dead** (no code dispatches that event). Decide deliberately — either have `theme.js` dispatch `cart:updated` after cart changes, or delete `discount-engine.js` and its `<head>` `<script>` tag. Do **not** silently drop it.
- **Inconsistent bundle-tier tables** in `discount-engine.js` (has 4→15%), `theme.js` (no 15%), `cart-page.liquid` (no 15%), `discount-carousel.liquid` (has 4/15), `cart-drawer.liquid` (2/3/5), `product-hero.liquid` (2/3/5): document as a known discrepancy; **do not unify during migration** — that is a functional change needing its own review/QA.
- `sections/pair-with.liquid`: the `{% else %}` (Theme-Editor-block) branch renders **no card HTML** — only the metafield path outputs cards. Fix the branch or remove the dead code + misleading `presets`/schema copy.
- `sections/discount-carousel.liquid`: `tierN_title` / `tierN_pct` settings are defined but never output. Either render them or drop them.
- `sections/footer.liquid`: `nav_group` block type is declared but never rendered (dead schema); columns 3 & 4 have no `link_list` setting. Wire the blocks or add menus.
- `sections/footer.liquid`: the trust-badge SVG `{% case %}` is duplicated inline 5×. Extract to a `snippets/footer-trust-icon.liquid`.
- `snippets/product-card-placeholder.liquid`: hardcoded `$34.00` — wrong currency; use `1 | times: 0 | money` or a neutral placeholder.
- Add JSON stubs for the missing routes: `page`, `search`, `404`, `list-collections`, `gift_card`, `password`, `customers/activate_account` — so every route is theme-controlled and can host app blocks.
- `assets/*` deprecated filters: migrate `img_url` → `image_url` + `image_tag` opportunistically **inside** each section's own migration phase (touching that file anyway), never as a repo-wide sweep.

**Sequencing:** Phase 0 hygiene and re-init shims first and independently; then Phases 1→5 one template per PR, each with the §7 checklist attached and a storefront diff (screenshots + DOM) reviewed before merge; Phase 6 only after 1–5 are stable in production.
