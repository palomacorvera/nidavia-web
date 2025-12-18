// js/newsletter.js
import { db } from "../data/firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// === AÑO EN FOOTER ===
const year = document.getElementById("y");
if (year) year.textContent = new Date().getFullYear();

// === CIERRE DEL MENÚ OFFCANVAS (si existe) ===
document.querySelectorAll(".offcanvas a").forEach(a =>
  a.addEventListener("click", () => {
    document.querySelector(".offcanvas")?.classList.remove("open");
  })
);

// === SUSCRIPCIÓN AL NEWSLETTER (GLOBAL) ===
const newsletter = document.querySelector(".newsletter");
if (newsletter) {
  const input = newsletter.querySelector("input[type='email']");
  const btn = newsletter.querySelector("button");

  btn?.addEventListener("click", async (e) => {
    e.preventDefault();
    const email = (input?.value || "").trim();

    if (!email || !email.includes("@")) {
      alert("Por favor, introduce un email válido.");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Enviando…";

    try {
      await addDoc(collection(db, "suscripciones"), {
        email,
        createdAt: serverTimestamp()
      });

      input.value = "";
      btn.textContent = "¡Suscrito!";
      btn.style.backgroundColor = "#22c55e"; // verde éxito
      setTimeout(() => {
        btn.textContent = "Suscribirme";
        btn.style.backgroundColor = "";
        btn.disabled = false;
      }, 2500);
      console.log("✅ Suscripción guardada en Firestore");
    } catch (err) {
      console.error("❌ Error al guardar suscripción:", err);
      alert("Ha ocurrido un error al guardar la suscripción.");
      btn.textContent = "Suscribirme";
      btn.disabled = false;
    }
  });
}
