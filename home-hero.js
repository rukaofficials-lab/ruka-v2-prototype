// Hero cards slide away to the sides as the visitor scrolls past the opening screen.
(() => {
 const hero=document.querySelector('.home-hero'),gallery=document.querySelector('.hero-gallery');
 if(!hero||!gallery)return;
 const motion=matchMedia('(min-width:1001px) and (prefers-reduced-motion:no-preference)');
 let frame=0;
 const paint=()=>{
  frame=0;
  const progress=motion.matches?Math.min(1,Math.max(0,scrollY/(hero.offsetHeight*.95))):0;
  gallery.style.setProperty('--out',String(1-Math.pow(1-progress,1.5)));
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint)};
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule);
 motion.addEventListener('change',schedule);
 paint();
 requestAnimationFrame(()=>document.querySelectorAll('.hero-card').forEach(card=>card.classList.add('is-ready')));
})();
