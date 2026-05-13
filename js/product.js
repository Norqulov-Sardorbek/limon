/* ============================================================
   LIMON — Product detail sahifa
   ============================================================ */
(function initProduct() {
  if (document.body.dataset.page !== "product") return;

  document.addEventListener("DOMContentLoaded", () => {
    const id = getQuery("id");
    const product = API.getProduct(id);
    const root = document.getElementById("productRoot");

    if (!product) {
      root.innerHTML = `<div class="empty-state">
        <div class="emoji">🥒</div>
        <h3>Mahsulot topilmadi</h3>
        <p>Bu mahsulot olib tashlangan yoki manzil noto'g'ri.</p>
        <a href="shop.html" class="btn btn-primary mt-4">Mahsulotlarga qaytish</a>
      </div>`;
      return;
    }

    const farmer = API.getFarmer(product.farmerId);
    const category = API.getCategory(product.cat);
    const discount = product.oldPrice && product.oldPrice > product.price
      ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

    root.innerHTML = `
      <div class="breadcrumb">
        <a href="index.html">Bosh</a><span class="sep">›</span>
        <a href="shop.html">Mahsulotlar</a><span class="sep">›</span>
        ${category ? `<a href="shop.html?cat=${category.id}">${category.name}</a><span class="sep">›</span>` : ""}
        <span>${escapeHTML(product.name)}</span>
      </div>

      <div class="pd-layout">
        <div class="pd-gallery">
          <div class="pd-main-img">
            <img src="${product.img}" alt="${escapeHTML(product.name)}" onerror="this.src='https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&q=80'">
          </div>
        </div>

        <div class="pd-info">
          <div class="pd-meta-row">
            ${category ? `<span class="pd-meta-pill">${category.icon} ${category.name}</span>` : ""}
            ${product.organic ? `<span class="pd-meta-pill organic">🌿 Organik</span>` : ""}
            <span class="pd-meta-pill">📅 Yig'ilgan: ${API.formatDate(product.harvest)}</span>
            <span class="pd-meta-pill">📦 Mavjud: ${product.stock} ${product.unit}</span>
          </div>

          <h1>${escapeHTML(product.name)}</h1>
          <p class="text-muted mb-4">${escapeHTML(product.desc || "")}</p>

          <div class="pd-price-block">
            <span class="pd-price">${API.formatPrice(product.price)} <small>/ ${product.unit}</small></span>
            ${product.oldPrice && product.oldPrice > product.price ? `<span class="pd-old-price">${API.formatPrice(product.oldPrice)}</span>` : ""}
            ${discount ? `<span class="pd-discount">-${discount}%</span>` : ""}
            <div class="pd-min-order">⚠️ Minimal buyurtma: <b>${product.minOrder} ${product.unit}</b></div>
          </div>

          <div class="pd-qty-row">
            <label style="font-weight:600;">Miqdor:</label>
            <div class="qty-control">
              <button id="qtyMinus">−</button>
              <input type="number" id="qtyInput" value="${product.minOrder}" min="${product.minOrder}" max="${product.stock}" step="1">
              <button id="qtyPlus">+</button>
            </div>
            <span class="text-muted" style="font-size:13px;" id="lineTotal"></span>
          </div>

          <div class="pd-actions">
            <button class="btn btn-primary btn-lg" id="addToCartBtn">🛒 Savatga qo'shish</button>
            <button class="btn btn-accent btn-lg" id="buyNowBtn">⚡ Hozir sotib olish</button>
            <button class="btn btn-ghost btn-icon" id="wishBtn" title="Saqlash">
              ${API.isWishlisted(product.id) ? "♥" : "♡"}
            </button>
          </div>

          ${farmer ? `
          <div class="pd-farmer-card">
            <div class="farmer-avatar">${farmer.avatar}</div>
            <div class="info">
              <h4>${escapeHTML(farmer.farm)} ${farmer.verified ? '<span class="verified" style="color:var(--info);">✓</span>' : ""}</h4>
              <p>👤 ${escapeHTML(farmer.name)} · 📍 ${farmer.region} · ⭐ ${farmer.rating} · 📦 ${farmer.deliveries}+ yetkazib berish · ${farmer.years} yil tajriba</p>
            </div>
            <a href="tel:${farmer.phone}" class="btn btn-light btn-sm">📞</a>
          </div>` : ""}
        </div>
      </div>

      <div class="pd-tabs">
        <button class="pd-tab active" data-tab="desc">Tavsif</button>
        <button class="pd-tab" data-tab="specs">Xususiyatlari</button>
        <button class="pd-tab" data-tab="delivery">Yetkazib berish</button>
        <button class="pd-tab" data-tab="farmer">Dehqon</button>
      </div>

      <div class="pd-tab-content active" data-tab="desc">
        <p style="font-size:16px; line-height:1.7; max-width:760px;">${escapeHTML(product.desc || "Tavsif tez orada qo'shiladi.")}</p>
        <ul style="margin-top:20px; line-height:2;">
          <li>✅ ${product.organic ? "Pestitsidlarsiz organik yetishtirilgan" : "Sanitariya nazoratidan o'tgan"}</li>
          <li>✅ Yangi yig'ilgan: ${API.formatDate(product.harvest)}</li>
          <li>✅ 1-qo'l yetkazib berish (vositachisiz)</li>
          <li>✅ Sifat sertifikati bilan</li>
          <li>✅ Yetkazib berishda to'lov mumkin</li>
        </ul>
      </div>

      <div class="pd-tab-content" data-tab="specs">
        <div class="specs-list">
          <div class="row"><span class="k">Kategoriya</span><span class="v">${category ? category.name : "—"}</span></div>
          <div class="row"><span class="k">O'lchov birligi</span><span class="v">${product.unit}</span></div>
          <div class="row"><span class="k">Narx</span><span class="v">${API.formatPrice(product.price)} / ${product.unit}</span></div>
          <div class="row"><span class="k">Min buyurtma</span><span class="v">${product.minOrder} ${product.unit}</span></div>
          <div class="row"><span class="k">Mavjud miqdor</span><span class="v">${product.stock} ${product.unit}</span></div>
          <div class="row"><span class="k">Yig'ilgan sana</span><span class="v">${API.formatDate(product.harvest)}</span></div>
          <div class="row"><span class="k">Organik</span><span class="v">${product.organic ? "Ha 🌿" : "Yo'q"}</span></div>
          <div class="row"><span class="k">Mintaqa</span><span class="v">${farmer ? farmer.region : "—"}</span></div>
        </div>
      </div>

      <div class="pd-tab-content" data-tab="delivery">
        <ul style="line-height:2; font-size:15px;">
          <li>🚚 <b>Toshkent shahri</b> — 4 soat ichida</li>
          <li>🚛 <b>Toshkent viloyati</b> — 8 soat ichida</li>
          <li>📦 <b>Boshqa viloyatlar</b> — 24 soat ichida</li>
          <li>❄️ Yangi mahsulotlar (sut, meva) sovutgich-mashinalarda</li>
          <li>💰 <b>Bepul yetkazib berish</b> — 1 mln so'mdan ortiq buyurtmalarda</li>
        </ul>
      </div>

      <div class="pd-tab-content" data-tab="farmer">
        ${farmer ? `
          <div style="display:flex; gap:32px; align-items:flex-start; flex-wrap:wrap;">
            <div class="farmer-avatar" style="width:120px; height:120px; font-size:42px;">${farmer.avatar}</div>
            <div style="flex:1; min-width:280px;">
              <h2 style="font-size:24px; font-weight:800; margin-bottom:6px;">${escapeHTML(farmer.farm)}</h2>
              <p class="text-muted mb-4">${escapeHTML(farmer.name)} · ${farmer.years} yil tajriba</p>
              <div class="specs-list">
                <div class="row"><span class="k">Mintaqa</span><span class="v">📍 ${farmer.region}</span></div>
                <div class="row"><span class="k">Reyting</span><span class="v">⭐ ${farmer.rating} / 5</span></div>
                <div class="row"><span class="k">Yetkazib berish</span><span class="v">${farmer.deliveries}+ marta</span></div>
                <div class="row"><span class="k">Holat</span><span class="v">${farmer.verified ? "✓ Tasdiqlangan" : "Tasdiqlanmagan"}</span></div>
              </div>
              <p style="margin-top:20px;">📞 Bog'lanish: <b>${farmer.phone}</b></p>
            </div>
          </div>` : "<p>Dehqon ma'lumotlari mavjud emas.</p>"}
      </div>

      <div class="section-sm" style="padding-top:32px;">
        <h3 style="font-size:24px; font-weight:800; margin-bottom:20px;">O'xshash mahsulotlar</h3>
        <div class="product-grid" id="relatedGrid"></div>
      </div>
    `;

    /* Tabs */
    document.querySelectorAll(".pd-tab").forEach(t => {
      t.addEventListener("click", () => {
        document.querySelectorAll(".pd-tab, .pd-tab-content").forEach(x => x.classList.remove("active"));
        t.classList.add("active");
        document.querySelector(`.pd-tab-content[data-tab=${t.dataset.tab}]`).classList.add("active");
      });
    });

    /* Qty kontrol */
    const qty = document.getElementById("qtyInput");
    const lineTotal = document.getElementById("lineTotal");
    const updateLine = () => {
      lineTotal.textContent = `= ${API.formatPrice(qty.value * product.price)}`;
    };
    updateLine();
    document.getElementById("qtyMinus").addEventListener("click", () => {
      qty.value = Math.max(product.minOrder, parseInt(qty.value) - product.minOrder);
      updateLine();
    });
    document.getElementById("qtyPlus").addEventListener("click", () => {
      qty.value = Math.min(product.stock, parseInt(qty.value) + product.minOrder);
      updateLine();
    });
    qty.addEventListener("input", updateLine);

    /* Add to cart */
    document.getElementById("addToCartBtn").addEventListener("click", () => {
      const r = API.addToCart(product.id, qty.value);
      if (r.ok) {
        toast(`Savatga qo'shildi: ${qty.value} ${product.unit}`, "success");
        renderHeader(document.body.dataset.page);
      } else toast(r.error, "error");
    });

    /* Buy now */
    document.getElementById("buyNowBtn").addEventListener("click", () => {
      const r = API.addToCart(product.id, qty.value);
      if (r.ok) location.href = "checkout.html";
      else toast(r.error, "error");
    });

    /* Wishlist */
    const wbtn = document.getElementById("wishBtn");
    wbtn.addEventListener("click", () => {
      const isOn = API.toggleWishlist(product.id);
      wbtn.innerHTML = isOn ? "♥" : "♡";
      wbtn.style.color = isOn ? "var(--danger)" : "";
      toast(isOn ? "Saqlandi" : "O'chirildi", isOn ? "success" : "default");
    });

    /* Related products */
    const related = API.searchProducts({ category: product.cat })
      .filter(p => p.id !== product.id)
      .slice(0, 4);
    renderProductGrid(document.getElementById("relatedGrid"), related);
  });
})();
