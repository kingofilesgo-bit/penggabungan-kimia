/* script.js - logika periodik & reaksi */
const elementData = [
    [1,"H","Hydrogen"],[2,"He","Helium"],[3,"Li","Lithium"],[4,"Be","Beryllium"],[5,"B","Boron"],[6,"C","Carbon"],[7,"N","Nitrogen"],[8,"O","Oxygen"],[9,"F","Fluorine"],[10,"Ne","Neon"],
    [11,"Na","Sodium"],[12,"Mg","Magnesium"],[13,"Al","Aluminium"],[14,"Si","Silicon"],[15,"P","Phosphorus"],[16,"S","Sulfur"],[17,"Cl","Chlorine"],[18,"Ar","Argon"],
    [19,"K","Potassium"],[20,"Ca","Calcium"],[21,"Sc","Scandium"],[22,"Ti","Titanium"],[23,"V","Vanadium"],[24,"Cr","Chromium"],[25,"Mn","Manganese"],[26,"Fe","Iron"],[27,"Co","Cobalt"],[28,"Ni","Nickel"],[29,"Cu","Copper"],[30,"Zn","Zinc"],
    [31,"Ga","Gallium"],[32,"Ge","Germanium"],[33,"As","Arsenic"],[34,"Se","Selenium"],[35,"Br","Bromine"],[36,"Kr","Krypton"],
    [37,"Rb","Rubidium"],[38,"Sr","Strontium"],[39,"Y","Yttrium"],[40,"Zr","Zirconium"],[41,"Nb","Niobium"],[42,"Mo","Molybdenum"],[43,"Tc","Technetium"],[44,"Ru","Ruthenium"],[45,"Rh","Rhodium"],[46,"Pd","Palladium"],[47,"Ag","Silver"],[48,"Cd","Cadmium"],
    [49,"In","Indium"],[50,"Sn","Tin"],[51,"Sb","Antimony"],[52,"Te","Tellurium"],[53,"I","Iodine"],[54,"Xe","Xenon"],
    [55,"Cs","Cesium"],[56,"Ba","Barium"],[57,"La","Lanthanum"],[58,"Ce","Cerium"],[59,"Pr","Praseodymium"],[60,"Nd","Neodymium"],[61,"Pm","Promethium"],[62,"Sm","Samarium"],[63,"Eu","Europium"],[64,"Gd","Gadolinium"],[65,"Tb","Terbium"],[66,"Dy","Dysprosium"],[67,"Ho","Holmium"],[68,"Er","Erbium"],[69,"Tm","Thulium"],[70,"Yb","Ytterbium"],[71,"Lu","Lutetium"],
    [72,"Hf","Hafnium"],[73,"Ta","Tantalum"],[74,"W","Tungsten"],[75,"Re","Rhenium"],[76,"Os","Osmium"],[77,"Ir","Iridium"],[78,"Pt","Platinum"],[79,"Au","Gold"],[80,"Hg","Mercury"],[81,"Tl","Thallium"],[82,"Pb","Lead"],[83,"Bi","Bismuth"],[84,"Po","Polonium"],[85,"At","Astatine"],[86,"Rn","Radon"],
    [87,"Fr","Francium"],[88,"Ra","Radium"],[89,"Ac","Actinium"],[90,"Th","Thorium"],[91,"Pa","Protactinium"],[92,"U","Uranium"],[93,"Np","Neptunium"],[94,"Pu","Plutonium"],[95,"Am","Americium"],[96,"Cm","Curium"],[97,"Bk","Berkelium"],[98,"Cf","Californium"],[99,"Es","Einsteinium"],[100,"Fm","Fermium"],[101,"Md","Mendelevium"],[102,"No","Nobelium"],[103,"Lr","Lawrencium"],
    [104,"Rf","Rutherfordium"],[105,"Db","Dubnium"],[106,"Sg","Seaborgium"],[107,"Bh","Bohrium"],[108,"Hs","Hassium"],[109,"Mt","Meitnerium"],[110,"Ds","Darmstadtium"],[111,"Rg","Roentgenium"],[112,"Cn","Copernicium"],[113,"Nh","Nihonium"],[114,"Fl","Flerovium"],[115,"Mc","Moscovium"],[116,"Lv","Livermorium"],[117,"Ts","Tennessine"],[118,"Og","Oganesson"]
  ];
  
  const periodicEl = document.getElementById('periodic');
  const selected = [];
  const selectedList = document.getElementById('selectedList');
  const resultText = document.getElementById('resultText');
  
  function renderPeriodic(){
    elementData.forEach(([z,s,name])=>{
      const d = document.createElement('div');
      d.className = 'el';
      d.title = `${name} (${z})`;
      d.innerHTML = `<div class="sym">${s}</div><div style="font-size:9px">${z}</div>`;
      d.addEventListener('click', ()=>{
        toggleSelect({s,name}, d);
      });
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
      const node = document.createElement('div'); 
      node.className='sel-item';
      node.innerHTML = `${el.s} — ${el.name} <button class='btn ghost' data-i='${i}'>x</button>`;
      node.querySelector('button').addEventListener('click', ()=>{
        selected.splice(i,1);
        // remove highlight in periodic grid
        const gridItems = Array.from(periodicEl.children);
        const found = gridItems.find(n => n.querySelector('.sym')?.textContent === el.s);
        if(found) found.classList.remove('selected');
        updateSelectedUI();
      });
      selectedList.appendChild(node);
    });
  }
  
  /* Rules reaksi sederhana (bisa kamu perluas) */
  const reactionRules = [
    { match: ['H','O'], result: 'Hydrogen + Oxygen → H₂O' },
    { match: ['Na','Cl'], result: 'Sodium + Chlorine → NaCl' },
    { match: ['Fe','O'], result: 'Iron + Oxygen → Karat (Fe₂O₃)' }
  ];
  
  function findReactionPair(a,b){
    for(const r of reactionRules){
      if(r.match.includes(a) && r.match.includes(b)) return r.result;
    }
    return null;
  }
  
  document.getElementById('reactBtn').addEventListener('click', ()=>{
    if(selected.length === 0){ 
      resultText.textContent = 'Belum ada unsur terpilih.'; 
      return; 
    }
    if(selected.length === 1){ 
      resultText.textContent = 'Hanya 1 unsur, tidak ada reaksi.'; 
      return; 
    }
  
    const results = [];
    for(let i=0;i<selected.length;i++){
      for(let j=i+1;j<selected.length;j++){
        const r = findReactionPair(selected[i].s, selected[j].s);
        results.push(`${selected[i].s} + ${selected[j].s} → ${r ? r : "tidak bereaksi"}`);
      }
    }
    resultText.textContent = results.join("\n");
  });
  
  document.getElementById('clearBtn').addEventListener('click', ()=>{
    selected.length = 0;
    // clear selections visual
    Array.from(periodicEl.children).forEach(ch => ch.classList.remove('selected'));
    updateSelectedUI();
    resultText.textContent = 'Belum ada reaksi.';
  });
  
  /* Canvas basic resize (siap untuk ditambah visual efek) */
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
    // simple decorative bubbles to hint "reaksi"
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
  
  window.addEventListener('resize', debounce(resizeCanvas, 120));
  renderPeriodic();
  resizeCanvas();
  
  /* util */
  function debounce(fn, t){
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(()=>fn(...args), t);
    };
  }
  