// Last brief step: collects contact details here and sends the lead straight to the ERP.
(() => {
 const LEAD_ENDPOINT = 'https://ruka-erp.vercel.app/api/public-lead';
 const form = document.getElementById('briefSend');
 if (!form) return;
 const status = document.getElementById('briefSendStatus');
 const button = form.querySelector('button[type=submit]');
 const readBrief = () => { try { return JSON.parse(localStorage.getItem('rukaBrief') || '{}'); } catch { return {}; } };

 const honeypot = document.createElement('input');
 honeypot.type = 'text';
 honeypot.name = 'company_website';
 honeypot.tabIndex = -1;
 honeypot.autocomplete = 'off';
 honeypot.setAttribute('aria-hidden', 'true');
 honeypot.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0';
 form.append(honeypot);

 const summary = b => {
  const lines = [['แพ็กเกจตั้งต้น', b.packageName], ['งบรวมตั้งต้น', b.totalBudget ? Number(b.totalBudget).toLocaleString('th-TH') + ' บาท' : ''], ['โอกาส', b.occasionLabel], ['รายละเอียด', b.detail], ['สินค้า', b.product], ['โจทย์', b.intent], ['ไอเดีย', b.idea], ['จำนวน', b.quantity], ['งบต่อชุด', b.budget], ['วันรับ', b.date], ['Mood', b.mood]];
  return 'บรีฟโปรเจกต์ RUKA\n' + lines.filter(([, v]) => v).map(([k, v]) => k + ': ' + v).join('\n');
 };
 const payload = () => {
  const data = new FormData(form);
  const b = readBrief();
  const value = key => String(data.get(key) || '').trim();
  return {name: value('name'), email: value('email'), phone: value('phone'), company: value('company'), refLink: '', taxId: '', taxAddress: '', line: '', message: summary(b), occasion: b.occasionLabel || b.occasion || '', product: b.product || localStorage.getItem('rukaProduct') || '', printTech: '', idea: b.idea || '', qty: b.quantity || '', budget: b.budget || '', timeline: b.date || '', mood: b.mood || '', detail: b.detail || '', company_website: honeypot.value};
 };
 const emailInstead = p => {
  status.textContent = 'ส่งผ่านระบบไม่สำเร็จ กำลังเปิดอีเมลให้แทน หรือส่งทาง LINE @rukaworld';
  const body = ['ชื่อ: ' + p.name, 'โทรศัพท์: ' + p.phone, 'อีเมล: ' + p.email, 'บริษัท: ' + p.company, '', p.message].join('\n');
  location.href = 'mailto:ruka.officials@gmail.com?subject=' + encodeURIComponent('บรีฟโปรเจกต์ RUKA') + '&body=' + encodeURIComponent(body);
 };
 form.addEventListener('submit', async event => {
  event.preventDefault();
  const p = payload();
  if (!p.name || (!p.phone && !p.email)) { status.textContent = 'กรุณากรอกชื่อ และเบอร์โทรหรืออีเมลอย่างน้อยหนึ่งช่อง'; return; }
  status.textContent = 'กำลังส่ง…';
  button.disabled = true;
  try {
   const response = await fetch(LEAD_ENDPOINT, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(p)});
   if (!response.ok) throw new Error('bad status ' + response.status);
   await response.json();
   window.rukaClearBrief?.();
   document.getElementById('complete').classList.add('is-sent');
  } catch (error) {
   button.disabled = false;
   emailInstead(p);
  }
 });
})();
