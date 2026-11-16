// Order terms: one wording for every page that shows them (product, products, how, brief, gift planner, terms).
// Edit the sentence here only. The English text lives in language.js under the same Thai keys.
(() => {
 const TITLE = 'เงื่อนไขการสั่งผลิต';
 const TEXT = 'ขั้นต่ำ 100 ชิ้นต่อแบบ เวลาผลิตเริ่มต้น 30–35 วัน ซึ่งเป็นประมาณการ ทีมจะยืนยันตามงาน และมีมัดจำ 50% เมื่อยืนยันแบบ';
 const boxes = document.querySelectorAll('[data-order-terms]');
 if (!boxes.length) return;
 const style = document.createElement('style');
 style.textContent = '.order-terms{display:flex;flex-wrap:wrap;gap:4px 8px;align-items:baseline;margin:16px 0;padding:12px 14px;border:1px solid #ecdcc0;border-left:3px solid #b41616;border-radius:10px;background:#fffaf1;color:#3a3127;font-size:14px;line-height:1.6;text-align:left}'
  + '.order-terms strong{color:#b41616;font-weight:800}'
  + '.order-terms--plain{display:block;padding:0;border:0;background:none;font-size:inherit;color:inherit}.order-terms--plain strong{color:inherit}';
 document.head.append(style);
 boxes.forEach(box => {
  box.setAttribute('role', 'note');
  const title = document.createElement('strong');
  title.textContent = TITLE;
  const text = document.createElement('span');
  text.textContent = TEXT;
  box.replaceChildren(title, text);
 });
})();
