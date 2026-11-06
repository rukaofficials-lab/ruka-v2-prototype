// The steps follow the scroll; on small screens they stack and open as they arrive.
(() => {
 const section=document.getElementById('how-ruka');
 if(!section)return;
 const pin=section.querySelector('.how-pin'),stops=[...section.querySelectorAll('.how-stop')],words=[...section.querySelectorAll('.how-fill')];
 const line=section.querySelector('.how-line i'),percent=section.querySelector('[data-percent]');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),compact=matchMedia('(max-width:900px),(max-height:640px)');
 let index=-1,count=0,frame=0,seen=0,observer=null;
 const light=n=>words.forEach((word,i)=>word.classList.toggle('is-lit',i<n));
 function runPercent(){
  cancelAnimationFrame(count);
  if(reduced.matches){percent.textContent='100%';return}
  const begin=performance.now(),tick=now=>{const p=Math.min(1,(now-begin)/2400);percent.textContent=Math.round(100*(1-Math.pow(1-p,3)))+'%';if(p<1)count=requestAnimationFrame(tick)};
  count=requestAnimationFrame(tick);
 }
 function show(next){
  if(next===index)return;
  index=next;
  stops.forEach((stop,i)=>{stop.classList.toggle('is-active',i===next);stop.classList.toggle('is-done',i<next);stop.querySelector('.how-stop-head').setAttribute('aria-current',i===next?'step':'false')});
  light(next+2);
  if(next===2)runPercent();
 }
 const range=()=>Math.max(1,section.offsetHeight-pin.offsetHeight);
 function read(){
  frame=0;
  if(compact.matches)return;
  const p=Math.min(1,Math.max(0,(parseFloat(getComputedStyle(pin).top||0)-section.getBoundingClientRect().top)/range()));
  line.style.transform='scaleX('+(.08+p*.92)+')';
  show(Math.min(stops.length-1,Math.floor(p*stops.length)));
 }
 function arrive(entries){
  entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('is-active');observer.unobserve(entry.target);seen++;light(seen+1);if(entry.target===stops[2])runPercent()});
 }
 function mode(){
  observer?.disconnect();observer=null;index=-1;seen=0;
  stops.forEach(stop=>stop.classList.remove('is-active','is-done'));
  if(compact.matches){light(1);observer=new IntersectionObserver(arrive,{threshold:.3});stops.forEach(stop=>observer.observe(stop))}
  else read();
 }
 stops.forEach((stop,i)=>stop.querySelector('.how-stop-head').addEventListener('click',()=>{
  if(compact.matches)return;
  const top=section.getBoundingClientRect().top+scrollY-parseFloat(getComputedStyle(pin).top||0);
  scrollTo({top:top+range()*(i+.5)/stops.length,behavior:reduced.matches?'auto':'smooth'});
 }));
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(read)},{passive:true});
 addEventListener('resize',read);
 compact.addEventListener('change',mode);
 mode();
})();
