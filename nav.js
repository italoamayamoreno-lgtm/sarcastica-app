// nav.js — autenticación + protección de ruta
// El HTML de la nav va hardcodeado en cada página para evitar parpadeo

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
  directora:   ['dashboard','pedidos','inventario','produccion','empaque','ruta','clientes'],
  operaciones: ['pedidos','inventario','produccion','empaque','ruta','clientes'],
  ventas:      ['pedidos','inventario','clientes'],
  produccion:  ['produccion','mermas'],
};

const LABELS = {
  dashboard:  'Dashboard',
  pedidos:    'Pedidos',
  inventario: 'Inventario',
  produccion: 'Producción',
  empaque:    'Empaque',
  ruta:       'Ruta',
  clientes:   'Clientes',
  mermas:     'Mermas',
};

export async function initPage(allowedRoles = null) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) { window.location.href = 'index.html'; return; }

      const snap = await getDoc(doc(db, 'usuarios', user.uid));
      if (!snap.exists()) { window.location.href = 'index.html'; return; }

      const userData = { uid: user.uid, email: user.email, ...snap.data() };

      if (allowedRoles && !allowedRoles.includes(userData.rol)) {
        window.location.href = 'index.html'; return;
      }

      // Activar links del rol y marcar activo
      const current = location.pathname.split('/').pop().replace('.html','') || 'index';
      const links = NAV_LINKS[userData.rol] || [];

      document.querySelectorAll('.nav-link').forEach(a => {
        const page = a.dataset.page;
        if (!links.includes(page)) {
          a.style.display = 'none';
        } else if (page === current) {
          a.classList.add('active');
        }
      });

      // Mostrar rol
      const rolEl = document.getElementById('nav-rol');
      if (rolEl) rolEl.textContent = userData.rol;

      // Logout
      document.getElementById('btn-salir').onclick = async () => {
        await signOut(auth);
        window.location.href = 'index.html';
      };

      // Mostrar nav (estaba oculto para evitar flash)
      const nav = document.getElementById('app-nav');
      if (nav) nav.style.opacity = '1';

      resolve(userData);
    });
  });
}
