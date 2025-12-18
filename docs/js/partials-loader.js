// docs/js/partials-loader.js
export async function loadPartials() {
  // === 1. Cargar en paralelo (sin bloquear render)
  const headerFetch = fetch("partials/header.html").then(r => r.text());
  const footerFetch = fetch("partials/footer.html").then(r => r.text());
  const [headerHTML, footerHTML] = await Promise.all([headerFetch, footerFetch]);

  // === 2. Insertar instantáneamente sin reflow
  const headerPlaceholder = document.getElementById("header-placeholder");
  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = headerHTML;
  } else {
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
  }

  document.body.insertAdjacentHTML("beforeend", footerHTML);

  // === 3. Inicializar interacciones
  const burger = document.querySelector(".burger");
  const offcanvas = document.querySelector(".offcanvas");
  const closeBtn = offcanvas?.querySelector('button[aria-label="Cerrar"]');
  burger?.addEventListener("click", () => offcanvas.classList.add("open"));
  closeBtn?.addEventListener("click", () => offcanvas.classList.remove("open"));
  document.querySelectorAll(".offcanvas a").forEach(a =>
    a.addEventListener("click", () => offcanvas.classList.remove("open"))
  );

  // === 4. Marcar navegación activa
  const current = location.pathname.split("/").pop();
  document.querySelectorAll("nav.menu a, .offcanvas a").forEach(link => {
    const href = link.getAttribute("href");
    if (href && current && href.includes(current)) {
      link.setAttribute("aria-current", "page");
    }
  });

  // === 5. Marcar como listo
  document.body.classList.add("partials-ready");

  document.querySelector("header")?.classList.remove("loading");
}
