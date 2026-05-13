/* ============================================================
   LIMON — Dashboard (do'kon va dehqon uchun)
   ============================================================ */
(function initDashboard() {
  if (document.body.dataset.page !== "dashboard") return;

  let activeTab = getQuery("tab") || "overview";

  document.addEventListener("DOMContentLoaded", () => {
    if (!requireLogin()) return;
    const user = API.currentUser();
    renderLayout(user);
    renderTab(activeTab, user);
  });

  function renderLayout(user) {
    const root = document.getElementById("dashRoot");
    const isShop = user.role === "shop";

    const menuItems = isShop ? [
      ["overview","📊","Umumiy"],
      ["orders","📦","Buyurtmalarim"],
      ["wishlist","♥","Saqlanganlar"],
      ["profile","⚙️","Profil"],
    ] : [
      ["overview","📊","Umumiy"],
      ["orders","📦","Kelgan buyurtmalar"],
      ["my-products","🌾","Mahsulotlarim"],
      ["add-product","➕","Yangi mahsulot"],
      ["profile","⚙️","Profil"],
    ];

    root.innerHTML = `
      <div class="dash-layout">
        <aside class="dash-side">
          <div class="dash-user">
            <div class="avatar">${user.name.charAt(0).toUpperCase()}</div>
            <h4>${escapeHTML(user.name)}</h4>
            <p>${escapeHTML(user.email)}</p>
            <span class="role-pill">${isShop ? "🏪 Do'kon" : "👨‍🌾 Dehqon"}</span>
          </div>
          <nav class="dash-nav">
            ${menuItems.map(([k, ico, label]) => `
              <a href="#" data-tab="${k}" class="${activeTab === k ? 'active' : ''}">
                <span class="ico">${ico}</span> ${label}
              </a>
            `).join("")}
            <a href="#" id="logoutBtn" style="margin-top:16px; color:var(--danger);">
              <span class="ico">↪</span> Chiqish
            </a>
          </nav>
        </aside>
        <div class="dash-main" id="dashMain"></div>
      </div>
    `;

    /* Tab nav */
    root.querySelectorAll(".dash-nav a[data-tab]").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        activeTab = a.dataset.tab;
        root.querySelectorAll(".dash-nav a").forEach(x => x.classList.remove("active"));
        a.classList.add("active");
        renderTab(activeTab, user);
        history.replaceState(null, "", "?tab=" + activeTab);
      });
    });

    /* Logout */
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
      e.preventDefault();
      API.logout();
      toast("Tizimdan chiqdingiz", "default");
      setTimeout(() => location.href = "index.html", 600);
    });
  }

  function renderTab(tab, user) {
    const main = document.getElementById("dashMain");
    const isShop = user.role === "shop";

    if (tab === "overview")       renderOverview(main, user);
    else if (tab === "orders")    renderOrders(main, user);
    else if (tab === "wishlist")  renderWishlist(main);
    else if (tab === "profile")   renderProfile(main, user);
    else if (tab === "my-products") renderMyProducts(main, user);
    else if (tab === "add-product") renderAddProduct(main, user);
    else main.innerHTML = "<p>Sahifa topilmadi</p>";
  }

  /* ---------- OVERVIEW ---------- */
  function renderOverview(main, user) {
    const orders = API.getOrders();
    const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
    const active = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled").length;
    const isShop = user.role === "shop";

    main.innerHTML = `
      <h2 style="font-size:24px; font-weight:800; margin-bottom:8px;">Salom, ${escapeHTML(user.name.split(" ")[0])}! 👋</h2>
      <p class="text-muted mb-8">Bu yerda buyurtmalaringiz va akkauntingiz holatini ko'rasiz.</p>

      <div class="dash-stats-grid">
        <div class="stat-card">
          <div class="ico">📦</div>
          <h3>${orders.length}</h3>
          <p>${isShop ? "Jami buyurtmalar" : "Kelgan buyurtmalar"}</p>
        </div>
        <div class="stat-card">
          <div class="ico yellow">⏳</div>
          <h3>${active}</h3>
          <p>Faol</p>
        </div>
        <div class="stat-card">
          <div class="ico blue">💰</div>
          <h3>${API.formatPrice(totalSpent)}</h3>
          <p>${isShop ? "Jami xarid" : "Jami daromad"}</p>
        </div>
        <div class="stat-card">
          <div class="ico red">♥</div>
          <h3>${API.getWishlist().length}</h3>
          <p>Saqlanganlar</p>
        </div>
      </div>

      <div class="dash-card">
        <div class="dash-card-head">
          <h3>Oxirgi buyurtmalar</h3>
          <a href="#" data-go="orders" class="btn btn-ghost btn-sm">Hammasini ko'rish →</a>
        </div>
        <div class="dash-card-body">
          ${orders.length ? renderOrdersTable(orders.slice(0, 5), isShop) : emptyMessage("📭", "Hozircha buyurtmalar yo'q", "Mahsulotlar bo'limidan kerakli mahsulotlarni qo'shing.")}
        </div>
      </div>

      ${isShop ? `
      <div class="dash-card">
        <div class="dash-card-head"><h3>Sizga tavsiya etiladi</h3></div>
        <div class="dash-card-body">
          <div class="product-grid" id="recommendedGrid"></div>
        </div>
      </div>` : ""}
    `;

    if (isShop) {
      const rec = API.searchProducts({ sort: "popular" }).slice(0, 4);
      renderProductGrid(document.getElementById("recommendedGrid"), rec);
    }

    main.querySelectorAll("[data-go]").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        activeTab = a.dataset.go;
        document.querySelectorAll(".dash-nav a").forEach(x => x.classList.remove("active"));
        document.querySelector(`.dash-nav a[data-tab=${activeTab}]`).classList.add("active");
        renderTab(activeTab, user);
      });
    });
  }

  function renderOrdersTable(orders, isShop) {
    return `
      <table class="orders-table">
        <thead><tr>
          <th>ID</th><th>Sana</th><th>Mahsulot</th><th>Jami</th><th>Holat</th><th></th>
        </tr></thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td><b>${o.id}</b></td>
              <td>${API.formatDate(o.createdAt)}</td>
              <td>${o.items.length} ta mahsulot</td>
              <td><b>${API.formatPrice(o.total)}</b></td>
              <td><span class="status-pill status-${o.status}">${(DB.orderStatuses.find(s => s.code === o.status) || {}).label || o.status}</span></td>
              <td><a href="order.html?id=${o.id}" class="btn btn-ghost btn-sm">Tafsilot</a></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  /* ---------- ORDERS ---------- */
  function renderOrders(main, user) {
    const orders = API.getOrders();
    main.innerHTML = `
      <h2 style="font-size:24px; font-weight:800; margin-bottom:20px;">
        ${user.role === "farmer" ? "Kelgan buyurtmalar" : "Buyurtmalarim"}
      </h2>
      <div class="dash-card">
        <div class="dash-card-body" style="padding:0;">
          ${orders.length ? renderOrdersTable(orders, user.role === "shop") : emptyMessage("📭", "Buyurtmalar yo'q", "")}
        </div>
      </div>
    `;
  }

  /* ---------- WISHLIST ---------- */
  function renderWishlist(main) {
    const ids = API.getWishlist();
    const items = ids.map(id => API.getProduct(id)).filter(Boolean);
    main.innerHTML = `
      <h2 style="font-size:24px; font-weight:800; margin-bottom:20px;">Saqlanganlar</h2>
      <div class="product-grid" id="wishGrid"></div>
    `;
    renderProductGrid(document.getElementById("wishGrid"), items, "Saqlangan mahsulotlar yo'q");
  }

  /* ---------- PROFILE ---------- */
  function renderProfile(main, user) {
    const isShop = user.role === "shop";
    main.innerHTML = `
      <h2 style="font-size:24px; font-weight:800; margin-bottom:20px;">Profil sozlamalari</h2>
      <form class="checkout-form" id="profileForm" style="max-width:680px;">
        <h3>Shaxsiy ma'lumotlar</h3>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">To'liq ism</label>
            <input class="form-input" name="name" value="${escapeHTML(user.name)}">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-input" name="email" value="${escapeHTML(user.email)}" readonly>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Telefon</label>
            <input class="form-input" name="phone" value="${escapeHTML(user.phone || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Viloyat</label>
            <select class="form-select" name="region">
              ${DB.regions.map(r => `<option ${user.region === r ? "selected" : ""}>${r}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Manzil</label>
          <input class="form-input" name="address" value="${escapeHTML(user.address || '')}">
        </div>
        ${isShop ? `
          <div class="form-group">
            <label class="form-label">Do'kon nomi</label>
            <input class="form-input" name="shopName" value="${escapeHTML(user.shopName || '')}">
          </div>` : `
          <div class="form-group">
            <label class="form-label">Xo'jalik nomi</label>
            <input class="form-input" name="farmName" value="${escapeHTML(user.farmName || '')}">
          </div>`}
        <button class="btn btn-primary" type="submit">Saqlash</button>
      </form>
    `;
    document.getElementById("profileForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const r = await API.updateProfile(Object.fromEntries(fd));
      if (r.ok) toast("Profil yangilandi", "success");
      else toast(r.error, "error");
    });
  }

  /* ---------- MY PRODUCTS (Dehqon uchun) ---------- */
  function renderMyProducts(main, user) {
    const all = API.getAllProducts().filter(p => p.farmerId === user.id);
    main.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h2 style="font-size:24px; font-weight:800;">Mahsulotlarim (${all.length})</h2>
        <a href="#" data-go="add-product" class="btn btn-primary">➕ Yangi qo'shish</a>
      </div>
      ${all.length ? `<div class="product-grid">${all.map(productCardHTML).join("")}</div>`
                   : emptyMessage("🌾", "Mahsulotlar yo'q", "'Yangi mahsulot' bo'limidan birinchi mahsulotingizni qo'shing.")}
    `;
    main.querySelectorAll("[data-go]").forEach(a => a.addEventListener("click", e => {
      e.preventDefault();
      activeTab = "add-product";
      document.querySelectorAll(".dash-nav a").forEach(x => x.classList.remove("active"));
      document.querySelector(`.dash-nav a[data-tab=add-product]`).classList.add("active");
      renderTab(activeTab, user);
    }));
    bindProductCardEvents(main);
  }

  /* ---------- ADD PRODUCT (Dehqon uchun) ---------- */
  function renderAddProduct(main, user) {
    main.innerHTML = `
      <h2 style="font-size:24px; font-weight:800; margin-bottom:20px;">➕ Yangi mahsulot qo'shish</h2>
      <form class="checkout-form" id="addForm" style="max-width:760px;">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Nomi *</label>
            <input class="form-input" name="name" required placeholder="Pomidor (Bahor)">
          </div>
          <div class="form-group">
            <label class="form-label">Kategoriya *</label>
            <select class="form-select" name="cat" required>
              ${DB.categories.map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Narx (so'm) *</label>
            <input class="form-input" type="number" name="price" required min="100">
          </div>
          <div class="form-group">
            <label class="form-label">O'lchov *</label>
            <select class="form-select" name="unit"><option>kg</option><option>litr</option><option>dona</option></select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Eski narx (chegirma uchun)</label>
            <input class="form-input" type="number" name="oldPrice" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Min buyurtma *</label>
            <input class="form-input" type="number" name="minOrder" required value="10" min="1">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Mavjud miqdor *</label>
            <input class="form-input" type="number" name="stock" required value="100" min="1">
          </div>
          <div class="form-group">
            <label class="form-label">Yig'ilgan sana</label>
            <input class="form-input" type="date" name="harvest" value="${new Date().toISOString().slice(0,10)}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Rasm URL</label>
          <input class="form-input" name="img" placeholder="https://...">
          <div class="form-hint">Bo'sh qoldirsangiz, default rasm qo'yiladi.</div>
        </div>
        <div class="form-group">
          <label class="form-label">Tavsif</label>
          <textarea class="form-textarea" name="desc" placeholder="Mahsulot haqida qisqacha..."></textarea>
        </div>
        <div class="form-group">
          <label style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" name="organic" style="width:18px; height:18px; accent-color:var(--primary);">
            <span>🌿 Organik (pestitsidlarsiz)</span>
          </label>
        </div>
        <button class="btn btn-primary btn-lg" type="submit">Mahsulotni qo'shish</button>
      </form>
    `;
    document.getElementById("addForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd);
      data.organic = !!data.organic;
      const r = await API.addProduct(data);
      if (r.ok) {
        toast("Mahsulot qo'shildi!", "success");
        setTimeout(() => {
          activeTab = "my-products";
          document.querySelectorAll(".dash-nav a").forEach(x => x.classList.remove("active"));
          document.querySelector(`.dash-nav a[data-tab=my-products]`).classList.add("active");
          renderTab(activeTab, user);
        }, 800);
      } else toast(r.error, "error");
    });
  }

  function emptyMessage(emoji, title, sub) {
    return `<div class="empty-state">
      <div class="emoji">${emoji}</div>
      <h3>${title}</h3>
      ${sub ? `<p>${sub}</p>` : ""}
    </div>`;
  }
})();
