import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyD5PAuTgNJed6ywyM3lTsN-VWtGfNprj_E",
  authDomain: "sarcastica-app.firebaseapp.com",
  projectId: "sarcastica-app",
  storageBucket: "sarcastica-app.firebasestorage.app",
  messagingSenderId: "629938299355",
  appId: "1:629938299355:web:c6d0d64902164504a347fe"
};
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
const ROL_LINKS = {
  ventas:      ['inventario','pedidos','clientes'],
  produccion:  ['inventario','produccion','empaque','ruta'],
  operaciones: ['inventario','pedidos','validar','produccion','empaque','ruta','clientes'],
  directora:   ['inventario','pedidos','validar','produccion','empaque','ruta','clientes'],
};
// Aplicar nombre y ocultar links desde localStorage ANTES del render
(function applyInstant() {
  try {
    const u = JSON.parse(localStorage.getItem('sc_user') || '{}');
    if (!u.rol) return;
    const el = document.getElementById('nav-rol');
    if (el) el.textContent = u.nombre || '';
    const links = ROL_LINKS[u.rol] || [];
    document.querySelectorAll('.nav-link').forEach(a => {
      if (!links.includes(a.dataset.page)) a.style.display = 'none';
    });
    // Ocultar hamburguesa si no es directora
    if (u.rol !== 'directora') {
      const btn = document.getElementById('nav-menu-btn');
      if (btn) btn.style.display = 'none';
    }
  } catch(e) {}
})();
export async function initPage(allowedRoles = null) {
  // Dropdown click — no depende de auth
  const menuBtn = document.getElementById('nav-menu-btn');
  const menuDrop = document.getElementById('nav-menu-dropdown');
  if (menuBtn && menuDrop) {
    menuBtn.onclick = (e) => { e.stopPropagation(); menuDrop.classList.toggle('open'); };
    document.addEventListener('click', () => menuDrop.classList.remove('open'));
  }
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) { localStorage.removeItem('sc_user'); window.location.href = 'index.html'; return; }
      let userData = JSON.parse(localStorage.getItem('sc_user') || 'null');
      if (!userData || userData.uid !== user.uid) {
        const snap = await getDoc(doc(db, 'usuarios', user.uid));
        if (!snap.exists()) { window.location.href = 'index.html'; return; }
        userData = { uid: user.uid, email: user.email, ...snap.data() };
        localStorage.setItem('sc_user', JSON.stringify(userData));
      }
      if (allowedRoles && !allowedRoles.includes(userData.rol)) { window.location.href = 'index.html'; return; }
      const btnSalir = document.getElementById('btn-salir');
      if (btnSalir) btnSalir.onclick = async () => {
        localStorage.removeItem('sc_user'); await signOut(auth); window.location.href = 'index.html';
      };
      resolve(userData);
    });
  });
}
