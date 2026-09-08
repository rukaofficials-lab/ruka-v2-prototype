// Shared footer: only existing routes and verified RUKA contact channels.
(() => {
 const footer = document.createElement('footer');
 footer.className = 'site-footer';
 footer.innerHTML = `
 <div class="footer-grid">
  <div class="footer-brand">
   <a class="footer-logo" href="./" aria-label="RUKA หน้าแรก"><span>R</span><span class="gold">uka</span><span class="footer-dot" aria-hidden="true"></span></a>
   <p>คิด ออกแบบ และผลิตของขวัญองค์กร<br>เริ่มจากไอเดียของคุณ แล้วให้ RUKA ช่วยต่อให้ครบ</p>
   <div class="footer-social"><a href="https://facebook.com/rukaworld" target="_blank" rel="noopener noreferrer">Facebook ↗</a><a href="https://instagram.com/rukaworld" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="https://line.me/R/ti/p/@rukaworld" target="_blank" rel="noopener noreferrer">LINE ↗</a></div>
  </div>
  <div class="footer-links"><h2>EXPLORE</h2><a href="products.html">สินค้าทั้งหมด</a><a href="occasion.html">เลือกตามโอกาส</a><a href="ideas.html">ไอเดียของขวัญ</a><a href="brief.html">บรีฟโปรเจกต์</a></div>
  <div class="footer-links"><h2>RUKA</h2><a href="about.html">เกี่ยวกับเรา</a><a href="how.html">ขั้นตอนการทำงาน</a><a href="contact.html">ติดต่อ / ขอราคา</a><a href="tel:+66821138914">082-113-8914</a><span>จันทร์–ศุกร์ 8:00–18:00</span></div>
  <div class="footer-cta"><h2>มีไอเดียแล้ว?<br><span>เริ่มไปด้วยกัน.</span></h2><p>บอกโอกาส จำนวน และงบที่มี<br>หรือเลือกสินค้าไว้แล้วค่อยคุยกับทีมก็ได้</p><a class="footer-start" href="brief.html">เริ่มบรีฟโปรเจกต์ <span aria-hidden="true">↗</span></a><a class="footer-talk" href="contact.html">คุยกับทีม RUKA →</a></div>
 </div>
 <div class="footer-bottom"><span>© ${new Date().getFullYear()} บริษัท รุกะ เวิลด์ จำกัด</span><span>คิด · ออกแบบ · ผลิต — RUKA</span></div>`;
 document.body.append(footer);
})();
