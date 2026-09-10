/* ==============================================================
   SECTION RE-INIT — Theme Editor only
   ==============================================================
   Loaded by layout/theme.liquid ONLY when request.design_mode is
   true, so it is never fetched or executed on the live storefront.

   When a merchant adds, reorders, edits, or removes a section in
   the Theme Editor, Shopify re-renders just that section's markup
   and fires shopify:section:load / :unload (and :select / :deselect
   when a section is focused). The theme's interactive scripts
   (theme.js, product-page.js, collection-filters.js, animations.js)
   and any <script> a section prints inline only run once, at initial
   page load — so those features go dead on the freshly re-rendered
   markup until a full reload.

   This shim, on section:load, re-runs the section's inline <script>
   tags and re-loads the interactive asset files so the editor
   preview keeps working. It is best-effort: re-loading the asset
   files re-runs their IIFEs, which can double-bind delegated
   listeners for the rest of the editor session. That trade-off is
   editor-only and never reaches shoppers.
   ============================================================== */
(function () {
  'use strict';

  if (!(window.Shopify && window.Shopify.designMode)) return;

  var INTERACTIVE_ASSETS = ['theme.js', 'product-page.js', 'collection-filters.js', 'animations.js'];

  // Resolve an asset URL from a <script> tag already on the page, so we
  // don't need Liquid's asset_url here. Assets not present on this
  // template (e.g. product-page.js off the product page) resolve to
  // null and are skipped.
  function assetUrl(name) {
    var tag = document.querySelector('script[src*="' + name + '"]');
    return tag ? tag.src.split('?')[0] : null;
  }

  // Re-execute <script> elements inside a container. A <script> node
  // that has already been parsed will not run again unless it is
  // recreated, so clone attributes + text into a fresh element.
  function runInlineScripts(container) {
    if (!container || !container.querySelectorAll) return;
    container.querySelectorAll('script').forEach(function (old) {
      var fresh = document.createElement('script');
      for (var i = 0; i < old.attributes.length; i++) {
        fresh.setAttribute(old.attributes[i].name, old.attributes[i].value);
      }
      fresh.textContent = old.textContent;
      old.parentNode.replaceChild(fresh, old);
    });
  }

  var reloadQueued = false;
  function reloadInteractiveAssets() {
    if (reloadQueued) return;
    reloadQueued = true;
    // Debounce — the editor can fire several section:load events in a burst.
    setTimeout(function () {
      reloadQueued = false;
      var bust = '?v=' + Date.now();
      INTERACTIVE_ASSETS.forEach(function (name) {
        var url = assetUrl(name);
        if (!url) return;
        var s = document.createElement('script');
        s.src = url + bust;
        s.defer = true;
        document.body.appendChild(s);
      });
    }, 60);
  }

  // Section added / reordered / settings changed -> markup replaced.
  document.addEventListener('shopify:section:load', function (event) {
    runInlineScripts(event.target);
    reloadInteractiveAssets();
  });

  // Section focused in the editor. Markup is NOT replaced here, so
  // there is nothing to re-initialise; kept as an explicit hook.
  document.addEventListener('shopify:section:select', function () {
    /* no-op — markup unchanged on select */
  });

  // Section removed. The theme's listeners are almost all delegated on
  // document and simply stop matching once the markup is gone, so there
  // is nothing to tear down; kept as an explicit hook.
  document.addEventListener('shopify:section:unload', function () {
    /* no-op */
  });
})();
