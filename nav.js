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

const NAV_LINKS = {
  directora:   ['dashboard','pedidos','inventario','produccion','empaque','ruta','clientes','mermas'],
  operaciones: ['pedidos','inventario','produccion','empaque','ruta','clientes','mermas'],
  ventas:      ['pedidos','inventario','clientes'],
  produccion:  ['produccion','mermas'],
};

export async function initPage(allowedRoles = null) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.href = 'index.html'; return; }

      const snap = await getDoc(doc(db, 'usuarios', user.uid));
      if (!snap.exists()) { window.location.href = 'index.html'; return; }

      const userData = { uid: user.uid, email: user.email, ...snap.data() };

      if (allowedRoles && !allowedRoles.includes(userData.rol)) {
        window.location.href = 'index.html'; return;
      }

      const current = location.pathname.split('/').pop().replace('.html','') || 'dashboard';
      const links = NAV_LINKS[userData.rol] || [];

      document.querySelectorAll('.nav-link').forEach(a => {
        const p = a.dataset.page;
        if (!links.includes(p)) {
          a.style.display = 'none';
        } else if (p === current) {
          a.classList.add('active');
        }
      });

      const rolEl = document.getElementById('nav-rol');
      if (rolEl) rolEl.textContent = userData.rol;

      const btnSalir = document.getElementById('btn-salir');
      if (btnSalir) {
        btnSalir.onclick = async () => {
          await signOut(auth);
          window.location.href = 'index.html';
        };
      }

      resolve(userData);
    });
  });
}
