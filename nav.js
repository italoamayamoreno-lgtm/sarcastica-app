// nav.js — componente de navegación compartido
// Importar en cada página: <script type="module" src="nav.js"></script>

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

// Menú por rol
const NAV_ITEMS = {
  directora:   [
    { href:'dashboard.html',  icon:'⬛', label:'Dashboard' },
    { href:'pedidos.html',    icon:'📋', label:'Pedidos' },
    { href:'inventario.html', icon:'📦', label:'Inventario' },
    { href:'produccion.html', icon:'🔧', label:'Producción' },
    { href:'empaque.html',    icon:'📫', label:'Empaque' },
    { href:'ruta.html',       icon:'🚚', label:'Ruta' },
    { href:'clientes.html',   icon:'👤', label:'Clientes' },
  ],
  operaciones: [
    { href:'pedidos.html',    icon:'📋', label:'Pedidos' },
    { href:'inventario.html', icon:'📦', label:'Inventario' },
    { href:'produccion.html', icon:'🔧', label:'Producción' },
    { href:'empaque.html',    icon:'📫', label:'Empaque' },
    { href:'ruta.html',       icon:'🚚', label:'Ruta' },
    { href:'clientes.html',   icon:'👤', label:'Clientes' },
  ],
  ventas: [
    { href:'pedidos.html',    icon:'📋', label:'Pedidos' },
    { href:'inventario.html', icon:'📦', label:'Inventario' },
    { href:'clientes.html',   icon:'👤', label:'Clientes' },
  ],
  produccion: [
    { href:'produccion.html', icon:'🔧', label:'Producción' },
    { href:'mermas.html',     icon:'⚠️', label:'Mermas' },
  ],
};

export async function initPage(allowedRoles = null) {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = 'index.html';
        return;
      }
      const snap = await getDoc(doc(db, 'usuarios', user.uid));
      if (!snap.exists()) {
        window.location.href = 'index.html';
        return;
      }
      const userData = { uid: user.uid, email: user.email, ...snap.data() };

      if (allowedRoles && !allowedRoles.includes(userData.rol)) {
        window.location.href = 'index.html';
        return;
      }

      renderNav(userData);
      resolve(userData);
    });
  });
}

function renderNav(user) {
  const items = NAV_ITEMS[user.rol] || [];
  const current = location.pathname.split('/').pop() || 'index.html';

  const nav = document.createElement('nav');
  nav.id = 'app-nav';
  nav.innerHTML = `
    <style>
      #app-nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 200;
        background: #000;
        display: flex; align-items: center;
        padding: 0 20px;
        height: 52px;
        gap: 4px;
        border-bottom: 2px solid #e1c4c1;
        font-family: 'Poppins', sans-serif;
      }
      #app-nav .nav-brand {
        font-size: 14px; font-weight: 800; color: #f1e8df;
        letter-spacing: -.3px; margin-right: 20px; white-space: nowrap;
      }
      #app-nav .nav-brand span { color: #cca99d; }
      #app-nav .nav-items {
        display: flex; gap: 2px; flex: 1; overflow-x: auto;
      }
      #app-nav .nav-items::-webkit-scrollbar { display: none; }
      #app-nav a.nav-link {
        padding: 6px 12px; border-radius: 6px;
        font-size: 12px; font-weight: 500; color: #888;
        text-decoration: none; white-space: nowrap;
        transition: background .15s, color .15s;
      }
      #app-nav a.nav-link:hover { background: #111; color: #f1e8df; }
      #app-nav a.nav-link.active { background: #e1c4c1; color: #000; font-weight: 600; }
      #app-nav .nav-user {
        margin-left: auto; display: flex; align-items: center; gap: 10px;
        flex-shrink: 0;
      }
      #app-nav .nav-rol {
        font-size: 11px; color: #cca99d; text-transform: uppercase;
        letter-spacing: .06em; font-weight: 500;
      }
      #app-nav .btn-salir {
        background: none; border: 1px solid #333; color: #888;
        padding: 4px 10px; border-radius: 6px; cursor: pointer;
        font-family: 'Poppins', sans-serif; font-size: 11px;
        transition: border-color .15s, color .15s;
      }
      #app-nav .btn-salir:hover { border-color: #e1c4c1; color: #f1e8df; }
      body { padding-top: 52px !important; }
    </style>
    <div class="nav-brand">SARCÁSTICA<span>·</span>OS</div>
    <div class="nav-items">
      ${items.map(i => `
        <a href="${i.href}" class="nav-link ${current === i.href ? 'active' : ''}">
          ${i.label}
        </a>
      `).join('')}
    </div>
    <div class="nav-user">
      <span class="nav-rol">${user.rol}</span>
      <button class="btn-salir" id="btnSalir">Salir</button>
    </div>
  `;

  document.body.prepend(nav);
  document.getElementById('btnSalir').onclick = async () => {
    await signOut(auth);
    window.location.href = 'index.html';
  };
}
