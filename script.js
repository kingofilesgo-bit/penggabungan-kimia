/* === DATA UNSUR (dipersingkat untuk contoh, bisa full) === */
const elementData = [
  [1,"H","Hydrogen"], [8,"O","Oxygen"], [11,"Na","Sodium"], [17,"Cl","Chlorine"],
  [26,"Fe","Iron"], [20,"Ca","Calcium"], [6,"C","Carbon"],
  [1,"H","Hydrogen"], [16,"S","Sulfur"]
];

/* DOM Elemen */
const periodicEl = document.getElementById('periodic');
const selected = [];
const selectedList = document.getElementById('selectedList');
const resultText = document.getElementById('resultText');
const canvas = document.getElementById('viz');
const ctx = canvas.getContext('2d');

/* Audio */
const audioSuccess = document.getElementById('audioSuccess');
const audioFail = document.getElementById('audioFail');

/* Render tabel periodik */
function renderPeriodic(){
  elementData.forEach(([z,s,name])=>{
    const d = document.createElement('div');
    d.className = 'el';
    d.title = `${name} (${z})`;
    d.innerHTML = `<div class="sym">${s}</div><div style="font-size:9px">${z}</div>`;
    d.addEventListener('click', ()=> toggleSelect({s,name}, d));
    periodicEl.appendChild(d);
  });
}
renderPeriodic();

/* Pilihan unsur */
function toggleSelect(el, dom){
  const idx = selected.findIndex(x=>x.s===el.s);
  if(idx>=0){ selected.splice(idx,1); dom.classList.remove('selected'); }
  else { selected.push(el); dom.classList.add('selected'); }
  updateSelectedUI();
}

function updateSelectedUI(){
  selectedList.innerHTML = '';
  selected.forEach((el,i)=>{
    const node = document.createElement('div');
    node.className='sel-item';
    node.innerHTML = `${el.s} — ${el.name} <button class='btn ghost'>x</button>`;
    node.querySelector('button').addEventListener('click', ()=>{
      selected.splice(i,1);
      Array.from(periodicEl.children).forEach(ch=>{
        if(ch.querySelector('.sym').textContent===el.s) ch.classList.remove('selected');
      });
      updateSelectedUI();
    });
    selectedList.appendChild(node);
  });
}

/* Aturan reaksi realistis */
const reactionRules = [
  { match:['H','O'], result:'2H₂ + O₂ → 2H₂O' },
  { match:['Na','Cl'], result:'Na + Cl → NaCl' },
  { match:['Fe','O'], result:'4Fe + 3O₂ → 2Fe₂O₃ (Karat)' },
  { match:['Ca','C','O'], result:'CaO + CO₂ → CaCO₃' },
  { match:['C','O'], result:'C + O₂ → CO₂' },
  { match:['H','Cl','Na','O'], result:'HCl + NaOH → NaCl + H₂O' }
];

/* Cari reaksi */
function findReaction(elements){
  for(const r of reactionRules){
    if(r.match.every(m=>elements.includes(m))) return r.result;
  }
  return null;
}

/* Efek visual bubble */
function drawEffect(success){
  const w=canvas.width, h=canvas.height;
  ctx.clearRect(0,0,w,h);
  for(let i=0;i<40;i++){
    const x=Math.random()*w, y=Math.random()*h, r=Math.random()*20+5;
    ctx.beginPath();
    ctx.fillStyle = success ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)';
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
  }
}

/* Tombol Reaksikan */
document.getElementById('reactBtn').addEventListener('click', ()=>{
  if(selected.length<2){
    resultText.textContent='Pilih minimal 2 unsur.';
    return;
  }
  const elems = selected.map(s=>s.s);
  const res = findReaction(elems);
  if(res){
    resultText.textContent=res;
    drawEffect(true);
    audioSuccess.play();
  }else{
    resultText.textContent='Tidak bereaksi.';
    drawEffect(false);
    audioFail.play();
  }
});

/* Tombol Hapus */
document.getElementById('clearBtn').addEventListener('click', ()=>{
  selected.length=0;
  Array.from(periodicEl.children).forEach(ch=>ch.classList.remove('selected'));
  updateSelectedUI();
  ctx.clearRect(0,0,canvas.width,canvas.height);
  resultText.textContent='Belum ada reaksi.';
});

/* Resize canvas */
function resizeCanvas(){
  canvas.width=canvas.clientWidth*devicePixelRatio;
  canvas.height=canvas.clientHeight*devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
