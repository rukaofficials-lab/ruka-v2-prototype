// Walkthrough: steps play in turn while on screen; visitors can pick one, and hover pauses it.
(() => {
 const demo=document.getElementById('how-demo');
 if(!demo)return;
 const STEP=4800;
 demo.style.setProperty('--step',STEP+'ms');
 const tabs=[...demo.querySelectorAll('.how-tab')],panels=[...demo.querySelectorAll('.how-panel')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const percent=demo.querySelector('[data-percent]');
 let index=0,timer=0,left=STEP,started=0,visible=false,hovering=false,count=0;
 function runPercent(){
  cancelAnimationFrame(count);
  if(reduced.matches){percent.textContent='100%';return}
  const begin=performance.now(),tick=now=>{const p=Math.min(1,(now-begin)/2400);percent.textContent=Math.round(100*(1-Math.pow(1-p,3)))+'%';if(p<1)count=requestAnimationFrame(tick)};
  count=requestAnimationFrame(tick);
 }
 function show(next){
  index=next;
  tabs.forEach((tab,i)=>{const on=i===next;tab.classList.toggle('is-active',on);tab.setAttribute('aria-selected',String(on))});
  panels.forEach((panel,i)=>panel.classList.toggle('is-active',i===next));
  if(next===2)runPercent();
 }
 function schedule(ms){clearTimeout(timer);started=performance.now();left=ms;timer=setTimeout(()=>{show((index+1)%tabs.length);restart()},ms)}
 function restart(){const active=tabs[index].querySelector('i');active.style.animation='none';void active.offsetWidth;active.style.animation='';schedule(STEP)}
 function sync(){
  const run=visible&&!hovering&&!reduced.matches;
  demo.classList.toggle('is-paused',!run);
  if(run){if(!demo.classList.contains('is-playing')){demo.classList.add('is-playing');show(index);restart()}else schedule(left)}
  else{clearTimeout(timer);if(started)left=Math.max(300,left-(performance.now()-started))}
 }
 tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{show(i);if(!reduced.matches&&visible)restart()}));
 demo.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovering=true;sync()}});
 demo.addEventListener('pointerleave',()=>{hovering=false;sync()});
 new IntersectionObserver(entries=>{visible=entries[entries.length-1].isIntersecting;sync()},{threshold:.35}).observe(demo);
 document.addEventListener('visibilitychange',()=>{visible=visible&&!document.hidden;sync()});
 show(0);
})();
