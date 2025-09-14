/* script.js - logika periodik & reaksi dengan efek visual + audio */
const elementData = [
  [1,"H","Hydrogen"],[2,"He","Helium"],[3,"Li","Lithium"],[4,"Be","Beryllium"],[5,"B","Boron"],[6,"C","Carbon"],
  [7,"N","Nitrogen"],[8,"O","Oxygen"],[9,"F","Fluorine"],[10,"Ne","Neon"],
  [11,"Na","Sodium"],[12,"Mg","Magnesium"],[13,"Al","Aluminium"],[14,"Si","Silicon"],[15,"P","Phosphorus"],
  [16,"S","Sulfur"],[17,"Cl","Chlorine"],[18,"Ar","Argon"],
  [19,"K","Potassium"],[20,"Ca","Calcium"],[26,"Fe","Iron"],
  [29,"Cu","Copper"],[30,"Zn","Zinc"],[35,"Br","Bromine"],[53,"I","Iodine"]
];

const periodicEl = document.getElementById('periodic');
const selected = [];
const selectedList = document.getElementById('selectedList');
const resultText = document.getElementById('resultText');

/* Render tabel periodik */
function renderPeriodic(){
  elementData.forEach(([z,s,name])=>{
    const d = document.createElement('div');
    d.className = 'el';
    d.title = `${name} (${z})`;
    d.innerHTML = `<div class="sym">${s}</div><div style="font-size:9px">${z}</div>`;
    d.addEventListener('click', ()=>{ toggleSelect({s,name}, d); });
    periodicEl.appendChild(d);
  });
}

function toggleSelect(el, dom){
  const idx = selected.findIndex(x=>x.s===el.s);
  if(idx >= 0){
    selected.splice(idx,1);
    dom?.classList.remove('selected');
  } else {
    selected.push(el);
    dom?.classList.add('selected');
  }
  updateSelectedUI();
}

function updateSelectedUI(){
  selectedList.innerHTML = '';
  selected.forEach((el,i)=>{
    const node = document.createElement('div'); node.className='sel-item';
    node.innerHTML = `${el.s} — ${el.name} <button class='btn ghost' data-i='${i}'>x</button>`;
    node.querySelector('button').addEventListener('click', ()=>{
      selected.splice(i,1);
      const gridItems = Array.from(periodicEl.children);
      const found = gridItems.find(n => n.querySelector('.sym')?.textContent === el.s);
      if(found) found.classList.remove('selected');
      updateSelectedUI();
    });
    selectedList.appendChild(node);
  });
}

/* Aturan reaksi realistis */
const reactionRules = [
  { match: ['H','O'], result: 'H₂O (Air)' },
  { match: ['Na','Cl'], result: 'NaCl (Garam dapur)' },
  { match: ['Fe','O'], result: 'Fe₂O₃ (Karat)' },
  { match: ['H','Cl'], result: 'HCl (Asam klorida)' },
  { match: ['C','O'], result: 'CO₂ (Karbon dioksida)' },
  { match: ['Cu','S'], result: 'CuS (Tembaga sulfida)' },
  { match: ['Zn','S'], result: 'ZnS (Seng sulfida)' }
];

function findReactionPair(a,b){
  for(const r of reactionRules){
    if(r.match.includes(a) && r.match.includes(b)) return r.result;
  }
  return null;
}

/* Tombol Reaksi */
document.getElementById('reactBtn').addEventListener('click', ()=>{
  if(selected.length === 0){ resultText.textContent = 'Belum ada unsur terpilih.'; return; }
  if(selected.length === 1){ resultText.textContent = 'Hanya 1 unsur, tidak ada reaksi.'; return; }

  const results = [];
  let anyReaction = false;
  for(let i=0;i<selected.length;i++){
    for(let j=i+1;j<selected.length;j++){
      const r = findReactionPair(selected[i].s, selected[j].s);
      if(r){
        results.push(`${selected[i].s} + ${selected[j].s} → ${r}`);
        anyReaction = true;
      } else {
        results.push(`${selected[i].s} + ${selected[j].s} → Tidak bereaksi`);
      }
    }
  }
  resultText.textContent = results.join("\n");

  if(anyReaction){
    playReactionSound(true);
    drawReactionEffect('green');
  } else {
    playReactionSound(false);
    drawReactionEffect('red');
  }
});

/* Tombol Clear */
document.getElementById('clearBtn').addEventListener('click', ()=>{
  selected.length = 0;
  Array.from(periodicEl.children).forEach(ch => ch.classList.remove('selected'));
  updateSelectedUI();
  resultText.textContent = 'Belum ada reaksi.';
});

/* Canvas Efek Visual */
const canvas = document.getElementById('viz');
const ctx = canvas.getContext && canvas.getContext('2d');

function resizeCanvas(){
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * devicePixelRatio);
  canvas.height = Math.floor(rect.height * devicePixelRatio);
  if(ctx) ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  drawPlaceholder();
}

function drawPlaceholder(){
  if(!ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const w = canvas.width / devicePixelRatio;
  const h = canvas.height / devicePixelRatio;
  ctx.save();
  ctx.globalAlpha = 0.08;
  for(let i=0;i<30;i++){
    const x = Math.random()*w, y = Math.random()*h, r = Math.random()*30+6;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(110,231,183,0.6)';
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

function drawReactionEffect(color){
  if(!ctx) return;
  const w = canvas.width / devicePixelRatio;
  const h = canvas.height / devicePixelRatio;
  ctx.clearRect(0,0,w,h);

  let particles = Array.from({length:40}, ()=>({
    x: Math.random()*w,
    y: h/2,
    r: Math.random()*8+3,
    vy: (Math.random()*-2)-1
  }));

  function animate(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.fillStyle = (color==='green' ? 'rgba(34,197,94,0.7)' : 'rgba(239,68,68,0.7)');
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
      p.y += p.vy;
      p.r *= 0.96;
    });
    particles = particles.filter(p=>p.r>0.5);
    if(particles.length>0) requestAnimationFrame(animate);
  }
  animate();
}

/* Audio efek */
function playReactionSound(success){
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(success ? 600 : 200, audioCtx.currentTime);
  gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.3);
}

/* Init */
window.addEventListener('resize', debounce(resizeCanvas, 120));
renderPeriodic();
resizeCanvas();

/* Util debounce */
function debounce(fn, t){
  let timer=null;
  return (...args)=>{
    clearTimeout(timer);
    timer=setTimeout(()=>fn(...args),t);
  };
}
