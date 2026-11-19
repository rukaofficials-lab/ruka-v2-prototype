// Services and how-we-work pages: builds the side list, tracks scroll position, and fills sample photos from the live catalog.
(() => {
 const stack = document.querySelector('.occ-stack');
 const rail = document.querySelector('.occ-rail');
 if (!stack || !rail) return;
 let panels = [];
 let buttons = [];
 const wide = () => innerWidth > 1050;
 let locked = -1;
 ['wheel', 'touchmove', 'keydown'].forEach(name => addEventListener(name, () => { locked = -1; }, {passive: true}));

 // Sticky cards report their stuck position, so targets come from card heights instead.
 const targetOf = index => {
  const gap = parseFloat(getComputedStyle(stack).rowGap) || 0;
  const before = panels.slice(0, index).reduce((sum, card) => sum + card.offsetHeight + gap, 0);
  const top = stack.getBoundingClientRect().top + scrollY + before;
  return top - (wide() ? 88 + index * 12 : innerWidth > 760 ? 136 : 130);
 };
 // Hidden panels (use cases without tagged products) stay out of the list.
 function buildRail() {
  panels = [...stack.querySelectorAll('.occ-panel')].filter(card => !card.hidden);
  rail.replaceChildren();
  buttons = panels.map((card, index) => {
   card.style.setProperty('--i', index);
   const button = document.createElement('button');
   button.type = 'button';
   button.textContent = card.dataset.rail || card.querySelector('h2').textContent;
   button.onclick = () => {
    locked = index;
    track();
    scrollTo({top: targetOf(index), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
   };
   rail.append(button);
   return button;
  });
  track();
 }
 function track() {
  const line = wide() ? innerHeight * .55 : 200;
  let now = 0;
  panels.forEach((card, index) => { if (card.getBoundingClientRect().top <= line) now = index; });
  if (locked >= 0) now = locked;
  buttons.forEach((button, index) => {
   const on = index === now;
   button.classList.toggle('active', on);
   button.setAttribute('aria-pressed', String(on));
   if (on && !wide()) rail.scrollTo({left: button.offsetLeft - rail.clientWidth / 2 + button.offsetWidth / 2, behavior: 'smooth'});
  });
 }
 let frame = 0;
 addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; track(); }); }, {passive: true});
 buildRail();

 // Deep links such as how.html#tracking or occasion.html#running land on the right card.
 const jumpToHash = () => {
  const start = panels.findIndex(card => card.id && '#' + card.id === location.hash);
  if (start > 0) { locked = start; scrollTo(0, targetOf(start)); track(); }
 };
 const loaded = new Promise(resolve => document.readyState === 'complete' ? resolve() : addEventListener('load', resolve, {once: true}));
 const hasUseCases = !!stack.querySelector('[data-usecase]');
 if (!hasUseCases) loaded.then(jumpToHash);

 // RUKA-styled photos for some products; the tile still opens the real product page.
 const rukaPics = new Set(['NOTE-002', 'BAG-001', 'DRW-001', 'DRW-002', 'DRW-009', 'STA-001', 'CAP-001', 'GG-002', 'TBL-005']);
 const productTile = item => {
  const tile = document.createElement('a');
  tile.className = 'occ-photo';
  tile.href = window.rukaProductUrl(item.code);
  tile.setAttribute('aria-label', rukaCatalog.name(item));
  const img = document.createElement('img');
  if (rukaPics.has(item.code)) { tile.classList.add('is-ruka'); img.src = 'assets/services/' + item.code + '.webp?v=20261116-d'; }
  else img.src = rukaCatalog.thumb(rukaCatalog.cover(item), 400);
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  tile.append(img);
  return tile;
 };
 const window_ = window;
 window_.rukaCatalog?.load().then(items => {
  // Use-case panels: products come from the ERP useCases tags; a tag with no products hides its panel.
  stack.querySelectorAll('.occ-photos[data-usecase]').forEach(box => {
   const tag = box.dataset.usecase;
   // Four tiles per panel, RUKA photos first.
   const found = items.filter(item => (item.useCases || []).includes(tag) && item.image)
    .sort((x, y) => rukaPics.has(y.code) - rukaPics.has(x.code)).slice(0, 4);
   const panel = box.closest('.occ-panel');
   panel.hidden = !found.length;
   if (!found.length) return;
   box.replaceChildren(...found.map(productTile));
   const note = document.createElement('p');
   note.className = 'occ-sample';
   note.textContent = 'ตัวอย่างสินค้าที่ติดแท็กงานนี้ใน ERP กดดูสินค้าได้';
   box.append(note);
  });

  // Each slot is a product code, or "?name" for an item not in the catalog yet.
  // Slots without a RUKA photo show the item's name, so the team can see which photo is still needed.
  stack.querySelectorAll('.occ-photos[data-codes]').forEach(box => {
   box.dataset.codes.split(' ').slice(0, 4).forEach(slot => {
    // "?name=file" is an item not in the catalog yet that already has a RUKA photo.
    const [rawName, photo] = slot.startsWith('?') ? slot.slice(1).split('=') : ['', ''];
    const wanted = rawName.replace(/_/g, ' ');
    const item = wanted ? null : items.find(entry => entry.code === slot);
    const label = wanted || (item ? rukaCatalog.name(item) : slot);
    const tile = document.createElement(item ? 'a' : 'span');
    tile.className = 'occ-photo';
    if (item) tile.href = window.rukaProductUrl(item.code);
    tile.setAttribute('aria-label', label);
    if ((item && rukaPics.has(item.code)) || photo) {
     tile.classList.add('is-ruka');
     const img = document.createElement('img');
     img.src = 'assets/services/' + (photo || item.code) + '.webp?v=20261116-d';
     img.alt = '';
     img.loading = 'lazy';
     img.decoding = 'async';
     tile.append(img);
    } else {
     tile.classList.add('is-pending');
     const name = document.createElement('b');
     name.textContent = label;
     const hint = document.createElement('small');
     hint.textContent = item ? 'รอรูป · ' + item.code : 'รอรูป · ยังไม่มีในแค็ตตาล็อก';
     tile.append(name, hint);
    }
    box.append(tile);
   });
   const note = document.createElement('p');
   note.className = 'occ-sample';
   note.textContent = 'ตัวอย่างสินค้าที่เหมาะกับงานนี้ กดดูสินค้าได้';
   box.append(note);
  });
  if (hasUseCases) { buildRail(); loaded.then(jumpToHash); }
 }).catch(() => { if (hasUseCases) loaded.then(jumpToHash); });
})();
