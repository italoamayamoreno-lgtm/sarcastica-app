// toast.js — Notificaciones Sarcástica OS
const STYLES = `
#sc-toast-wrap{position:fixed;top:64px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;}
.sc-toast{display:flex;align-items:flex-start;gap:10px;background:#000;color:#fff;border:1.5px solid #333;border-radius:10px;padding:12px 16px;min-width:280px;max-width:380px;box-shadow:0 8px 32px rgba(0,0,0,.35);font-family:'Poppins',sans-serif;font-size:12px;pointer-events:auto;animation:scIn .25s ease;transition:opacity .3s;}
.sc-toast.hide{opacity:0;}
.sc-toast-icon{font-size:16px;flex-shrink:0;margin-top:1px;}
.sc-toast-body{flex:1;}
.sc-toast-title{font-weight:700;font-size:12px;margin-bottom:2px;}
.sc-toast-msg{color:#aaa;font-size:11px;line-height:1.4;}
.sc-toast-close{background:none;border:none;color:#555;font-size:18px;cursor:pointer;padding:0;line-height:1;flex-shrink:0;}
.sc-toast-close:hover{color:#fff;}
.sc-toast.success{border-color:#3B6D11;background:#0a1505;}
.sc-toast.success .sc-toast-icon{color:#6db83a;}
.sc-toast.error{border-color:#A32D2D;background:#1a0505;}
.sc-toast.error .sc-toast-icon{color:#e05555;}
.sc-toast.warn{border-color:#854F0B;background:#1a0e05;}
.sc-toast.warn .sc-toast-icon{color:#d4842a;}
.sc-toast.info{border-color:#cca99d;background:#0d0d0d;}
.sc-toast.info .sc-toast-icon{color:#e1c4c1;}
@keyframes scIn{from{opacity:0;transform:translateX(40px);}to{opacity:1;transform:translateX(0);}}
`;
function init(){
  if(document.getElementById('sc-toast-wrap')) return;
  const s=document.createElement('style'); s.textContent=STYLES; document.head.appendChild(s);
  const w=document.createElement('div'); w.id='sc-toast-wrap'; document.body.appendChild(w);
}
function show(type,title,msg,ms=4500){
  init();
  const ICONS={success:'✓',error:'✕',warn:'⚠',info:'ℹ'};
  const t=document.createElement('div');
  t.className=`sc-toast ${type}`;
  t.innerHTML=`<span class="sc-toast-icon">${ICONS[type]}</span><div class="sc-toast-body"><div class="sc-toast-title">${title}</div>${msg?`<div class="sc-toast-msg">${msg}</div>`:''}</div><button class="sc-toast-close" onclick="this.parentElement.remove()">×</button>`;
  document.getElementById('sc-toast-wrap').appendChild(t);
  setTimeout(()=>{t.classList.add('hide');setTimeout(()=>t.remove(),300);},ms);
}
export const toast={
  success:(t,m,ms)=>show('success',t,m,ms),
  error:(t,m,ms)=>show('error',t,m,ms),
  warn:(t,m,ms)=>show('warn',t,m,ms),
  info:(t,m,ms)=>show('info',t,m,ms),
};
