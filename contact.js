(() => {
 // ERP lead intake endpoint (Lane A). Web enquiries POST here → land in the ERP Sales Pipeline.
 const LEAD_ENDPOINT='https://ruka-erp.vercel.app/api/public-lead';

 const form=document.getElementById('messageForm');
 const message=document.getElementById('message');
 const status=document.getElementById('contactStatus');
 const brief=document.getElementById('handoff').textContent;
 if(brief.startsWith('บรีฟโปรเจกต์ RUKA'))message.value=brief;
 const hasBrief=brief.startsWith('บรีฟโปรเจกต์ RUKA');document.querySelector('.contact-brief').hidden=!hasBrief;document.getElementById('copyBrief').hidden=!hasBrief;

 // มาจาก flow บรีฟ → จัดหน้านี้ให้เป็น "สเต็ปสุดท้าย" (ขอแค่ชื่อ+เบอร์) ไม่ใช่ฟอร์มเขียนข้อความเต็ม
 // บรีฟถูกแนบไปให้แล้ว (โชว์ใน details ด้านล่าง) จึงซ่อนช่องข้อความก้อนใหญ่ที่ทำให้รู้สึกกรอกซ้ำ
 const cameFromBrief=brief.startsWith('บรีฟโปรเจกต์ RUKA')||!!localStorage.getItem('rukaBrief');
 if(cameFromBrief){
  const card=document.querySelector('.form-card');
  const h2=card&&card.querySelector('h2');
  const sub=card&&card.querySelector('.contact-muted');
  if(h2)h2.textContent='เกือบเสร็จแล้ว';
  if(sub)sub.textContent='เหลือแค่ชื่อกับเบอร์ เดี๋ยวทีม RUKA ติดต่อกลับพร้อมราคา — บรีฟของคุณแนบไปให้แล้ว';
  const msgLabel=message.closest('label');
  if(msgLabel)msgLabel.hidden=true;
  message.required=false;
 }

 const taxFields=document.getElementById('taxFields');
 document.getElementById('taxToggle').addEventListener('change',e=>{
  taxFields.hidden=!e.target.checked;
  taxFields.querySelectorAll('input,textarea').forEach(input=>input.disabled=!e.target.checked);
 });

 // Honeypot — hidden from real users; naive bots fill it and get silently dropped server-side.
 const honeypot=document.createElement('input');
 honeypot.type='text';honeypot.name='company_website';honeypot.tabIndex=-1;honeypot.autocomplete='off';
 honeypot.setAttribute('aria-hidden','true');
 honeypot.style.cssText='position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
 form.appendChild(honeypot);

 // Structured brief captured earlier in the flow (occasion/product/idea/qty/budget/date/mood/detail).
 function readBrief(){try{return JSON.parse(localStorage.getItem('rukaBrief')||'{}')}catch{return{}}}

 function payload(){
  const data=new FormData(form);
  const b=readBrief();
  return {
   name:[data.get('firstName'),data.get('lastName')].filter(Boolean).join(' '),
   email:data.get('email')||'',phone:data.get('phone')||'',
   company:data.get('company')||'',
   refLink:data.get('refLink')||'',
   taxId:data.get('taxId')||'',taxAddress:data.get('taxAddress')||'',
   line:'',
   message:message.value||'',
   occasion:b.occasionLabel||b.occasion||localStorage.getItem('rukaOccasion')||'',
   product:b.product||localStorage.getItem('rukaProduct')||'',
   printTech:(()=>{try{const a=JSON.parse(localStorage.getItem('rukaProductTech')||'[]');return Array.isArray(a)?a.join(', '):''}catch{return''}})(),
   idea:b.idea||localStorage.getItem('rukaIdea')||'',
   qty:b.quantity||'',budget:b.budget||localStorage.getItem('rukaIdeaBudget')||'',
   timeline:b.date||'',mood:b.mood||localStorage.getItem('rukaIdeaMood')||'',
   detail:b.detail||'',
   company_website:honeypot.value,
  };
 }

 // Fallback text (email / LINE) if the endpoint is unreachable — so no lead is ever lost.
 function fallbackBody(){
  const p=payload();
  return [
   ['ชื่อ',p.name],['อีเมล',p.email],['โทรศัพท์',p.phone],['บริษัท',p.company],
   ['ลิงก์รูปตัวอย่าง',p.refLink],
   ['เลขผู้เสียภาษี',p.taxId],['ที่อยู่ออกใบกำกับ',p.taxAddress],['ข้อความ',p.message]
  ].filter(([,v])=>v).map(([l,v])=>l+': '+v).join('\n');
 }
 function mailtoFallback(){
  status.textContent='ส่งผ่านระบบไม่สำเร็จ กำลังเปิดอีเมลให้แทน หากไม่เปิด ให้คัดลอกแล้วส่งทาง LINE @rukaworld';
  location.href='mailto:ruka.officials@gmail.com?subject='+encodeURIComponent('สอบถามโปรเจกต์ของขวัญองค์กร — RUKA')+'&body='+encodeURIComponent(fallbackBody());
 }

 form.addEventListener('submit',async e=>{
  e.preventDefault();
  const btn=form.querySelector('button[type=submit],button:not([type])');
  const p=payload();
  if(!p.name||(!p.phone&&!p.email)){status.textContent='กรุณากรอกชื่อ และเบอร์โทรหรืออีเมลอย่างน้อยหนึ่งช่อง';return}
  status.textContent='กำลังส่ง…';if(btn)btn.disabled=true;
  try{
   const res=await fetch(LEAD_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(p)});
   if(!res.ok)throw new Error('bad status '+res.status);
   await res.json();
   status.textContent='ส่งเรียบร้อย! ทีม RUKA จะติดต่อกลับภายใน 24 ชั่วโมง (จันทร์–ศุกร์)';
   window.rukaClearBrief();
   form.reset();
  }catch(err){
   if(btn)btn.disabled=false;
   mailtoFallback();
  }
 });

 document.getElementById('copyBrief').onclick=async()=>{
  try{await navigator.clipboard.writeText(fallbackBody());status.textContent='คัดลอกแล้ว เปิด LINE @rukaworld แล้ววางข้อความเพื่อส่งให้ทีม'}
  catch{status.textContent='คัดลอกอัตโนมัติไม่ได้ กรุณาเลือกข้อความและคัดลอกด้วยตนเอง'}
 };
})();
