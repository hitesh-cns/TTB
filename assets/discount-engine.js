/* ==============================================
   BABY ELEGANCE — Discount Engine
   Applies quantity-based discounts via cart
   discount codes / line item properties
   ============================================== */

window.DiscountEngine = (function () {
  const TIERS = [
    { qty: 2, pct: 5,  code: 'BUNDLE5'  },
    { qty: 3, pct: 10, code: 'BUNDLE10' },
    { qty: 4, pct: 15, code: 'BUNDLE15' },
    { qty: 5, pct: 20, code: 'BUNDLE20' },
  ];

  function getTier(itemCount) {
    let match = null;
    for (const t of TIERS) {
      if (itemCount >= t.qty) match = t;
    }
    return match;
  }

  async function applyDiscount(itemCount) {
    const tier = getTier(itemCount);
    if (!tier) return;

    // Add discount via cart note attributes (visible at checkout)
    try {
      await fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attributes: {
            '_bundle_discount_pct': `${tier.pct}`,
            '_bundle_discount_items': `${itemCount}`,
            '_bundle_discount_code': tier.code
          },
          note: `Bundle discount: ${tier.pct}% off (${itemCount} items) — Use code ${tier.code} at checkout`
        })
      });
    } catch (e) {
      console.warn('Discount attribute update failed:', e);
    }

    return tier;
  }

  // Listen for cart updates
  document.addEventListener('cart:updated', async (e) => {
    if (e.detail && e.detail.item_count !== undefined) {
      await applyDiscount(e.detail.item_count);
    }
  });

  return { getTier, applyDiscount, TIERS };
})();
