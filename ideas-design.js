// Client wall: moving columns of real work; choosing a piece opens that brand's profile.
(() => {
 const wall = document.getElementById('clWall');
 const dialog = document.getElementById('clProfile');
 if (!wall || !dialog) return;
 const V = '?v=20261106-c';
 const brands = [
  {name: 'UNICEF Thailand', logo: 'unicef.jpg', made: ['สมุดโน้ต', 'สมุด A5'], pics: [['unicef-1', 0], ['unicef-2', 1]]},
  {name: 'Medyceles', logo: 'medyceles.jpg', made: ['ที่ประคบเย็น', 'กล่องบรรจุ'], pics: [['medyceles-1', 0], ['medyceles-2', 0]]},
  {name: 'JLL', logo: 'jll.png', made: ['กระเป๋าเครื่องมือช่าง', 'เสื้อกีฬาผ้ารังผึ้ง'], pics: [['jll-1', 0], ['jll-2', 1]]},
  {name: 'เขตรักษาพันธุ์สัตว์ป่าห้วยขาแข้ง', letter: 'ห', made: ['กระบอกน้ำด้ามจับเอียง 500 ml'], pics: [['huai-1', 1], ['huai-2', 1]]},
  {name: 'โต๊ะกลม', logo: 'toeklom.jpg', made: ['กระเป๋าแคนวาส', 'Giftset พัดลม'], pics: [['toeklom-1', 1], ['toeklom-2', 1]]},
  {name: 'Generali', logo: 'generali.jpg', made: ['หมวกแก๊ป'], pics: [['generali-1', 0]]},
  {name: 'SuperRich', logo: 'superrich.jpg', made: ['ร่มกอล์ฟ 30 นิ้ว'], pics: [['superrich-1', 0]]},
  {name: 'MuzikMove', logo: 'muzikmove.jpg', made: ['ซองใส่บัตรพนักงานพร้อมสายคล้อง'], pics: [['muzikmove-1', 1]]},
  {name: 'The Val', logo: 'theval.jpg', made: ['ร่มกอล์ฟ'], pics: [['theval-1', 1]]},
  {name: 'Pathé', logo: 'pathe.jpg', made: ['หมวกแก๊ป'], pics: [['pathe-1', 0]]},
 ];
 const src = key => `assets/clients/${key}.webp${V}`;
 const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
 const mark = brand => {
  const box = el('span', 'cl-logo' + (brand.logo ? '' : ' cl-logo--text'), brand.logo ? '' : brand.letter);
  if (brand.logo) { const img = el('img'); img.src = 'assets/brands/partners/' + brand.logo; img.alt = ''; box.append(img); }
  return box;
 };
 const open = brand => {
  dialog.replaceChildren();
  const close = el('button', 'cl-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'ปิด');
  close.onclick = () => dialog.close();
  const head = el('header');
  head.append(mark(brand), el('h3', '', brand.name));
  const pics = el('div', 'cl-pics' + (brand.pics.length === 1 ? ' one' : ''));
  brand.pics.forEach(([key, fit]) => {
   const tile = el('span', fit ? 'fit' : '');
   const img = el('img');
   img.src = src(key);
   img.alt = 'งานของ ' + brand.name;
   tile.append(img);
   pics.append(tile);
  });
  const made = el('ul', 'cl-made');
  brand.made.forEach(item => made.append(el('li', '', item)));
  const go = el('a', 'cl-go', 'อยากได้แนวนี้ →');
  go.href = 'brief.html';
  const foot = el('footer');
  foot.append(made, go);
  dialog.append(close, head, pics, foot);
  dialog.showModal();
 };
 dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

 const tiles = brands.flatMap(brand => brand.pics.map(([key, fit]) => ({brand, key, fit})));
 // Deal tiles across columns so one brand does not sit in a clump.
 const order = [0, 6, 11, 3, 13, 8, 1, 10, 5, 14, 2, 12, 7, 4, 9].map(i => tiles[i]).filter(Boolean);
 const build = (list, hidden) => list.map(({brand, key, fit}) => {
  const button = el('button', 'cl-tile' + (fit ? ' fit' : ''));
  button.type = 'button';
  const img = el('img');
  img.src = src(key);
  img.alt = '';
  img.decoding = 'async';
  const tag = el('span', 'cl-tag', brand.name);
  button.append(img, tag);
  button.onclick = () => open(brand);
  if (hidden) { button.tabIndex = -1; button.setAttribute('aria-hidden', 'true'); } else button.setAttribute('aria-label', 'ดูงานของ ' + brand.name);
  return button;
 });
 // Phones get two columns, so every piece is dealt into a column that is on screen.
 const render = () => {
  const count = innerWidth <= 900 ? 2 : 4;
  if (wall.childElementCount === count) return;
  const columns = Array.from({length: count}, () => []);
  order.forEach((tile, index) => columns[index % count].push(tile));
  wall.replaceChildren(...columns.map((list, index) => {
   const col = el('div', 'cl-col' + (index % 2 ? ' down' : ''));
   col.style.setProperty('--speed', 44 + index * 6 + 's');
   const track = el('div', 'cl-track');
   track.append(...build(list, false), ...build(list, true));
   col.append(track);
   return col;
  }));
 };
 addEventListener('resize', render);
 render();
})();
