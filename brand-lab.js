(()=>{
 const root=document.querySelector('.brand-lab');if(!root)return;
 const input=root.querySelector('input');const tabs=[...root.querySelectorAll('[role=tab]')];
 const en=()=>document.documentElement.lang.startsWith('en');
 function render(){
  const english=en();
  root.querySelector('.lab-heading').innerHTML=english?'What would <em>your brand</em> look like?':'ถ้าเป็น<em>แบรนด์คุณ</em> จะหน้าตาแบบไหน?';
  tabs[0].textContent=english?'Events':'งานอีเวนต์';tabs[1].textContent=english?'Employees':'พนักงาน';
  root.querySelector('label').textContent=english?'Your brand name':'ชื่อแบรนด์ของคุณ';
  input.placeholder=english?'Enter your brand name':'ใส่ชื่อแบรนด์ของคุณ';
  root.querySelector('small').textContent=english?'Preview: RUKA · Type to personalize':'ตัวอย่าง RUKA • พิมพ์ชื่อเพื่อลองเปลี่ยน';
  root.querySelector('.before .lab-label').textContent=english?'Before design':'ก่อนออกแบบ';
  root.querySelector('.after .lab-label').textContent=english?'With your brand':'เมื่อเป็นแบรนด์คุณ';
  root.querySelector('.lab-cta').textContent=english?'Create this set with RUKA ↗':'ให้ RUKA จัดชุดนี้ต่อ ↗';
  root.querySelector('.lab-disclaimer').textContent=english?'Concept images · Brand placement is illustrative. Our team will confirm artwork and product details before production.':'ภาพแนวคิดและสินค้าจำลอง • ชื่อแบรนด์เป็นตัวอย่างตำแหน่งพิมพ์ ทีมช่วยตรวจแบบและรายละเอียดก่อนผลิต';
  const kind=root.dataset.kind;const name=input.value.trim()||'RUKA';
  root.querySelectorAll('.lab-photo').forEach(el=>el.style.backgroundImage=`url("assets/brand-lab/${kind}.png")`);
  root.querySelectorAll('.lab-brand').forEach(el=>el.textContent=name);
  root.querySelector('.lab-description').textContent=kind==='event'?(en()?'Outdoor events · Easy to carry, useful every day':'อีเวนต์กลางแจ้ง • พกง่าย ใช้ได้จริง'):(en()?'Desk essentials · Ready for every workday':'ของใช้ประจำโต๊ะ • ใช้ต่อได้ทุกวัน');
  const url=new URL('brief.html',location.href);url.searchParams.set('occasion',kind);url.searchParams.set('brand',name);root.querySelector('.lab-cta').href=url.pathname+url.search;
 }
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>{root.dataset.kind=tab.dataset.kind;tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1});render()});tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[n].click();tabs[n].focus()})});
 input.addEventListener('input',render);new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});render();
})();
