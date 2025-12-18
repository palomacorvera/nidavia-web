// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// 🔥 Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAeo3HKZFK347upUD6jTG0RJSihBWLjTgY",
  authDomain: "nidavia-web.firebaseapp.com",
  projectId: "nidavia-web",
  storageBucket: "nidavia-web.appspot.com",
  messagingSenderId: "435373492249",
  appId: "1:435373492249:web:496b84947df01b3a474288",
  measurementId: "G-WD8RDEQ4Z9"
};

// Inicializa la app y exporta Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);