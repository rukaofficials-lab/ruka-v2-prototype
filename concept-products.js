// Concept builder: slots, picker, and estimates come from the ERP catalog only.
let products=[],activeSlot=0,cat='all',allMode=false,pickerView='recommended',slots=[null,null,null,null];
const conceptCategories={drink:'drinkware',bag:'bags',life:'lifestyle',apparel:'apparel',tech:'tech',pack:'packaging',eco:'eco'};
const synonymGroups=[['กระเป๋า','ถุง','bag','tote'],['แก้ว','กระบอก','ขวด','tumbler','bottle','mug','cup','drinkware'],['หมวก','cap','hat','bucket'],['สมุด','notebook','note'],['แผ่นรองเมาส์','mouse pad','mousepad'],['พัดลม','fan'],['กล่อง','บรรจุภัณฑ์','box','packaging']];
const conceptEsc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const conceptPrice=p=>p.price?(p.priceMax&&p.priceMax>p.price?'฿'+p.price+'–'+p.priceMax:'฿'+p.price):'';
const conceptImage=p=>p.image?'<img src="'+conceptEsc(rukaCatalog.thumb(rukaCatalog.cover(p),320))+'" alt="" decoding="async">':'';
const conceptRef=p=>rukaCatalog.clean(p.name)+' ('+p.code+')';
const conceptCode=value=>String(value||'').match(/\(([^()]+)\)$/)?.[1]||'';
function conceptMatches(product,query){
 const hay=[product.name,product.nameEn,product.code,product.category,conceptCategories[product.category]].join(' ').toLowerCase();
 return query.split(/\s+/).every(term=>hay.includes(term)||!/\d/.test(term)&&synonymGroups.some(group=>group.some(word=>word.includes(term)||term.includes(word))&&group.some(word=>hay.includes(word))));
}
function conceptState(){
 const ref=p=>p?conceptRef(p):'';
 return {sourceProduct:localStorage.getItem('rukaProduct')||'',direction:localStorage.getItem('rukaDirection')||'',codes:slots.map(p=>p?.code||''),items:slots.slice(0,3).filter(Boolean).map(p=>({code:p.code,name:ref(p)})),packaging:ref(slots[3])};
}
function persistConcept(){localStorage.setItem('rukaConcept',JSON.stringify(conceptState()))}
function paintConcept(){
 slots.slice(0,3).forEach((p,i)=>{
  const image=document.getElementById('e'+i);
  document.getElementById('n'+i).textContent=p?rukaCatalog.name(p):'ให้ทีม RUKA แนะนำ';
  image.innerHTML=conceptImage(p||{})||'';
 });
 packName.textContent=slots[3]?rukaCatalog.name(slots[3]):'ให้ทีม RUKA แนะนำ';
 const chosen=slots.filter(p=>p?.price);
 const low=chosen.reduce((sum,p)=>sum+Number(p.price),0),high=chosen.reduce((sum,p)=>sum+Number(p.priceMax||p.price),0);
 const range=low?'฿'+low.toLocaleString('en-US')+(high>low?'–'+high.toLocaleString('en-US'):''):'';
 estProducts.textContent=range||'ทีมประเมิน';
 estTotal.textContent=range?'≈ '+range+' / set':'ทีมประเมิน';
}
function renderProducts(){
 const query=search.value.trim().toLowerCase();
 let list=products.filter(p=>(cat==='all'||conceptCategories[p.category]===cat)&&(!query||conceptMatches(p,query)));
 if(activeSlot===3&&!query)list=list.filter(p=>p.category==='pack');
 if(pickerView==='saved'){let saved=[];try{saved=JSON.parse(localStorage.getItem('rukaSavedProducts')||'[]')}catch{}const refs=new Set(saved.map(conceptCode));list=list.filter(p=>refs.has(p.code)||saved.includes(p.name))}
 if(pickerView==='recommended'&&!allMode&&!query&&cat==='all'&&activeSlot!==3){const seen=new Set();list=[...list.filter(p=>!seen.has(p.category)&&seen.add(p.category)),...list].filter((p,i,all)=>all.indexOf(p)===i).slice(0,6)}
 const empty=!products.length?'กำลังโหลดสินค้า…':activeSlot===3&&!query?'ยังไม่มีบรรจุภัณฑ์ในแค็ตตาล็อก ทีม RUKA ช่วยแนะนำได้':pickerView==='saved'?'ยังไม่มีสินค้าที่บันทึกไว้':'ยังไม่เจอสินค้า ลองค้นคำอื่น หรือส่งโจทย์ให้ทีม RUKA';
 productGrid.innerHTML=list.map(p=>'<article class="product"><div class="pimg">'+conceptImage(p)+'</div><small class="pcode">'+conceptEsc(p.code)+'</small><h4>'+conceptEsc(rukaCatalog.name(p))+'</h4><div class="meta"><span>'+conceptEsc([conceptPrice(p)&&'≈ '+conceptPrice(p),p.moq&&'MOQ '+p.moq].filter(Boolean).join(' · '))+'</span><br><span>'+conceptEsc(p.leadTime?p.leadTime+' วัน':'')+'</span></div><button class="use" type="button" data-code="'+conceptEsc(p.code)+'">ใช้สินค้านี้</button></article>').join('')||'<p class="picker-empty">'+empty+'</p>';
 moreBtn.style.display=(!allMode&&cat==='all'&&!query&&pickerView==='recommended'&&activeSlot!==3&&products.length)?'block':'none';
}
function openPicker(i,label){activeSlot=i;pickerTitle.textContent='เปลี่ยน '+label;const current=slots[i];contextText.textContent='กำลังแทนที่: '+(current?rukaCatalog.name(current):'ให้ทีม RUKA แนะนำ')+' · Brief และสินค้าที่เลือกไว้จะไม่หาย';overlay.classList.add('open');allMode=false;cat='all';pickerView='recommended';search.value='';setPickerTab(0);document.querySelectorAll('.categories .cat').forEach((x,j)=>x.classList.toggle('on',j===0));renderProducts()}
function closePicker(){overlay.classList.remove('open')}
function setPickerTab(index){document.querySelectorAll('.tab').forEach((x,j)=>x.classList.toggle('on',j===index))}
function showAll(){allMode=true;pickerView='all';setPickerTab(1);renderProducts()}
function showRecommended(){allMode=false;pickerView='recommended';setPickerTab(0);renderProducts()}
function showSaved(){allMode=true;pickerView='saved';setPickerTab(2);renderProducts()}
function setCat(value,el){cat=value;allMode=true;document.querySelectorAll('.categories .cat').forEach(x=>x.classList.remove('on'));el.classList.add('on');renderProducts()}
function chooseProduct(code){const product=products.find(p=>p.code===code);if(!product)return;slots[activeSlot]=product;paintConcept();persistConcept();aiText.textContent='เลือก '+rukaCatalog.name(product)+' แล้ว · ทีม RUKA จะยืนยันราคา MOQ และเวลาผลิตอีกครั้ง';closePicker()}
function searchAI(){allMode=true;pickerView='all';setPickerTab(1);renderProducts()}
function restoreConcept(){
 const byCode=code=>products.find(p=>p.code===code)||null;
 let saved={};try{saved=JSON.parse(localStorage.getItem('rukaConcept'))||{}}catch{}
 const source=localStorage.getItem('rukaProduct')||'';
 if(saved.codes&&saved.direction===(localStorage.getItem('rukaDirection')||'')&&saved.sourceProduct===source){slots=[0,1,2,3].map(i=>byCode(saved.codes[i]));return}
 slots=[byCode(conceptCode(source))||products.find(p=>p.category==='drink')||null,products.find(p=>p.category==='bag')||null,null,null];
}
productGrid.addEventListener('click',e=>{const button=e.target.closest('.use');if(button)chooseProduct(button.dataset.code)});
addEventListener('rukaLanguageChange',()=>{paintConcept();renderProducts()});
renderProducts();
rukaCatalog.load().then(items=>{
 products=items;
 const live=new Set(items.map(p=>conceptCategories[p.category]));
 document.querySelectorAll('.categories .cat').forEach(el=>{const value=el.getAttribute('onclick').match(/setCat\('([a-z]+)'/)?.[1];if(value!=='all'&&!live.has(value)){el.hidden=true;el.style.display='none'}});
 restoreConcept();paintConcept();renderProducts();
}).catch(()=>{paintConcept();productGrid.innerHTML='<p class="picker-empty">โหลดสินค้าไม่สำเร็จ กรุณาลองใหม่ หรือส่งโจทย์ให้ทีม RUKA</p>';moreBtn.style.display='none'});
