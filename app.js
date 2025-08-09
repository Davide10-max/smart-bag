// SmartBag PWA - app.js (simulated data mode)

let simulate = true;
let simState = {
  battery: 78,
  weight: 3.4,
  items: [
    {id:'t1', name:'Portafoglio', present:true},
    {id:'t2', name:'Chiavi', present:true},
    {id:'t3', name:'Astuccio', present:false}
  ]
};

function setBattery(v){
  const fill = document.getElementById('battery-fill');
  const pct = document.getElementById('battery-percent');
  const w = Math.max(0, Math.min(100, Math.round(v)));
  fill.style.width = w+'%';
  pct.textContent = w+'%';
}

function setWeight(w){
  const circle = document.getElementById('weight-circle');
  const text = document.getElementById('weight-text');
  const pct = Math.max(0, Math.min(100, Math.round((w/10)*100)));
  circle.setAttribute('stroke-dasharray', pct + ',100');
  text.textContent = w.toFixed(1) + ' kg';
}

function renderItems(items){
  const ul = document.getElementById('items-list');
  ul.innerHTML='';
  items.forEach(it=>{
    const li = document.createElement('li');
    const left = document.createElement('div'); left.className='items-name';
    const dot = document.createElement('div'); dot.className='dot ' + (it.present? 'present':'missing');
    const name = document.createElement('div'); name.textContent = it.name;
    left.appendChild(dot); left.appendChild(name);
    const status = document.createElement('div'); status.textContent = it.present? 'Presente':'Manca';
    li.appendChild(left); li.appendChild(status);
    ul.appendChild(li);
  });
}

function updateUIFromState(){
  setBattery(simState.battery);
  setWeight(simState.weight);
  renderItems(simState.items);
}

function randomFluctuate(){
  simState.battery = Math.max(30, simState.battery - Math.random()*2);
  simState.weight = Math.max(0, Math.min(9.5, simState.weight + (Math.random()-0.5)*0.4));
  if(Math.random() < 0.25) {
    const idx = Math.floor(Math.random()*simState.items.length);
    simState.items[idx].present = !simState.items[idx].present;
  }
  updateUIFromState();
  checkAlerts();
}

function checkAlerts(){
  const missing = simState.items.filter(i=>!i.present);
  if(missing.length > 0){
    // small banner in-page
    showBanner('Manca: ' + missing.map(m=>m.name).join(', '));
  } else {
    clearBanner();
  }
  if(simState.battery < 35){
    showBanner('Batteria zaino bassa');
  }
}

function showBanner(text){
  let b = document.getElementById('banner');
  if(!b){
    b = document.createElement('div'); b.id='banner';
    b.style.cssText = 'position:fixed;left:12px;right:12px;bottom:86px;background:#fff3f2;border:1px solid #ffdddd;padding:10px;border-radius:10px;text-align:center;z-index:9999';
    document.body.appendChild(b);
  }
  b.textContent = text;
}
function clearBanner(){ const b=document.getElementById('banner'); if(b) b.remove(); }

document.addEventListener('DOMContentLoaded', ()=>{
  updateUIFromState();
  let t = setInterval(()=>{ if(simulate) randomFluctuate(); }, 4500);

  const scanBtn = document.getElementById('scan-btn');
  scanBtn.addEventListener('click', ()=>{
    simulate = false;
    randomFluctuate();
    setTimeout(()=> simulate=true, 6000);
  });

  const simToggle = document.getElementById('simulate-toggle');
  simToggle.addEventListener('click', ()=>{
    simulate = !simulate;
    simToggle.textContent = simulate? 'Simula' : 'Simulazione OFF';
  });

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').then(()=>{ console.log('Service Worker registrato'); }).catch(()=>{});
  }
});
