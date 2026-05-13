/* ============================================================
   LIMON — Auth page (login + register)
   ============================================================ */

(function initAuth() {
  if (document.body.dataset.page !== "login") return;

  document.addEventListener("DOMContentLoaded", () => {
    const tabLogin = document.getElementById("tabLogin");
    const tabReg   = document.getElementById("tabReg");
    const formLogin= document.getElementById("formLogin");
    const formReg  = document.getElementById("formReg");

    function switchTab(which) {
      const isLogin = which === "login";
      tabLogin.classList.toggle("active", isLogin);
      tabReg.classList.toggle("active", !isLogin);
      formLogin.style.display = isLogin ? "block" : "none";
      formReg.style.display   = isLogin ? "none"  : "block";
    }

    tabLogin.addEventListener("click", () => switchTab("login"));
    tabReg.addEventListener("click",   () => switchTab("register"));

    /* Role selector (register) */
    let role = "shop";
    document.querySelectorAll(".role-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".role-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        role = tab.dataset.role;
        document.getElementById("shopFields").style.display   = role === "shop"   ? "block" : "none";
        document.getElementById("farmerFields").style.display = role === "farmer" ? "block" : "none";
      });
    });

    /* Login form */
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = formLogin.email.value.trim();
      const password = formLogin.password.value;
      const btn = formLogin.querySelector("button[type=submit]");
      btn.disabled = true; btn.textContent = "Tekshirilmoqda...";
      const r = await API.login(email, password);
      btn.disabled = false; btn.textContent = "Kirish";

      if (r.ok) {
        toast(`Xush kelibsiz, ${r.user.name}!`, "success");
        const next = getQuery("next") || "dashboard.html";
        setTimeout(() => location.href = next, 600);
      } else {
        document.getElementById("loginError").textContent = r.error;
        document.getElementById("loginError").style.display = "block";
      }
    });

    /* Register form */
    formReg.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        role,
        name:     formReg.name.value.trim(),
        email:    formReg.email.value.trim(),
        phone:    formReg.phone.value.trim(),
        password: formReg.password.value,
        region:   formReg.region.value,
        address:  formReg.address.value.trim(),
        shopName: formReg.shopName?.value.trim() || "",
        farmName: formReg.farmName?.value.trim() || ""
      };
      if (data.password !== formReg.password2.value) {
        document.getElementById("regError").textContent = "Parollar mos kelmadi";
        document.getElementById("regError").style.display = "block";
        return;
      }

      const btn = formReg.querySelector("button[type=submit]");
      btn.disabled = true; btn.textContent = "Ro'yxatdan o'tilmoqda...";
      const r = await API.register(data);
      btn.disabled = false; btn.textContent = "Ro'yxatdan o'tish";

      if (r.ok) {
        toast("Ro'yxatdan o'tdingiz! Limon'ga xush kelibsiz", "success");
        setTimeout(() => location.href = "dashboard.html", 800);
      } else {
        document.getElementById("regError").textContent = r.error;
        document.getElementById("regError").style.display = "block";
      }
    });

    /* Region selectlarni to'ldirish */
    const regSel = formReg.querySelector("[name=region]");
    DB.regions.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r; opt.textContent = r;
      regSel.appendChild(opt);
    });

    /* Demo login tugmasi */
    document.querySelectorAll("[data-demo]").forEach(b => {
      b.addEventListener("click", async () => {
        const email = b.dataset.demo;
        const r = await API.login(email, "demo123");
        if (r.ok) {
          toast("Demo akkaunt orqali kirildi", "success");
          setTimeout(() => location.href = "dashboard.html", 600);
        }
      });
    });
  });
})();
