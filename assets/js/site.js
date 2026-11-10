// Thông tin dùng chung cho header/footer — chỉ cần sửa ở đây.
const SITE = {
  shortName: "Quỳnh Hương",
  fullName: "Đinh Thị Quỳnh Hương",
  studentId: "2552210185",
  className: "INF2501_2",
  course: "Nhập môn Công nghệ số và ứng dụng trí tuệ nhân tạo",
  courseCode: "INF2501",
  school: "Trường Đại học Sư phạm Nghệ thuật Trung ương",
};

const PROJECTS = [
  { id: "bai-1", chapter: "Chương 1", title: "Thao tác cơ bản với tệp tin và thư mục" },
  { id: "bai-2", chapter: "Chương 2", title: "Tìm kiếm và đánh giá thông tin học thuật" },
  { id: "bai-3", chapter: "Chương 3", title: "Viết Prompt hiệu quả cho các tác vụ học tập" },
  { id: "bai-4", chapter: "Chương 4", title: "Sử dụng công cụ hợp tác trực tuyến cho dự án nhóm" },
  { id: "bai-5", chapter: "Chương 5", title: "Sử dụng AI tạo sinh để hỗ trợ sáng tạo nội dung" },
  { id: "bai-6", chapter: "Chương 6", title: "Sử dụng AI có trách nhiệm trong học tập và nghiên cứu" },
];

(function () {
  const body = document.body;
  const root = body.dataset.root || "";   // "../" cho các trang trong /projects/
  const page = body.dataset.page;          // about | projects | conclusion | bai-1..bai-6
  const logo = `${root}assets/img/logo.svg`;
  const inProjects = page === "projects" || page.startsWith("bai-");

  const subItems = PROJECTS.map((p, i) =>
    `<li><a href="${root}projects/${p.id}.html"${page === p.id ? ' aria-current="page"' : ""}>Bài ${i + 1}. ${p.title}<small>${p.chapter}</small></a></li>`
  ).join("");
  const cur = (on) => (on ? ' aria-current="page"' : "");

  document.getElementById("site-header").outerHTML = `
  <a class="skip" href="#main">Bỏ qua điều hướng</a>
  <header class="site-header">
    <div class="container nav-bar">
      <a class="brand" href="${root}index.html"><img src="${logo}" alt="" width="40" height="40">${SITE.shortName}</a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" aria-label="Điều hướng chính">
        <ul>
          <li><a href="${root}index.html"${cur(page === "about")}>Giới thiệu</a></li>
          <li class="has-sub"><a href="${root}projects.html"${cur(inProjects)}>Dự án</a><ul class="sub">${subItems}</ul></li>
          <li><a href="${root}conclusion.html"${cur(page === "conclusion")}>Tổng kết</a></li>
        </ul>
      </nav>
    </div>
  </header>`;

  document.getElementById("site-footer").outerHTML = `
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
        <p><span>Học phần</span>${SITE.course} (${SITE.courseCode})</p>
      </div>
      <div class="footer-bottom">© 2026 ${SITE.fullName} · ${SITE.school} · Công cụ AI đã sử dụng được ghi rõ tại <a href="${root}conclusion.html#ai">trang Tổng kết</a>.</div>
    </div>
  </footer>`;

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Đóng" : "Menu";
  });

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

  const todos = document.querySelectorAll(".todo").length;
  if (todos) console.warn(`[Portfolio] Trang này còn ${todos} mục TODO cần hoàn thiện.`);
})();
