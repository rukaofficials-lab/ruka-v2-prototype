(()=>{
const $=id=>document.getElementById(id), money=n=>Number(n).toLocaleString('th-TH',{maximumFractionDigits:0});
const key=new URLSearchParams(location.search).get('package');
let packageKey=['starter','plus','custom'].includes(key)?key:'starter', occasion='unsure',selected=0,products=[],options=[];
const names={event:'งานอีเวนต์',employee:'พนักงาน',client:'ลูกค้า',vip:'VIP',unsure:'ยังไม่แน่ใจ'};
const concepts={event:[['พกแบรนด์กลับบ้าน','หยิบง่าย พกสะดวก เหมาะกับผู้ร่วมงาน',['BAG-002']],['พร้อมออกงาน','ของใช้สำหรับกิจกรรมนอกสถานที่',['CAP-001','BAG-003']],['เติมความสดชื่น','ของใช้ที่หยิบกลับมาใช้หลังจบงาน',['DRW-006']]],employee:[['เริ่มวันทำงาน','ของใช้บนโต๊ะที่ได้ใช้ทุกวัน',['NOTE-002','STA-001']],['พักเติมพลัง','แก้วคู่ใจสำหรับช่วงพักของทีม',['DRW-006']],['ไปทำงานด้วยกัน','รวมของใช้ประจำวันไว้ในกระเป๋า',['BAG-001','NOTE-002','DRW-006']]],client:[['ขอบคุณในทุกวัน','ของใช้เรียบง่ายที่ส่งต่อความใส่ใจ',['DRW-009']],['พาแบรนด์ไปด้วย','กระเป๋าและสมุดสำหรับวันทำงาน',['BAG-001','NOTE-002']],['พร้อมสำหรับวันใหม่','ชุดของใช้ที่อยู่กับลูกค้าได้นาน',['TBL-008','NOTE-002']]],vip:[['ชิ้นเดียวที่ตั้งใจ','เริ่มจากกระบอกน้ำ แล้วให้ทีมช่วยเลือกงานตกแต่ง',['TBL-002']],['รายละเอียดที่ใส่ใจ','สมุดและกระบอกน้ำในแนวเดียวกัน',['TBL-002','NOTE-002']],['ของขวัญสำหรับคนสำคัญ','ให้ทีมช่วยต่อยอดการจัดชุดและบรรจุภัณฑ์',['BAG-004','TBL-008','NOTE-002']]],unsure:[['พกไปได้ทุกวัน','เริ่มจากของชิ้นเดียวที่ใช้ง่าย',['BAG-002']],['คู่หูวันทำงาน','สมุดและแผ่นรองเมาส์สำหรับโต๊ะทำงาน',['NOTE-002','STA-001']],['เติมแบรนด์ในทุกวัน','แก้วกาแฟสำหรับช่วงเวลาที่คุ้นเคย',['DRW-006']]]};
$('total').value=packageKey==='plus'?50000:packageKey==='custom'?'':20000;
$('unknown').checked=packageKey==='custom';$('total').disabled=$('unknown').checked;
if(new URLSearchParams(location.search).get('resume')==='1'){try{const saved=JSON.parse(sessionStorage.getItem('rukaGiftPlan'));if(saved){occasion=saved.occasionLabel==='VIP'?'vip':saved.occasion;packageKey=saved.packageKey;$('total').value=saved.total||'';$('unknown').checked=!saved.total;$('total').disabled=!saved.total;$('quantity').value=saved.quantity}}catch{}}
function state(){return {total:$('unknown').checked?null:Number($('total').value),quantity:Number($('quantity').value)}}
function valid(){return $('plan-form').checkValidity()&&Number($('quantity').value)>0&&($('unknown').checked||Number($('total').value)>0)}
function render(){
 const {total,quantity}=state();
 document.querySelectorAll('[data-budget]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.budget===(packageKey==='custom'?'custom':String(total)))));
 document.querySelectorAll('[data-occasion]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.occasion===occasion)));
 document.querySelectorAll('[data-qty]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.qty)===quantity)));
 $('per-person').textContent=valid()?(total?'฿'+money(total/quantity):'ให้ทีมช่วยวางงบ'):'กรอกงบและจำนวน';
 options=concepts[occasion].map(([title,desc,codes])=>{const items=codes.map(c=>products.find(p=>p.code===c));if(items.some(p=>!p))return null;return {title,desc,items,unit:items.reduce((s,p)=>s+Number(p.price||0),0),moq:Math.max(...items.map(p=>Number(p.moq)||1))}}).filter(Boolean);
 // Put directions with a catalog starting cost within the budget first; never imply a final quote.
 options.sort((a,b)=>Number(total!==null&&a.unit*quantity>total)-Number(total!==null&&b.unit*quantity>total));
 selected=Math.min(selected,Math.max(0,options.length-1));$('directions').replaceChildren();
 options.forEach((o,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',String(i===selected));const n=document.createElement('span');n.textContent='แนว '+(i+1);const title=document.createElement('strong');title.textContent=o.title;const meta=document.createElement('span');meta.textContent=o.items.length+' รายการ';b.append(n,title,meta);b.onclick=()=>{selected=i;render()};$('directions').append(b)});
 $('result-count').textContent=options.length+' แนวทาง';$('preview').hidden=!options.length;
 $('continue').setAttribute('aria-disabled',String(!valid()));
 if(!options.length){$('estimate').textContent=products.length?'ยังไม่มีแนวที่ตรงหมวดนี้ ให้ทีมช่วยคัดให้ได้เลย':'กำลังเตรียมตัวเลือกสินค้า';return}
 const o=options[selected];$('direction-label').textContent=names[occasion];$('direction-title').textContent=o.title;$('direction-desc').textContent=o.desc;
 $('product-images').replaceChildren();$('product-list').replaceChildren();
 o.items.forEach(p=>{const f=document.createElement('figure');const im=document.createElement('img');im.src=p.image;im.alt=p.name.trim();im.onerror=()=>{im.hidden=true;f.textContent=p.name.trim()};f.append(im);$('product-images').append(f);const a=document.createElement('a');a.href='product.html?product='+encodeURIComponent(p.name.trim());a.textContent=p.name.trim()+' ↗';$('product-list').append(a)});
 const cost=o.unit*quantity;$('estimate').replaceChildren();
 const strong=document.createElement('strong');strong.textContent=valid()?'เริ่มอ้างอิง ฿'+money(cost):'กรุณาตรวจงบและจำนวน';
 const detail=document.createElement('div');detail.textContent=valid()?quantity+' ชุด × ฿'+money(o.unit)+' / ชุด • '+o.items.length+' รายการต่อชุด':'';
 const note=document.createElement('div');note.textContent=!valid()?'กรอกจำนวนเต็มมากกว่า 0':quantity<o.moq?'จำนวนนี้ต่ำกว่า MOQ '+o.moq+' ชุด — ให้ทีมเช็กการผลิตก่อน':total&&cost>total?'ราคาสินค้าเริ่มต้นเกินงบ ฿'+money(cost-total)+' — ลองเพิ่มงบ ลดจำนวน หรือให้ทีมช่วยปรับชุด':total?'เหลืองบจากราคาสินค้าเริ่มต้น ฿'+money(total-cost)+' สำหรับรายละเอียดอื่น ๆ ที่ทีมจะประเมิน':'ให้ทีมประเมินงบรวม พร้อมงานโลโก้และบรรจุภัณฑ์';$('estimate').append(strong,detail,note);
 $('continue').textContent=(!total||cost>total||quantity<o.moq)?'ให้ RUKA ช่วยปรับชุดนี้ ↗':'ชอบแนวนี้ ให้ RUKA ช่วยต่อ ↗';
}
document.querySelectorAll('[data-budget]').forEach(b=>b.onclick=()=>{const v=b.dataset.budget;packageKey=v==='20000'?'starter':v==='50000'?'plus':'custom';if(v!=='custom'){$('total').value=v;$('unknown').checked=false;$('total').disabled=false}else{$('unknown').checked=false;$('total').disabled=false;$('total').focus()}selected=0;render()});
document.querySelectorAll('[data-occasion]').forEach(b=>b.onclick=()=>{occasion=b.dataset.occasion;selected=0;render()});
document.querySelectorAll('[data-qty]').forEach(b=>b.onclick=()=>{$('quantity').value=b.dataset.qty;selected=0;render()});
$('total').oninput=()=>{packageKey='custom';selected=0;render()};$('quantity').oninput=()=>{selected=0;render()};$('unknown').onchange=()=>{$('total').disabled=$('unknown').checked;packageKey='custom';render()};$('plan-form').onsubmit=e=>e.preventDefault();
$('continue').onclick=e=>{e.preventDefault();if(!valid()){$('plan-form').reportValidity();return}const s=state(),o=options[selected];const plan={...s,packageKey,occasion:occasion==='vip'?'client':occasion,occasionLabel:names[occasion],title:o?.title||'ให้ทีมช่วยคัดสินค้า',items:o?.items.map(p=>({code:p.code,name:p.name.trim()}))||[],unit:o?.unit||null};try{sessionStorage.setItem('rukaGiftPlan',JSON.stringify(plan));location.href='brief.html?planner=1&occasion='+plan.occasion}catch{$('estimate').textContent='เบราว์เซอร์ไม่อนุญาตให้บันทึกตัวเลือก กรุณาเปิดการจัดเก็บข้อมูลแล้วลองอีกครั้ง'}};
const search=document.querySelector('.searchBtn');if(search)search.onclick=()=>location.href='products.html?search=1';
(async()=>{try{let response;try{response=await fetch('https://ruka-erp.vercel.app/api/public-products',{signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error();const data=await response.json();if(!data.products?.length)throw Error();products=data.products;$('catalog-status').textContent='ภาพและราคาเริ่มต้นจากแค็ตตาล็อก RUKA'}catch{response=await fetch('assets/gift-planner-products.json');products=(await response.json()).products;$('catalog-status').textContent='ใช้ข้อมูลแค็ตตาล็อกสำรอง • ให้ทีมยืนยันราคาล่าสุด'}render()}catch{$('catalog-status').textContent='โหลดสินค้าไม่ได้ในขณะนี้';render()}})();render();
})();
