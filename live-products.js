// Lane C phase 2 — ให้หน้าสินค้าขับด้วยข้อมูลจาก ERP (single source of truth).
// ดึงสินค้าที่ติดธง web:true → แทนที่ array `products` ในกริดหลัก แล้ววาดใหม่
// → สินค้าเข้าหมวดจริง + ตัวกรองงบ/ค้นหา/หน้ารายละเอียด ทำงานครบ.
// ถ้า endpoint ล่ม/ไม่มีสินค้า → คงสินค้าเดิมไว้ (fallback ไม่พังหน้า).
(async () => {
  const ENDPOINT = 'https://ruka-erp.vercel.app/api/public-products';
  const EMOJI = { drink: '🥤', bag: '👜', tech: '🔌', apparel: '👕', eco: '🌱', pack: '📦', life: '🎁' };
  const q1 = (s) => String(s == null ? '' : s).replace(/'/g, '’'); // กัน onclick พังจาก single quote
  const attr = (s) => String(s == null ? '' : s).replace(/"/g, '&quot;');

  // บังคับรูป ERP ให้พอดีกรอบ .photo ทุกเบราว์เซอร์ (กัน Safari/Chrome ปล่อยรูปสูงตามจริงแล้วล้นไปทับชื่อ/ราคา)
  try {
    const st = document.createElement('style');
    st.textContent =
      '#grid .card .photo{overflow:hidden}' +
      '#grid .card .photo img{position:absolute;inset:0;width:100%;height:100%;padding:16px;box-sizing:border-box;object-fit:contain;display:block}';
    document.head.appendChild(st);
  } catch (e) {}

  try {
    const res = await fetch(ENDPOINT, { cache: 'no-store' });
    if (!res.ok) return;
    const data = await res.json();
    const items = Array.isArray(data.products) ? data.products : [];
    if (!items.length) return;                       // ยังไม่มีสินค้าติดธง → คงของเดิม
    if (typeof products === 'undefined' || typeof render !== 'function') return;

    // Reuse the public feed when navigating to details (five-minute freshness).
    try { sessionStorage.setItem('rukaPublicProducts', JSON.stringify({ savedAt: Date.now(), products: items })); } catch (e) {}

    const rows = items.map((p) => {
      const photo = p.image
        ? `<img src="${attr(p.image)}" alt="" loading="lazy" decoding="async">`       // สไตล์คุมด้วย <style> ด้านบน
        : (EMOJI[p.category] || '🎁');
      const moq = p.moq ? 'MOQ ' + p.moq : 'MOQ 100';
      const lead = p.leadTime ? p.leadTime + ' วัน' : '';
      // ช่วงราคา floor–ราคาแนะนำ (เช่น ฿138–207) · ถ้ามีค่าเดียวก็โชว์ค่าเดียว
      const lo = p.price, hi = p.priceMax;
      const price = lo ? (hi && hi > lo ? `฿${lo}–${hi}` : '฿' + lo) : '';
      const custom = p.printType || 'ปรับแต่งโลโก้ได้';
      // รูปแบบ positional เดียวกับ array products เดิม: [รูป, ชื่อ, หมวด, MOQ, lead, ราคา, badge, custom]
      return [photo, q1(p.name), p.category || 'life', moq, lead, price, '', q1(custom)];
    });

    // ── โชว์รหัสสินค้าเป็นแท็กมุมรูปบนการ์ด (ดูเร็ว ๆ · ลูกค้าอ้างรหัสกับเซลได้) ──
    const codeByName = {};
    items.forEach((p) => { if (p.name) codeByName[String(p.name).trim()] = p.code; });
    const injectCodes = () => {
      document.querySelectorAll('#grid .card').forEach((card) => {
        if (card.querySelector('.erp-code-tag')) return;
        const h3 = card.querySelector('h3'); if (!h3) return;
        const code = codeByName[h3.textContent.trim()]; if (!code) return;
        const photo = card.querySelector('.photo'); if (!photo) return;
        photo.style.position = 'relative';
        const t = document.createElement('span');
        t.className = 'erp-code-tag'; t.textContent = code;
        photo.appendChild(t);
      });
    };
    try {
      const s = document.createElement('style');
      s.textContent = '#grid .card .erp-code-tag{position:absolute;top:10px;left:10px;background:#fff;color:#b41616;border:1px solid #f3c9c0;font:800 11px "SF Mono",ui-monospace,Menlo,monospace;letter-spacing:.5px;padding:3px 8px;border-radius:7px;box-shadow:0 1px 4px #0000000f;z-index:2}';
      document.head.appendChild(s);
    } catch (e) {}
    // re-inject ทุกครั้งที่กริดวาดใหม่ (เช่น ตอนกรอง) — idempotent ไม่ซ้ำ
    const gridEl = document.getElementById('grid');
    if (gridEl && 'MutationObserver' in window) new MutationObserver(() => injectCodes()).observe(gridEl, { childList: true });

    products.length = 0;                              // mutate array เดิม (const แก้ค่าไม่ได้ แต่ mutate ได้)
    rows.forEach((r) => products.push(r));
    render();                                          // วาดกริดใหม่ด้วยสินค้าจาก ERP
    injectCodes();                                     // ครั้งแรก
  } catch (e) {
    /* เงียบ — คงสินค้าเดิมไว้ */
  }
})();
