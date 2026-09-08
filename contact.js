(() => {
 const form=document.getElementById('messageForm');
 const message=document.getElementById('message');
 const brief=document.getElementById('handoff').textContent;
 if(brief.startsWith('บรีฟโปรเจกต์ RUKA'))message.value=brief;
 const taxFields=document.getElementById('taxFields');
 document.getElementById('taxToggle').addEventListener('change',e=>{
  taxFields.hidden=!e.target.checked;
  taxFields.querySelectorAll('input,textarea').forEach(input=>input.disabled=!e.target.checked);
 });
 function body(){
  const data=new FormData(form);
  return [
   ['ชื่อ',[data.get('firstName'),data.get('lastName')].filter(Boolean).join(' ')],
   ['อีเมล',data.get('email')],['โทรศัพท์',data.get('phone')],
   ['บริษัท',data.get('company')],['เลขผู้เสียภาษี',data.get('taxId')],
   ['ที่อยู่ออกใบกำกับ',data.get('taxAddress')],['ข้อความ',message.value]
  ].filter(([,v])=>v).map(([label,value])=>label+': '+value).join('\n');
 }
 form.addEventListener('submit',e=>{
  e.preventDefault();
  document.getElementById('contactStatus').textContent='กรุณากดส่งในแอปอีเมล หากแอปไม่เปิด ให้คัดลอกข้อความแล้วส่งทาง LINE';
  location.href='mailto:ruka.officials@gmail.com?subject='+encodeURIComponent('สอบถามโปรเจกต์ของขวัญองค์กร — RUKA')+'&body='+encodeURIComponent(body());
 });
 document.getElementById('copyBrief').onclick=async()=>{
  try{await navigator.clipboard.writeText(body());document.getElementById('contactStatus').textContent='คัดลอกแล้ว เปิด LINE @rukaworld แล้ววางข้อความเพื่อส่งให้ทีม'}
  catch{document.getElementById('contactStatus').textContent='คัดลอกอัตโนมัติไม่ได้ กรุณาเลือกข้อความและคัดลอกด้วยตนเอง'}
 };
})();
