/* ============================================================
   LIMON — DRF backend bilan ulangan API qatlami
   Sync surface (cache asosida) saqlanadi; mutatsiyalar serverga
   yuboriladi va lokal cache yangilanadi.
   ============================================================ */

const API_BASE = (() => {
  // Allow override via <meta name="limon-api" content="http://other-host">
  const meta = document.querySelector('meta[name="limon-api"]');
  if (meta && meta.content) return meta.content.replace(/\/$/, "");
  return "http://173.249.10.117:8053";
})();

const API = (() => {
  /* ---------- helpers ---------- */
  function getToken() { return localStorage.getItem("limon_jwt"); }
  function setToken(t) { t ? localStorage.setItem("limon_jwt", t) : localStorage.removeItem("limon_jwt"); }
  function getUserCached() {
    try { return JSON.parse(localStorage.getItem("limon_user") || "null"); } catch { return null; }
  }
  function setUserCached(u) {
    if (u) localStorage.setItem("limon_user", JSON.stringify(u));
    else localStorage.removeItem("limon_user");
  }

  async function http(path, { method = "GET", body, auth = true } = {}) {
    const headers = { "Content-Type": "application/json" };
    if (auth) {
      const t = getToken();
      if (t) headers["Authorization"] = "Bearer " + t;
    }
    const res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let data = null;
    const text = await res.text();
    if (text) { try { data = JSON.parse(text); } catch { data = { error: text }; } }
    if (!res.ok) {
      const error = (data && (data.error || data.detail)) || `HTTP ${res.status}`;
      if (res.status === 401) {
        setToken(null); setUserCached(null);
      }
      return { ok: false, status: res.status, error, data };
    }
    return { ok: true, status: res.status, data };
  }

  /* ---------- LOCAL CACHES ---------- */
  function readLocalCart() {
    try { return JSON.parse(localStorage.getItem("limon_cart") || "[]"); }
    catch { return []; }
  }
  function writeLocalCart(cart) {
    localStorage.setItem("limon_cart", JSON.stringify(cart));
  }

  function readWishlist() {
    try { return JSON.parse(localStorage.getItem("limon_wishlist") || "[]"); }
    catch { return []; }
  }
  function writeWishlist(w) {
    localStorage.setItem("limon_wishlist", JSON.stringify(w));
  }

  function readCustomProducts() {
    try { return JSON.parse(localStorage.getItem("limon_custom_products") || "[]"); }
    catch { return []; }
  }
  function writeCustomProducts(arr) {
    localStorage.setItem("limon_custom_products", JSON.stringify(arr));
  }

  function readOrdersCache() {
    try { return JSON.parse(localStorage.getItem("limon_orders") || "[]"); }
    catch { return []; }
  }
  function writeOrdersCache(arr) {
    localStorage.setItem("limon_orders", JSON.stringify(arr));
  }

  /* ---------- AUTH ---------- */
  async function register(payload) {
    if (!payload.password || payload.password.length < 6)
      return { ok: false, error: "Parol kamida 6 ta belgi bo'lishi kerak." };
    const r = await http("/api/auth/register/", { method: "POST", body: payload, auth: false });
    if (!r.ok) return { ok: false, error: r.error };
    setToken(r.data.access);
    setUserCached(r.data.user);
    await pullServerState();
    return { ok: true, user: r.data.user };
  }

  async function login(email, password) {
    const r = await http("/api/auth/login/", { method: "POST", body: { email, password }, auth: false });
    if (!r.ok) return { ok: false, error: r.error };
    setToken(r.data.access);
    setUserCached(r.data.user);
    await pullServerState();
    return { ok: true, user: r.data.user };
  }

  function logout() {
    setToken(null);
    setUserCached(null);
    writeLocalCart([]);
    writeWishlist([]);
    writeOrdersCache([]);
    writeCustomProducts([]);
  }

  function currentUser() {
    return getUserCached();
  }

  async function updateProfile(patch) {
    const r = await http("/api/auth/me/", { method: "PATCH", body: patch });
    if (!r.ok) return { ok: false, error: r.error };
    setUserCached(r.data.user || r.data);
    return { ok: true, user: r.data.user || r.data };
  }

  /** Fetch server-side state (cart, wishlist, custom products) after auth */
  async function pullServerState() {
    const [cartR, wishR, prodR] = await Promise.all([
      http("/api/cart/"),
      http("/api/wishlist/"),
      http("/api/products/?custom=1", { auth: false }),
    ]);
    if (cartR.ok) {
      writeLocalCart((cartR.data.items || []).map(i => ({ id: i.product.id, qty: i.qty })));
    }
    if (wishR.ok) {
      writeWishlist(Array.isArray(wishR.data) ? wishR.data : []);
    }
    if (prodR.ok && Array.isArray(prodR.data)) {
      writeCustomProducts(prodR.data.filter(p => p.custom));
    }
  }

  /* ---------- PRODUCTS ---------- */
  function getAllProducts() {
    const custom = readCustomProducts();
    return [...DB.products, ...custom];
  }

  function getProduct(id) {
    return getAllProducts().find(p => String(p.id) === String(id));
  }

  function getFarmer(id) {
    return DB.farmers.find(f => f.id === id);
  }

  function getCategory(id) {
    return DB.categories.find(c => c.id === id);
  }

  function searchProducts({ query = "", category = "", region = "", organic = null, minPrice = 0, maxPrice = Infinity, sort = "popular" } = {}) {
    let list = getAllProducts();
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || (p.desc || "").toLowerCase().includes(q));
    }
    if (category) list = list.filter(p => p.cat === category);
    if (region) list = list.filter(p => {
      const f = getFarmer(p.farmerId);
      return f && f.region === region;
    });
    if (organic === true)  list = list.filter(p => p.organic);
    if (organic === false) list = list.filter(p => !p.organic);
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);

    switch (sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "new":        list.sort((a, b) => new Date(b.harvest) - new Date(a.harvest)); break;
      case "popular":
      default:           list.sort((a, b) => (b.stock < 100 ? 0 : 1) - (a.stock < 100 ? 0 : 1));
    }
    return list;
  }

  async function addProduct(data) {
    const u = currentUser();
    if (!u || u.role !== "farmer") return { ok: false, error: "Faqat dehqonlar mahsulot qo'sha oladi." };
    const r = await http("/api/products/", { method: "POST", body: data });
    if (!r.ok) return { ok: false, error: r.error };
    const prod = r.data.product || r.data;
    const list = readCustomProducts();
    list.push(prod);
    writeCustomProducts(list);
    return { ok: true, product: prod };
  }

  /* ---------- CART (local cache, bg-sync server) ---------- */
  function getCart() { return readLocalCart(); }

  function cartCount() {
    return readLocalCart().reduce((sum, it) => sum + it.qty, 0);
  }

  function _bgSyncCartItem(productId, qty) {
    // Fire-and-forget; absolute-set the server qty via DELETE+POST is heavy.
    // Strategy: POST add (server adds qty), or PATCH if it already exists.
    http(`/api/cart/items/${productId}/`, { method: "PATCH", body: { qty } }).then(r => {
      if (r.status === 404) {
        http("/api/cart/items/", { method: "POST", body: { productId, qty } });
      }
    }).catch(() => {});
  }

  function addToCart(productId, qty) {
    const cart = readLocalCart();
    const prod = getProduct(productId);
    if (!prod) return { ok: false, error: "Mahsulot topilmadi" };
    qty = Math.max(prod.minOrder, parseInt(qty) || prod.minOrder);
    if (qty > prod.stock) return { ok: false, error: `Maksimal: ${prod.stock} ${prod.unit}` };

    const existing = cart.find(c => String(c.id) === String(productId));
    if (existing) existing.qty = Math.min(prod.stock, existing.qty + qty);
    else cart.push({ id: productId, qty });
    writeLocalCart(cart);

    if (getToken()) _bgSyncCartItem(productId, cart.find(c => String(c.id) === String(productId)).qty);
    return { ok: true, count: cartCount() };
  }

  function updateCartQty(productId, qty) {
    const cart = readLocalCart();
    const prod = getProduct(productId);
    if (!prod) return;
    const item = cart.find(c => String(c.id) === String(productId));
    if (!item) return;
    qty = parseInt(qty) || 0;
    if (qty < prod.minOrder) item.qty = prod.minOrder;
    else if (qty > prod.stock) item.qty = prod.stock;
    else item.qty = qty;
    writeLocalCart(cart);

    if (getToken()) _bgSyncCartItem(productId, item.qty);
  }

  function removeFromCart(productId) {
    const cart = readLocalCart().filter(c => String(c.id) !== String(productId));
    writeLocalCart(cart);
    if (getToken()) {
      http(`/api/cart/items/${productId}/`, { method: "DELETE" }).catch(() => {});
    }
  }

  function clearCart() {
    writeLocalCart([]);
    if (getToken()) {
      http("/api/cart/clear/", { method: "DELETE" }).catch(() => {});
    }
  }

  function cartTotals(promoCode = null) {
    const cart = readLocalCart();
    let subtotal = 0;
    const items = cart.map(c => {
      const p = getProduct(c.id);
      if (!p) return null;
      const line = p.price * c.qty;
      subtotal += line;
      return { ...p, qty: c.qty, line };
    }).filter(Boolean);

    const delivery = subtotal >= 1000000 ? 0 : (cart.length ? 50000 : 0);
    let discount = 0;
    let appliedPromo = null;

    if (promoCode && DB.promoCodes[promoCode]) {
      const p = DB.promoCodes[promoCode];
      if (subtotal >= p.minOrder) {
        discount = p.type === "percent" ? Math.round(subtotal * p.discount / 100) : p.discount;
        appliedPromo = { code: promoCode, ...p };
      }
    }

    const total = Math.max(0, subtotal + delivery - discount);
    return { items, subtotal, delivery, discount, total, appliedPromo };
  }

  /* ---------- ORDERS ---------- */
  async function placeOrder(payload) {
    const u = currentUser();
    if (!u) return { ok: false, error: "Avval tizimga kiring." };

    // Server's cart is authoritative; ensure it matches local first.
    await Promise.all(
      readLocalCart().map(it =>
        http(`/api/cart/items/${it.id}/`, { method: "PATCH", body: { qty: it.qty } })
          .then(r => r.status === 404
            ? http("/api/cart/items/", { method: "POST", body: { productId: it.id, qty: it.qty } })
            : null
          )
      )
    );

    const r = await http("/api/orders/place/", { method: "POST", body: payload });
    if (!r.ok) return { ok: false, error: r.error };
    const order = r.data.order;
    writeLocalCart([]);
    const cache = readOrdersCache();
    cache.unshift(order);
    writeOrdersCache(cache);
    return { ok: true, order };
  }

  async function fetchOrders() {
    const r = await http("/api/orders/");
    if (r.ok && Array.isArray(r.data)) writeOrdersCache(r.data);
    return r.ok ? r.data : readOrdersCache();
  }

  function getOrders() {
    // Sync read for the dashboard; consumer can call API.refreshOrders() for fresh data
    fetchOrders().catch(() => {});
    return readOrdersCache();
  }

  function getOrder(id) {
    return readOrdersCache().find(o => o.id === id);
  }

  async function advanceOrderStatus(orderId) {
    const r = await http(`/api/orders/${orderId}/advance/`, { method: "POST" });
    if (!r.ok) return { ok: false, error: r.error };
    const cache = readOrdersCache();
    const idx = cache.findIndex(o => o.id === orderId);
    if (idx >= 0) cache[idx] = r.data.order; else cache.unshift(r.data.order);
    writeOrdersCache(cache);
    return { ok: true, order: r.data.order };
  }

  /* ---------- WISHLIST ---------- */
  function getWishlist() { return readWishlist(); }

  function toggleWishlist(id) {
    let w = readWishlist();
    const isOn = w.includes(id);
    if (isOn) w = w.filter(x => x !== id);
    else w.push(id);
    writeWishlist(w);
    if (getToken()) {
      http("/api/wishlist/toggle/", { method: "POST", body: { productId: id } }).catch(() => {});
    }
    return !isOn;
  }

  function isWishlisted(id) { return readWishlist().includes(id); }

  /* ---------- PROMO ---------- */
  function validatePromo(code, subtotal) {
    const p = DB.promoCodes[code];
    if (!p) return { ok: false, error: "Bunday promo-kod yo'q." };
    if (subtotal < p.minOrder)
      return { ok: false, error: `Minimal buyurtma: ${formatPrice(p.minOrder)}` };
    return { ok: true, promo: { code, ...p } };
  }

  /* ---------- HELPERS ---------- */
  function formatPrice(n) {
    return new Intl.NumberFormat("uz-UZ").format(Math.round(n)) + " so'm";
  }
  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString("uz-UZ", { day: "2-digit", month: "long", year: "numeric" });
  }

  /* ---------- BOOT ---------- */
  // Refresh server state in background if logged in (non-blocking)
  if (getToken()) pullServerState().catch(() => {});

  return {
    register, login, logout, currentUser, updateProfile,
    getAllProducts, getProduct, getFarmer, getCategory, searchProducts, addProduct,
    getCart, cartCount, addToCart, updateCartQty, removeFromCart, clearCart, cartTotals,
    placeOrder, getOrders, getOrder, fetchOrders, advanceOrderStatus,
    getWishlist, toggleWishlist, isWishlisted,
    validatePromo, formatPrice, formatDate,
  };
})();
