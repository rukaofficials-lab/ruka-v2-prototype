// Shared product feed helpers: loading, display names, and category visibility.
(() => {
 const ENDPOINT='https://ruka-erp.vercel.app/api/public-products';
 const FALLBACK='assets/gift-planner-products.json';
 const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
 const isEnglish=()=>{try{return localStorage.getItem('rukaLanguage')==='en'}catch{return false}};
 const name=product=>(isEnglish()&&clean(product.nameEn))||clean(product.name);
 const normalize=product=>({...product,name:clean(product.name),nameEn:clean(product.nameEn),size:clean(product.size)});
 const hide=el=>{el.hidden=true;el.style.display='none'};
 let request;
 async function read(url,options){const res=await fetch(url,options);if(!res.ok)throw Error('Product feed unavailable');const data=await res.json();if(!data.products?.length)throw Error('Product feed empty');return data.products.map(normalize)}
 function load(){
  request=request||read(ENDPOINT,{cache:'no-store',signal:AbortSignal.timeout(10000)}).catch(()=>read(FALLBACK));
  return request;
 }
 function syncCategoryTabs(products){
  const live=new Set(products.map(p=>p.category));
  const absent=value=>value&&value!=='all'&&!live.has(value);
  document.querySelectorAll('.bar .cat').forEach(el=>{if(absent(el.getAttribute('onclick')?.match(/"([a-z]+)"/)?.[1]))hide(el)});
  const tabs=[...document.querySelectorAll('.category-picker [data-pick]')];
  tabs.forEach(el=>{if(absent(el.dataset.pick))hide(el)});
  const active=tabs.find(el=>el.getAttribute('aria-selected')==='true');
  if(active?.hidden)tabs.find(el=>!el.hidden)?.click();
 }
 window.rukaCatalog={clean,name,load,syncCategoryTabs};
 if(document.querySelector('.category-picker'))load().then(syncCategoryTabs).catch(()=>{});
})();
