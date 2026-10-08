/* =========================================================================
   AMAZONA Global Asset Hub - app logic (vanilla JS, hash router)

   Routes
     #/                              language select
     #/{lang}                        two main actions
     #/{lang}/preview                product gallery
     #/{lang}/preview/{id}?view=pc   detail page viewer (pc | mobile)
     #/{lang}/download               download hub
   ========================================================================= */
(function () {
  "use strict";

  const C = window.AMAZONA_CONFIG;
  const app = document.getElementById("app");
  const langSwitch = document.getElementById("lang-switch");
  const toastEl = document.getElementById("toast");
  const LANG_CODES = C.languages.map((l) => l.code);
  const DEFAULT_LANG = "en";

  // Approximate page heights at 860px (reserves space before images load).
  const PLACEHOLDER_H = { Hero: 2700, Solution: 6200, Ingredients: 4900, Safety: 7800, FreezeDrying: 4600, Feed: 4500, Review: 5500, ProductInfo: 6400 };

  let cleanup = [];

  /* ---------------------------------------------------------------- utils */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (tpl, vars) => String(tpl).replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
  const t = (lang, key, vars) => fmt((C.i18n[lang] || C.i18n[DEFAULT_LANG])[key] ?? key, vars || {});
  const isReal = (url) => !!url && url !== C.placeholder && !url.includes("your-drive-link-here");
  const imgUrl = (id, kind = "primary", w = C.image.pageWidth) => fmt(C.image[kind], { id, w });
  const round1 = (n) => Math.round(n * 10) / 10;

  // Product package image (config products[].image); falls back to the Drive hero page.
  const pimg = (p, alt) => p.image
    ? `<img class="pimg" src="${esc(p.image)}" alt="${esc(alt)}" loading="lazy" decoding="async">`
    : thumb(heroId(DEFAULT_LANG, p.id), alt);
  const thumb = (id, alt) => `<img data-thumb="${esc(id)}" alt="${esc(alt)}" decoding="async" referrerpolicy="no-referrer">`;

  /* Throttled image loader. Google Drive rejects bursts of parallel
     requests, so images load a few at a time and retry on a fallback
     host with backoff before giving up. */
  const MAX_PARALLEL = 3;
  const queue = [];
  let active = 0;

  function fetchImage(img, id, w, priority) {
    return new Promise((resolve) => {
      const job = { img, id, w, resolve };
      priority ? queue.unshift(job) : queue.push(job);
      pump();
    });
  }

  function pump() {
    while (active < MAX_PARALLEL && queue.length) {
      const job = queue.shift();
      if (!job.img.isConnected) { job.resolve(false); continue; }
      active++;
      attempt(job, 0);
    }
  }

  function attempt(job, n) {
    const plan = [
      () => imgUrl(job.id, "primary", job.w),
      () => imgUrl(job.id, "fallback", job.w),
      () => imgUrl(job.id, "primary", job.w) + "-rj",
      () => imgUrl(job.id, "fallback", job.w) + "&r=" + Date.now(),
    ];
    const img = job.img;
    const done = (ok) => { active--; job.resolve(ok); pump(); };
    if (!img.isConnected) return done(false);
    img.onload = () => { img.onload = img.onerror = null; done(true); };
    img.onerror = () => {
      img.onload = img.onerror = null;
      if (n + 1 < plan.length) setTimeout(() => attempt(job, n + 1), 400 * (n + 1));
      else done(false);
    };
    img.src = plan[n]();
  }

  function productsFor(lang) {
    return C.products.filter((p) =>
      p.enabled !== false &&
      (!p.only || p.only.includes(lang)) &&
      C.assets[lang] && C.assets[lang][p.id]
    );
  }
  const assetOf = (lang, pid) => (C.assets[lang] || {})[pid];
  const heroId = (lang, pid) => {
    const a = assetOf(lang, pid);
    return a && a.files && a.files[0] ? a.files[0].id : "";
  };
  const pVars = (p) => `--p-color:${p.color};--p-panel:${p.panel};--p-ground:${p.ground};--p-ink:color-mix(in srgb, ${p.color} 30%, #0b0b0b)`;

  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [path, query = ""] = raw.split("?");
    const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
    const params = new URLSearchParams(query);
    return { parts, params };
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toastEl.classList.remove("is-on"), 1800);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
      ta.remove();
      return ok;
    }
  }

  // Absolute URL of the site root (for QR codes / shared links).
  function siteBase() {
    const local = location.protocol === "file:" || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (local || C.brand.forceSiteUrl) return C.brand.siteUrl;
    return location.href.split("#")[0];
  }

  /* ------------------------------------------------------------- chrome */
  function renderChrome(lang, parts) {
    const active = lang || null;
    const rest = parts.slice(1).join("/");
    const query = location.hash.includes("?") ? "?" + location.hash.split("?")[1] : "";
    langSwitch.innerHTML = C.languages.map((l) => {
      const href = active ? `#/${l.code}${rest ? "/" + rest : ""}${query}` : `#/${l.code}`;
      return `<a href="${href}" lang="${l.code}" aria-current="${l.code === active}">${esc(l.short)}</a>`;
    }).join("");

    const ui = lang || DEFAULT_LANG;
    document.documentElement.lang = lang ? C.i18n[lang].htmlLang : "en";
    document.getElementById("footer-note").textContent = t(ui, "footer");
    const mail = C.brand.contactEmail ? ` <a href="mailto:${esc(C.brand.contactEmail)}">${esc(C.brand.contactEmail)}</a>` : "";
    document.getElementById("footer-copy").innerHTML = `&copy; ${new Date().getFullYear()} ${esc(C.brand.name)}.${mail}`;
  }

  function crumbs(lang, items) {
    const sep = '<i class="ph ph-caret-right" aria-hidden="true"></i>';
    const home = `<a href="#/">${esc(t(lang, "home"))}</a>`;
    const langLabel = C.languages.find((l) => l.code === lang).label;
    const all = [home, `<a href="#/${lang}">${esc(langLabel)}</a>`, ...items];
    return `<nav class="crumbs reveal" aria-label="Breadcrumb">${all.join(sep)}</nav>`;
  }

  /* ------------------------------------------------------------ Level 1 */
  function viewLanding() {
    document.title = `${C.brand.name} | Global Asset & Detail Page Hub`;
    const strip = productsFor("en").slice(0, 5).map((p, i) => `
      <div class="strip-item reveal" style="--i:${i + 4};${pVars(p)}">
        <div class="strip-media">${pimg(p, p.name.en)}</div>
        <div class="strip-name">${esc(p.name.en)}<span lang="ko">${esc(p.name.ko)}</span></div>
      </div>`).join("");

    const langs = C.languages.map((l, i) => `
      <a class="lang-card reveal" style="--i:${i + 1}" href="#/${l.code}">
        <span class="lang-code" aria-hidden="true">${esc(l.short)}</span>
        <span>
          <span class="lang-name" lang="${l.code}">${esc(l.label)}</span>
          <span class="lang-sub">${esc(l.sub)}</span>
        </span>
        <i class="ph ph-arrow-right arrow" aria-hidden="true"></i>
      </a>`).join("");

    app.innerHTML = `
      <section class="view">
        <div class="container">
          <div class="landing">
            <div class="landing-copy">
              <p class="eyebrow reveal">${esc(C.brand.hubTitle)}</p>
              <h1 class="h-display reveal" style="--i:1">Every detail page,<br><strong>reviewed in one place.</strong></h1>
              <div class="landing-sub reveal" style="--i:2">
                <p>${esc(C.i18n.en.landingSub)}</p>
                <p lang="ko">${esc(C.i18n.ko.landingSub)}</p>
                <p lang="ja">${esc(C.i18n.ja.landingSub)}</p>
              </div>
            </div>
            <div class="lang-list" role="list">
              <p class="lang-list-label reveal">Choose a language / 언어 선택 / 言語を選択</p>
              ${langs}
            </div>
          </div>
          <div class="strip" aria-label="Products">${strip}</div>
        </div>
      </section>`;
  }

  /* ------------------------------------------------------------ Level 2 */
  function viewHub(lang) {
    const prods = productsFor(lang);
    const totalFiles = prods.reduce((n, p) => n + (assetOf(lang, p.id).files || []).length, 0);
    const totalMB = round1(prods.reduce((n, p) => n + (assetOf(lang, p.id).sizeMB || 0), 0));
    document.title = `${t(lang, "hubTitle")} | ${C.brand.name}`;

    const fan = prods.slice(0, 5).map((p) =>
      `<div class="fan-card" style="${pVars(p)}">${pimg(p, "")}</div>`
    ).join("");

    app.innerHTML = `
      <section class="view">
        <div class="container">
          ${crumbs(lang, [])}
          <div class="hub-head reveal" style="--i:1">
            <h1 class="h-section">${esc(t(lang, "hubTitle"))}</h1>
            <p>${esc(t(lang, "hubSub"))}</p>
          </div>
          <div class="actions">
            <a class="action reveal" style="--i:2" href="#/${lang}/preview">
              <div class="action-text">
                <span class="action-icon" aria-hidden="true"><i class="ph ph-devices"></i></span>
                <h2>${esc(t(lang, "previewTitle"))}</h2>
                <p>${esc(t(lang, "previewDesc"))}</p>
              </div>
              <span class="action-cta"><span class="circle"><i class="ph ph-arrow-right" aria-hidden="true"></i></span>${esc(t(lang, "open"))}</span>
              <div class="fan" aria-hidden="true">${fan}</div>
            </a>
            <a class="action is-dark reveal" style="--i:3" href="#/${lang}/download">
              <div class="action-text">
                <span class="action-icon" aria-hidden="true"><i class="ph ph-download-simple"></i></span>
                <h2>${esc(t(lang, "downloadTitle"))}</h2>
                <p>${esc(t(lang, "downloadDesc"))}</p>
              </div>
              <div class="stats">
                <div><div class="stat-num">${prods.length}</div><div class="stat-label">${esc(t(lang, "products"))}</div></div>
                <div><div class="stat-num">${totalFiles}</div><div class="stat-label">${esc(C.fileFormat.label)}</div></div>
                <div><div class="stat-num">${totalMB}</div><div class="stat-label">MB</div></div>
              </div>
              <span class="action-cta"><span class="circle"><i class="ph ph-arrow-right" aria-hidden="true"></i></span>${esc(t(lang, "open"))}</span>
            </a>
          </div>
        </div>
      </section>`;
  }

  /* ---------------------------------------------------------- Level 3-A */
  function viewPreviewGrid(lang) {
    const prods = productsFor(lang);
    document.title = `${t(lang, "previewTitle")} | ${C.brand.name}`;
    const cards = prods.map((p, i) => {
      const a = assetOf(lang, p.id);
      return `
        <a class="product-card reveal" style="--i:${i + 2};${pVars(p)}" href="#/${lang}/preview/${p.id}">
          <div class="product-media">${pimg(p, p.name[lang])}</div>
          <div class="product-body">
            <div>
              <div class="product-name">${esc(p.name[lang])}</div>
              <div class="product-meta"><span class="swatch" aria-hidden="true"></span>${esc(lang === "en" ? p.name.ko : p.name.en)} &middot; ${esc(t(lang, "pages", { n: a.files.length }))}</div>
            </div>
            <span class="product-arrow" aria-hidden="true"><i class="ph ph-arrow-up-right"></i></span>
          </div>
        </a>`;
    }).join("");

    app.innerHTML = `
      <section class="view">
        <div class="container">
          ${crumbs(lang, [`<span>${esc(t(lang, "previewTitle"))}</span>`])}
          <div class="grid-head reveal" style="--i:1">
            <h1 class="h-section">${esc(t(lang, "previewGridTitle"))}</h1>
          </div>
          <div class="product-grid">${cards}</div>
        </div>
      </section>`;
  }

  /* -------------------------------------------------------------- Viewer */
  function pageImgHTML(f, i, lang, eager) {
    const ph = PLACEHOLDER_H[f.section] || 4500;
    const label = (C.sections[f.section] || {})[lang] || f.section;
    return `
      <figure class="page-img is-loading" id="sec-${i}" data-idx="${i}" style="--ar:860/${ph};margin:0">
        <img alt="${esc(label)}" decoding="async" width="860" referrerpolicy="no-referrer" data-id="${esc(f.id)}" ${eager ? 'data-eager="1"' : ""}>
      </figure>`;
  }

  function sectionList(files, lang) {
    return files.map((f, i) => ({ i, label: (C.sections[f.section] || {})[lang] || f.section }));
  }

  /* Smart Store style product page shell around the detail images.
     Layout reference only: no Naver logo or branding is reproduced. */
  function storePage(p, lang, stack, kind) {
    const tabs = t(lang, "storeTabs").split("|");
    const tabsHTML = `<div class="ss-tabs" role="presentation">${tabs.map((x, i) => `<span${i === 0 ? ' class="is-on"' : ""}>${esc(x)}</span>`).join("")}</div>`;
    const detail = `
      <div class="ss-detail is-collapsed" data-detail>
        <div class="ss-detail-inner">${stack}</div>
        <div class="ss-more">
          <button type="button" class="ss-more-btn" data-expand aria-expanded="false">
            <span data-label>${esc(t(lang, "storeExpand"))}</span><i class="ph ph-caret-down" aria-hidden="true"></i>
          </button>
        </div>
      </div>`;
    if (kind === "pc") {
      return `
        <div class="ss ss-pc">
          <div class="ss-head">
            <span class="ss-store">${esc(C.brand.name)}</span>
            <span class="ss-search" aria-hidden="true"><i class="ph ph-magnifying-glass"></i></span>
          </div>
          <div class="ss-summary">
            <div class="ss-thumb">${pimg(p, p.name[lang])}</div>
            <div class="ss-info">
              <p class="ss-brand">${esc(C.brand.name)}</p>
              <h2>${esc(p.name[lang])}</h2>
              <p class="ss-note"><i class="ph ph-info" aria-hidden="true"></i>${esc(t(lang, "storeNote"))}</p>
            </div>
          </div>
          ${tabsHTML}
          ${detail}
        </div>`;
    }
    return `
      <div class="ss ss-m">
        <div class="ss-m-head" aria-hidden="true">
          <i class="ph ph-caret-left"></i>
          <span class="ss-store">${esc(C.brand.name)}</span>
          <span><i class="ph ph-magnifying-glass"></i><i class="ph ph-shopping-cart-simple"></i></span>
        </div>
        <div class="ss-m-thumb">${pimg(p, p.name[lang])}</div>
        <div class="ss-m-info">
          <p class="ss-brand">${esc(C.brand.name)}</p>
          <h2>${esc(p.name[lang])}</h2>
        </div>
        ${tabsHTML}
        ${detail}
      </div>`;
  }

  function viewViewer(lang, pid, params) {
    const p = productsFor(lang).find((x) => x.id === pid);
    if (!p) return viewNotFound(lang);
    const a = assetOf(lang, pid);
    const files = a.files || [];
    let mode = params.get("view");
    if (mode !== "pc" && mode !== "mobile") mode = window.innerWidth < 900 ? "mobile" : "pc";
    document.title = `${p.name[lang]} | ${C.brand.name}`;

    const secs = sectionList(files, lang);
    const stack = files.map((f, i) => pageImgHTML(f, i, lang, i < 2)).join("");
    const folderOk = isReal(a.driveFolder);

    const bar = `
      <div class="viewer-bar" style="${pVars(p)}">
        <div class="container">
          <div class="viewer-title">
            <a class="icon-btn" href="#/${lang}/preview" aria-label="${esc(t(lang, "back"))}"><i class="ph ph-arrow-left" aria-hidden="true"></i></a>
            <div style="min-width:0">
              <h1><span class="swatch" aria-hidden="true"></span>${esc(p.name[lang])}</h1>
              <small>${esc(t(lang, "pages", { n: files.length }))} &middot; ${esc(C.fileFormat.label)} ${esc(C.fileFormat.spec)}</small>
            </div>
          </div>
          <div class="segmented" role="group" aria-label="View mode">
            <button type="button" data-mode="pc" aria-pressed="${mode === "pc"}"><i class="ph ph-desktop" aria-hidden="true"></i>${esc(t(lang, "pcView"))}</button>
            <button type="button" data-mode="mobile" aria-pressed="${mode === "mobile"}"><i class="ph ph-device-mobile" aria-hidden="true"></i>${esc(t(lang, "mobileView"))}</button>
          </div>
          <div class="viewer-tools">
            <a class="btn btn-ghost" href="${esc(folderOk ? a.driveFolder : "#")}" ${folderOk ? 'target="_blank" rel="noopener"' : 'aria-disabled="true"'}><i class="ph ph-google-drive-logo" aria-hidden="true"></i>${esc(folderOk ? t(lang, "downloadFolder") : t(lang, "comingSoon"))}</a>
          </div>
        </div>
      </div>`;

    let body;
    if (mode === "pc") {
      body = `
        <div class="pc-layout">
          <nav class="section-nav" aria-label="${esc(t(lang, "sectionsLabel"))}">
            <div class="section-nav-label">${esc(t(lang, "sectionsLabel"))}</div>
            <ol>${secs.map((s) => `<li><button type="button" data-jump="${s.i}"><span class="num">${String(s.i + 1).padStart(2, "0")}</span>${esc(s.label)}</button></li>`).join("")}</ol>
          </nav>
          ${storePage(p, lang, stack, "pc")}
        </div>`;
    } else {
      const shareUrl = `${siteBase()}#/${lang}/preview/${pid}?view=mobile`;
      body = `
        <div class="mobile-layout">
          <div class="device">
            <div class="device-screen" data-scroller="screen">
              <div class="device-pad" aria-hidden="true"></div>
              ${storePage(p, lang, stack, "mobile")}
            </div>
          </div>
          <div class="mobile-side">
            <div class="qr-card">
              <h2>${esc(t(lang, "scanTitle"))}</h2>
              <p>${esc(t(lang, "scanDesc"))}</p>
              <div class="qr-box" id="qr" role="img" aria-label="QR code"></div>
              <div class="qr-url">${esc(shareUrl)}</div>
              <div class="qr-actions">
                <button type="button" class="btn btn-primary" data-copy="${esc(shareUrl)}"><i class="ph ph-link" aria-hidden="true"></i>${esc(t(lang, "copyLink"))}</button>
                ${folderOk ? `<a class="btn btn-ghost" href="${esc(a.driveFolder)}" target="_blank" rel="noopener"><i class="ph ph-google-drive-logo" aria-hidden="true"></i>${esc(t(lang, "downloadFolder"))}</a>` : ""}
              </div>
            </div>
            <div>
              <div class="section-nav-label">${esc(t(lang, "sectionsLabel"))}</div>
              <div class="chip-nav">${secs.map((s) => `<button type="button" data-jump="${s.i}">${esc(s.label)}</button>`).join("")}</div>
            </div>
          </div>
        </div>`;
    }

    app.innerHTML = `
      <div style="${pVars(p)}">
        ${bar}
        <section class="viewer-body"><div class="container">${body}</div></section>
      </div>`;

    // Mode toggle without a full route change (keeps the URL shareable).
    app.querySelectorAll("[data-mode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = btn.dataset.mode;
        if (m === mode) return;
        history.replaceState(null, "", `#/${lang}/preview/${pid}?view=${m}`);
        render({ keepScroll: false });
      });
    });

    if (mode === "mobile") drawQR(`${siteBase()}#/${lang}/preview/${pid}?view=mobile`);
    app.querySelectorAll("[data-copy]").forEach((b) =>
      b.addEventListener("click", async () => toast((await copyText(b.dataset.copy)) ? t(lang, "copied") : b.dataset.copy))
    );

    setupImages(lang, mode);
  }

  function drawQR(url) {
    const box = document.getElementById("qr");
    if (!box) return;
    if (typeof window.qrcode !== "function") {
      box.innerHTML = `<i class="ph ph-qr-code" style="font-size:64px;color:#16201A" aria-hidden="true"></i>`;
      return;
    }
    const qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();
    box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  }

  // Lazy loading, Drive fallback, error + retry, section tracking.
  function setupImages(lang, mode) {
    const screen = app.querySelector('[data-scroller="screen"]');
    const root = mode === "mobile" && screen && getComputedStyle(screen).overflowY === "auto" ? screen : null;
    const figs = Array.from(app.querySelectorAll(".page-img"));

    function load(fig) {
      const img = fig.querySelector("img");
      fig.classList.add("is-loading");
      fig.classList.remove("is-error");
      const err = fig.querySelector(".img-error");
      if (err) err.remove();
      fig.dataset.started = "1";
      fetchImage(img, img.dataset.id, C.image.pageWidth, fig.dataset.idx < 2).then((ok) => {
        fig.classList.remove("is-loading");
        if (ok) { fig.classList.add("is-loaded"); return; }
        fig.classList.add("is-error");
        fig.insertAdjacentHTML("beforeend", `
          <div class="img-error"><i class="ph ph-image-broken" aria-hidden="true"></i>
            <span>${esc(t(lang, "loadError"))}</span>
            <button type="button" class="btn btn-ghost"><i class="ph ph-arrow-clockwise" aria-hidden="true"></i>${esc(t(lang, "retry"))}</button>
          </div>`);
        fig.querySelector(".img-error button").addEventListener("click", () => load(fig));
      });
    }

    const lazy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !e.target.dataset.started) { load(e.target); lazy.unobserve(e.target); }
      });
    }, { root, rootMargin: "1600px 0px" });

    figs.forEach((fig) => {
      if (fig.querySelector("img").dataset.eager) load(fig);
      else lazy.observe(fig);
    });

    // Active section highlight
    const navBtns = Array.from(app.querySelectorAll("[data-jump]"));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const idx = e.target.dataset.idx;
        navBtns.forEach((b) => b.setAttribute("aria-current", String(b.dataset.jump === idx)));
      });
    }, { root, rootMargin: "-35% 0px -60% 0px" });
    figs.forEach((f) => spy.observe(f));

    const detail = app.querySelector("[data-detail]");
    const expandBtn = app.querySelector("[data-expand]");
    function setExpanded(open) {
      if (!detail) return;
      detail.classList.toggle("is-collapsed", !open);
      expandBtn.setAttribute("aria-expanded", String(open));
      expandBtn.querySelector("[data-label]").textContent = t(lang, open ? "storeCollapse" : "storeExpand");
    }
    if (expandBtn) expandBtn.addEventListener("click", () => {
      const open = detail.classList.contains("is-collapsed");
      setExpanded(open);
      if (!open) {
        const tabs = app.querySelector(".ss-tabs");
        if (root) root.scrollTo({ top: tabs.offsetTop, behavior: "smooth" });
        else tabs.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    navBtns.forEach((b) => b.addEventListener("click", () => {
      const idx = Number(b.dataset.jump);
      setExpanded(true);
      // Make sure everything above the target is loading so the jump lands close.
      figs.slice(0, idx + 1).forEach((f) => { if (!f.dataset.started) load(f); });
      const target = figs[idx];
      if (root) root.scrollTo({ top: target.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 44, behavior: "smooth" });
      else target.scrollIntoView({ behavior: "smooth", block: "start" });
    }));

    cleanup.push(() => { lazy.disconnect(); spy.disconnect(); });
  }

  /* ---------------------------------------------------------- Level 3-B */
  function viewDownload(lang) {
    const prods = productsFor(lang);
    document.title = `${t(lang, "downloadTitle")} | ${C.brand.name}`;
    const totalFiles = prods.reduce((n, p) => n + (assetOf(lang, p.id).files || []).length, 0);
    const totalMB = round1(prods.reduce((n, p) => n + (assetOf(lang, p.id).sizeMB || 0), 0));
    const bLang = C.bundles[lang];
    const bAll = C.bundles.all;

    const bundle = `
      <article class="dl-card is-bundle reveal" style="--i:2">
        <span class="bundle-icon" aria-hidden="true"><i class="ph ph-package"></i></span>
        <div style="display:flex;flex-direction:column;gap:10px">
          <h2>${esc(t(lang, "bundleTitle"))}</h2>
          <p>${esc(t(lang, "bundleDesc"))}</p>
        </div>
        <div class="bundle-meta">
          <span class="badge">${esc(C.fileFormat.label)}</span>
          <span class="badge">${esc(C.fileFormat.spec)}</span>
          <span class="badge">${esc(t(lang, "files", { n: totalFiles }))}</span>
          <span class="badge">${esc(t(lang, "sizeMB", { n: totalMB }))}</span>
        </div>
        <div class="bundle-actions">
          ${linkBtn(bLang, "btn btn-light", "ph-google-drive-logo", t(lang, "openDrive"), lang)}
          ${linkBtn(bAll, "btn btn-outline-light", "ph-globe-simple", t(lang, "bundleAll"), lang)}
        </div>
      </article>`;

    const others = C.languages.filter((l) => l.code !== lang).map((l) => l.code);
    const cards = prods.map((p, i) => {
      const a = assetOf(lang, p.id);
      const files = (a.files || []).map((f) => `
        <li><a href="${esc(imgUrl(f.id, "download"))}" target="_blank" rel="noopener" title="${esc(f.name)}">
          <span>${esc((C.sections[f.section] || {})[lang] || f.section)}</span>
          <span class="kb">${f.kb >= 1000 ? round1(f.kb / 1024) + " MB" : f.kb + " KB"}</span>
          <i class="ph ph-download-simple" aria-hidden="true"></i>
        </a></li>`).join("");
      return `
        <article class="dl-card reveal" style="--i:${i + 3};${pVars(p)}">
          <div class="dl-head">
            <div class="dl-thumb">${pimg(p, "")}</div>
            <div class="dl-names">
              <h3 class="dl-name"><span class="swatch" aria-hidden="true"></span>${esc(p.name[lang])}</h3>
              <div class="dl-alt">${others.map((c) => `<div lang="${c}">${esc(p.name[c])}</div>`).join("")}</div>
            </div>
          </div>
          <div class="badges">
            <span class="badge is-format">${esc(C.fileFormat.label)}</span>
            <span class="badge">${esc(C.fileFormat.spec)}</span>
            <span class="badge">${esc(t(lang, "files", { n: a.files.length }))}</span>
            <span class="badge">${esc(t(lang, "sizeMB", { n: a.sizeMB }))}</span>
          </div>
          <div class="dl-actions">
            ${linkBtn(a.driveFolder, "btn btn-primary", "ph-google-drive-logo", t(lang, "openDrive"), lang)}
          </div>
          <details class="file-list">
            <summary>${esc(t(lang, "sectionsLabel"))} (${a.files.length})<i class="ph ph-caret-down" aria-hidden="true"></i></summary>
            <ol>${files}</ol>
          </details>
        </article>`;
    }).join("");

    app.innerHTML = `
      <section class="view">
        <div class="container">
          ${crumbs(lang, [`<span>${esc(t(lang, "downloadTitle"))}</span>`])}
          <div class="grid-head reveal" style="--i:1">
            <h1 class="h-section">${esc(t(lang, "downloadGridTitle"))}</h1>
          </div>
          <div class="dl-grid">${bundle}${cards}</div>
        </div>
      </section>`;
  }

  function linkBtn(url, cls, icon, label, lang) {
    if (!isReal(url)) {
      return `<a class="${cls}" aria-disabled="true" href="#"><i class="ph ph-clock" aria-hidden="true"></i>${esc(t(lang, "comingSoon"))}</a>`;
    }
    return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener"><i class="ph ${icon}" aria-hidden="true"></i>${esc(label)}</a>`;
  }

  /* ---------------------------------------------------------------- 404 */
  function viewNotFound(lang) {
    const l = lang || DEFAULT_LANG;
    document.title = `${t(l, "notFound")} | ${C.brand.name}`;
    app.innerHTML = `
      <section class="view"><div class="container">
        <div class="empty reveal">
          <i class="ph ph-compass" aria-hidden="true"></i>
          <h1 class="h-section">${esc(t(l, "notFound"))}</h1>
          <a class="btn btn-primary" href="#/${lang || ""}"><i class="ph ph-arrow-left" aria-hidden="true"></i>${esc(t(l, "home"))}</a>
        </div>
      </div></section>`;
  }

  /* ------------------------------------------------------------- router */
  let lastKey = "";
  function render(opts = {}) {
    cleanup.forEach((fn) => fn());
    cleanup = [];
    const { parts, params } = parseRoute();
    const lang = LANG_CODES.includes(parts[0]) ? parts[0] : null;
    renderChrome(lang, parts);

    document.body.dataset.view =
      !parts.length ? "landing" :
      !lang ? "notfound" :
      parts.length === 1 ? "hub" :
      parts[1] === "preview" ? (parts.length === 3 ? "viewer" : "gallery") :
      parts[1] === "download" ? "download" : "notfound";

    if (!parts.length) viewLanding();
    else if (!lang) viewNotFound(null);
    else if (parts.length === 1) viewHub(lang);
    else if (parts[1] === "preview" && parts.length === 2) viewPreviewGrid(lang);
    else if (parts[1] === "preview" && parts.length === 3) viewViewer(lang, parts[2], params);
    else if (parts[1] === "download" && parts.length === 2) viewDownload(lang);
    else viewNotFound(lang);

    // Thumbnails go through the same throttled loader as page images.
    const thumbs = Array.from(app.querySelectorAll("img[data-thumb]"));
    const thumbIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        thumbIO.unobserve(e.target);
        const img = e.target;
        fetchImage(img, img.dataset.thumb, 600, true).then((ok) => img.classList.add(ok ? "is-loaded" : "is-error"));
      });
    }, { rootMargin: "600px" });
    thumbs.forEach((img) => thumbIO.observe(img));
    cleanup.push(() => thumbIO.disconnect());

    // Scroll to top when the page (not just the language) changes.
    const key = parts.slice(1).join("/");
    if (!opts.keepScroll || key !== lastKey) window.scrollTo(0, 0);
    lastKey = key;
  }

  window.addEventListener("hashchange", () => render({ keepScroll: true }));
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const { parts } = parseRoute();
    if (parts[1] === "preview" && parts.length === 3) location.hash = `#/${parts[0]}/preview`;
  });

  render();
})();
