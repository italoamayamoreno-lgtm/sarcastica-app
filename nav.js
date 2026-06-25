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

// Links visibles por rol — en orden del proceso
const NAV_LINKS = {
  ventas:      ['inventario','pedidos','clientes'],
  produccion:  ['produccion'],
  operaciones: ['inventario','pedidos','validar','produccion','empaque','ruta','clientes'],
  directora:   ['inventario','pedidos','validar','produccion','empaque','ruta','clientes'],
};

const NAV_LABELS = {
  inventario: 'Inventario',
  pedidos:    'Pedidos',
  validar:    'Validar Pagos',
  produccion: 'Producción',
  empaque:    'Empaque',
  ruta:       'Ruta',
  clientes:   'CRM Clientes',
};

const NAV_HREFS = {
  inventario: 'inventario.html',
  pedidos:    'pedidos.html',
  validar:    'validar.html',
  produccion: 'produccion.html',
  empaque:    'empaque.html',
  ruta:       'ruta.html',
  clientes:   'clientes.html',
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

      const current = location.pathname.split('/').pop().replace('.html','') || 'inventario';
      const links = NAV_LINKS[userData.rol] || [];

      // Activar/ocultar links
      document.querySelectorAll('.nav-link').forEach(a => {
        const p = a.dataset.page;
        if (!links.includes(p)) {
          a.style.display = 'none';
        } else if (p === current) {
          a.classList.add('active');
        }
      });

      // Rol label
      const rolEl = document.getElementById('nav-rol');
      if (rolEl) rolEl.textContent = userData.nombre || userData.email.split('@')[0];

      // Salir
      const btnSalir = document.getElementById('btn-salir');
      if (btnSalir) {
        btnSalir.onclick = async () => { await signOut(auth); window.location.href = 'index.html'; };
      }

      // Menú hamburguesa solo para directora
      if (userData.rol === 'directora') {
        const menuBtn = document.getElementById('nav-menu-btn');
        const menuDropdown = document.getElementById('nav-menu-dropdown');
        if (menuBtn && menuDropdown) {
          menuBtn.style.display = 'flex';
          menuBtn.onclick = (e) => {
            e.stopPropagation();
            menuDropdown.classList.toggle('open');
          };
          document.addEventListener('click', () => menuDropdown.classList.remove('open'));
        }
      }

      resolve(userData);
    });
  });
}
