(()=>{
if(new URLSearchParams(location.search).get('planner')!=='1')return;
let plan;try{plan=JSON.parse(sessionStorage.getItem('rukaGiftPlan'))}catch{return}if(!plan||!Number.isInteger(plan.quantity)||plan.quantity<1)return;
const average=plan.total?plan.total/plan.quantity:0;
data.qty=String(plan.quantity);qty.value=data.qty;data.detail=plan.occasionLabel+' · '+plan.title;data.budget=average?(average<300?'ต่ำกว่า 300 บาท':average<600?'300–599 บาท':average<1000?'600–999 บาท':'1,000+ บาท'):'ให้ทีมช่วยวางงบ';data.dateLabel='';date.value='';mood.value='แนวที่เลือก: '+plan.title+'\nสินค้า: '+plan.items.map(p=>p.name+' ('+p.code+')').join(', ');
const note=document.createElement('p');note.className='brief-summary-note';note.textContent='งบรวมที่เลือก: '+(plan.total?plan.total.toLocaleString('th-TH')+' บาท':'ให้ทีมช่วยวางงบ')+' · '+plan.quantity+' ชุด';document.querySelector('.summary').prepend(note);
const edit=document.createElement('a');edit.href='gift-planner.html?resume=1&package='+plan.packageKey;edit.textContent='← กลับไปลองจัดชุดใหม่';note.append(document.createElement('br'),edit);
const prior=sync;sync=function(){prior();const brief=flowRead('rukaBrief');Object.assign(brief,{packageName:'RUKA '+plan.packageKey.toUpperCase(),totalBudget:plan.total,plannerSelection:plan,product:plan.items.map(p=>p.name).join(', ')});localStorage.setItem('rukaBrief',JSON.stringify(brief))};
const oldContext=document.querySelector('.flow-context');if(oldContext)oldContext.textContent='ชุดที่เลือก: '+plan.title;
sOccasion.textContent=plan.occasionLabel;
const priorNext=next;next=function(){priorNext();sync()};
document.querySelector('#complete .recommend').textContent='กรอกข้อมูลติดต่อ ให้ RUKA ช่วยต่อ →';document.querySelector('#complete .recommend').onclick=()=>location.href='contact.html';document.querySelector('#complete p').textContent='แนวสินค้า งบ และจำนวนพร้อมแล้ว เหลือข้อมูลติดต่อเพื่อส่งให้ทีมช่วยประเมิน';
step=4;sync();show();
})();
