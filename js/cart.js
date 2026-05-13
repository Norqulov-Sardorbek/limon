/* ============================================================
   LIMON — Cart sahifa
   ============================================================ */
(function initCart() {
  if (document.body.dataset.page !== "cart") return;

  let promoCode = null;

  document.addEventListener("DOMContentLoaded", () => {
    render();
  });

  function render() {
    const t = API.cartTotals(promoCode);
    const root = document.getElementById("cartRoot");

    if (!t.items.length) {
      root.innerHTML = `<div class="empty-state">
        <div class="emoji">🛒</div>
        <h3>Savatcha bo'sh</h3>
        <p>Mahsulotlar bo'limidan kerakli mahsulotlarni qo'shing.</p>
        <a href="shop.html" class="btn btn-primary mt-4">Xaridni boshlash</a>
      </div>`;
      return;
    }

    root.innerHTML = `
      <div class="cart-layout">
        <div class="cart-items">
          ${t.items.map(it => cartItemHTML(it)).join("")}
        </div>
        <aside class="cart-summary">
          <h3>Buyurtma xulosasi</h3>

          <div class="summary-row">
            <span>Mahsulotlar (${t.items.length})</span>
            <b>${API.formatPrice(t.subtotal)}</b>
          </div>
          <div class="summary-row">
            <span>Yetkazib berish</span>
            <b>${t.delivery === 0 ? '<span class="text-primary">Bepul</span>' : API.formatPrice(t.delivery)}</b>
          </div>
          ${t.discount > 0 ? `
            <div class="summary-row discount">
              <span>Chegirma (${t.appliedPromo.code})</span>
              <b>−${API.formatPrice(t.discount)}</b>
            </div>` : ""}

          <div class="promo-row">
            <input id="promoInput" placeholder="Promo-kod (YANGI10)" value="${promoCode || ""}">
            <button class="btn btn-ghost btn-sm" id="applyPromo">Qo'llash</button>
          </div>
          ${t.appliedPromo ? `
            <div class="promo-applied">
              <span>✓ ${t.appliedPromo.label}</span>
              <button id="removePromo" style="color:var(--danger); font-weight:700;">✕</button>
            </div>` : ""}

          <div class="summary-row total">
            <span>Jami</span>
            <b>${API.formatPrice(t.total)}</b>
          </div>

          ${t.subtotal < 1000000 ? `
            <div class="form-hint mt-4" style="background:var(--surface-2); padding:10px; border-radius:8px;">
              💡 Yana ${API.formatPrice(1000000 - t.subtotal)} qo'shsangiz — bepul yetkazib berish!
            </div>` : ""}

          <a href="checkout.html" class="btn btn-primary btn-block btn-lg mt-4">
            Rasmiylashtirish →
          </a>
          <a href="shop.html" class="btn btn-ghost btn-block mt-4" style="margin-top:8px;">
            Xaridni davom ettirish
          </a>

          <div class="text-muted mt-4" style="font-size:12px; text-align:center;">
            🔒 To'lov xavfsiz tarzda amalga oshiriladi
          </div>
        </aside>
      </div>
    `;

    bindEvents();
  }

  function cartItemHTML(it) {
    const farmer = API.getFarmer(it.farmerId);
    return `
      <div class="cart-item" data-id="${it.id}">
        <a href="product.html?id=${it.id}"><img src="${it.img}" alt="${escapeHTML(it.name)}" onerror="this.src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&q=80'"></a>
        <div>
          <a href="product.html?id=${it.id}" class="name">${escapeHTML(it.name)}</a>
          <div class="farmer">${farmer ? "👨‍🌾 " + escapeHTML(farmer.farm) + " · 📍 " + farmer.region : ""}</div>
          <div class="price-row">
            <b>${API.formatPrice(it.price)}</b>
            <span class="text-muted">/ ${it.unit}</span>
            ${it.organic ? '<span class="organic-tag">🌿 Bio</span>' : ""}
          </div>
        </div>
        <div class="actions">
          <div class="qty-control" style="height:40px;">
            <button data-dec="${it.id}" style="height:40px; width:36px;">−</button>
            <input value="${it.qty}" data-qty="${it.id}" type="number" min="${it.minOrder}" max="${it.stock}" style="height:40px; width:60px;">
            <button data-inc="${it.id}" style="height:40px; width:36px;">+</button>
          </div>
          <div style="font-weight:700;">${API.formatPrice(it.line)}</div>
          <button class="remove" data-remove="${it.id}">✕ O'chirish</button>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    document.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.inc;
      const it = API.cartTotals().items.find(x => String(x.id) === String(id));
      API.updateCartQty(id, it.qty + it.minOrder);
      render(); renderHeader(document.body.dataset.page);
    }));
    document.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => {
      const id = b.dataset.dec;
      const it = API.cartTotals().items.find(x => String(x.id) === String(id));
      API.updateCartQty(id, it.qty - it.minOrder);
      render(); renderHeader(document.body.dataset.page);
    }));
    document.querySelectorAll("[data-qty]").forEach(inp => inp.addEventListener("change", () => {
      API.updateCartQty(inp.dataset.qty, inp.value);
      render(); renderHeader(document.body.dataset.page);
    }));
    document.querySelectorAll("[data-remove]").forEach(b => b.addEventListener("click", () => {
      API.removeFromCart(b.dataset.remove);
      toast("Mahsulot savatchadan o'chirildi", "default");
      render(); renderHeader(document.body.dataset.page);
    }));

    const applyBtn = document.getElementById("applyPromo");
    if (applyBtn) applyBtn.addEventListener("click", () => {
      const code = document.getElementById("promoInput").value.trim().toUpperCase();
      const r = API.validatePromo(code, API.cartTotals().subtotal);
      if (r.ok) { promoCode = code; toast("Promo-kod qo'llandi: " + r.promo.label, "success"); render(); }
      else toast(r.error, "error");
    });
    const rmBtn = document.getElementById("removePromo");
    if (rmBtn) rmBtn.addEventListener("click", () => { promoCode = null; render(); });
  }
})();
