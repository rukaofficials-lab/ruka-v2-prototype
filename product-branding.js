(()=>{
// These are options to discuss, not verified manufacturing specifications.
const fabric=['ผ้า / สิ่งทอ',['งานปัก','สกรีน','พิมพ์ลายบนผ้า']];
const drink=['วัสดุตัวแก้วและผิวเคลือบ',['สกรีนโลโก้','เลเซอร์บนวัสดุที่รองรับ','พิมพ์ UV / งานนูน 3D ตามพื้นผิว']];
const options={
 'Everyday Tumbler':drink,'Premium Bottle':drink,
 'Ceramic Mug Set':['เซรามิกและผิวเคลือบ',['พิมพ์ลาย / รูปลอกสำหรับเซรามิก','โลโก้บนกล่อง','การ์ดและปลอกกระดาษ']],
 'Premium Utility Bag':fabric,'Urban Backpack':fabric,'Custom Apparel':fabric,
 'Compact Umbrella':['ผ้าร่มและด้ามจับ',['สกรีนบนผ้าร่ม','พิมพ์โลโก้บนด้ามตามวัสดุ','ป้ายแบรนด์']],
 'Compact Tech Kit':['วัสดุอุปกรณ์และกระเป๋าในชุด',['พิมพ์โลโก้ตามพื้นผิว','เลเซอร์บนชิ้นส่วนที่รองรับ','ป้าย / โลโก้บนกระเป๋า']],
 'Power Bank':['วัสดุตัวเครื่องและผิวเคลือบ',['สกรีน / พิมพ์ UV ตามพื้นผิว','เลเซอร์บนวัสดุที่รองรับ','กล่องและปลอกแบรนด์']],
 'Eco Welcome Kit':['วัสดุของแต่ละชิ้นในชุด',['เลือกวิธีพิมพ์ตามวัสดุ','ปักบนชิ้นงานผ้าที่รองรับ','การ์ดและแพ็กเกจแบรนด์']],
 'Custom Gift Box':['กระดาษและวัสดุหุ้มกล่อง',['พิมพ์โลโก้และลาย','ปั๊มฟอยล์ / ปั๊มนูนตามวัสดุ','ปลอกกล่องและการ์ด']],
 'Clear Event Bag':['วัสดุใสและสายกระเป๋า',['พิมพ์โลโก้บนวัสดุที่รองรับ','ป้าย / โลโก้บนสาย','การ์ดแทรกแบรนด์']]
};
const [material,methods]=options[selected];
const custom=document.querySelector('.custom');custom.querySelector('h3').textContent='สินค้านี้ต่อยอดโลโก้แบบไหนได้บ้าง?';
const intro=document.createElement('p');intro.className='branding-material';intro.textContent='พิจารณาจาก: '+material;custom.querySelector('h3').after(intro);
const chips=custom.querySelector('.chips');chips.replaceChildren();methods.forEach(method=>{const chip=document.createElement('span');chip.className='chip';chip.textContent=method;chips.append(chip)});
const note=document.createElement('p');note.className='branding-note';note.textContent='แนวทางเบื้องต้นสำหรับคุยกับทีม — ต้องยืนยันวัสดุจริง ผิวเคลือบ และพื้นที่โลโก้ของรุ่นนี้ก่อนเลือกเทคนิคผลิต';custom.append(note);
})();
