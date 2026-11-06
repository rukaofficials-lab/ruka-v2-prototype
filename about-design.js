// About page: Vision fills in with scroll; the value grid eases in as they arrive.
(() => {
 if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 const hero = document.querySelector('.ab-hero');
 const chunks = [...hero.querySelectorAll('.ab-chunk')];
 const close = hero.querySelector('.ab-position');
 hero.classList.add('is-live');
 const paint = () => {
  const box = hero.getBoundingClientRect();
  const done = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - innerHeight)));
  chunks.forEach((chunk, index) => chunk.classList.toggle('on', done >= index / chunks.length * .8));
  close.classList.toggle('on', done >= .86);
 };
 let frame = 0;
 addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; paint(); }); }, {passive: true});
 addEventListener('resize', paint);
 paint();

 const list = document.querySelector('.ab-bento');
 if (!('IntersectionObserver' in window)) return;
 list.classList.add('is-live');
 const seen = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('on');
  seen.unobserve(entry.target);
 }), {rootMargin: '0px 0px -8% 0px'});
 list.querySelectorAll('.ab-tile').forEach((card, index) => { card.style.transitionDelay = index * 70 + 'ms'; seen.observe(card); });
})();
