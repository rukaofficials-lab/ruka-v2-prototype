(() => {
  const reel = document.getElementById('landing-reel');
  if (!reel) return;
  const prev = document.getElementById('landing-prev');
  const next = document.getElementById('landing-next');
  const position = document.getElementById('landing-position');
  const cards = [...reel.children];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const step = () => cards[0].offsetWidth + parseFloat(getComputedStyle(reel).gap);
  const update = () => {
    const max = reel.scrollWidth - reel.clientWidth;
    document.querySelector('.landing-controls').hidden = max <= 2;
    prev.disabled = reel.scrollLeft <= 2;
    next.disabled = reel.scrollLeft >= max - 2;
    const index = max > 2 && reel.scrollLeft >= max - 2 ? cards.length : Math.min(cards.length, Math.round(reel.scrollLeft / step()) + 1);
    position.textContent = `${String(index).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  };
  const move = direction => reel.scrollBy({left: direction * step(), behavior: reduced.matches ? 'instant' : 'smooth'});
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  reel.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); move(e.key === 'ArrowRight' ? 1 : -1); }
  });
  // Touch uses native scrolling. Mouse dragging preserves ordinary card clicks.
  let drag = null, suppressClick = false;
  reel.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    suppressClick = false;
    drag = {x: e.clientX, scroll: reel.scrollLeft, id: e.pointerId, moved: false};
  });
  reel.addEventListener('pointermove', e => {
    if (!drag) return;
    const delta = e.clientX - drag.x;
    if (!drag.moved && Math.abs(delta) > 6) { drag.moved = true; reel.setPointerCapture(drag.id); reel.classList.add('is-dragging'); }
    if (drag.moved) { e.preventDefault(); reel.scrollLeft = drag.scroll - delta; }
  });
  const finish = () => {
    if (!drag) return;
    suppressClick = drag.moved;
    setTimeout(() => { suppressClick = false; }, 0);
    if (reel.hasPointerCapture(drag.id)) reel.releasePointerCapture(drag.id);
    drag = null; reel.classList.remove('is-dragging'); update();
  };
  window.addEventListener('pointerup', finish);
  reel.addEventListener('pointercancel', finish);
  reel.addEventListener('lostpointercapture', finish);
  reel.addEventListener('click', e => { if (suppressClick) { e.preventDefault(); e.stopPropagation(); suppressClick = false; } }, true);
  reel.addEventListener('scroll', update, {passive:true});
  new ResizeObserver(update).observe(reel);
  update();
})();
