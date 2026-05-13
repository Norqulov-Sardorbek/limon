/* ============================================================
   LIMON — Shop (catalog) sahifa
   ============================================================ */
(function initShop() {
  if (document.body.dataset.page !== "shop") return;

  let state = {
    query: getQuery("q") || "",
    category: getQuery("cat") || "",
    region: "",
    organic: null,
    minPrice: 0,
    maxPrice: Infinity,
    sort: "popular"
  };

  document.addEventListener("DOMContentLoaded", () => {
    renderFilters();
    renderResults();
    bindToolbar();
  });

  function renderFilters() {
    /* Kategoriya filtri */
    const catList = document.getElementById("filterCategories");
    if (catList) {
      const allCount = API.getAllProducts().length;
      catList.innerHTML = `
        <label>
          <input type="radio" name="filterCat" value="" ${!state.category ? 'checked' : ''}>
          Hammasi <span class="count">${allCount}</span>
        </label>
        ${DB.categories.map(c => {
          const count = API.getAllProducts().filter(p => p.cat === c.id).length;
          return `<label>
            <input type="radio" name="filterCat" value="${c.id}" ${state.category === c.id ? 'checked' : ''}>
            ${c.icon} ${c.name} <span class="count">${count}</span>
          </label>`;
        }).join("")}
      `;
      catList.querySelectorAll("input").forEach(inp => {
        inp.addEventListener("change", () => { state.category = inp.value; renderResults(); });
      });
    }

    /* Region filtri */
    const regList = document.getElementById("filterRegions");
    if (regList) {
      regList.innerHTML = `
        <label><input type="radio" name="filterReg" value="" checked> Barchasi</label>
        ${DB.regions.map(r => {
          const count = API.getAllProducts().filter(p => {
            const f = API.getFarmer(p.farmerId);
            return f && f.region === r;
          }).length;
          if (count === 0) return "";
          return `<label><input type="radio" name="filterReg" value="${r}"> ${r} <span class="count">${count}</span></label>`;
        }).join("")}
      `;
      regList.querySelectorAll("input").forEach(inp => {
        inp.addEventListener("change", () => { state.region = inp.value; renderResults(); });
      });
    }

    /* Organic filtri */
    const orgList = document.getElementById("filterOrganic");
    if (orgList) {
      orgList.innerHTML = `
        <label><input type="radio" name="filterOrg" value="all" checked> Hammasi</label>
        <label><input type="radio" name="filterOrg" value="yes"> 🌿 Faqat organik</label>
        <label><input type="radio" name="filterOrg" value="no"> Boshqalari</label>
      `;
      orgList.querySelectorAll("input").forEach(inp => {
        inp.addEventListener("change", () => {
          state.organic = inp.value === "yes" ? true : inp.value === "no" ? false : null;
          renderResults();
        });
      });
    }

    /* Narx oralig'i */
    const min = document.getElementById("minPrice");
    const max = document.getElementById("maxPrice");
    const apply = document.getElementById("applyPrice");
    if (apply) {
      apply.addEventListener("click", () => {
        state.minPrice = parseInt(min.value) || 0;
        state.maxPrice = parseInt(max.value) || Infinity;
        renderResults();
      });
    }
  }

  function bindToolbar() {
    const search = document.getElementById("shopSearch");
    if (search) {
      search.value = state.query;
      let t;
      search.addEventListener("input", () => {
        clearTimeout(t);
        t = setTimeout(() => { state.query = search.value; renderResults(); }, 250);
      });
    }
    const sort = document.getElementById("shopSort");
    if (sort) sort.addEventListener("change", () => { state.sort = sort.value; renderResults(); });
  }

  function renderResults() {
    const results = API.searchProducts(state);
    const container = document.getElementById("shopResults");
    const counter = document.getElementById("resultsCount");
    if (counter) counter.textContent = `${results.length} ta mahsulot topildi`;
    renderProductGrid(container, results, "Bu filtrlar bilan mahsulot yo'q");

    /* Sahifa sarlavhasi */
    const title = document.getElementById("shopTitle");
    if (title) {
      if (state.category) {
        const c = DB.categories.find(x => x.id === state.category);
        title.textContent = c ? c.name : "Mahsulotlar";
      } else if (state.query) title.textContent = `"${state.query}" — qidiruv natijalari`;
      else title.textContent = "Barcha mahsulotlar";
    }
  }
})();
