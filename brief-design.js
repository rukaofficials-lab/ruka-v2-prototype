/* Presentation layer: retain the existing answers, validation and handoff. */
(()=>{
const designs={
 employee:['มอบให้ทีมในโอกาสไหน?',['','ต้อนรับสมาชิกใหม่','ของขวัญเริ่มงาน'],['','ขอบคุณและให้รางวัล','ฉลองผลงานของทีม'],['','ฉลองครบรอบ','วันสำคัญและความสำเร็จ'],['','กิจกรรมในทีม','งานบริษัทหรือแคมเปญภายใน']],
 client:['อยากส่งความประทับใจให้ใคร?',['','ลูกค้าทั่วไป','ขอบคุณที่เลือกแบรนด์เรา'],['','ลูกค้าคนสำคัญ','ดูแลความสัมพันธ์ระยะยาว'],['','VIP และผู้บริหาร','ของขวัญสำหรับคนพิเศษ'],['','คู่ค้าและพาร์ตเนอร์','ขอบคุณที่เติบโตไปด้วยกัน']],
 event:['กำลังเตรียมของสำหรับงานไหน?',['','สัมมนาและประชุม','ของใช้สำหรับผู้ร่วมงาน'],['','คอนเสิร์ตและเทศกาล','พกความสนุกกลับบ้าน'],['','นิทรรศการและบูธ','ให้คนจดจำแบรนด์'],['','งานเปิดตัว','สร้างความประทับใจแรก']],
 campaign:['อยากให้แคมเปญนี้ช่วยอะไร?',['','ให้คนจำแบรนด์','สร้างการรับรู้'],['','ชวนคนมีส่วนร่วม','ให้คนอยากแชร์และบอกต่อ'],['','มอบรางวัล','ขอบคุณและสร้างแรงจูงใจ'],['','เปิดตัวสินค้า','ให้ของขวัญช่วยเล่าเรื่อง']],
 seasonal:['ปีนี้อยากส่งของขวัญให้ใคร?',['','พนักงาน','ขอบคุณทีมที่ร่วมสร้างผลงาน'],['','ลูกค้าทั่วไป','ส่งความสุขให้คนที่ไว้ใจเรา'],['','VIP และผู้บริหาร','เพิ่มความพิเศษให้คนสำคัญ'],['','คู่ค้า','ฉลองความสำเร็จไปด้วยกัน']],
 unsure:['เริ่มจากสิ่งที่คุณรู้ก่อนได้เลย',['','รู้ว่าให้ใคร','เริ่มจากคนรับของขวัญ'],['','มีงบในใจ','ช่วยเลือกให้เหมาะกับงบ'],['','รู้ว่าจะใช้ในงานไหน','เริ่มจากโอกาสของคุณ'],['','มีไอเดียคร่าว ๆ','ค่อย ๆ คิดต่อด้วยกัน']]
};
const design=designs[occ]||designs.unsure;
q1title.textContent=design[0];q1lead.textContent='เลือกสิ่งที่ใกล้กับโจทย์ของคุณที่สุด';
const panel=document.querySelector('.wrap>.panel');
panel.querySelector('.ey').hidden=true;panel.querySelector('h1').hidden=true;panel.querySelector('.sub').hidden=true;
const progress=document.createElement('div');progress.className='brief-step';panel.prepend(progress);progress.append(document.getElementById('stepLabel'),panel.querySelector('.progress'));
const backLink=document.createElement('a');backLink.className='brief-occasion-back';backLink.href='occasion.html';backLink.textContent='← เลือกโอกาสใหม่';document.querySelector('.wrap').before(backLink);
const summary=document.querySelector('.summary');summary.querySelector('h3').textContent='โปรเจกต์ของคุณ';
const context=document.querySelector('.flow-context');if(context)summary.querySelector('h3').after(context);
summary.querySelector('.ai').hidden=true;document.getElementById('sTotal').closest('.row').hidden=true;
const note=document.createElement('p');note.className='brief-summary-note';note.textContent='ข้อมูลที่เลือกจะส่งต่อให้ทีม RUKA';summary.append(note);
const detailNames=new Map();
q1options.querySelectorAll('.opt').forEach((button,i)=>{const [icon,title,desc]=design[i+1];detailNames.set(f.options[i],title);button.replaceChildren();const art=document.createElement('span');art.className='brief-choice-icon';art.setAttribute('aria-hidden','true');art.textContent=icon;const label=document.createElement('span');label.className='brief-choice-copy';const strong=document.createElement('strong');strong.textContent=title;const small=document.createElement('small');small.textContent=desc;label.append(strong,small);button.append(art,label)});
const editSteps={sDetail:1,sQty:2,sBudget:3,sDate:4,sMood:5};
Object.entries(editSteps).forEach(([id,target])=>{const row=document.getElementById(id).closest('.row');const button=document.createElement('button');button.type='button';button.className='brief-edit';button.textContent='แก้ไข';button.setAttribute('aria-label','แก้ไข'+row.querySelector('small').textContent);button.onclick=()=>{step=target;questions.style.display='';actions.style.display='';complete.classList.remove('active');show();panel.scrollIntoView({behavior:'smooth',block:'start'})};row.append(button)});
function refresh(){
 for(const id of Object.keys(editSteps)){const el=document.getElementById(id);el.closest('.row').classList.toggle('is-empty',!el.textContent.trim()||el.textContent==='—')}
 if(detailNames.has(data.detail))sDetail.textContent=detailNames.get(data.detail);
 document.querySelectorAll('#q1options .opt').forEach((b,i)=>b.setAttribute('aria-pressed',String(data.detail===f.options[i])));
 document.querySelectorAll('.qtybtn,.budgetcard,.datechip').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('selected'))));
}
const savedSync=sync;sync=function(){savedSync();refresh()};
const savedShow=show;show=function(){savedShow();stepLabel.textContent='ขั้นที่ '+step+' จาก 5';document.querySelectorAll('.q h2').forEach(h=>h.tabIndex=-1);document.querySelector('.q.active h2')?.focus({preventScroll:true})};
mood.addEventListener('input',refresh);
qty.setAttribute('aria-label','จำนวนชุด');date.setAttribute('aria-label','วันที่ต้องการรับสินค้า');mood.setAttribute('aria-label','รูปแบบหรือความรู้สึกที่ต้องการ');
const moodLabel=document.createElement('p');moodLabel.className='qlead';moodLabel.textContent='เลือกแนวที่ชอบ หรือเล่าไอเดียเพิ่มเติมได้เลย';mood.before(moodLabel);
const moods=document.createElement('div');moods.className='brief-moods';['เรียบหรู','ธรรมชาติ','สดใส','อบอุ่น'].forEach(text=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=()=>{mood.value=text.slice(text.indexOf(' ')+1);sync()};moods.append(b)});mood.before(moods);
const chosenStyle=new URLSearchParams(location.search).get('style');
const styleLabels={everyday:'เรียบง่าย ใช้ได้ทุกวัน',premium:'พรีเมียม น่าประทับใจ',playful:'สนุก จดจำแบรนด์ได้'};
if(styleLabels[chosenStyle]){mood.value=styleLabels[chosenStyle];sync()}
const budgetStart=new URLSearchParams(location.search).get('budgetStart');
const startingBudgets={under300:'ต่ำกว่า 300 บาท','300to599':'300–599 บาท'};
if(startingBudgets[budgetStart]){data.budget=startingBudgets[budgetStart];document.querySelectorAll('.budgetcard').forEach(b=>b.classList.toggle('selected',b.getAttribute('onclick').includes(data.budget)));sync()}
if(budgetStart==='600plus'){data.budget='';document.querySelectorAll('.budgetcard').forEach(b=>b.classList.remove('selected'));document.querySelectorAll('.budgetcard').forEach(b=>{if(b.getAttribute('onclick').includes('ต่ำกว่า')||b.getAttribute('onclick').includes('300–599'))b.hidden=true});sync();const hint=document.createElement('p');hint.className='brief-summary-note';hint.textContent='เริ่มจากงบ 600 บาทขึ้นไป — เลือกช่วงงบที่เหมาะในขั้นที่ 3';summary.prepend(hint)}
const packageKey=new URLSearchParams(location.search).get('package');
const packagePlans={starter:{name:'RUKA STARTER',total:20000,quantity:100,budget:'ต่ำกว่า 300 บาท'},plus:{name:'RUKA PLUS',total:50000,quantity:300,budget:'ต่ำกว่า 300 บาท'}};
if(packagePlans[packageKey]){
 const plan=packagePlans[packageKey];data.qty=String(plan.quantity);qty.value=data.qty;data.budget=plan.budget;
 const packageNote=document.createElement('p');packageNote.className='brief-summary-note';packageNote.textContent=plan.name+' · งบรวมตั้งต้น '+plan.total.toLocaleString('th-TH')+' บาท / '+plan.quantity+' ชุด (ปรับได้)';summary.prepend(packageNote);
 const beforePackageSync=sync;sync=function(){beforePackageSync();const brief=flowRead('rukaBrief');brief.packageName=plan.name;brief.totalBudget=plan.total;localStorage.setItem('rukaBrief',JSON.stringify(brief))};sync();
 const originalPackageNext=next;next=function(){originalPackageNext();sync()};
}
// Step list on the left; answered steps get a dot and stay clickable.
const rail=document.createElement('div');rail.className='brief-rail';rail.setAttribute('role','group');rail.setAttribute('aria-label','ขั้นตอนบรีฟ');
const goTo=target=>{step=target;questions.style.display='';actions.style.display='';complete.classList.remove('active');show()};
const railButtons=['โจทย์','จำนวน','งบต่อชุด','วันรับของ','แนวทาง'].map((label,i)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=()=>goTo(i+1);rail.append(b);return b});
document.querySelector('.wrap').prepend(rail);
const paintRail=()=>{const answers=[data.detail,data.qty,data.budget,data.dateLabel,mood.value];railButtons.forEach((b,i)=>{b.classList.toggle('active',step===i+1);b.classList.toggle('done',!!answers[i]);b.setAttribute('aria-current',step===i+1?'step':'false')})};
const showBase=show;show=function(){showBase();paintRail()};
const syncBase=sync;sync=function(){syncBase();paintRail()};
mood.addEventListener('input',paintRail);
// The project card takes the occasion colour and shows sample products.
const tints={employee:'#f6f1e7',client:'#f3f0f8',event:'#edf4ef',campaign:'#fbeee9',seasonal:'#f1f4f9',unsure:'#fbeecb'};
summary.style.setProperty('--brief-tint',tints[occ]||tints.unsure);
const picks={employee:'NOTE-002 DRW-009 BAG-001 TBL-008',client:'DRW-005 TBL-005 NOTE-002 DRW-002',event:'CAP-001 BAG-003 STA-001 TBL-007',campaign:'CAP-002 BAG-002 DRW-003 CAP-004',seasonal:'BAG-004 DRW-004 TBL-002 NOTE-002',unsure:'BAG-001 CAP-001 DRW-005 NOTE-002'};
window.rukaCatalog?.load().then(items=>{const found=(picks[occ]||picks.unsure).split(' ').map(code=>items.find(p=>p.code===code)).filter(p=>p&&p.image);if(found.length<4)return;const box=document.createElement('div');box.className='brief-photos';found.forEach(p=>{const tile=document.createElement('span');const img=document.createElement('img');img.src=rukaCatalog.thumb(rukaCatalog.cover(p),240);img.alt='';img.decoding='async';tile.append(img);box.append(tile)});const caption=document.createElement('p');caption.className='brief-photos-note';caption.textContent='ตัวอย่างสินค้าที่เหมาะกับงานนี้';summary.querySelector('h3').after(box,caption)}).catch(()=>{});
// Friendly layer: Ruka replies to each answer, cards carry an icon and colour, and picks move on by themselves.
const icon=path=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
const icons={gift:'<path d="M4 11h16v9H4zM3 7h18v4H3zM12 7v13M12 7c-2-4-6-3-5 0h5zM12 7c2-4 6-3 5 0h-5z"/>',heart:'<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',star:'<path d="m12 3 2.7 5.8 6.3.8-4.6 4.3 1.2 6.2-5.6-3.1-5.6 3.1 1.2-6.2L3 9.6l6.3-.8z"/>',party:'<path d="m4 20 5-13 8 8zM14 4v2M19 5l-2 2M20 10h-2"/>',people:'<circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-4 3-6 6-6s6 2 6 6M16 5a3.5 3.5 0 0 1 0 6.5M18 14c2 .6 3 2.6 3 6"/>',crown:'<path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',shake:'<path d="m3 12 4-4 5 2 5-2 4 4-8 8zM12 10l-3 3 2 2"/>',mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',music:'<path d="M9 18V6l11-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>',booth:'<path d="M4 9h16l-1-4H5zM6 9v11h12V9M10 20v-6h4v6"/>',rocket:'<path d="M12 3c4 3 5 7 4 12H8C7 10 8 6 12 3zM8 15l-3 4h4M16 15l3 4h-4"/><circle cx="12" cy="10" r="1.5"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',share:'<circle cx="6" cy="12" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="m9 10.5 6-3M9 13.5l6 3"/>',coin:'<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.5h4.5a2 2 0 0 1 0 4H9"/>',bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c1 1 1.5 2 1.5 3h5c0-1 .5-2 1.5-3A6 6 0 0 0 12 3z"/>',pin:'<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'};
const iconSets={employee:['gift','star','party','people'],client:['heart','star','crown','shake'],event:['mic','music','booth','rocket'],campaign:['eye','share','gift','rocket'],seasonal:['people','heart','crown','shake'],unsure:['people','coin','pin','bulb']};
(iconSets[occ]||iconSets.unsure).forEach((key,i)=>{const slot=q1options.querySelectorAll('.brief-choice-icon')[i];if(slot)slot.innerHTML=icon(icons[key])});
document.querySelectorAll('.budgetcard').forEach((card,i)=>{const b=document.createElement('i');b.className='brief-coins';b.setAttribute('aria-hidden','true');b.textContent='฿'.repeat(i+1);card.prepend(b)});
const english=()=>{try{return localStorage.getItem('rukaLanguage')==='en'}catch(e){return false}};
const voice=document.createElement('div');voice.className='brief-voice';voice.setAttribute('aria-live','polite');const face=document.createElement('span');face.className='brief-face';face.setAttribute('aria-hidden','true');face.textContent='R';const bubble=document.createElement('p');voice.append(face,bubble);panel.querySelector('#questions').before(voice);document.getElementById('contextBadge').hidden=true;
const say=text=>{bubble.textContent=text;bubble.classList.remove('pop');void bubble.offsetWidth;bubble.classList.add('pop')};
const readValue=i=>[sDetail.textContent,data.qty,data.budget,data.dateLabel,mood.value][i];
const replies=[v=>'รับทราบ งาน “'+v+'” ต่อไปขอถามจำนวนหน่อย',v=>v+' ชุด จดไว้แล้ว เรื่องงบเป็นยังไงบ้าง',v=>'งบ'+v+' ต่อชุด ทีมจะคัดให้ไม่หลุดงบ',v=>'“'+v+'” รับทราบ เหลืออีกข้อเดียว',v=>'แนว “'+v+'” ชอบเลย กดถัดไปได้เลย'];
const repliesEn=['Got it. How many sets?','Noted. What is the budget per set?','Thanks, we will stay within that.','Noted. One more to go.','Lovely. Press next when you are ready.'];
say(english()?'Five quick questions. A rough answer is fine.':'ถามแค่ 5 ข้อ ตอบคร่าว ๆ ก็พอ แก้ทีหลังได้');
// Meter: fills through a rainbow as the project card completes.
const meter=document.createElement('div');meter.className='brief-meter';meter.setAttribute('aria-hidden','true');const meterFill=document.createElement('i');meter.append(meterFill);summary.querySelector('h3').after(meter);
let seen=[data.detail,data.qty,data.budget,data.dateLabel,mood.value],armed=false;
const syncVoice=sync;sync=function(){syncVoice();const now=[data.detail,data.qty,data.budget,data.dateLabel,mood.value];meterFill.style.width=(now.filter(Boolean).length*20)+'%';if(armed)now.forEach((v,i)=>{if(v&&v!==seen[i])say(english()?repliesEn[i]:replies[i](readValue(i)))});seen=now};
let auto=0;document.querySelector('.wrap').addEventListener('click',e=>{if(!e.target.closest('.opt,.qtybtn,.budgetcard,.datechip'))return;clearTimeout(auto);const at=step;if(at<5)auto=setTimeout(()=>{if(step===at)next()},520)});
show();refresh();paintRail();sync();armed=true;
})();
