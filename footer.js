// Shared footer: only existing routes and verified RUKA contact channels.
(() => {
 const footer = document.createElement('footer');
 footer.className = 'site-footer';
 footer.innerHTML = `
 <div class="footer-inner">
  <div class="footer-top">
   <div class="footer-cta"><h2>มีไอเดียแล้ว?<br><span>เริ่มไปด้วยกัน.</span></h2><a class="footer-start" href="brief.html">เริ่มบรีฟโปรเจกต์<i aria-hidden="true">→</i></a></div>
   <div class="footer-links">
    <div class="footer-col"><h3>เลือกดู</h3><a href="products.html">สินค้าทั้งหมด</a><a href="occasion.html">เลือกตามโอกาส</a><a href="work.html">ผลงาน</a><a href="ideas.html">ไอเดียของขวัญ</a><a href="gift-planner.html">จัดของขวัญตามงบ</a></div>
    <div class="footer-col"><h3>Ruka</h3><a href="about.html">เกี่ยวกับเรา</a><a href="how.html">ขั้นตอนการทำงาน</a><a href="contact.html">ติดต่อ / ขอราคา</a></div>
    <div class="footer-col"><h3>ติดต่อ</h3><a href="tel:+66821138914">082-113-8914</a><span>จันทร์–ศุกร์ 8:00–18:00</span><a href="https://line.me/R/ti/p/@rukaworld" target="_blank" rel="noopener noreferrer">LINE</a><a href="https://facebook.com/rukaworld" target="_blank" rel="noopener noreferrer">Facebook</a><a href="https://instagram.com/rukaworld" target="_blank" rel="noopener noreferrer">Instagram</a></div>
   </div>
  </div>
  <div class="footer-bottom"><span>© ${new Date().getFullYear()} บริษัท รุกะ เวิลด์ จำกัด · ทีมคิดและผลิตของแบรนด์ ที่รับผิดชอบงานจนจบ</span><span class="footer-legal"><a href="privacy.html">นโยบายความเป็นส่วนตัว</a><a href="terms.html">ข้อกำหนดการใช้งาน</a></span></div>
 </div>`;
 document.body.append(footer);
 if('IntersectionObserver' in window){
  document.documentElement.classList.add('js-footer');
  const watch=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){footer.classList.add('is-in');watch.disconnect()}},{threshold:.3});
  watch.observe(footer);
 }else footer.classList.add('is-in');
})();
