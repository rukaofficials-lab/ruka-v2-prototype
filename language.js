(() => {
  const translations = {
    'สินค้า':'Products','บริการ':'Services','เกี่ยวกับ':'About','ติดต่อ':'Contact','ค้นหา':'Search',
    'ของขวัญองค์กรที่ดี':'Corporate gifts that matter','เริ่มจาก':'start with','ไอเดีย.':'an idea.',
    'ไม่ต้องเริ่มจากการเปิดแคตตาล็อก':'You don’t have to start with a catalogue',
    'บอกเราว่าคุณกำลังสร้างอะไร แล้ว RUKA จะช่วยต่อให้ครบ':'Tell us what you’re creating, and RUKA will help shape the rest.',
    'เริ่มจากโอกาสของคุณ':'Start with your occasion','อีเวนต์':'Event','พนักงาน':'Employees','แคมเปญ':'Campaign','ปีใหม่':'New Year','ยังไม่แน่ใจ':'Not sure yet',
    'Ruka คือสตูดิโอที่คิด ออกแบบ และผลิต — เพื่อสร้างประสบการณ์แบรนด์ที่ครบทุกสัมผัส':'Ruka is a creative studio that thinks, designs and produces complete brand experiences.',
    'ดีไซน์ไปด้วยกัน':'Design together','บรีฟสั้นๆ ทีมดีไซน์คิดต่อให้ แก้ได้จนใช่':'Share a short brief. Our design team develops it with you until it feels right.',
    'ติดตามเรียลไทม์':'Track in real time','อัปเดตอัตโนมัติ เห็นรูป QC ก่อนส่งจริง':'Get automatic updates and review QC photos before delivery.',
    'ขั้นต่ำยืดหยุ่น':'Flexible minimums','เริ่มต้น 50 ชิ้น ปรับได้ ผลิตทันงาน':'Start from 50 pieces, with flexible production built around your timeline.',
    'ดูแลเหมือนเพื่อน':'Here like a friend','หลังส่งมอบยังอยู่กับคุณ ซัพพอร์ตไม่มีหมด':'We stay with you after delivery, with support whenever you need it.',
    'แบรนด์และองค์กรที่ไว้วางใจ RUKA':'Brands and organisations that trust RUKA',
    'คุณกำลังสร้างของขวัญ':'What are you creating a gift','สำหรับโอกาสไหน?':'for?','ยังไม่ต้องเลือกสินค้า เลือกสิ่งที่ใกล้กับโจทย์ของคุณที่สุดก่อน แล้ว RUKA จะพาไปต่อทีละขั้น':'No need to choose a product yet. Start with the occasion closest to your brief, and RUKA will guide you step by step.',
    'พนักงาน & ทีม':'Employees & Teams','ลูกค้า & VIP':'Clients & VIPs','เทศกาล & ปีใหม่':'Festive & New Year','ยังไม่แน่ใจ / Open Brief':'Not sure / Open Brief',
    'เลือกตามโอกาส':'Shop by occasion','ไอเดีย':'Ideas','ผลงาน':'Work','วิธีการทำงาน':'How it works','เกี่ยวกับ RUKA':'About RUKA','เริ่มโปรเจกต์ →':'Start a project →','ให้ RUKA ช่วยคิด →':'Let RUKA help →',
    'สินค้าทั้งหมด':'All products','ค้นหาสินค้า':'Search products','เริ่มจากโจทย์ของคุณ →':'Start with your brief →',
    'เล่าโจทย์ให้เรารู้':'Tell us about your brief','เท่าที่จำเป็นก็พอ':'Only what matters','กำลังเตรียม Brief':'Preparing your brief',
    'ต้องการประมาณกี่ชุด?':'Approximately how many sets do you need?','อยากให้งบต่อชุดอยู่ประมาณไหน?':'What is your approximate budget per set?','ต้องการรับสินค้าภายในวันที่?':'When do you need the products?','อยากให้ของออกมาใน mood แบบไหน?':'What mood should the gift express?',
    'ขอราคาและเริ่มโปรเจกต์':'Get a quote and start','คุยกับทีม RUKA':'Talk to RUKA','กลับหน้าแรก':'Back to home','กลับไปดูสินค้าทั้งหมด':'Back to all products',
    'ทำอะไรกับแบรนด์คุณได้บ้าง?':'How can this work with your brand?','เพิ่มสินค้านี้เข้าโปรเจกต์':'Add this product to your project','บันทึกไว้':'Save',
    'เราไม่ได้หาของให้คุณ':'We don’t simply source products','เราออกแบบ':'We design a','Direction ให้':'direction for you','3 Directions for your project':'3 directions for your project',
    'ถูกใจชุดนี้แล้ว?':'Ready with this set?','ขอราคาและเริ่มโปรเจกต์ →':'Get a quote and start →'
  };
  const originals = new WeakMap();
  const textNodes = root => { const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){if(!node.nodeValue.trim()||/^(SCRIPT|STYLE|NOSCRIPT)$/.test(node.parentElement?.tagName||''))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT}});const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);return nodes };
  function applyLanguage(lang){document.documentElement.lang=lang==='en'?'en':'th';textNodes(document.body).forEach(node=>{if(!originals.has(node))originals.set(node,node.nodeValue);const original=originals.get(node);if(lang==='th'){node.nodeValue=original;return}const lead=original.match(/^\s*/)?.[0]||'',tail=original.match(/\s*$/)?.[0]||'',key=original.trim();if(translations[key])node.nodeValue=lead+translations[key]+tail});document.querySelectorAll('[data-lang]').forEach(button=>button.classList.toggle('active',button.dataset.lang===lang));localStorage.setItem('rukaLanguage',lang)}
  function markCurrentPage(){const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();document.querySelectorAll('body > nav a[href]').forEach(a=>{const href=(a.getAttribute('href')||'').split('?')[0].split('#')[0].toLowerCase();let active=false;if(page==='index.html'||page===''){active=href==='index.html'||href==='./'||href==='' }else if(page==='products.html'){active=href==='products.html'}else if(page==='occasion.html'){active=href==='occasion.html'}else if(page==='ideas.html'){active=href==='ideas.html'}else if(page==='about.html'){active=href==='about.html'}if(active&&!a.classList.contains('logo')){a.classList.add('active');a.setAttribute('aria-current','page')}})}
  window.setRukaLanguage=applyLanguage;
  document.addEventListener('DOMContentLoaded',()=>{
    const trust=document.querySelector('.trust');if(trust){trust.innerHTML='<div class="trustEyebrow">BRANDS THAT TRUST US</div><h2 class="trustTitle">แบรนด์และองค์กรที่ไว้วางใจ RUKA</h2><div class="trustBoard"><img src="assets/brands/brands-board.jpg?v=20260830" alt="องค์กรและแบรนด์ลูกค้า RUKA"></div>';const style=document.createElement('style');style.textContent='.trust{padding:54px 5vw 64px;background:#fff;color:#171717}.trustEyebrow{font-size:11px;font-weight:900;letter-spacing:.18em;color:#b41616;margin-bottom:10px}.trustTitle{font:700 34px Georgia;margin:0 0 28px}.trustBoard{max-width:1180px;margin:auto;border-top:1px solid #eee;border-bottom:1px solid #eee;padding:22px 0}.trustBoard img{display:block;width:100%;height:auto;mix-blend-mode:multiply}@media(max-width:760px){.trust{padding:40px 18px 48px}.trustTitle{font-size:28px}.trustBoard{overflow:hidden}.trustBoard img{width:160%;max-width:none;transform:translateX(-18%)}}';document.head.appendChild(style)}
    markCurrentPage();document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>applyLanguage(button.dataset.lang)));applyLanguage(localStorage.getItem('rukaLanguage')==='en'?'en':'th');
  });
})();
