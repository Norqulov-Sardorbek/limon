/* ============================================================
   LIMON — Bosh sahifa (landing) logikasi
   ============================================================ */
(function initHome() {
  if (document.body.dataset.page !== "home") return;

  document.addEventListener("DOMContentLoaded", () => {
    /* Kategoriyalar */
    const catWrap = document.getElementById("categoriesGrid");
    if (catWrap) {
      catWrap.innerHTML = DB.categories.map(c => `
        <a href="shop.html?cat=${c.id}" class="cat-card">
          <div class="cat-icon" style="background:${c.color}22; color:${c.color};">${c.icon}</div>
          <h3>${c.name}</h3>
          <p>${c.desc || ""}</p>
        </a>
      `).join("");
    }

    /* Bestseller mahsulotlar (statistika bo'yicha) */
    const popular = API.searchProducts({ sort: "popular" }).slice(0, 8);
    renderProductGrid(document.getElementById("bestsellersGrid"), popular);

    /* Yangi hosil */
    const fresh = API.searchProducts({ sort: "new" }).slice(0, 8);
    renderProductGrid(document.getElementById("freshGrid"), fresh);

    /* Sharhlar */
    const testWrap = document.getElementById("testimonialsGrid");
    if (testWrap) {
      testWrap.innerHTML = DB.testimonials.map(t => `
        <div class="t-card">
          <div class="t-stars">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</div>
          <p>"${t.text}"</p>
          <div class="t-author">
            <div class="avatar">${t.name.charAt(0)}</div>
            <div>
              <h5>${t.name}</h5>
              <p>${t.role} · ${t.region}</p>
            </div>
          </div>
        </div>
      `).join("");
    }

    /* FAQ */
    const faqWrap = document.getElementById("faqList");
    if (faqWrap) {
      faqWrap.innerHTML = DB.faq.slice(0, 5).map((f, i) => `
        <div class="faq-item ${i === 0 ? 'open' : ''}">
          <button class="faq-q">${f.q}<span class="toggle">+</span></button>
          <div class="faq-a"><p>${f.a}</p></div>
        </div>
      `).join("");
      faqWrap.querySelectorAll(".faq-q").forEach(q => {
        q.addEventListener("click", () => q.parentElement.classList.toggle("open"));
      });
    }

    /* Statistika animatsiyasi */
    animateCounters();
  });

  function animateCounters() {
    document.querySelectorAll("[data-count]").forEach(el => {
      const target = parseInt(el.dataset.count);
      const duration = 1500;
      const step = target / (duration / 30);
      let cur = 0;
      const tick = () => {
        cur += step;
        if (cur >= target) { el.textContent = formatCount(target); return; }
        el.textContent = formatCount(Math.floor(cur));
        requestAnimationFrame(tick);
      };
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { tick(); obs.disconnect(); } });
      obs.observe(el);
    });
  }
  function formatCount(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + " mlrd";
    if (n >= 1000) return Math.round(n / 1000) + "K+";
    return n.toString();
  }
})();
