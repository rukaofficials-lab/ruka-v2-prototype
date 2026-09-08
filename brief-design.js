/* Presentation layer: retain the existing answers, validation and handoff. */
(()=>{
const designs={
 employee:['มอบให้ทีมในโอกาสไหน?',['👋','ต้อนรับสมาชิกใหม่','ของขวัญเริ่มงาน'],['🏆','ขอบคุณและให้รางวัล','ฉลองผลงานของทีม'],['🎂','ฉลองครบรอบ','วันสำคัญและความสำเร็จ'],['🎉','กิจกรรมในทีม','งานบริษัทหรือแคมเปญภายใน']],
 client:['อยากส่งความประทับใจให้ใคร?',['🎁','ลูกค้าทั่วไป','ขอบคุณที่เลือกแบรนด์เรา'],['🤝','ลูกค้าคนสำคัญ','ดูแลความสัมพันธ์ระยะยาว'],['👑','VIP และผู้บริหาร','ของขวัญสำหรับคนพิเศษ'],['🌟','คู่ค้าและพาร์ตเนอร์','ขอบคุณที่เติบโตไปด้วยกัน']],
 event:['กำลังเตรียมของสำหรับงานไหน?',['🎤','สัมมนาและประชุม','ของใช้สำหรับผู้ร่วมงาน'],['🎵','คอนเสิร์ตและเทศกาล','พกความสนุกกลับบ้าน'],['🎪','นิทรรศการและบูธ','ให้คนจดจำแบรนด์'],['🚀','งานเปิดตัว','สร้างความประทับใจแรก']],
 campaign:['อยากให้แคมเปญนี้ช่วยอะไร?',['📣','ให้คนจำแบรนด์','สร้างการรับรู้'],['💬','ชวนคนมีส่วนร่วม','ให้คนอยากแชร์และบอกต่อ'],['🏆','มอบรางวัล','ขอบคุณและสร้างแรงจูงใจ'],['🚀','เปิดตัวสินค้า','ให้ของขวัญช่วยเล่าเรื่อง']],
 seasonal:['ปีนี้อยากส่งของขวัญให้ใคร?',['👋','พนักงาน','ขอบคุณทีมที่ร่วมสร้างผลงาน'],['🎁','ลูกค้าทั่วไป','ส่งความสุขให้คนที่ไว้ใจเรา'],['👑','VIP และผู้บริหาร','เพิ่มความพิเศษให้คนสำคัญ'],['🤝','คู่ค้า','ฉลองความสำเร็จไปด้วยกัน']],
 unsure:['เริ่มจากสิ่งที่คุณรู้ก่อนได้เลย',['👥','รู้ว่าให้ใคร','เริ่มจากคนรับของขวัญ'],['💰','มีงบในใจ','ช่วยเลือกให้เหมาะกับงบ'],['🎉','รู้ว่าจะใช้ในงานไหน','เริ่มจากโอกาสของคุณ'],['💡','มีไอเดียคร่าว ๆ','ค่อย ๆ คิดต่อด้วยกัน']]
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
 for(const id of Object.keys(editSteps)){const el=document.getElementById(id);el.closest('.row').hidden=!el.textContent.trim()||el.textContent==='—'}
 if(detailNames.has(data.detail))sDetail.textContent=detailNames.get(data.detail);
 document.querySelectorAll('#q1options .opt').forEach((b,i)=>b.setAttribute('aria-pressed',String(data.detail===f.options[i])));
 document.querySelectorAll('.qtybtn,.budgetcard,.datechip').forEach(b=>b.setAttribute('aria-pressed',String(b.classList.contains('selected'))));
}
const savedSync=sync;sync=function(){savedSync();refresh()};
const savedShow=show;show=function(){savedShow();stepLabel.textContent='ขั้นที่ '+step+' จาก 5';document.querySelectorAll('.q h2').forEach(h=>h.tabIndex=-1);document.querySelector('.q.active h2')?.focus({preventScroll:true})};
mood.addEventListener('input',refresh);
qty.setAttribute('aria-label','จำนวนชุด');date.setAttribute('aria-label','วันที่ต้องการรับสินค้า');mood.setAttribute('aria-label','รูปแบบหรือความรู้สึกที่ต้องการ');
const moodLabel=document.createElement('p');moodLabel.className='qlead';moodLabel.textContent='เลือกแนวที่ชอบ หรือเล่าไอเดียเพิ่มเติมได้เลย';mood.before(moodLabel);
const moods=document.createElement('div');moods.className='brief-moods';['✨ เรียบหรู','🌿 ธรรมชาติ','🎨 สดใส','🤍 อบอุ่น'].forEach(text=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=()=>{mood.value=text.slice(text.indexOf(' ')+1);sync()};moods.append(b)});mood.before(moods);
show();refresh();
})();
