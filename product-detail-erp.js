// Lane C phase 2 — หน้ารายละเอียดสินค้า: ถ้าเปิดสินค้าที่มาจาก ERP (web:true) ให้ดึงข้อมูลจริงมาแทน
// ค่า hardcode เดิม. ถ้าไม่ใช่สินค้า ERP → คงพฤติกรรมเดิม.
(async () => {
  const ENDPOINT = 'https://ruka-erp.vercel.app/api/public-products';
  const requested =
    new URLSearchParams(location.search).get('product') ||
    localStorage.getItem('rukaProductDetail') || '';
  const finish = () => document.documentElement.classList.remove('product-pending');
  if (!requested || (typeof catalog !== 'undefined' && Object.hasOwn(catalog, requested))) { finish(); return; }
  const attr = (s) => String(s == null ? '' : s).replace(/"/g, '&quot;');
  const esc = (s) => String(s == null ? '' : s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  try {
    let items = [];
    try {
      const cached = JSON.parse(sessionStorage.getItem('rukaPublicProducts') || 'null');
      if (cached && Date.now() - cached.savedAt >= 0 && Date.now() - cached.savedAt < 300000 && Array.isArray(cached.products)) items = cached.products;
    } catch (e) {}
    const clean = rukaCatalog.clean;
    const matches = (x) => x.code === requested || clean(x.name) === clean(requested);
    let p = items.find(matches);
    if (!p) {
      const res = await fetch(ENDPOINT, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) throw new Error('Product feed unavailable');
      const data = await res.json();
      items = Array.isArray(data.products) ? data.products : [];
      try { sessionStorage.setItem('rukaPublicProducts', JSON.stringify({ savedAt: Date.now(), products: items })); } catch (e) {}
      p = items.find(matches);
    }
    if (!p) throw new Error('Product not found');
    selected = clean(p.name) + (p.code ? ' (' + p.code + ')' : '');
    const saveButton = document.querySelector('.secondary');
    if (saveButton) saveButton.setAttribute('aria-label', 'บันทึก ' + selected);

    const set = (id, v) => { const el = document.getElementById(id); if (el && v != null && v !== '') el.textContent = v; };

    // ── ฟอนต์สม่ำเสมอ + Ruka Warm polish (แดง/ทอง/ครีม อบอุ่น มีชีวิต) ──
    const st = document.createElement('style');
    st.textContent = [
      '.details h1{font-family:Arial,"Helvetica Neue",sans-serif}',
      // กรอบรูปหุ้มรูปพอดี ไม่ยืดตามคอลัมน์ขวา (ลดช่องว่าง)
      '.mainimg{align-self:start;min-height:auto;height:auto}',
      // ป้ายรหัสสินค้า (อ่านง่ายแบบโค้ด · ให้ลูกค้าแจ้งเซล)
      '.erp-code{display:inline-block;margin-left:10px;padding:3px 12px;border-radius:8px;background:#fff0ec;color:#b41616;border:1.5px solid #f3c9c0;font:800 13px "SF Mono",ui-monospace,Menlo,monospace;letter-spacing:.5px;vertical-align:middle;white-space:nowrap}',
      // ราคาเด่นสีแบรนด์
      '.details .price{color:#b41616}',
      // การ์ดสเปคพื้นครีม + ไอคอน
      '.erp-specs{margin-top:18px;background:#fbf8f3;border:1px solid #efe4d2;border-radius:16px;padding:15px 18px;display:grid;gap:11px}',
      '.erp-specs .row{display:flex;gap:11px;align-items:flex-start;font-size:13.5px;line-height:1.55}',
      '.erp-specs .ic{font-size:16px;width:22px;text-align:center;flex-shrink:0}',
      '.erp-specs .k{min-width:74px;font-weight:800;color:#9a5b2b}',
      '.erp-specs .v{color:#4a4a4a;white-space:pre-line;flex:1}',
      // หัวข้อ "ต่อยอดโลโก้" + ขีดทอง-แดง
      '.custom h3::after{content:"";display:block;width:46px;height:3px;background:linear-gradient(90deg,#e8a51d,#b41616);border-radius:3px;margin-top:9px}',
      // ชิปเทคนิค = ครีม/แดง hover เด้ง
      '.custom .chips{display:flex;flex-wrap:wrap;gap:8px}',
      '.custom .chips .chip{background:#fff6f4;border:1.5px solid #f0c4bb;color:#b41616;font-weight:700;border-radius:20px;padding:7px 14px;font-size:13px;transition:.15s;cursor:pointer;user-select:none}',
      '.custom .chips .chip:hover{transform:translateY(-2px);box-shadow:0 4px 12px #b4161633}',
      '.custom .chips .chip.sel{background:#b41616;color:#fff;border-color:#b41616}',
      '.custom .chips .chip.sel::before{content:"\\2713 "}',
      '.erp-tech-hint{font-size:12px;color:#8a5a2b;margin:2px 0 10px}',
      // โน้ตอุ่น ๆ
      '.branding-note{color:#9a7b52;font-style:italic;font-size:12px;margin-top:12px}',
      // การ์ด MOQ/Lead/เหมาะกับ — ไอคอนน่ารัก + ลูกเล่น hover
      '.facts .fact{transition:transform .15s,box-shadow .15s,border-color .15s}',
      '.facts .fact:hover{transform:translateY(-3px);border-color:#f0c4bb;box-shadow:0 8px 20px #b4161318}',
      '.facts .fact small{letter-spacing:.2px}',
    ].join('');
    document.head.appendChild(st);

    // ── ชื่อ + ป้ายรหัสสินค้า (ข้างชื่อ · ลูกค้าอ้างอิงกับเซล → เปิด ERP ดูราคาได้ทันที) ──
    // ขนาดย้ายไปอยู่ในสเปคด้านล่างแทน (ลูกค้าส่วนใหญ่เลือกจากรูปทรงมากกว่าขนาด)
    const nameEl = document.getElementById('name');
    if (nameEl) {
      const paintName = () => {
        nameEl.textContent = rukaCatalog.name(p);
        if (p.code) nameEl.insertAdjacentHTML('beforeend', ` <span class="erp-code" title="รหัสสินค้า — แจ้งเซลเพื่อเช็คราคาได้เลย">${esc(p.code)}</span>`);
      };
      paintName();
      addEventListener('rukaLanguageChange', paintName);
    }

    if (p.image) {
      const emoji = document.getElementById('emoji');
      if (emoji) emoji.outerHTML = `<img id="emoji" src="${attr(p.image)}" alt="${attr(p.name)}" style="max-width:100%;max-height:100%;object-fit:contain">`;
      const thumbs = document.querySelector('.thumbs');
      const imgs = Array.isArray(p.images) && p.images.length ? p.images : [p.image];
      if (thumbs) {
        thumbs.innerHTML = imgs.map((u, i) =>
          `<button class="thumb${i === 0 ? ' active' : ''}" onclick="document.getElementById('emoji').src='${attr(u)}'"><img src="${attr(u)}" style="width:100%;height:100%;object-fit:cover;border-radius:11px" alt=""></button>`
        ).join('');
      }
    }

    // ── ราคาช่วง (target ต่ำสุด–สูงสุด) ──
    const price = document.getElementById('price');
    if (price) {
      const lo = p.price, hi = p.priceMax;
      price.innerHTML = lo
        ? (hi && hi > lo
            ? `฿${lo}–${hi} <small>/ ชิ้น · ยิ่งสั่งเยอะยิ่งถูก</small>`
            : `เริ่มต้น ฿${lo} <small>/ ชิ้น · ราคาโดยประมาณ</small>`)
        : 'ขอใบเสนอราคา';
    }

    // ── ไอคอนน่ารักในการ์ด MOQ / Lead time / เหมาะกับ (ใส่ลูกเล่น) ──
    document.querySelectorAll('.facts .fact').forEach((f) => {
      const label = f.querySelector('small');
      if (!label || label.dataset.iced) return;
      const t = label.textContent;
      const ic = /MOQ|ขั้นต่ำ/i.test(t) ? '📦' : /lead|เวลา|ผลิต/i.test(t) ? '⏱️' : /เหมาะ|gift|occasion/i.test(t) ? '🎁' : '✨';
      label.textContent = ic + ' ' + t.trim();
      label.dataset.iced = '1';
    });

    set('moq', p.moq ? p.moq + ' ' + (p.unit || 'ชิ้น') : '');
    set('leadtime', p.leadTime ? p.leadTime + ' วัน' : '');

    // คำโปรยสั้น ๆ (คุณสมบัติเด่น) — มีของจริงค่อยโชว์ · ไม่มีก็ซ่อน filler เทมเพลตกันรก
    const leadTag = document.getElementById('lead');
    if (p.performance || p.note) { set('lead', p.performance || p.note); }
    else if (leadTag) { leadTag.textContent = ''; leadTag.style.display = 'none'; }

    // ── แผงสเปค: วัสดุ / สีที่ผลิตได้ (ขนาด→ข้างชื่อ · เทคนิค→ส่วน "ต่อยอดโลโก้") ──
    const lead = document.getElementById('lead');
    if (lead) {
      const specs = [];
      if (p.material) specs.push(['⚙️', 'วัสดุ', p.material]);
      if (clean(p.size)) specs.push(['📐', 'ขนาด/ความจุ', clean(p.size)]); // รองรับหลายขนาด เช่น "350 ML, 510 ML"
      // สี = ชวนลูกค้าสอบถาม/ระบุสี (ตรงกับ ERP)
      if (p.colors) specs.push(['🎨', 'สีที่ผลิตได้', p.colors + ' · สอบถาม/ระบุสีที่ต้องการกับทีมงาน']);
      if (specs.length) {
        lead.insertAdjacentHTML('afterend',
          '<div class="erp-specs">' +
          specs.map(([ic, k, v]) =>
            `<div class="row"><span class="ic">${ic}</span><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`
          ).join('') +
          '</div>');
      }
    }

    // ── ส่วน "สินค้านี้ต่อยอดโลโก้แบบไหนได้บ้าง?" — ใช้เทคนิคจริงจาก ERP ──
    // product-branding.js สร้างส่วนนี้ไว้ก่อนแล้ว → ลบ "พิจารณาจาก:", ใส่เทคนิคจริง, คงโน้ตเล็ก ๆ
    const custom = document.querySelector('.custom');
    if (custom) {
      const intro = custom.querySelector('.branding-material');
      if (intro) intro.remove(); // เอา "พิจารณาจาก: วัสดุ..." ออก
      const techs = String(p.printType || '').split(',').map((s) => s.trim()).filter(Boolean);
      const chips = custom.querySelector('.chips');
      if (chips && techs.length) {
        // แตะเลือกเทคนิคที่ "สนใจ" ได้ (ไม่บังคับ · ทีมยืนยันความเป็นไปได้อีกที) → เก็บลง localStorage ให้เซลเห็น
        const KEY = 'rukaProductTech';
        let picked = [];
        try { picked = JSON.parse(localStorage.getItem(KEY) || '[]'); if (!Array.isArray(picked)) picked = []; } catch (e) { picked = []; }
        const save = () => { try { localStorage.setItem(KEY, JSON.stringify(picked)); } catch (e) {} };
        // มีเทคนิคนี้อยู่จริงเท่านั้นที่คงค่าเลือกไว้
        picked = picked.filter((t) => techs.includes(t)); save();
        const hint = document.createElement('p');
        hint.className = 'erp-tech-hint';
        hint.textContent = '👉 แตะเลือกเทคนิคที่สนใจได้ (ไม่บังคับ) — ราคาขึ้นกับเทคนิค (ปักมักสูงกว่าสกรีน) ทีมยืนยันราคาตามงานจริง';
        chips.before(hint);
        chips.replaceChildren();
        techs.forEach((t) => {
          const c = document.createElement('span');
          c.className = 'chip' + (picked.includes(t) ? ' sel' : '');
          c.textContent = t;
          c.onclick = () => {
            if (picked.includes(t)) { picked = picked.filter((x) => x !== t); c.classList.remove('sel'); }
            else { picked.push(t); c.classList.add('sel'); }
            save();
          };
          chips.append(c);
        });
      }
      // โน้ตเล็ก ๆ (คงไว้ ถ้ายังไม่มีให้เพิ่ม)
      if (!custom.querySelector('.branding-note')) {
        const note = document.createElement('p');
        note.className = 'branding-note';
        note.textContent = 'แนวทางเบื้องต้นสำหรับคุยกับทีม — ต้องยืนยันวัสดุจริง ผิวเคลือบ และพื้นที่โลโก้ของรุ่นนี้ก่อนเลือกเทคนิคผลิต';
        custom.append(note);
      }
    }
  } catch (e) {
    const status = document.getElementById('product-status');
    if (status) status.textContent = 'โหลดสินค้าไม่สำเร็จ กรุณารีเฟรชเพื่อลองอีกครั้ง';
    return;
  }
  finish();
})();
