(() => {
 const track=document.getElementById('hero-track');if(!track)return;
 const slides=[...track.children],dots=[...document.querySelectorAll('[data-hero-slide]')];
 const prev=document.getElementById('hero-prev'),next=document.getElementById('hero-next');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let current=0,frame,drag;
 function paint(){current=Math.max(0,Math.min(slides.length-1,Math.round(track.scrollLeft/track.clientWidth)));prev.disabled=current===0;next.disabled=current===slides.length-1;dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===current)));slides.forEach((slide,i)=>{slide.inert=i!==current;});}
 function go(i){track.scrollTo({left:Math.max(0,Math.min(slides.length-1,i))*track.clientWidth,behavior:reduced.matches?'instant':'smooth'});}
 prev.onclick=()=>go(current-1);next.onclick=()=>go(current+1);dots.forEach((dot,i)=>dot.onclick=()=>go(i));
 track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(paint);},{passive:true});
 track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(current+(e.key==='ArrowRight'?1:-1));}});
 track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0||e.target.closest('a,button,input,select,textarea'))return;drag={x:e.clientX,left:track.scrollLeft,index:current};track.setPointerCapture(e.pointerId);track.classList.add('is-dragging');});
 track.addEventListener('pointermove',e=>{if(drag)track.scrollLeft=drag.left+drag.x-e.clientX;});
 function end(e){if(!drag)return;const delta=drag.x-e.clientX;const index=drag.index;drag=null;track.classList.remove('is-dragging');if(track.hasPointerCapture(e.pointerId))track.releasePointerCapture(e.pointerId);go(index+(Math.abs(delta)>50?Math.sign(delta):0));}
 track.addEventListener('pointerup',end);track.addEventListener('pointercancel',end);
 new ResizeObserver(()=>{track.scrollTo({left:current*track.clientWidth,behavior:'instant'});}).observe(track);paint();
 const autoplay=document.getElementById('hero-autoplay');
 let paused=reduced.matches,hovered=false,timer;
 function syncAutoplay(){
  clearInterval(timer);
  autoplay.textContent=paused?'▶':'Ⅱ';
  autoplay.setAttribute('aria-pressed',String(paused));
  autoplay.setAttribute('aria-label',paused?'เล่นสไลด์อัตโนมัติ':'หยุดสไลด์อัตโนมัติ');
  if(!paused)timer=setInterval(()=>{
   if(document.hidden||hovered||drag||track.contains(document.activeElement))return;
   go((current+1)%slides.length);
  },6000);
 }
 autoplay.onclick=()=>{paused=!paused;syncAutoplay();};
 track.addEventListener('mouseenter',()=>hovered=true);
 track.addEventListener('mouseleave',()=>hovered=false);
 track.addEventListener('pointerdown',()=>clearInterval(timer));
 track.addEventListener('pointerup',syncAutoplay);
 track.addEventListener('pointercancel',syncAutoplay);
 document.addEventListener('visibilitychange',syncAutoplay);
 reduced.addEventListener('change',()=>{paused=reduced.matches;syncAutoplay();});
 syncAutoplay();
})();
