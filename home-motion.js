/* Scroll-linked polish: native scrolling, no layout wrappers or scroll interception. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const selectors = '.trust h2,.category-picker-header,.category-stage,.budget-ticket-header,.budget-ticket,.brandCard';
  const elements = [...document.querySelectorAll(selectors)];
  const storyHead = document.querySelector('.brandStoryHead');
  const journey = document.querySelector('.brandJourney');
  const hero = document.querySelector('.hero-carousel');
  const heroScene = document.createElement('div');
  heroScene.className = 'motion-hero-scene';
  if (hero) { hero.before(heroScene); heroScene.append(hero); }
  document.documentElement.classList.add('motion-scenes');
  const desktop = matchMedia('(min-width:901px) and (min-height:650px)');
  const active = new Set();
  let frame = 0;
  let observer;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    observer?.disconnect();
    active.clear();
    elements.forEach(el => { el.style.removeProperty('translate'); el.style.removeProperty('opacity'); });
    if(storyHead) storyHead.style.removeProperty('opacity');
    if(hero) { hero.style.removeProperty('scale'); hero.style.removeProperty('opacity'); hero.style.removeProperty('filter'); }
    document.querySelectorAll('.brandOrb').forEach(el => el.style.removeProperty('translate'));
  };
  const render = () => {
    frame = 0;
    const height = innerHeight;
    if(storyHead && journey) {
      const gap = journey.getBoundingClientRect().top - storyHead.getBoundingClientRect().bottom;
      storyHead.style.opacity = desktop.matches ? String(Math.max(0, Math.min(1, gap / 65))) : '1';
    }
    const sceneTop = hero ? heroScene.getBoundingClientRect().top : 0;
    const departure = desktop.matches ? Math.max(0, Math.min(1, -sceneTop / (height * .36))) : 0;
    if(hero) {
      // Keep forms and controls fully clear while the visitor is interacting.
      const p = hero.contains(document.activeElement) ? 0 : departure;
      hero.style.scale = String(1 - p * .055);
      hero.style.opacity = String(1 - p * .55);
      hero.style.filter = p > 0 ? `blur(${(p * 2).toFixed(2)}px)` : 'none';
    }
    // Read positions before writes. offset geometry is unaffected by CSS translate.
    const readings = [...active].map(el => {
      const top = el.getBoundingClientRect().top - (parseFloat(el.dataset.motionY) || 0);
      const stagger = el.matches('.brandCard') ? ([...el.parentElement.children].indexOf(el) % 2) * .055 : 0;
      const progress = Math.max(0, Math.min(1, (height * (.96 - stagger) - top) / (height * .26)));
      return {el, progress};
    });
    readings.forEach(({el, progress}) => {
      const eased = 1 - Math.pow(1 - progress, 3);
      const y = (1 - eased) * (innerWidth < 680 ? 18 : 30);
      el.dataset.motionY = String(y);
      el.style.translate = `0 ${y.toFixed(2)}px`;
      el.style.opacity = String(.45 + .55 * eased);
    });
  };
  const schedule = () => { if (!preference.matches && !frame) frame = requestAnimationFrame(render); };
  const start = () => {
    reset();
    elements.forEach(el => delete el.dataset.motionY);
    if (preference.matches || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(({target,isIntersecting}) => { if(isIntersecting) active.add(target); else active.delete(target); });
      schedule();
    }, {rootMargin:'80px 0px'});
    elements.forEach(el => observer.observe(el));
  };
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  preference.addEventListener('change', start);
  start();
})();
