/**
 * =
 * COLLECTION FILTERS — collection-filters.js
 * --
 * Reads filter tags from product data, builds the sidebar UI, and
 * filters products client-side without a page reload.
 *
 * HOW IT WORKS:
 * 1. On page load, reads all product tags from collection-tags-data
 * 2. Tags prefixed with "filter-" are parsed into groups + values
 *    e.g. "filter-Color:White" → group="Color", value="White"
 * 3. Renders checkboxes in the sidebar for each group/value
 * 4. When a filter is selected, hides non-matching product cards
 *    using CSS classes — no reload needed
 * 5. Active filters are shown as removable chips in the toolbar
 * 6. Sort dropdown changes the Shopify URL (requires reload for
 *    server-side sort)
 * =
 */

(function() {
  'use strict';

  // -- State: which filters are currently active --
  const activeFilters = {};  // { 'Color': ['White', 'Blush'], 'Size': ['0-3M'] }

  // -- DOM references --
  const filterGroupsEl  = document.getElementById('filter-groups');
  const activeChipsEl   = document.getElementById('active-filter-chips');
  const filterBadgeEl   = document.getElementById('filter-count-badge');
  const clearAllBtn     = document.getElementById('sidebar-clear-all');
  const noResultsEl     = document.getElementById('collection-no-results');
  const collectionGrid  = document.getElementById('collection-grid');
  const sortSelect      = document.getElementById('collection-sort');
  const mobileToggle    = document.getElementById('filter-toggle-mobile');
  const sidebar         = document.getElementById('collection-sidebar');
  const noResultsClear  = document.getElementById('no-results-clear');

  // -- Read tag data passed from Liquid --
  const tagsDataEl = document.getElementById('collection-tags-data');
  if (!tagsDataEl || !filterGroupsEl) return;

  let tagsData = {};
  try {
    tagsData = JSON.parse(tagsDataEl.textContent);
  } catch(e) {
    console.warn('Baby Elegance: Could not parse collection tags', e);
    return;
  }

  // -- Parse tags into groups --
  // Input:  ["filter-Color:White", "filter-Color:Blush", "filter-Size:0-3M"]
  // Output: { Color: ['White', 'Blush'], Size: ['0-3M'] }
  function parseTags(tags) {
    const groups = {};
    (tags || []).forEach(tag => {
      if (!tag.startsWith('filter-')) return;
      const withoutPrefix = tag.replace('filter-', '');
      const colonPos = withoutPrefix.indexOf(':');
      if (colonPos === -1) return;
      const groupName = withoutPrefix.slice(0, colonPos).trim();
      const value     = withoutPrefix.slice(colonPos + 1).trim();
      if (!groups[groupName]) groups[groupName] = [];
      if (!groups[groupName].includes(value)) groups[groupName].push(value);
    });
    return groups;
  }

  // -- Count how many products match a given filter value --
  function countProducts(groupName, value) {
    const cards = document.querySelectorAll('.collection-product-card');
    let count = 0;
    cards.forEach(card => {
      const tags = (card.dataset.tags || '').split(',');
      if (tags.includes('filter-' + groupName + ':' + value)) count++;
    });
    return count;
  }

  // -- Render filter sidebar UI --
  function renderFilters(groups) {
    filterGroupsEl.innerHTML = '';

    const groupNames = Object.keys(groups);
    if (groupNames.length === 0) {
      filterGroupsEl.innerHTML = '<p class="no-filters-msg">No filters available for this collection. Add tags like <code>filter-Color:White</code> to products to create filters.</p>';
      return;
    }

    groupNames.forEach(groupName => {
      const values = groups[groupName];

      // Wrapper for each filter group (e.g. "Color")
      const groupEl = document.createElement('div');
      groupEl.className = 'filter-group';
      groupEl.dataset.group = groupName;

      // Group heading with toggle
      const headEl = document.createElement('button');
      headEl.className = 'filter-group__head';
      headEl.setAttribute('aria-expanded', 'true');
      headEl.innerHTML = `
        <span class="filter-group__name">${groupName}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="18 15 12 9 6 15"/></svg>
      `;

      // Group body — declared BEFORE the event listener so the closure captures it
      const bodyEl = document.createElement('div');
      bodyEl.className = 'filter-group__body';
      // Start open (aria-expanded="true") — body is visible by default

      headEl.addEventListener('click', () => {
        const isOpen = headEl.getAttribute('aria-expanded') === 'true';
        // Toggle: flip the value
        const newState = !isOpen;
        headEl.setAttribute('aria-expanded', String(newState));
        bodyEl.style.display = newState ? 'block' : 'none';
      });

      values.sort().forEach(value => {
        const count  = countProducts(groupName, value);
        const isActive = (activeFilters[groupName] || []).includes(value);
        const id = 'filter-' + groupName.toLowerCase().replace(/\s+/g,'-') + '-' + value.toLowerCase().replace(/\s+/g,'-');

        const itemEl = document.createElement('label');
        itemEl.className = 'filter-option' + (isActive ? ' is-active' : '');
        itemEl.setAttribute('for', id);

        // Colour swatch for colour filters
        const isColorGroup = ['color', 'colour'].includes(groupName.toLowerCase());
        const swatchHtml = isColorGroup
          ? `<span class="filter-color-dot" style="background-color:${value.toLowerCase().replace(/\s+/g,'')};" aria-hidden="true"></span>`
          : '';

        itemEl.innerHTML = `
          <input type="checkbox" id="${id}" class="filter-checkbox" data-group="${groupName}" data-value="${value}" ${isActive ? 'checked' : ''}>
          ${swatchHtml}
          <span class="filter-label">${value}</span>
          <span class="filter-count" aria-label="${count} products">(${count})</span>
        `;

        const checkbox = itemEl.querySelector('input');
        checkbox.addEventListener('change', () => {
          toggleFilter(groupName, value, checkbox.checked);
        });

        bodyEl.appendChild(itemEl);
      });

      groupEl.appendChild(headEl);
      groupEl.appendChild(bodyEl);
      filterGroupsEl.appendChild(groupEl);
    });
  }

  // -- Toggle a filter value on/off --
  function toggleFilter(groupName, value, active) {
    if (!activeFilters[groupName]) activeFilters[groupName] = [];

    if (active) {
      if (!activeFilters[groupName].includes(value)) {
        activeFilters[groupName].push(value);
      }
    } else {
      activeFilters[groupName] = activeFilters[groupName].filter(v => v !== value);
      if (activeFilters[groupName].length === 0) delete activeFilters[groupName];
    }

    applyFilters();
    renderChips();
    updateFilterBadge();
    syncCheckboxStates();
  }

  // -- Apply active filters to product grid --
  function applyFilters() {
    const cards        = document.querySelectorAll('.collection-product-card');
    const groups       = Object.keys(activeFilters);
    let visibleCount   = 0;

    cards.forEach(card => {
      const tagStr = card.dataset.tags || '';
      const tags   = tagStr.split(',').map(t => t.trim());

      // A card passes if it matches AT LEAST ONE value in EACH active group
      // (OR within a group, AND across groups)
      const passes = groups.every(groupName => {
        const allowedValues = activeFilters[groupName];
        return allowedValues.some(val => tags.includes('filter-' + groupName + ':' + val));
      });

      card.style.display = (groups.length === 0 || passes) ? '' : 'none';
      if (groups.length === 0 || passes) visibleCount++;
    });

    // Show/hide "no results" message
    if (noResultsEl) noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
    if (collectionGrid) collectionGrid.style.display = visibleCount === 0 ? 'none' : '';
  }

  // -- Render active filter chips in toolbar --
  function renderChips() {
    if (!activeChipsEl) return;
    activeChipsEl.innerHTML = '';

    Object.entries(activeFilters).forEach(([group, values]) => {
      values.forEach(value => {
        const chip = document.createElement('button');
        chip.className = 'filter-chip';
        chip.setAttribute('aria-label', `Remove filter: ${group} ${value}`);
        chip.innerHTML = `<span>${group}: ${value}</span><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
        chip.addEventListener('click', () => toggleFilter(group, value, false));
        activeChipsEl.appendChild(chip);
      });
    });
  }

  // -- Update the filter count badge on mobile toggle button --
  function updateFilterBadge() {
    if (!filterBadgeEl) return;
    const total = Object.values(activeFilters).reduce((a, b) => a + b.length, 0);
    filterBadgeEl.textContent = total > 0 ? total : '';
    filterBadgeEl.style.display = total > 0 ? 'inline-flex' : 'none';
  }

  // -- Keep checkboxes in sync when filters are cleared --
  function syncCheckboxStates() {
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
      const group = cb.dataset.group;
      const value = cb.dataset.value;
      const isActive = (activeFilters[group] || []).includes(value);
      cb.checked = isActive;
      cb.closest('.filter-option')?.classList.toggle('is-active', isActive);
    });
  }

  // -- Clear all filters --
  function clearAll() {
    Object.keys(activeFilters).forEach(k => delete activeFilters[k]);
    applyFilters();
    renderChips();
    updateFilterBadge();
    syncCheckboxStates();
  }

  clearAllBtn && clearAllBtn.addEventListener('click', clearAll);
  noResultsClear && noResultsClear.addEventListener('click', clearAll);

  // -- Sort dropdown — changes URL for server-side sorting --
  sortSelect && sortSelect.addEventListener('change', () => {
    const url = new URL(window.location.href);
    url.searchParams.set('sort_by', sortSelect.value);
    window.location.href = url.toString();
  });

  // -- Filter panel toggle — outside-click aware --
  const filterBar = document.getElementById('coll-filter-bar');

  function closeSidebar() {
    sidebar && sidebar.classList.remove('is-mobile-open');
    filterBar && filterBar.classList.remove('filter-open');
    mobileToggle && mobileToggle.setAttribute('aria-expanded', 'false');
  }

  mobileToggle && mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    if (sidebar && sidebar.classList.contains('is-mobile-open')) {
      closeSidebar();
      return;
    }
    // Close any other open filter dropdowns
    document.querySelectorAll('.filter-wrapper.filter-open').forEach(function(fw) {
      if (fw !== filterBar) fw.classList.remove('filter-open');
    });
    sidebar && sidebar.classList.add('is-mobile-open');
    filterBar && filterBar.classList.add('filter-open');
    mobileToggle && mobileToggle.setAttribute('aria-expanded', 'true');
    // Attach outside-click handler on next tick so this click doesn't immediately fire it
    setTimeout(function() {
      document.addEventListener('click', function outsideHandler(ev) {
        if (!ev.target.closest('.filter-wrapper')) {
          closeSidebar();
        }
      }, { once: true });
    }, 0);
  });

  // -- Sidebar X close button --
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  sidebarCloseBtn && sidebarCloseBtn.addEventListener('click', closeSidebar);

  // -- Initialise --
  const groups = parseTags(tagsData.tags || []);
  renderFilters(groups);

  // Apply any filters that are pre-set in the URL
  // e.g. if user arrives via a link with ?filter-Color=White
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.forEach((value, key) => {
    if (key.startsWith('filter-')) {
      const groupName = key.replace('filter-', '');
      if (!activeFilters[groupName]) activeFilters[groupName] = [];
      activeFilters[groupName].push(value);
    }
  });

  if (Object.keys(activeFilters).length > 0) {
    applyFilters();
    renderChips();
    updateFilterBadge();
    syncCheckboxStates();
  }

})();
