(() => {
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const topNav = document.getElementById("topNav");
  const search = document.getElementById("chapterSearch");
  const cards = [...document.querySelectorAll(".chapter-card")];
  const count = document.getElementById("searchCount");
  const noResults = document.getElementById("noResults");
  const backToTop = document.getElementById("backToTop");

  const savedTheme = localStorage.getItem("shaga-theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
  }

  themeToggle?.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("shaga-theme", body.classList.contains("dark") ? "dark" : "light");
  });

  menuToggle?.addEventListener("click", () => {
    const isOpen = topNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  topNav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      topNav.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  const updateSearch = () => {
    const term = (search?.value || "").trim().toLowerCase();
    let visible = 0;

    cards.forEach(card => {
      const text = `${card.textContent} ${card.dataset.search || ""}`.toLowerCase();
      const match = !term || text.includes(term);
      card.hidden = !match;
      if (match) visible += 1;
    });

    if (count) {
      count.textContent = term ? `${visible} chapter${visible === 1 ? "" : "s"} found` : "";
    }

    if (noResults) {
      noResults.hidden = visible !== 0;
    }

    document.querySelectorAll(".part-block").forEach(part => {
      const hasVisible = [...part.querySelectorAll(".chapter-card")].some(card => !card.hidden);
      part.hidden = !hasVisible;
    });
  };

  search?.addEventListener("input", updateSearch);

  const toggleBackToTop = () => {
    backToTop?.classList.toggle("visible", window.scrollY > 500);
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.addEventListener("keydown", event => {
    if (event.key === "/" && document.activeElement !== search) {
      event.preventDefault();
      search?.focus();
    }
  });
})();
