/* ============================================================
   LIMON — Checkout sahifa
   ============================================================ */
(function initCheckout() {
  if (document.body.dataset.page !== "checkout") return;

  let promoCode = sessionStorage.getItem("limon_promo") || null;

  document.addEventListener("DOMContentLoaded", () => {
    if (!requireLogin()) return;

    const t = API.cartTotals(promoCode);
    if (!t.items.length) {
      location.href = "cart.html"; return;
    }

    const user = API.currentUser();
    renderForm(user, t);
    bindEvents();
  });

  function renderForm(user, t) {
    const root = document.getElementById("checkoutRoot");
    root.innerHTML = `
      <div class="breadcrumb">
        <a href="cart.html">Savatcha</a><span class="sep">›</span><span>Rasmiylashtirish</span>
      </div>
      <h1 style="font-size:32px; font-weight:800; margin-bottom:28px;">Buyurtmani rasmiylashtirish</h1>

      <div class="checkout-grid">
        <form class="checkout-form" id="checkoutForm">
          <h3>👤 Kontakt ma'lumotlari</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">To'liq ism *</label>
              <input class="form-input" name="name" required value="${escapeHTML(user.name)}">
            </div>
            <div class="form-group">
              <label class="form-label">Telefon *</label>
              <input class="form-input" name="phone" required value="${escapeHTML(user.phone || '')}">
            </div>
          </div>

          <h3>📍 Yetkazib berish manzili</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Viloyat *</label>
              <select class="form-select" name="region" required>
                ${DB.regions.map(r => `<option value="${r}" ${user.region === r ? "selected" : ""}>${r}</option>`).join("")}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Mahalla / shahar *</label>
              <input class="form-input" name="city" required placeholder="Yunusobod, 5-mavze">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">To'liq manzil *</label>
            <input class="form-input" name="address" required value="${escapeHTML(user.address || '')}" placeholder="Ko'cha, uy, kvartira">
          </div>

          <h3>💳 To'lov usuli</h3>
          <div class="payment-options">
            <label class="payment-option">
              <input type="radio" name="payment" value="cash" checked>
              <div class="ico">💵</div>
              <div><h5>Yetkazganda naqd</h5><p>Mahsulotni qabul qilganda to'laysiz</p></div>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="click">
              <div class="ico">⚡</div>
              <div><h5>Click</h5><p>Mobil ilova orqali</p></div>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="payme">
              <div class="ico">💜</div>
              <div><h5>Payme</h5><p>QR-kod yoki ilova orqali</p></div>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="card">
              <div class="ico">💳</div>
              <div><h5>Uzcard / Humo / Visa</h5><p>Onlayn bank kartasi</p></div>
            </label>
            <label class="payment-option">
              <input type="radio" name="payment" value="bank">
              <div class="ico">🏦</div>
              <div><h5>Bank o'tkazmasi</h5><p>Yuridik shaxslar uchun (NDS bilan invoice)</p></div>
            </label>
          </div>

          <h3>📝 Qo'shimcha</h3>
          <div class="form-group">
            <label class="form-label">Izoh (ixtiyoriy)</label>
            <textarea class="form-textarea" name="comment" placeholder="Yetkazib berish vaqti, qo'shimcha ko'rsatmalar..."></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" id="placeOrderBtn">
            ✓ Buyurtmani tasdiqlash — ${API.formatPrice(t.total)}
          </button>
        </form>

        <aside class="checkout-summary">
          <h3 style="font-size:17px; font-weight:700; margin-bottom:16px;">Buyurtma tarkibi</h3>
          <div class="summary-items">
            ${t.items.map(it => `
              <div class="summary-item">
                <img src="${it.img}" alt="${escapeHTML(it.name)}" onerror="this.src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&q=80'">
                <div>
                  <div class="name">${escapeHTML(it.name)}</div>
                  <div class="qty">${it.qty} ${it.unit} × ${API.formatPrice(it.price)}</div>
                </div>
                <div class="price">${API.formatPrice(it.line)}</div>
              </div>
            `).join("")}
          </div>
          <div class="summary-row"><span>Mahsulotlar</span><b>${API.formatPrice(t.subtotal)}</b></div>
          <div class="summary-row"><span>Yetkazib berish</span><b>${t.delivery === 0 ? '<span class="text-primary">Bepul</span>' : API.formatPrice(t.delivery)}</b></div>
          ${t.discount > 0 ? `<div class="summary-row discount"><span>Chegirma</span><b>−${API.formatPrice(t.discount)}</b></div>` : ""}
          <div class="summary-row total"><span>Jami</span><b>${API.formatPrice(t.total)}</b></div>
        </aside>
      </div>
    `;
  }

  function bindEvents() {
    const form = document.getElementById("checkoutForm");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = document.getElementById("placeOrderBtn");
      btn.disabled = true; btn.textContent = "Yuborilmoqda...";

      const fd = new FormData(form);
      const r = await API.placeOrder({
        name: fd.get("name"),
        phone: fd.get("phone"),
        region: fd.get("region"),
        address: fd.get("city") + ", " + fd.get("address"),
        paymentMethod: fd.get("payment"),
        comment: fd.get("comment"),
        promoCode
      });

      if (r.ok) {
        sessionStorage.removeItem("limon_promo");
        sessionStorage.setItem("limon_last_order", r.order.id);
        location.href = "order-success.html?id=" + r.order.id;
      } else {
        toast(r.error, "error");
        btn.disabled = false;
      }
    });
  }
})();
