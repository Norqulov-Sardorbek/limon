/* ============================================================
   LIMON — Order detail / Tracking + Success
   ============================================================ */

/* ----- Order success page ----- */
(function initOrderSuccess() {
  if (document.body.dataset.page !== "order-success") return;
  document.addEventListener("DOMContentLoaded", () => {
    const id = getQuery("id") || sessionStorage.getItem("limon_last_order");
    const order = id && API.getOrder(id);
    const root = document.getElementById("successRoot");
    if (!order) {
      root.innerHTML = `<div class="empty-state"><div class="emoji">🤔</div><h3>Buyurtma topilmadi</h3>
        <a href="shop.html" class="btn btn-primary mt-4">Mahsulotlarga</a></div>`;
      return;
    }
    root.innerHTML = `
      <div class="success-card">
        <div class="success-check">✓</div>
        <h1>Buyurtma qabul qilindi!</h1>
        <p>Rahmat! Buyurtmangiz tasdiqlanmoqda. SMS orqali holatdan xabardor qilamiz.</p>
        <div class="order-info">
          <div class="order-info-row"><span>Buyurtma raqami</span><b>${order.id}</b></div>
          <div class="order-info-row"><span>Sana</span><b>${API.formatDate(order.createdAt)}</b></div>
          <div class="order-info-row"><span>Mahsulot soni</span><b>${order.items.length} ta</b></div>
          <div class="order-info-row"><span>To'lov usuli</span><b>${paymentLabel(order.paymentMethod)}</b></div>
          <div class="order-info-row" style="font-size:18px; padding-top:10px; border-top:1px solid var(--border); margin-top:8px;"><span>Jami</span><b style="color:var(--primary);">${API.formatPrice(order.total)}</b></div>
        </div>
        <div class="success-actions">
          <a href="order.html?id=${order.id}" class="btn btn-primary">Buyurtmani kuzatish</a>
          <a href="shop.html" class="btn btn-ghost">Xaridni davom ettirish</a>
          <a href="dashboard.html" class="btn btn-ghost">Kabinet</a>
        </div>
      </div>
    `;
  });
})();

/* ----- Order tracking detail page ----- */
(function initOrderDetail() {
  if (document.body.dataset.page !== "order") return;
  document.addEventListener("DOMContentLoaded", () => {
    if (!requireLogin()) return;
    const id = getQuery("id");
    let order = API.getOrder(id);
    if (!order) {
      document.getElementById("orderRoot").innerHTML = `<div class="empty-state"><div class="emoji">❓</div><h3>Buyurtma topilmadi</h3></div>`;
      return;
    }
    render(order);
  });

  function render(order) {
    const root = document.getElementById("orderRoot");
    const user = API.currentUser();
    const isFarmer = user.role === "farmer";

    const flowCodes = ["new", "accepted", "preparing", "shipping", "delivered"];
    const currentIdx = flowCodes.indexOf(order.status);

    root.innerHTML = `
      <div class="breadcrumb">
        <a href="dashboard.html?tab=orders">Buyurtmalarim</a><span class="sep">›</span><span>${order.id}</span>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
        <div>
          <h1 style="font-size:30px; font-weight:800;">Buyurtma ${order.id}</h1>
          <p class="text-muted">Yaratilgan: ${API.formatDate(order.createdAt)}</p>
        </div>
        <span class="status-pill status-${order.status}" style="padding:8px 18px; font-size:14px;">
          ${(DB.orderStatuses.find(s => s.code === order.status) || {}).label}
        </span>
      </div>

      <div style="display:grid; grid-template-columns:1fr 380px; gap:32px;" class="order-grid">
        <div>
          <div class="dash-card">
            <div class="dash-card-head"><h3>Yetkazib berish holati</h3></div>
            <div class="dash-card-body">
              <div class="timeline">
                ${DB.orderStatuses.filter(s => s.code !== "cancelled").map((s, i) => {
                  const done = i < currentIdx;
                  const current = i === currentIdx;
                  const ev = order.timeline.find(t => t.code === s.code);
                  return `
                    <div class="timeline-step ${done ? 'done' : ''} ${current ? 'current' : ''}">
                      <h5>${s.label}</h5>
                      <p>${s.desc}</p>
                      ${ev ? `<div class="ts">${new Date(ev.ts).toLocaleString("uz-UZ")}</div>` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
              ${isFarmer && order.status !== "delivered" && order.status !== "cancelled" ? `
                <button class="btn btn-primary" id="advanceBtn" style="margin-top:16px;">
                  Keyingi bosqichga o'tkazish →
                </button>` : ""}
            </div>
          </div>

          <div class="dash-card">
            <div class="dash-card-head"><h3>Buyurtma tarkibi</h3></div>
            <div class="dash-card-body">
              ${order.items.map(it => `
                <div style="display:flex; gap:14px; align-items:center; padding:12px 0; border-bottom:1px solid var(--border);">
                  <img src="${it.img}" style="width:64px; height:64px; border-radius:10px; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&q=80'">
                  <div style="flex:1;">
                    <div style="font-weight:700;">${escapeHTML(it.name)}</div>
                    <div class="text-muted" style="font-size:13px;">${it.qty} ${it.unit} × ${API.formatPrice(it.price)}</div>
                  </div>
                  <div style="font-weight:700;">${API.formatPrice(it.qty * it.price)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <aside>
          <div class="dash-card">
            <div class="dash-card-head"><h3>Mijoz</h3></div>
            <div class="dash-card-body">
              <p><b>${escapeHTML(order.customer.name)}</b></p>
              <p>📞 ${escapeHTML(order.customer.phone)}</p>
              <p>📍 ${escapeHTML(order.customer.region)}, ${escapeHTML(order.customer.address)}</p>
              ${order.comment ? `<p style="margin-top:12px; padding:10px; background:var(--surface-2); border-radius:8px; font-size:13px;">💬 ${escapeHTML(order.comment)}</p>` : ""}
            </div>
          </div>

          <div class="dash-card">
            <div class="dash-card-head"><h3>To'lov</h3></div>
            <div class="dash-card-body">
              <div class="summary-row"><span>Mahsulotlar</span><b>${API.formatPrice(order.subtotal)}</b></div>
              <div class="summary-row"><span>Yetkazib berish</span><b>${order.delivery ? API.formatPrice(order.delivery) : '<span class="text-primary">Bepul</span>'}</b></div>
              ${order.discount ? `<div class="summary-row discount"><span>Chegirma${order.promo ? " ("+order.promo+")" : ""}</span><b>−${API.formatPrice(order.discount)}</b></div>` : ""}
              <div class="summary-row total" style="font-size:18px;"><span>Jami</span><b>${API.formatPrice(order.total)}</b></div>
              <p style="margin-top:12px; font-size:13px;" class="text-muted">Usul: <b>${paymentLabel(order.paymentMethod)}</b></p>
            </div>
          </div>
        </aside>
      </div>
    `;

    const adv = document.getElementById("advanceBtn");
    if (adv) adv.addEventListener("click", async () => {
      adv.disabled = true; adv.textContent = "...";
      const r = await API.advanceOrderStatus(order.id);
      if (r.ok) { order = r.order; toast("Holat yangilandi", "success"); render(order); }
      else { adv.disabled = false; toast("Holatni o'zgartirib bo'lmadi", "error"); }
    });
  }
})();

function paymentLabel(code) {
  return ({
    cash:  "Yetkazganda naqd",
    click: "Click",
    payme: "Payme",
    card:  "Bank kartasi",
    bank:  "Bank o'tkazmasi"
  })[code] || code;
}
