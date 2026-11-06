(()=>{
const categories=['ทั้งหมด','แก้วและกระบอกน้ำ','กระเป๋า','อุปกรณ์ไอที','ของใช้ประจำวัน','เสื้อผ้าและหมวก','รักษ์โลก','บรรจุภัณฑ์'];
document.querySelectorAll('.cat').forEach((el,i)=>el.textContent=categories[i]);
document.querySelector('.hero h1').innerHTML='<span>เลือกของที่ใช่</span> <span class="h1-shine">ให้แบรนด์คุณ</span>';
document.querySelector('.hero p').textContent='เลือกดูสินค้า หรือบอกไอเดียให้เราช่วยหา';
q.setAttribute('aria-label','ค้นหาสินค้า');
q.placeholder='ค้นหาสินค้า เช่น กระบอกน้ำ งบไม่เกิน 200 บาท';
document.querySelector('.ask').textContent='ค้นหา';
const quick=document.querySelector('.quick');quick.replaceChildren();
[['fast','ผลิตภายใน 1 เดือน'],['premium','งบ 600–999 บาท']].forEach(([type,label])=>{const b=document.createElement('button');b.textContent=label;b.type='button';b.onclick=()=>preset(type);quick.append(b)});

const filter=document.querySelector('.filters');
filter.querySelector('h3').textContent='เลือกเงื่อนไข';
filter.querySelector('select').options[0].textContent='ทุกจำนวนขั้นต่ำ';
const toggler=document.createElement('button');toggler.type='button';toggler.className='products-filter-toggle';toggler.textContent='ตัวกรอง';toggler.setAttribute('aria-expanded','false');filter.id='products-filters';toggler.setAttribute('aria-controls',filter.id);toggler.onclick=()=>{const open=toggler.getAttribute('aria-expanded')!=='true';toggler.setAttribute('aria-expanded',String(open));filter.classList.toggle('is-open',open)};
const shopBar=document.createElement('div');shopBar.className='shop-bar';const bar=document.querySelector('.bar');bar.before(shopBar);shopBar.append(bar,toggler,filter);const planLink=document.createElement('a');planLink.className='cat-plan';planLink.href='gift-planner.html';planLink.textContent='จัดของขวัญตามงบ →';bar.append(planLink);document.addEventListener('click',e=>{if(filter.classList.contains('is-open')&&!filter.contains(e.target)&&!toggler.contains(e.target))toggler.click()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&filter.classList.contains('is-open'))toggler.click()});
const chips=document.createElement('div');chips.className='products-applied';chips.setAttribute('aria-label','เงื่อนไขที่เลือก');document.querySelector('.topline').after(chips);
const radios=[...filter.querySelectorAll('input[name=budget]')],selects=[...filter.querySelectorAll('select')];
const groups=[...document.querySelectorAll('.cat')].map((el,i)=>[el.getAttribute('onclick').match(/"([a-z]+)"/)[1],categories[i]]).filter(([id])=>id!=='all');
// One continuous list: every category stays on the page, the side list jumps and tracks.
let pending=new URLSearchParams(location.search).get('category');
try{pending=pending||JSON.parse(localStorage.getItem('rukaFilters')||'{}').category}catch(e){}
const offset=()=>innerWidth>1050?92:150;
let locked='';['wheel','touchmove','keydown'].forEach(e=>addEventListener(e,()=>{locked=''},{passive:true}));
const jump=id=>{const head=document.getElementById('group-'+id);if(!head)return false;locked=id;scrollTo({top:head.getBoundingClientRect().top+scrollY-offset(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});return true};
const spy=()=>{const heads=[...document.querySelectorAll('.group-head')];if(!heads.length)return;const line=innerWidth>1050?innerHeight*.55:offset()+60;let now=heads[0];heads.forEach(h=>{if(h.getBoundingClientRect().top<=line)now=h});if(locked)now=heads.find(h=>h.dataset.cat===locked)||now;
 document.querySelectorAll('.cat').forEach(b=>{const on=b.getAttribute('onclick').includes('"'+now.dataset.cat+'"');b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));
  if(on&&innerWidth<=1050){const bar=b.parentElement;bar.scrollTo({left:b.offsetLeft-bar.clientWidth/2+b.offsetWidth/2,behavior:'smooth'})}})};
let spyFrame=0;addEventListener('scroll',()=>{if(!spyFrame)spyFrame=requestAnimationFrame(()=>{spyFrame=0;spy()})},{passive:true});
window.filterCat=(el,id)=>{if(!jump(id)){q.value='';render(id)}};
// Search stays on this page: words narrow the list, "budget 200" caps the price, quantities are ignored.
const askTeam=smartSearch;
const SYNONYMS={'ขวด':'กระบอก','bottle':'กระบอก','tumbler':'แก้ว','mug':'แก้ว','tote':'กระเป๋า'};
const parseQuery=raw=>{let t=String(raw||'').toLowerCase();const b=t.match(/(?:งบ|ไม่เกิน|ต่ำกว่า|under|below)[^\d]*([\d,]+)/);t=t.replace(/(?:งบ|ไม่เกิน|ต่ำกว่า|under|below)[^\d]*[\d,]+\s*(?:บาท|฿)?/g,' ').replace(/[\d,]+\s*(?:ใบ|ชิ้น|ตัว|อัน|ชุด|pcs?|บาท)/g,' ').replace(/งบ|ไม่เกิน|ต้องการ|อยากได้|สำหรับ/g,' ');return{budget:b?Number(b[1].replace(/,/g,'')):0,words:t.split(/\s+/).filter(Boolean).map(w=>SYNONYMS[w]||w)}};
const fits=(card,{budget,words})=>{const row=products.find(p=>p[8]===card.dataset.code)||[];const hay=[card.textContent,card.dataset.code,row[9],(groups.find(g=>g[0]===card.dataset.cat)||[])[1]].join(' ').toLowerCase();const price=Number((card.querySelector('.price').textContent.match(/฿\s*(\d+)/)||[0,0])[1]);return words.every(w=>hay.includes(w))&&(!budget||price<=budget)};
const searchState=document.createElement('div');searchState.className='search-state';searchState.hidden=true;document.getElementById('grid').before(searchState);
smartSearch=function(){render();const top=document.getElementById('grid').getBoundingClientRect().top+scrollY-110;if(scrollY>top)scrollTo({top})};
let typing=0;q.addEventListener('input',()=>{clearTimeout(typing);typing=setTimeout(()=>render(),140)});
// Flat-background photos get re-centred and scaled so products read the same size in every tile.
const framing=new Map();
const measure=src=>{if(framing.has(src))return framing.get(src);const job=new Promise(done=>{const pic=new Image();pic.crossOrigin='anonymous';pic.onerror=()=>done(null);pic.onload=()=>{try{const ratio=pic.naturalWidth/pic.naturalHeight;if(ratio<.94||ratio>1.06)return done(null);const n=64,cv=document.createElement('canvas');cv.width=cv.height=n;const ctx=cv.getContext('2d',{willReadFrequently:true});ctx.drawImage(pic,0,0,n,n);const px=ctx.getImageData(0,0,n,n).data,at=(x,y)=>{const i=(y*n+x)*4;return[px[i],px[i+1],px[i+2]]},far=(p,q,t)=>Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])+Math.abs(p[2]-q[2])>t;
 const edge=[];for(let i=0;i<n;i++)edge.push(at(i,0),at(i,n-1),at(0,i),at(n-1,i));const bg=[0,1,2].map(c=>edge.map(p=>p[c]).sort((a,b)=>a-b)[edge.length>>1]);if(edge.filter(p=>far(p,bg,42)).length/edge.length>.14)return done(null);
 let x0=n,x1=0,y0=n,y1=0;for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(far(at(x,y),bg,60)){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}if(x1<=x0||y1<=y0)return done(null);
 const white=bg.every(c=>c>232),w=(x1-x0+1)/n,h=(y1-y0+1)/n,boxed=white&&w>.82&&h>.82,scale=boxed?Math.min(1.25,1.02/Math.max(w,h)):Math.min(1.5,Math.max(white?.72:1,.8/Math.max(w,h))),room=white?1:(scale-1)/2,move=c=>Math.max(-room,Math.min(room,(.5-c)*scale));done({scale,x:move((x0+x1+1)/2/n),y:move((y0+y1+1)/2/n)})}catch(e){done(null)}};pic.src=src});framing.set(src,job);return job};
const frame=img=>measure(img.currentSrc||img.src).then(f=>{if(!f)return;img.style.setProperty('--s',f.scale.toFixed(3));img.style.setProperty('--x',(f.x*100).toFixed(1)+'%');img.style.setProperty('--y',(f.y*100).toFixed(1)+'%')});
const frameAll=()=>document.querySelectorAll('#grid .card .photo img').forEach(img=>{if(img.dataset.framed)return;img.dataset.framed='1';if(img.complete&&img.naturalWidth)frame(img);else img.addEventListener('load',()=>frame(img),{once:true})});
const savedRender=render;
render=function(wanted){savedRender('all');
 document.querySelectorAll('#grid .card').forEach(card=>{
  card.querySelector('.add').remove();card.querySelector('.custom').remove();
  const button=card.querySelector('.view');button.textContent='ดูสินค้า →';button.setAttribute('aria-label','ดูสินค้า '+card.querySelector('h3').textContent);
  const photo=card.querySelector('.photo');photo.setAttribute('aria-hidden','true');
  card.querySelector('.meta').textContent=card.querySelector('.meta').textContent.replace('MOQ ','ขั้นต่ำ ');
 });
 document.querySelectorAll('.cat').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('active'))));
 chips.replaceChildren();
 const addChip=(text,remove)=>{const b=document.createElement('button');b.type='button';b.textContent=text+' ×';b.setAttribute('aria-label','ยกเลิก '+text);b.onclick=remove;chips.append(b)};
 radios.forEach(r=>{if(r.checked)addChip(r.parentElement.textContent.trim(),()=>{r.checked=false;render()})});
 selects.forEach((s,i)=>{if(s.selectedIndex)addChip((i===0?'จำนวน: ':'รับสินค้า: ')+s.selectedOptions[0].textContent,()=>{s.selectedIndex=0;render()})});
 chips.hidden=!chips.children.length;
 const box=document.getElementById('grid'),all=[...box.querySelectorAll('.card')],query=parseQuery(q.value),searching=!!(query.budget||query.words.length);
 const cards=searching?all.filter(c=>fits(c,query)):all,complete=!searching&&products.length>0&&all.length===products.length;
 searchState.hidden=!searching;searchState.replaceChildren();
 if(searching){const label=document.createElement('span');label.textContent=cards.length+' รายการ';const clear=document.createElement('button');clear.type='button';clear.textContent='ล้างการค้นหา';clear.onclick=()=>{q.value='';render();q.focus()};searchState.append(label,clear)}
 if(cards.length||complete){const parts=[];groups.forEach(([id,label])=>{const set=cards.filter(c=>c.dataset.cat===id);if(!set.length&&!complete)return;const panel=document.createElement('section');panel.className='group-panel';const h=document.createElement('h2');h.className='group-head';h.id='group-'+id;h.dataset.cat=id;h.textContent=label+' ';const n=document.createElement('span');n.textContent=set.length;h.append(n);panel.append(h);
  if(set.length){const inner=document.createElement('div');inner.className='panel-grid';inner.append(...set);panel.append(inner)}
  else{const none=document.createElement('div');none.className='group-empty';const t=document.createElement('strong');t.textContent=label;const s=document.createElement('p');s.textContent='ยังไม่มีสินค้าขึ้นเว็บในหมวดนี้ บอกสิ่งที่ต้องการ แล้วทีม Ruka จะช่วยหาให้';const b=document.createElement('a');b.href='brief.html';b.textContent='ให้ทีม Ruka ช่วยหา →';b.onclick=()=>{localStorage.setItem('rukaSearchIntent',label);localStorage.setItem('rukaHandoff','search')};none.append(t,s,b);panel.append(none)}
  parts.push(panel)});box.replaceChildren(...parts)}
 else if(searching&&all.length){const none=document.createElement('div');none.className='search-none';const t=document.createElement('strong');t.textContent='ไม่พบสินค้าที่ตรงกับคำค้น';const s=document.createElement('p');s.textContent='ลองคำอื่น หรือส่งโจทย์ให้ทีม Ruka ช่วยหาให้';const b=document.createElement('button');b.type='button';b.textContent='ให้ทีม Ruka ช่วยหา →';b.onclick=askTeam;none.append(t,s,b);box.replaceChildren(none)}
 spy();frameAll();
 const target=wanted&&wanted!=='all'?wanted:pending;
 if(cards.length&&target&&target!=='all'){pending=null;requestAnimationFrame(()=>jump(target))}
};
render();
})();
