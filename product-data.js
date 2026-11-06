// Shared product feed helpers: loading, display names, and category visibility.
(() => {
 const ENDPOINT='https://ruka-erp.vercel.app/api/public-products';
 const FALLBACK='assets/gift-planner-products.json';
 const clean=value=>String(value??'').replace(/\s+/g,' ').trim();
 const isEnglish=()=>{try{return localStorage.getItem('rukaLanguage')==='en'}catch{return false}};
 const name=product=>(isEnglish()&&clean(product.nameEn))||clean(product.name);
 const normalize=product=>({...product,name:clean(product.name),nameEn:clean(product.nameEn),size:clean(product.size)});
 const thumb=(url,width)=>String(url).includes('/storage/v1/object/public/')?String(url).replace('/storage/v1/object/public/','/storage/v1/render/image/public/')+`?width=${width}&quality=75`:url;
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
  document.querySelectorAll('.category-picker [data-pick]').forEach(card=>{
   const items=products.filter(p=>p.category===card.dataset.pick&&p.image);
   if(absent(card.dataset.pick)){hide(card);return}
   card.querySelector('.folder-count').textContent=products.filter(p=>p.category===card.dataset.pick).length+' สินค้า';
   const photo=(place,item)=>{const frame=card.querySelector('.folder-photo--'+place)||document.createElement('span');frame.className='folder-photo folder-photo--'+place;const image=frame.querySelector('img')||frame.appendChild(new Image);image.alt='';image.decoding='async';image.src=thumb(item.image,260);if(!frame.parentNode)card.querySelector('.folder-front').before(frame)};
   ['center','left','right'].forEach((place,i)=>{if(items[i])photo(place,items[i])});
  });
 }
 window.rukaCatalog={clean,name,thumb,load,syncCategoryTabs};
 if(document.querySelector('.category-picker'))load().then(syncCategoryTabs).catch(()=>{});
})();
