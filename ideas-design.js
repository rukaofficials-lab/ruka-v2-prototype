// Client wall: moving columns of real work; choosing a piece opens that brand's profile.
(() => {
 const wall = document.getElementById('clWall');
 const dialog = document.getElementById('clProfile');
 if (!dialog) return;
 const V = '?v=20261110-b';
 // Each brand lists what it made: real photos for the profile, layout/design images for the moving wall.
 const brands = [
  {name: 'JLL', logo: 'jll.png', works: [
   {item: 'กระเป๋าเครื่องมือช่าง', type: ['กระเป๋า'], real: ['jll-bag', 'jll-bags', 'jll-boxes'], design: ['jll-bag-spec']},
   {item: 'เสื้อกีฬาผ้ารังผึ้ง', type: ['เสื้อ'], real: ['jll-shirts'], design: ['jll-shirt-template']}]},
  {name: 'Medyceles', logo: 'medyceles.jpg', works: [
   {item: 'ที่ประคบเย็น', type: ['ของใช้อื่น ๆ'], real: ['medyceles-pink', 'medyceles-rollers', 'medyceles-close'], design: []},
   {item: 'กล่องบรรจุ', type: ['บรรจุภัณฑ์'], real: ['medyceles-box'], design: []}]},
  {name: 'SuperRich', logo: 'superrich.jpg', works: [
   {item: 'ร่มกอล์ฟ 30 นิ้ว', type: ['ร่ม'], real: ['superrich-floor', 'superrich-open'], design: ['superrich-3d']}]},
  {name: 'Pathé', logo: 'pathe.jpg', works: [
   {type: ['หมวก'], item: 'หมวกแก๊ป', real: ['pathe-cap'], design: ['pathe-artwork']}]},
  {name: 'โต๊ะกลม', logo: 'toeklom.jpg', works: [
   {item: 'กระเป๋าแคนวาส', type: ['กระเป๋า'], real: ['toeklom-tote'], design: ['toeklom-tote-spec']},
   {item: 'Giftset พัดลม', type: ['ของใช้อื่น ๆ', 'บรรจุภัณฑ์'], real: ['toeklom-fan-box', 'toeklom-fan'], design: ['toeklom-fan-dieline']}]},
  {name: "Gloria Jean's Coffees", logo: 'gloriajeans.jpg', works: [
   {item: 'กระเป๋าโท้ต', type: ['กระเป๋า'], real: ['gloria-tote'], design: ['gloria-tote-spec']}]},
  {name: 'Generali', logo: 'generali.jpg', works: [
   {type: ['หมวก'], item: 'หมวกแก๊ป', real: ['generali-caps'], design: ['generali-cap-3d', 'generali-cap-side']}]},
  {name: 'The Val', logo: 'theval.jpg', works: [
   {item: 'ร่มกอล์ฟ', type: ['ร่ม'], real: ['theval-umbrella'], design: ['theval-top']}]},
  {name: 'UNICEF Thailand', logo: 'unicef.jpg', works: [
   {item: 'สมุดโน้ต A5', type: ['สมุด'], real: ['unicef-notebook', 'unicef-set'], design: ['unicef-cover-2', 'unicef-cover']}]},
  {name: 'MuzikMove', logo: 'muzikmove.jpg', works: [
   {item: 'ซองใส่บัตรพนักงานพร้อมสายคล้อง', type: ['ของใช้อื่น ๆ'], real: ['muzikmove-lanyard', 'muzikmove-holder'], design: ['muzikmove-spec']}]},
  {name: 'เขตรักษาพันธุ์สัตว์ป่าห้วยขาแข้ง', logo: 'huaikhakhaeng.jpg', works: [
   {item: 'กระบอกน้ำด้ามจับเอียง 500 ml', type: ['แก้วและกระบอกน้ำ'], real: [], design: ['huai-artwork-b', 'huai-artwork-a']}]},
 ];
 brands.forEach(brand => {
  brand.made = brand.works.map(work => work.item);
  brand.real = brand.works.flatMap(work => work.real);
  brand.design = brand.works.flatMap(work => work.design);
 });
 const src = key => `assets/work/${key}.webp${V}`;
 const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
 const mark = brand => {
  const box = el('span', 'cl-logo' + (brand.logo ? '' : ' cl-logo--text'), brand.logo ? '' : brand.letter);
  if (brand.logo) { const img = el('img'); img.src = 'assets/brands/partners/' + brand.logo; img.alt = ''; box.append(img); }
  return box;
 };
 // Shared profile dialog: real work and concept ideas open and hand off the same way.
 const show = ({head, note, pics, sections, chips, label, href, handoff}) => {
  dialog.replaceChildren();
  const close = el('button', 'cl-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'ปิด');
  close.onclick = () => dialog.close();
  const top = el('header');
  top.append(...head);
  // Product blocks keep a steady four-across rhythm, whatever the count.
  const grid = (list, steady) => {
   const box = el('div', 'cl-pics' + (steady ? ' many' : list.length === 1 ? ' one' : list.length > 2 ? ' many' : ''));
   box.style.setProperty('--n', steady ? 4 : Math.min(list.length, 4));
   list.forEach(({src: url, fit, alt, tag}) => {
    const tile = el('span', fit ? 'fit' : '');
    const img = el('img');
    img.src = url;
    img.alt = alt;
    img.loading = 'lazy';
    tile.append(img);
    if (tag) tile.append(el('em', 'cl-pic-tag', tag));
    box.append(tile);
   });
   return box;
  };
  const body = el('div', 'cl-body');
  if (sections) sections.forEach(section => {
   const part = el('section', 'cl-work');
   part.append(el('h4', '', section.title), grid(section.pics, true));
   body.append(part);
  });
  else body.append(grid(pics));
  const made = el('ul', 'cl-made');
  chips.forEach(item => made.append(el('li', '', item)));
  const go = el('a', 'cl-go', label);
  go.href = href;
  go.onclick = () => {
   try {
    localStorage.removeItem('rukaDraft');
    localStorage.removeItem('rukaBrief');
    localStorage.setItem('rukaRefPics', JSON.stringify(pics.slice(0, 2).map(({src: url, fit}) => ({src: url, fit}))));
    handoff();
   } catch (error) {}
  };
  const foot = el('footer');
  if (sections) foot.append(el('p', 'cl-count', sections.length + ' งานที่ทำร่วมกัน'), go);
  else foot.append(made, go);
  dialog.append(close, top);
  if (note) dialog.append(el('p', 'cl-note', note));
  dialog.append(body, foot);
  dialog.showModal();
 };
 const open = brand => show({
  head: [mark(brand), el('h3', '', brand.name)],
  pics: (brand.real.length ? brand.real : brand.design).map(key => ({src: src(key), fit: brand.real.length ? 0 : 1})),
  sections: brand.works.map(work => ({title: work.item, pics: [
   ...work.real.map(key => ({src: src(key), fit: key === 'toeklom-fan' ? 1 : 0, alt: work.item + ' ' + brand.name})),
   ...work.design.map(key => ({src: src(key), fit: 1, alt: 'แบบ ' + work.item, tag: 'ภาพแบบ'})),
  ]})),
  chips: brand.made,
  label: 'ขอราคางานแบบนี้ →',
  href: 'brief.html?ref=' + encodeURIComponent(brand.name),
  handoff: () => {
   localStorage.setItem('rukaProduct', brand.made.join(', '));
   localStorage.setItem('rukaHandoff', 'product');
   localStorage.setItem('rukaOccasion', 'unsure');
  },
 });
 document.querySelectorAll('.idea-card').forEach(card => {
  const name = card.querySelector('b').textContent;
  card.querySelector('.idea-pic').onclick = () => show({
   head: [mark({letter: 'R'}), el('h3', '', name)],
   note: card.dataset.text,
   pics: [{src: card.querySelector('img').getAttribute('src'), fit: 0, alt: name}],
   chips: [card.dataset.tag],
   label: 'ขอราคาแนวนี้ →',
   href: 'brief.html?kind=idea&ref=' + encodeURIComponent(name),
   handoff: () => {
    localStorage.setItem('rukaIdea', name);
    localStorage.setItem('rukaOccasion', card.dataset.occ);
    localStorage.setItem('rukaIdeaBudget', '');
    localStorage.setItem('rukaIdeaMood', card.dataset.mood);
    localStorage.setItem('rukaHandoff', 'idea');
   },
  });
 });
 dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
 // Ideas page: the side list follows the scroll, the same way the services page does.
 const groups = [...document.querySelectorAll('.id-group')];
 const list = document.querySelector('.id-filters');
 if (groups.length && list) {
  let locked = -1;
  ['wheel', 'touchmove', 'keydown'].forEach(name => addEventListener(name, () => { locked = -1; }, {passive: true}));
  const roomy = () => innerWidth > 900;
  // "All" is the top of the page; every other item is a group.
  const stops = [null, ...groups];
  const buttons = stops.map((group, index) => {
   const button = el('button', 'filter', group ? group.dataset.rail : 'ทั้งหมด');
   button.type = 'button';
   button.onclick = () => {
    locked = index;
    follow();
    const top = group ? group.getBoundingClientRect().top + scrollY - (roomy() ? 100 : 136) : 0;
    scrollTo({top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
   };
   list.append(button);
   return button;
  });
  function follow() {
   const line = roomy() ? innerHeight * .55 : 220;
   let now = 0;
   if (scrollY > 60) groups.forEach((group, index) => { if (group.getBoundingClientRect().top <= line) now = index + 1; });
   if (locked >= 0) now = locked;
   buttons.forEach((button, index) => {
    const on = index === now;
    if (button.classList.contains('on') !== on && on && !roomy()) list.scrollTo({left: button.offsetLeft - 16, behavior: 'smooth'});
    button.classList.toggle('on', on);
    button.setAttribute('aria-pressed', String(on));
   });
  }
  let frame = 0;
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; follow(); }); }, {passive: true});
  addEventListener('resize', follow);
  follow();
 }

 // The logo row opens each brand's profile; Unilever's Knorr work sits under โต๊ะกลม.
 document.querySelectorAll('.cl-logos img').forEach(img => {
  const file = img.getAttribute('src').split('/').pop();
  const brand = brands.find(item => item.logo === (file === 'unilever.jpg' ? 'toeklom.jpg' : file));
  if (!brand) return;
  const button = el('button', 'cl-logo-btn');
  button.type = 'button';
  button.setAttribute('aria-label', 'ดูงานของ ' + brand.name);
  button.title = brand.name;
  img.replaceWith(button);
  button.append(img);
  button.onclick = () => open(brand);
 });
 // Work by product: the side list follows the scroll like the services page,
 // and every card turns from its layout into the real piece.
 const deck = document.getElementById('clClients');
 const typeList = document.getElementById('clTypes');
 if (deck && typeList && !deck.closest('[hidden]')) {
  const order = ['กระเป๋า', 'หมวก', 'ร่ม', 'เสื้อ', 'สมุด', 'แก้วและกระบอกน้ำ', 'บรรจุภัณฑ์', 'ของใช้อื่น ๆ'];
  const used = order.filter(type => brands.some(brand => brand.works.some(work => work.type.includes(type))));
  const picture = (key, cls) => { const img = el('img', cls); img.src = src(key); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; return img; };
  const groups = used.map(type => {
   const group = el('section', 'cl-type');
   group.dataset.type = type;
   const grid = el('div', 'cl-type-grid');
   brands.forEach(brand => brand.works.filter(work => work.type.includes(type)).forEach(work => {
    const card = el('button', 'cl-flip-card');
    card.type = 'button';
    card.setAttribute('aria-label', 'ดูงานของ ' + brand.name + ' ' + work.item);
    const both = work.design.length && work.real.length;
    const stage = el('span', 'cl-flip' + (both ? ' has-both' : ''));
    if (work.design.length) stage.append(picture(work.design[0], 'is-design'));
    if (work.real.length) stage.append(picture(work.real[0], 'is-real' + (work.real[0] === 'toeklom-fan' ? ' fit' : '')));
    if (both) {
     const tags = el('span', 'cl-flip-tags');
     tags.append(el('em', 'is-design', 'ภาพแบบ'), el('em', 'is-real', 'งานจริง'));
     stage.append(tags);
    }
    const foot = el('span', 'cl-flip-foot');
    const text = el('span', 'cl-card-text');
    text.append(el('b', '', brand.name), el('small', '', work.item));
    foot.append(mark(brand), text);
    card.append(stage, foot);
    card.onclick = () => open(brand);
    grid.append(card);
   }));
   group.append(el('h3', '', type), grid);
   deck.append(group);
   return group;
  });
  // Phones have no hover, so cards turn on their own as they reach the middle of the screen.
  if ('IntersectionObserver' in window) {
   const turn = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-turned', entry.isIntersecting)), {rootMargin: '-35% 0px -35% 0px'});
   deck.querySelectorAll('.cl-flip.has-both').forEach(stage => turn.observe(stage));
  }
  let locked = -1;
  ['wheel', 'touchmove', 'keydown'].forEach(name => addEventListener(name, () => { locked = -1; }, {passive: true}));
  const roomy = () => innerWidth > 900;
  const items = groups.map((group, index) => {
   const button = el('button', 'filter', group.dataset.type);
   button.type = 'button';
   button.onclick = () => {
    locked = index;
    follow();
    scrollTo({top: group.getBoundingClientRect().top + scrollY - (roomy() ? 100 : 136), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
   };
   typeList.append(button);
   return button;
  });
  function follow() {
   const line = roomy() ? innerHeight * .5 : 220;
   let now = 0;
   groups.forEach((group, index) => { if (group.getBoundingClientRect().top <= line) now = index; });
   if (locked >= 0) now = locked;
   items.forEach((button, index) => {
    const on = index === now;
    if (on && !button.classList.contains('on') && !roomy()) typeList.scrollTo({left: button.offsetLeft - 16, behavior: 'smooth'});
    button.classList.toggle('on', on);
    button.setAttribute('aria-pressed', String(on));
   });
  }
  let frame = 0;
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; follow(); }); }, {passive: true});
  addEventListener('resize', follow);
  follow();
 }
 if (!wall) return;
 // Hand-set wall: white-background pieces only, so the band reads as one set; colours and brands spread across columns.
 const columnsPlan = [
  ['jll-bag-spec', 'unicef-cover', 'pathe-artwork', 'generali-cap-side'],
  ['superrich-3d', 'huai-artwork-b', 'muzikmove-spec', 'toeklom-tote-spec', 'unicef-cover-2'],
  ['generali-cap-3d', 'theval-top', 'toeklom-fan', 'gloria-tote-spec'],
  ['toeklom-fan-dieline', 'jll-shirt-template', 'unicef-notebook', 'huai-artwork-a'],
 ];
 const owner = key => brands.find(brand => brand.real.includes(key) || brand.design.includes(key));
 const order = [];
 const rows = Math.max(...columnsPlan.map(column => column.length));
 for (let row = 0; row < rows; row++) columnsPlan.forEach(column => {
  const key = column[row], brand = key && owner(key);
  if (brand) order.push({brand, key, fit: 1});
 });
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
