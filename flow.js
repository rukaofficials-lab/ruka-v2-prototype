/* Shared navigation and handoff for the prototype. No message is sent automatically. */
const flowRead=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key))||fallback}catch{return fallback}};
function flowFilterIntent() {
 const filters=flowRead('rukaFilters');
 return {
  quantity:[null,50,100,300,500][filters.selects?.[0]||0],
  budget:['ต่ำกว่า 300 บาท','300–599 บาท','600–999 บาท','1,000+ บาท'][filters.budget]||'',
  delivery:['','ภายใน 2–3 สัปดาห์','ภายใน 1 เดือน','มากกว่า 1 เดือน'][filters.selects?.[1]||0]
 };
}
function flowSelectProduct(name) {
 localStorage.setItem('rukaProduct',name);
 localStorage.setItem('rukaHandoff','product');
 localStorage.setItem('rukaFilterIntent',JSON.stringify(flowFilterIntent()));
 location.href='brief.html';
}
const flowPage=location.pathname.split('/').pop()||'index.html';
const flowNav=document.querySelector('body>nav');
if(flowNav){
 const toggle=document.createElement('button');toggle.type='button';toggle.className='mobile-menu-button';toggle.textContent='☰';toggle.setAttribute('aria-label','เปิดเมนู');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','mobileMenu');
 const menu=document.createElement('div');menu.id='mobileMenu';menu.className='mobile-menu';menu.hidden=true;
 [['index.html','หน้าแรก'],['products.html','สินค้า'],['occasion.html','บริการ'],['how.html','ขั้นตอนการทำงาน'],['ideas.html','STORIES'],['about.html','เกี่ยวกับ'],['contact.html','ติดต่อ / ขอราคา']].forEach(([url,label])=>{const a=document.createElement('a');a.href=url;a.textContent=label;menu.append(a)});
 const languages=document.createElement('div');languages.className='mobile-languages';languages.setAttribute('role','group');languages.setAttribute('aria-label','Language');['th','en'].forEach(lang=>{const button=document.createElement('button');button.type='button';button.dataset.lang=lang;button.textContent=lang.toUpperCase();languages.append(button)});menu.append(languages);
 const close=()=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false')};toggle.onclick=()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))};document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus()}});flowNav.prepend(toggle);flowNav.append(menu);
 flowNav.querySelector('.quote').onclick=()=>location.href='contact.html';
 const search=flowNav.querySelector('.searchBtn');if(search)search.onclick=()=>location.href='products.html?search=1';
}
// Keyboard access for existing occasion cards.
document.querySelectorAll('[onclick^="choose("]').forEach(el=>{el.setAttribute('role','button');el.tabIndex=0;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click()}}});
if(flowPage==='index.html')document.getElementById('idea').addEventListener('keydown',e=>{if(e.key==='Enter')startIdea()});
if(flowPage==='products.html'){
 let category='all';const budgetInputs=[...document.querySelectorAll('input[name=budget]')];const selects=[...document.querySelectorAll('.filters select')];selects[0].setAttribute('aria-label','จำนวนที่ต้องการ');selects[1].setAttribute('aria-label','ต้องการใช้เมื่อไร');
 const saved=flowRead('rukaFilters');const linkedCategory=new URLSearchParams(location.search).get('category');if(['drink','bag','tech','life','apparel','eco','pack'].includes(linkedCategory)){saved.category=linkedCategory;saved.budget=-1;saved.selects=[0,0]}category=saved.category||'all';budgetInputs.forEach((x,i)=>x.checked=saved.budget===i);selects.forEach((s,i)=>s.selectedIndex=saved.selects?.[i]||0);
 render=function(t=category){category=t;const bi=budgetInputs.findIndex(x=>x.checked),range=[[0,299],[300,599],[600,999],[1000,Infinity]][bi];const maxMoq=[Infinity,50,100,300,Infinity][selects[0].selectedIndex],maxDays=[Infinity,21,30,Infinity][selects[1].selectedIndex];
 const list=products.filter(p=>{const cost=Number((String(p[5]).match(/\d+/)||[0])[0]),moq=Number(String(p[3]).replace(/\D/g,'')),days=Number((String(p[4]).match(/\d+/g)||[0]).at(-1));return(category==='all'||p[2]===category)&&(!range||(cost>0&&cost>=range[0]&&cost<=range[1]))&&moq<=maxMoq&&days<=maxDays});
 document.getElementById('grid').innerHTML=list.map(p=>`<article class="card" data-code="${p[8]||''}" data-cat="${p[2]}"><div class="photo">${p[0]}</div><div class="info"><h3>${p[1]}</h3>${p[10]?`<small class="card-size">${p[10]}</small>`:''}<div class="meta">${p[3]} · ${p[4]}</div><div class="price">เริ่มประมาณ ${p[5]} / ชิ้น</div><div class="custom">Custom: ${p[7]}</div><div class="actions"><button class="add" onclick="add('${p[9]||p[1]}')">+ เพิ่มเข้าโปรเจกต์</button><button class="view" onclick="detail('${p[8]||p[1]}')">ดูรายละเอียด</button></div></div></article>`).join('')||`<p class="flow-empty">${products.length?'ไม่พบสินค้าที่ตรงเงื่อนไข ลองปรับหรือล้างตัวกรอง':window.rukaProductsFailed?'โหลดสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง':'กำลังโหลดสินค้า…'}</p>`;
 document.getElementById('count').textContent=list.length+' รายการ';localStorage.setItem('rukaFilters',JSON.stringify({category,budget:bi,selects:selects.map(s=>s.selectedIndex)}));
 document.querySelectorAll('.cat').forEach(el=>el.classList.toggle('active',el.getAttribute('onclick').includes('"'+category+'"')));
 };
 budgetInputs.forEach(x=>x.onchange=()=>render());selects.forEach(x=>x.onchange=()=>render());
 const reset=document.createElement('button');reset.className='filter-reset';reset.textContent='ล้างตัวกรอง';reset.onclick=()=>{budgetInputs.forEach(x=>x.checked=false);selects.forEach(x=>x.selectedIndex=0);render('all')};document.querySelector('.filters').append(reset);
 add=flowSelectProduct;
 detail=function(name){location.href='product.html?product='+encodeURIComponent(name)};
 preset=function(type){if(type==='easy'){location.href='occasion.html';return}budgetInputs.forEach(x=>x.checked=false);selects.forEach(s=>s.selectedIndex=0);if(type==='budget')budgetInputs[0].checked=true;if(type==='premium')budgetInputs[2].checked=true;if(type==='fast')selects[1].selectedIndex=2;render('all');document.querySelector('.filters').scrollIntoView({block:'center'})};
 document.getElementById('q').addEventListener('keydown',e=>{if(e.key==='Enter')smartSearch()});render();if(location.search.includes('search=1'))document.getElementById('q').focus();
}
if(flowPage==='brief.html'){
 const filtered=flowRead('rukaFilterIntent');localStorage.removeItem('rukaFilterIntent');
 const draft=flowRead('rukaDraft');if(draft.data){Object.assign(data,draft.data);if(draft.occasion!==occ)data.detail='';mood.value=draft.mood||'';date.value=draft.exactDate||'';qty.value=data.qty||''}
 if(filtered.quantity)data.qty=String(filtered.quantity);if(filtered.budget)data.budget=filtered.budget;if(filtered.delivery){data.dateLabel=filtered.delivery;date.value=''}
 const intent=localStorage.getItem('rukaSearchIntent')||'',idea=localStorage.getItem('rukaIdea')||'';
 if(idea&&draft.idea!==idea)mood.value=localStorage.getItem('rukaIdeaMood')||'';
 const context=document.createElement('p');context.className='flow-context';context.textContent=[product&&'สินค้า: '+product,intent&&'โจทย์: '+intent,idea&&'ไอเดีย: '+idea,idea&&localStorage.getItem('rukaIdeaBudget')&&'งบอ้างอิง: '+localStorage.getItem('rukaIdeaBudget')].filter(Boolean).join('\n');if(context.textContent)document.querySelector('.sub').after(context);
 const originalSync=sync;sync=function(){originalSync();localStorage.setItem('rukaBrief',JSON.stringify({occasion:occ,occasionLabel:f.label,detail:data.detail,quantity:data.qty,budget:data.budget,date:data.dateLabel,mood:mood.value,product,intent,idea}));localStorage.setItem('rukaDraft',JSON.stringify({occasion:occ,idea,data,mood:mood.value,exactDate:date.value}))};
 const error=document.createElement('p');error.className='flow-error';error.setAttribute('role','alert');error.hidden=true;document.getElementById('actions').before(error);
 const originalNext=next;next=function(){let problem='';if(step===1&&!data.detail)problem='กรุณาเลือกคำตอบก่อน';if(step===2&&(!Number.isInteger(Number(data.qty))||Number(data.qty)<=0))problem='กรุณาระบุจำนวนเป็นจำนวนเต็มมากกว่า 0';if(step===3&&!data.budget)problem='กรุณาเลือกช่วงงบ';if(step===4&&(!data.dateLabel||(date.value&&new Date(date.value+'T23:59:59')<new Date())))problem='กรุณาเลือกวันรับสินค้าในอนาคต หรือยังไม่กำหนดวัน';error.textContent=problem;error.hidden=!problem;if(problem)return;originalNext();if(step===5&&document.getElementById('complete').classList.contains('active')){const b=flowRead('rukaBrief');Object.assign(b,{intent,idea,ideaBudget:localStorage.getItem('rukaIdeaBudget')||''});localStorage.setItem('rukaBrief',JSON.stringify(b))}};
 qty.value=data.qty||'';document.querySelectorAll('#q1options .opt').forEach(x=>x.classList.toggle('selected',x.textContent===data.detail));document.querySelectorAll('.budgetcard').forEach(x=>x.classList.toggle('selected',x.getAttribute('onclick').includes(data.budget)&&!!data.budget));sync();
}
if(flowPage==='concept.html'){
 openContact=function(){persistConcept();location.href='contact.html'};flowNav.querySelector('.quote').onclick=()=>openContact();
}
if(flowPage==='contact.html'){
 const b=flowRead('rukaBrief'),draft=flowRead('rukaDraft'),concept=flowRead('rukaConcept');const current=draft.data?{...b,occasion:draft.occasion,detail:draft.data.detail,quantity:draft.data.qty,budget:draft.data.budget,date:draft.data.dateLabel,mood:draft.mood}:b;
 const lines=[['แพ็กเกจตั้งต้น',b.packageName],['งบรวมตั้งต้น',b.totalBudget?Number(b.totalBudget).toLocaleString('th-TH')+' บาท':''],['โอกาส',({employee:'พนักงาน & ทีม',client:'ลูกค้า & VIP',event:'Event',campaign:'Campaign',seasonal:'เทศกาล & ปีใหม่',unsure:'ยังไม่แน่ใจ'})[current.occasion]||current.occasion],['รายละเอียด',current.detail],['สินค้า',b.plannerSelection?b.product:localStorage.getItem('rukaProduct')],['โจทย์',b.plannerSelection?'':localStorage.getItem('rukaSearchIntent')],['ไอเดีย',b.plannerSelection?'':localStorage.getItem('rukaIdea')],['จำนวน',current.quantity],['งบต่อชุด',current.budget],['วันรับ',current.date],['Mood',current.mood],['Direction',b.plannerSelection?b.plannerSelection.title:concept.direction],['สินค้าใน Concept',b.plannerSelection?'':concept.items?.map(i=>i.name).join(', ')],['Packaging',b.plannerSelection?'':concept.packaging]].filter(([,v])=>v).map(([k,v])=>k+': '+v);
 const text=lines.length?'บรีฟโปรเจกต์ RUKA\n'+lines.join('\n'):'ยังไม่มีข้อมูลโปรเจกต์ เริ่มบรีฟหรือเลือกสินค้าก่อนได้';document.getElementById('handoff').textContent=text;
 document.getElementById('copyBrief').onclick=async()=>{try{await navigator.clipboard.writeText(text);document.getElementById('contactStatus').textContent='คัดลอกแล้ว — นำข้อความไปส่งให้ทีมผ่านช่องทางติดต่อ'}catch{document.getElementById('contactStatus').textContent='คัดลอกอัตโนมัติไม่ได้ กรุณาเลือกและคัดลอกข้อความด้านบน'}};
}

if(flowPage==='ideas.html'){
 const initialFilter=document.querySelector('.filter.on');if(initialFilter)pick(initialFilter);
}

if(flowPage==='product.html'){
 addToProject=function(){flowSelectProduct(selected)};
 const save=document.querySelector('button[onclick^="alert("]');if(save){save.onclick=()=>{localStorage.setItem('rukaProduct',selected);localStorage.setItem('rukaHandoff','product');save.textContent='✓ บันทึกแล้ว';save.setAttribute('aria-pressed','true')};if(localStorage.getItem('rukaProduct')===selected)save.textContent='✓ บันทึกแล้ว'}
}

if(flowPage==='product.html'){
 const saveButton=document.querySelector('.secondary');
 const readSaved=()=>{try{const value=JSON.parse(localStorage.getItem('rukaSavedProducts')||'[]');return Array.isArray(value)?value.filter(x=>typeof x==='string'):[]}catch{return []}};
 const paintSaved=()=>{const saved=readSaved().includes(selected);saveButton.textContent=saved?'♥ บันทึกแล้ว':'♡ บันทึกไว้';saveButton.setAttribute('aria-pressed',String(saved));saveButton.setAttribute('aria-label',(saved?'ยกเลิกบันทึก ':'บันทึก ')+selected)};
 if(saveButton){saveButton.onclick=()=>{const saved=readSaved();try{localStorage.setItem('rukaSavedProducts',JSON.stringify(saved.includes(selected)?saved.filter(name=>name!==selected):[...saved,selected]));paintSaved()}catch{saveButton.textContent='ลองบันทึกอีกครั้ง';saveButton.setAttribute('aria-label','บันทึกไม่สำเร็จ ลองอีกครั้ง')}};paintSaved()}
}
