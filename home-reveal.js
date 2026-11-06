// One language down the page: words fill in, lines draw in brand colours, and work arrives step by step.
(() => {
 const trust=document.querySelector('section.trust .trustTitle');
 const picker=document.querySelector('.category-picker');
 if(!picker)return;
 const words=[...picker.querySelectorAll('.how-fill')],cards=[...picker.querySelectorAll('.category-card')];
 const grid=picker.querySelector('.category-grid'),line=picker.querySelector('.how-line i'),title=picker.querySelector('h2');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const clamp=value=>Math.min(1,Math.max(0,value));
 let frame=0;
 function read(){
  frame=0;
  if(reduced.matches){
   words.forEach(word=>word.classList.add('is-lit'));
   cards.forEach(card=>card.classList.add('is-in'));
   line.style.transform='none';
   trust?.style.setProperty('--line','1');
   return;
  }
  const height=innerHeight;
  if(trust)trust.style.setProperty('--line',String(clamp((height*.98-trust.getBoundingClientRect().top)/(height*.34))));
  const fill=clamp((height*.92-title.getBoundingClientRect().top)/(height*.34));
  words.forEach((word,i)=>word.classList.toggle('is-lit',fill>=(i+1)/words.length));
  const box=grid.getBoundingClientRect(),reach=clamp((height*.98-box.top)/(box.height*.9));
  line.style.transform='scaleX('+reach+')';
  const shown=cards.filter(card=>card.offsetParent);
  shown.forEach((card,i)=>card.classList.toggle('is-in',reach>=(i+.6)/shown.length));
 }
 picker.classList.add('is-live');
 addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(read)},{passive:true});
 addEventListener('resize',read);
 read();
})();
