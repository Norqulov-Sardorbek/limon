/* ============================================================
   LIMON — Asosiy JS
   Header, Footer, Navigation, Toast, Mobile menu, Init
   ============================================================ */

/* ---------- TOAST ---------- */
function toast(message, type = "default", duration = 3000) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.innerHTML = `<span>${type === "success" ? "✓" : type === "error" ? "✕" : type === "warning" ? "⚠" : "ℹ"}</span><span>${message}</span>`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.animation = "slideIn .3s reverse";
    setTimeout(() => t.remove(), 300);
  }, duration);
}

/* ---------- HEADER (har sahifaga inject) ---------- */
function renderHeader(active = "") {
  const user = API.currentUser();
  const cartCount = API.cartCount();

  const html = `
  <header class="header">
    <div class="topbar">
      <div class="container topbar-inner">
        <div class="left">
          <span>📞 +998 91 894 06 16</span>
          <span>📍 Toshkent, O'zbekiston</span>
          <span>🕐 Mon-Sat 8:00 - 20:00</span>
        </div>
        <div class="right">
          ${user ? `<a href="dashboard.html">👤 ${user.name}</a>` : `<a href="login.html">Kirish</a>`}
          <a href="about.html">Yordam</a>
          <a href="contact.html">Aloqa</a>
        </div>
      </div>
    </div>
    <div class="container nav">
      <a href="index.html" class="brand">
        <div class="brand-mark">🍋</div>
        <div class="brand-name">Li<b>mon</b></div>
      </a>
      <nav class="nav-menu">
        <a href="index.html"   class="${active === 'home' ? 'active' : ''}">Bosh sahifa</a>
        <a href="shop.html"    class="${active === 'shop' ? 'active' : ''}">Mahsulotlar</a>
        <a href="about.html"   class="${active === 'about' ? 'active' : ''}">Biz haqimizda</a>
        <a href="how.html"     class="${active === 'how' ? 'active' : ''}">Qanday ishlaydi</a>
        <a href="contact.html" class="${active === 'contact' ? 'active' : ''}">Aloqa</a>
      </nav>
      <div class="nav-actions">
        <a href="shop.html" class="icon-btn" title="Qidirish">🔍</a>
        <a href="cart.html" class="icon-btn" title="Savatcha">
          🛒
          ${cartCount > 0 ? `<span class="badge-count">${cartCount}</span>` : ""}
        </a>
        ${user
          ? `<a href="dashboard.html" class="btn btn-primary btn-sm">Kabinet</a>`
          : `<a href="login.html" class="btn btn-primary btn-sm">Kirish</a>`}
        <button class="menu-toggle" id="menuToggle" aria-label="Menyu">☰</button>
      </div>
    </div>
  </header>
  <div class="mobile-overlay" id="mobileOverlay"></div>
  <aside class="mobile-menu" id="mobileMenu">
    <nav>
      <a href="index.html"   class="${active === 'home' ? 'active' : ''}">🏠 Bosh sahifa</a>
      <a href="shop.html"    class="${active === 'shop' ? 'active' : ''}">🛍️ Mahsulotlar</a>
      <a href="cart.html"    class="${active === 'cart' ? 'active' : ''}">🛒 Savatcha ${cartCount ? `(${cartCount})` : ""}</a>
      <a href="dashboard.html" class="${active === 'dashboard' ? 'active' : ''}">👤 ${user ? "Kabinet" : "Kirish"}</a>
      <a href="about.html"   class="${active === 'about' ? 'active' : ''}">ℹ️ Biz haqimizda</a>
      <a href="how.html"     class="${active === 'how' ? 'active' : ''}">⚙️ Qanday ishlaydi</a>
      <a href="contact.html" class="${active === 'contact' ? 'active' : ''}">📞 Aloqa</a>
    </nav>
  </aside>`;

  const slot = document.getElementById("headerSlot");
  if (slot) slot.innerHTML = html;

  /* Mobile menu */
  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("mobileOverlay");
  if (toggle && menu && overlay) {
    toggle.addEventListener("click", () => {
      menu.classList.add("open");
      overlay.classList.add("open");
    });
    overlay.addEventListener("click", () => {
      menu.classList.remove("open");
      overlay.classList.remove("open");
    });
  }
}

/* ---------- FOOTER ---------- */
function renderFooter() {
  const year = new Date().getFullYear();
  const slot = document.getElementById("footerSlot");
  if (!slot) return;

  slot.innerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="brand">
            <div class="brand-mark">🍋</div>
            <div class="brand-name" style="color:#fff;">Li<b style="color:var(--accent);">mon</b></div>
          </a>
          <p>Dehqondan to'g'ridan-to'g'ri do'koningizga. 1-qo'l mahsulotlar, qisqa zanjir, halol narx.</p>
          <div class="footer-socials">
            <a href="#" title="Telegram">✈</a>
            <a href="#" title="Instagram">📷</a>
            <a href="#" title="Facebook">f</a>
            <a href="#" title="YouTube">▶</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Mahsulotlar</h4>
          <ul>
            ${DB.categories.slice(0, 6).map(c => `<li><a href="shop.html?cat=${c.id}">${c.name}</a></li>`).join("")}
          </ul>
        </div>
        <div class="footer-col">
          <h4>Kompaniya</h4>
          <ul>
            <li><a href="about.html">Biz haqimizda</a></li>
            <li><a href="how.html">Qanday ishlaydi</a></li>
            <li><a href="contact.html">Aloqa</a></li>
            <li><a href="login.html">Dehqon bo'lish</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Yordam</h4>
          <ul>
            <li><a href="about.html#faq">Ko'p so'raladigan</a></li>
            <li><a href="contact.html">Yordam markazi</a></li>
            <li><a href="#">Yetkazib berish</a></li>
            <li><a href="#">Qaytarish</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Yangiliklarga obuna</h4>
          <p style="font-size:13px; margin-bottom:14px;">Yangi mavsumiy mahsulotlar va aksiyalar haqida birinchi bilib oling.</p>
          <form onsubmit="event.preventDefault(); toast('Obuna bo\\'ldingiz!', 'success');" style="display:flex; gap:8px;">
            <input type="email" required placeholder="Email" style="flex:1; padding:10px 14px; border-radius:10px; border:0; font-size:13px;">
            <button class="btn btn-accent btn-sm" type="submit">→</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <div>© ${year} Limon B2B. Barcha huquqlar himoyalangan.</div>
        <div class="pay-icons">
          <span>CLICK</span><span>PAYME</span><span>UZCARD</span><span>HUMO</span><span>VISA</span>
        </div>
      </div>
    </div>
  </footer>`;
}

/* ---------- AUTO INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";
  renderHeader(page);
  renderFooter();

  /* Background page transitions */
  document.querySelectorAll("a[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (href && href.endsWith(".html") && !a.dataset.bound) {
      a.dataset.bound = "1";
    }
  });
});

/* ---------- AUTH GUARD ---------- */
function requireLogin(redirectTo = "login.html") {
  if (!API.currentUser()) {
    location.href = redirectTo + "?next=" + encodeURIComponent(location.pathname);
    return false;
  }
  return true;
}

function requireRole(role) {
  const u = API.currentUser();
  if (!u || u.role !== role) {
    toast("Bu sahifa uchun ruxsat yo'q", "error");
    setTimeout(() => location.href = "dashboard.html", 1500);
    return false;
  }
  return true;
}

/* ---------- HELPERS UMUMIY ---------- */
function escapeHTML(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

/** URL query parametrlarni o'qish */
function getQuery(name) {
  return new URLSearchParams(location.search).get(name);
}

/** Mahsulot kartochkasini render qilish */
function productCardHTML(p, opts = {}) {
  const farmer = API.getFarmer(p.farmerId);
  const isWished = API.isWishlisted(p.id);
  const discount = p.oldPrice && p.oldPrice > p.price
    ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const badgeClass = p.organic ? "organic" : (discount ? "discount" : "");
  const badgeText  = p.organic ? "ORGANIK" : (p.badge || (discount ? `-${discount}%` : ""));

  return `
  <article class="product-card" data-id="${p.id}">
    <div class="product-image">
      ${badgeText ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : ""}
      <button class="wish-btn ${isWished ? 'active' : ''}" data-wish="${p.id}" aria-label="Saqlash">
        ${isWished ? "♥" : "♡"}
      </button>
      <a href="product.html?id=${p.id}">
        <img src="${p.img}" alt="${escapeHTML(p.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80'">
      </a>
    </div>
    <div class="product-info">
      <div class="product-farmer">
        <span>${escapeHTML(farmer ? farmer.farm : "Limon partner")}</span>
        ${farmer && farmer.verified ? '<span class="verified" title="Tasdiqlangan">✓</span>' : ""}
      </div>
      <a href="product.html?id=${p.id}" class="product-name">${escapeHTML(p.name)}</a>
      <div class="product-meta">
        <span>📍 ${escapeHTML(farmer ? farmer.region : "—")}</span>
        ${p.organic ? '<span class="organic-tag">🌿 Bio</span>' : ""}
      </div>
      <div class="product-price-row">
        <span class="product-price">${API.formatPrice(p.price)}</span>
        <span class="product-unit">/ ${p.unit}</span>
        ${p.oldPrice && p.oldPrice > p.price ? `<span class="product-old-price">${API.formatPrice(p.oldPrice)}</span>` : ""}
      </div>
    </div>
    <div class="product-actions">
      <button class="btn btn-primary btn-sm" data-add="${p.id}">
        Savatga (${p.minOrder} ${p.unit})
      </button>
    </div>
  </article>`;
}

/** Mahsulot gridini biror konteynerga chizish */
function renderProductGrid(container, products, emptyMsg = "Mahsulot topilmadi") {
  if (!container) return;
  if (!products.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
      <div class="emoji">🥕</div>
      <h3>${emptyMsg}</h3>
      <p>Filtrlaringizni o'zgartirib qaytadan urinib ko'ring.</p>
    </div>`;
    return;
  }
  container.innerHTML = products.map(productCardHTML).join("");
  bindProductCardEvents(container);
}

function bindProductCardEvents(scope = document) {
  scope.querySelectorAll("[data-add]").forEach(btn => {
    if (btn.dataset.bound) return; btn.dataset.bound = "1";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.add;
      const prod = API.getProduct(id);
      const r = API.addToCart(id, prod.minOrder);
      if (r.ok) {
        toast(`Savatga qo'shildi: ${prod.name} (${prod.minOrder} ${prod.unit})`, "success");
        // header badge yangilash
        document.querySelectorAll(".badge-count").forEach(b => b.remove());
        renderHeader(document.body.dataset.page || "");
      } else toast(r.error, "error");
    });
  });
  scope.querySelectorAll("[data-wish]").forEach(btn => {
    if (btn.dataset.bound) return; btn.dataset.bound = "1";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.dataset.wish;
      const isOn = API.toggleWishlist(id);
      btn.classList.toggle("active", isOn);
      btn.innerHTML = isOn ? "♥" : "♡";
      toast(isOn ? "Saqlanganlarga qo'shildi" : "O'chirildi", isOn ? "success" : "default");
    });
  });
}
