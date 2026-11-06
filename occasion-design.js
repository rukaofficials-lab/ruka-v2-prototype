// Services and how-we-work pages: builds the side list, tracks scroll position, and fills sample photos from the live catalog.
(() => {
 const stack = document.querySelector('.occ-stack');
 const rail = document.querySelector('.occ-rail');
 if (!stack || !rail) return;
 const panels = [...stack.querySelectorAll('.occ-panel')];
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
 const buttons = panels.map((card, index) => {
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
 track();

 // Deep links such as how.html#tracking land on the right card.
 const start = panels.findIndex(card => card.id && '#' + card.id === location.hash);
 if (start > 0) addEventListener('load', () => { locked = start; scrollTo(0, targetOf(start)); track(); });

 window.rukaCatalog?.load().then(items => {
  stack.querySelectorAll('.occ-photos[data-codes]').forEach(box => {
   const found = box.dataset.codes.split(' ').map(code => items.find(item => item.code === code)).filter(item => item && item.image);
   if (found.length < 2) return;
   found.slice(0, 4).forEach(item => {
    const tile = document.createElement('a');
    tile.className = 'occ-photo';
    tile.href = window.rukaProductUrl(item.code);
    tile.setAttribute('aria-label', rukaCatalog.name(item));
    const img = document.createElement('img');
    img.src = rukaCatalog.thumb(rukaCatalog.cover(item), 520);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    tile.append(img);
    box.append(tile);
   });
   const note = document.createElement('p');
   note.className = 'occ-sample';
   note.textContent = 'ตัวอย่างสินค้าที่เหมาะกับงานนี้';
   box.append(note);
  });
 }).catch(() => {});
})();
