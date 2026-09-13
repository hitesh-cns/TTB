/**
 * PAGE-FADE-IN.JS — Baby Elegance
 * Progressive-enhancement load fade: adds `js` to <html> as soon as this
 * (deferred) script runs, then `is-loaded` to <body> on window load.
 * A no-JS or JS-blocked visitor never gets the `js` class, so theme.css's
 * `html.js body { opacity: 0 }` rule never applies — content stays visible.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  function reveal() {
    document.body.classList.add('is-loaded');
  }

  if (document.readyState === 'complete') {
    reveal();
  } else {
    window.addEventListener('load', reveal);
  }
})();
