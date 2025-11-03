// js/auth-state.js
import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

export async function initAuthUI() {
  // 1️⃣ Esperar a que los elementos del header estén disponibles
  const waitForHeader = () => new Promise(resolve => {
    const check = () => {
      const loginBtn = document.getElementById("btn-login");
      const signupBtn = document.getElementById("btn-signup");
      const logoutBtn = document.getElementById("btn-logout");
      const accountLink = document.getElementById("link-account");
      if (loginBtn && signupBtn && logoutBtn && accountLink) {
        resolve({ loginBtn, signupBtn, logoutBtn, accountLink });
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });

  const { loginBtn, signupBtn, logoutBtn, accountLink } = await waitForHeader();

  // 2️⃣ Escuchar el estado de autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginBtn.style.display = "none";
      signupBtn.style.display = "none";
      logoutBtn.style.display = "";
      accountLink.style.display = "";
    } else {
      loginBtn.style.display = "";
      signupBtn.style.display = "";
      logoutBtn.style.display = "none";
      accountLink.style.display = "none";
    }

    // Marcar el body como listo (hace visibles los botones)
    document.body.classList.add("auth-ready");
  });

  // 3️⃣ Cerrar sesión
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await signOut(auth);
    location.href = "index.html";
  });
}
