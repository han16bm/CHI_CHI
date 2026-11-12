// Thông tin dùng chung cho header/footer — chỉ cần sửa ở đây.
const SITE = {
  shortName: "Quỳnh Hương",
  fullName: "Đinh Thị Quỳnh Hương",
  studentId: "2552210185",
  className: "INF2501_2",
  course: "Nhập môn Công nghệ số và ứng dụng trí tuệ nhân tạo",
  courseCode: "INF2501",
  school: "Trường Đại học Sư phạm Nghệ thuật Trung ương",
  lecturer: "Vũ Việt Hoàng",
};

const PROJECTS = [
  { id: "bai-1", chapter: "Chương 1", title: "Thao tác cơ bản với tệp tin và thư mục" },
  { id: "bai-2", chapter: "Chương 2", title: "Tìm kiếm và đánh giá thông tin học thuật" },
  { id: "bai-3", chapter: "Chương 3", title: "Viết Prompt hiệu quả cho các tác vụ học tập" },
  { id: "bai-4", chapter: "Chương 4", title: "Sử dụng công cụ hợp tác trực tuyến cho dự án nhóm" },
  { id: "bai-5", chapter: "Chương 5", title: "Sử dụng AI tạo sinh để hỗ trợ sáng tạo nội dung" },
  { id: "bai-6", chapter: "Chương 6", title: "Sử dụng AI có trách nhiệm trong học tập và nghiên cứu" },
];

// Mỗi bài một chòm sao (khung 100 × 70): điểm, đường nối, chỉ số sao sáng.
const CONSTELLATIONS = {
  1: { // thư mục — hình chữ W như chòm Cassiopeia
    p: [[8, 24], [28, 50], [50, 28], [72, 52], [92, 22], [50, 62]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [5, 3]], big: 2 },
  2: { // kính lúp — tìm kiếm
    p: [[42, 10], [58, 16], [64, 32], [57, 46], [42, 51], [27, 45], [21, 30], [28, 15], [80, 64], [42, 31]],
    e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [3, 8]], big: 9 },
  3: { // khung thoại — viết prompt
    p: [[12, 12], [88, 12], [88, 46], [46, 46], [30, 62], [32, 46], [12, 46], [36, 29], [50, 29], [64, 29]],
    e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]], big: 8 },
  4: { // mạng lưới — hợp tác nhóm
    p: [[16, 18], [50, 6], [84, 20], [76, 58], [26, 60], [50, 34]],
    e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4]], big: 5 },
  5: { // nốt nhạc + ngôi sao — sáng tạo cùng AI
    p: [[38, 58], [38, 10], [58, 20], [56, 34], [28, 64], [20, 56], [30, 50], [78, 30], [70, 30], [86, 30], [78, 22], [78, 38]],
    e: [[0, 1], [1, 2], [2, 3], [0, 4], [4, 5], [5, 6], [6, 0], [8, 9], [10, 11]], big: 7 },
  6: { // khiên — AI có trách nhiệm
    p: [[50, 4], [82, 14], [78, 40], [50, 64], [22, 40], [18, 14], [36, 34], [46, 44], [64, 24]],
    e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [6, 7], [7, 8]], big: 7 },
};

function constellationSVG(n) {
  const c = CONSTELLATIONS[n];
  if (!c) return "";
  const lines = c.e.map(([a, b]) => `<line x1="${c.p[a][0]}" y1="${c.p[a][1]}" x2="${c.p[b][0]}" y2="${c.p[b][1]}"/>`).join("");
  const stars = c.p.map(([x, y], i) =>
    `<circle cx="${x}" cy="${y}" r="${i === c.big ? 2.6 : 1.5}"${i === c.big ? ' class="big"' : ""} style="animation-delay:${(-i * 0.7).toFixed(1)}s"/>`).join("");
  return `<svg viewBox="0 0 100 70" aria-hidden="true" focusable="false">${lines}${stars}</svg>`;
}

(function () {
  const body = document.body;
  const root = body.dataset.root || "";   // "../" cho các trang trong /projects/
  const page = body.dataset.page;          // about | projects | conclusion | bai-1..bai-6
  const logo = `${root}assets/img/logo.svg`;
  const inProjects = page === "projects" || page.startsWith("bai-");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Bầu trời: tinh vân + hạt nhiễu (CSS) và canvas sao
  body.insertAdjacentHTML("afterbegin", '<div class="cosmos" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>');

  const subItems = PROJECTS.map((p, i) =>
    `<li><a href="${root}projects/${p.id}.html"${page === p.id ? ' aria-current="page"' : ""}><b>0${i + 1}</b>${p.title}<small>${p.chapter}</small></a></li>`
  ).join("");
  const cur = (on) => (on ? ' aria-current="page"' : "");

  document.getElementById("site-header").outerHTML = `
  <a class="skip" href="#main">Bỏ qua điều hướng</a>
  <header class="site-header">
    <div class="container nav-bar">
      <a class="brand" href="${root}index.html"><img src="${logo}" alt="" width="40" height="40">${SITE.shortName}</a>
      <nav id="site-nav" aria-label="Điều hướng chính">
        <ul>
          <li><a href="${root}index.html"${cur(page === "about")}>Giới thiệu</a></li>
          <li class="has-sub"><a href="${root}projects.html"${cur(inProjects)}>Dự án</a><ul class="sub">${subItems}</ul></li>
          <li><a href="${root}conclusion.html"${cur(page === "conclusion")}>Tổng kết</a></li>
        </ul>
      </nav>
      <div class="nav-actions">
        <button class="music-toggle" type="button" aria-pressed="false" aria-label="Bật nhạc nền" title="Bật nhạc nền"><span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span></button>
        <button class="theme-toggle" type="button"></button>
        <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
      </div>
    </div>
  </header>`;

  document.getElementById("site-footer").outerHTML = `
  <section class="finale" aria-label="Lời kết">
    <div class="container">
      <span class="label" data-reveal>Vũ trụ vẫn tiếp tục</span>
      <p class="display" data-reveal style="--d:.1s">Mỗi giấc mơ bắt đầu từ <em>một nốt nhạc.</em></p>
      <p class="lead" data-reveal style="--d:.2s">Cảm ơn bạn đã dạo một vòng quanh vũ trụ nhỏ của mình.</p>
      <div class="btn-row center" data-reveal style="--d:.3s"><button class="btn to-top" type="button">Về đầu trang <span class="arrow">↑</span></button></div>
    </div>
  </section>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div class="footer-brand"><img src="${logo}" alt="" width="44" height="44">
          <div><strong>${SITE.fullName}</strong>Sư phạm Âm nhạc · Portfolio ${SITE.courseCode}</div>
        </div>
        <nav class="footer-nav" aria-label="Điều hướng chân trang">
          <a href="${root}index.html">Giới thiệu</a><a href="${root}projects.html">Dự án</a><a href="${root}conclusion.html">Tổng kết</a>
        </nav>
      </div>
      <div class="footer-info">
        <p><span>Mã sinh viên</span>${SITE.studentId}</p>
        <p><span>Lớp</span>${SITE.className}</p>
        <p><span>Giảng viên</span>${SITE.lecturer}</p>
        <p><span>Học phần</span>${SITE.course} (${SITE.courseCode})</p>
      </div>
      <div class="footer-bottom">© 2026 ${SITE.fullName} · ${SITE.school} · Nhạc nền không lời tự sinh bằng Web Audio API · Công cụ AI đã sử dụng được ghi rõ tại <a href="${root}conclusion.html#ai">trang Tổng kết</a>.</div>
    </div>
  </footer>`;

  // Menu
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Đóng" : "Menu";
    body.classList.toggle("menu-open", open);
  });
  // Giao diện: mặc định hồng – trắng; "dark" = vũ trụ tối. Lựa chọn được nhớ trong trình duyệt.
  const docEl = document.documentElement;
  const themeBtn = document.querySelector(".theme-toggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const paintThemeButton = () => {
    const dark = docEl.dataset.theme === "dark";
    themeBtn.textContent = dark ? "☀" : "☾";
    const label = dark ? "Chuyển sang giao diện hồng – trắng" : "Chuyển sang giao diện vũ trụ tối";
    themeBtn.setAttribute("aria-label", label);
    themeBtn.title = label;
    if (themeMeta) themeMeta.content = dark ? "#050711" : "#fdf6f9";
  };
  const applyTheme = () => {
    const dark = docEl.dataset.theme !== "dark";
    if (dark) docEl.dataset.theme = "dark"; else delete docEl.dataset.theme;
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) { /* trình duyệt chặn lưu trữ: chỉ đổi trong phiên này */ }
    paintThemeButton();
    document.dispatchEvent(new Event("themechange"));
  };
  // Hiệu ứng "lucid dream": vòng sáng óng ánh + sao lấp lánh bay lên từ nút bấm
  const dreamBurst = (x, y) => {
    const veil = document.createElement("div");
    veil.className = "dream-veil";
    veil.setAttribute("aria-hidden", "true");
    veil.style.setProperty("--tx", `${x}px`);
    veil.style.setProperty("--ty", `${y}px`);
    let sparks = "";
    for (let k = 0; k < 16; k++) {
      const a = Math.random() * 6.283, d = 60 + Math.random() * 220;
      sparks += `<i style="--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d - 60).toFixed(0)}px;--dl:${(Math.random() * 0.35).toFixed(2)}s;--sz:${(6 + Math.random() * 10).toFixed(0)}px">✦</i>`;
    }
    veil.innerHTML = `<b></b>${sparks}`;
    body.appendChild(veil);
    setTimeout(() => veil.remove(), 1700);
  };
  themeBtn.addEventListener("click", () => {
    const r = themeBtn.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    docEl.style.setProperty("--tx", `${x}px`);
    docEl.style.setProperty("--ty", `${y}px`);
    if (reduce) { applyTheme(); return; }
    if (document.startViewTransition) {
      docEl.classList.add("dreaming");
      const t = document.startViewTransition(() => { applyTheme(); dreamBurst(x, y); });
      t.finished.finally(() => docEl.classList.remove("dreaming"));
    } else {
      docEl.classList.add("theme-fade");
      applyTheme();
      dreamBurst(x, y);
      setTimeout(() => docEl.classList.remove("theme-fade"), 800);
    }
  });
  paintThemeButton();

  // ---------- Nhạc nền ----------
  const musicBtn = document.querySelector(".music-toggle");
  const store = (k, v) => { try { v === undefined ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* bỏ qua */ } };
  const recall = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const theme = () => (docEl.dataset.theme === "dark" ? "dark" : "light");
  let toastTimer = 0;
  const toast = (text) => {
    let el = document.querySelector(".music-toast");
    if (!el) { el = document.createElement("div"); el.className = "music-toast"; el.setAttribute("role", "status"); body.appendChild(el); }
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  };
  const paintMusic = () => {
    const playing = typeof Music !== "undefined" && Music.on;
    musicBtn.classList.toggle("playing", playing);
    musicBtn.setAttribute("aria-pressed", String(playing));
    const label = playing ? `Tắt nhạc nền (đang phát: ${Music.title})` : "Bật nhạc nền";
    musicBtn.setAttribute("aria-label", label); musicBtn.title = label;
  };
  const startMusic = () => { Music.start(theme()); paintMusic(); toast(`♪ Đang phát: ${Music.title}`); };
  if (typeof Music === "undefined") musicBtn.hidden = true;
  else {
    musicBtn.addEventListener("click", () => {
      if (Music.on) { Music.stop(); store("music"); paintMusic(); toast("Đã tắt nhạc nền"); }
      else { startMusic(); store("music", "on"); }
    });
    // Đã bật ở trang trước: trình duyệt cần một lần chạm/bấm mới cho phát tiếp
    if (recall("music") === "on") {
      const resumeOnce = (e) => {
        if (e.target.closest && e.target.closest(".music-toggle")) return;
        if (!Music.on) startMusic();
      };
      addEventListener("pointerdown", resumeOnce, { once: true });
      addEventListener("keydown", resumeOnce, { once: true });
    }
    document.addEventListener("themechange", () => {
      Music.setScene(theme());
      if (Music.on) { paintMusic(); toast(`♪ Chuyển sang: ${Music.title}`); }
    });
    document.addEventListener("visibilitychange", () => (document.hidden ? Music.pause() : Music.resume()));
  }

  // ---------- Hiệu ứng khi bấm: vòng sáng + sao/nốt nhạc ----------
  if (!reduce) {
    let lastBurst = 0;
    addEventListener("pointerdown", (e) => {
      if (e.target.closest(".theme-toggle, input, textarea, select")) return;
      const now = performance.now();
      if (now - lastBurst < 90) return;
      lastBurst = now;
      const el = document.createElement("div");
      el.className = "click-burst";
      el.setAttribute("aria-hidden", "true");
      el.style.left = `${e.clientX}px`; el.style.top = `${e.clientY}px`;
      const glyphs = ["✦", "♪", "✧", "♫", "✦", "·", "✧"];
      let html = "<b></b>";
      glyphs.forEach((g, k) => {
        const a = (k / glyphs.length) * 6.283 + Math.random() * 0.6, d = 22 + Math.random() * 26;
        html += `<i style="--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d - 10).toFixed(0)}px">${g}</i>`;
      });
      el.innerHTML = html;
      body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }, { passive: true });
  }

  const onScroll = () => header.classList.toggle("scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  document.querySelector(".to-top").addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));

  // Điều hướng trước/sau cho trang bài tập
  const pager = document.getElementById("pager");
  const i = PROJECTS.findIndex((p) => p.id === page);
  if (pager && i >= 0) {
    const prev = PROJECTS[i - 1], next = PROJECTS[i + 1];
    pager.innerHTML = `
      ${prev ? `<a class="pager-card prev" href="${prev.id}.html"><small>← Bài trước</small>Bài ${i}. ${prev.title}</a>` : "<span></span>"}
      <a class="btn back" href="../projects.html">Về trang Dự án</a>
      ${next ? `<a class="pager-card next" href="${next.id}.html"><small>Bài tiếp theo →</small>Bài ${i + 2}. ${next.title}</a>`
             : `<a class="pager-card next" href="../conclusion.html"><small>Tiếp theo →</small>Trang Tổng kết</a>`}`;
  }

  // Vẽ chòm sao vào các khung [data-cst]
  document.querySelectorAll("[data-cst]").forEach((el) => { el.innerHTML = constellationSVG(el.dataset.cst); });

  // Hiện dần khi cuộn
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

  // Mục lục trang bài tập: đánh dấu phần đang đọc
  const tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length) {
    const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) tocLinks.forEach((a) => a.classList.toggle("active", a.hash === "#" + en.target.id));
    }), { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll(".part[id]").forEach((s) => spy.observe(s));
  }

  // Ánh sáng theo chuột ở hero
  const hero = document.querySelector(".hero");
  if (hero && !reduce && matchMedia("(pointer: fine)").matches) {
    let raf = 0;
    hero.addEventListener("pointermove", (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        hero.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
        raf = 0;
      });
    });
  }

  starfield(reduce);

  const todos = document.querySelectorAll(".todo").length;
  if (todos) console.warn(`[Portfolio] Trang này còn ${todos} mục TODO cần hoàn thiện.`);
})();

// Canvas sao: ~30 khung hình/giây, dừng khi tab ẩn, đứng yên khi người dùng chọn giảm chuyển động.
function starfield(reduce) {
  const c = document.createElement("canvas");
  c.id = "starfield";
  c.setAttribute("aria-hidden", "true");
  document.body.prepend(c);
  const ctx = c.getContext("2d");
  let w = 0, h = 0, stars = [], shoot = null, last = 0, raf = 0;
  // Màu sao lấy từ biến CSS để đổi theo giao diện sáng/tối
  let tints = [], alphaK = 1, shootRGB = "255,255,255";
  const readTheme = () => {
    const cs = getComputedStyle(document.documentElement);
    tints = cs.getPropertyValue("--star-tints").trim().split("|");
    alphaK = parseFloat(cs.getPropertyValue("--star-alpha")) || 1;
    shootRGB = cs.getPropertyValue("--shoot").trim() || "255,255,255";
  };
  readTheme();
  document.addEventListener("themechange", () => {
    readTheme();
    for (const s of stars) s.c = tints[(Math.random() * tints.length) | 0];
    draw(performance.now());
  });

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(240, Math.round((w * h) / 7500));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.1 + 0.25,
      a: Math.random() * 0.55 + 0.2, t: Math.random() * 6.283, s: Math.random() * 1.5 + 0.4,
      z: Math.random() * 0.5 + 0.1, c: tints[(Math.random() * tints.length) | 0],
    }));
    draw(0);
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    const sy = scrollY;
    for (const s of stars) {
      const alpha = alphaK * (reduce ? s.a : s.a * (0.65 + 0.35 * Math.sin(s.t + (time / 1000) * s.s)));
      let y = (s.y - sy * s.z * 0.2) % h;
      if (y < 0) y += h;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgb(${s.c})`;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, 6.283);
      ctx.fill();
    }
    if (shoot) {
      const k = shoot.life / 46, len = 120;
      const x = shoot.x - shoot.life * 9, y = shoot.y + shoot.life * 4.2;
      const g = ctx.createLinearGradient(x, y, x + len, y - len * 0.47);
      g.addColorStop(0, `rgba(${shootRGB},0.9)`);
      g.addColorStop(1, `rgba(${shootRGB},0)`);
      ctx.globalAlpha = 1 - k;
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y - len * 0.47); ctx.stroke();
      if (++shoot.life > 46) shoot = null;
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (t - last < 33) return;
    last = t;
    if (!shoot && Math.random() < 0.004) shoot = { x: w * (0.4 + Math.random() * 0.6), y: h * Math.random() * 0.4, life: 0 };
    draw(t);
  }

  let timer = 0;
  addEventListener("resize", () => { clearTimeout(timer); timer = setTimeout(resize, 200); });
  resize();
  if (reduce) {
    addEventListener("scroll", () => requestAnimationFrame(() => draw(0)), { passive: true });
  } else {
    raf = requestAnimationFrame(loop);
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    });
  }
}
