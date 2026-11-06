# RUKA website: pre-launch review

Branch นี้คือสำเนาเว็บล่าสุด ณ วันที่ 6 พ.ย. 2569 สำหรับให้ทีมตรวจโค้ด

## วิธีรัน

เป็นเว็บ static (HTML/CSS/JS) ไม่ต้องติดตั้งอะไรเพิ่ม

```bash
git clone -b review/pre-launch https://github.com/rukaofficials-lab/ruka-v2-prototype.git
cd ruka-v2-prototype
python3 -m http.server 8765
```

เปิด http://localhost:8765

ต้องใช้พอร์ต 8765 เพราะ API ฝั่ง ERP อนุญาต CORS เฉพาะ `localhost:8765` และ `rukaworld.co`

ตรวจลิงก์และ syntax ของ JavaScript ได้ด้วย:

```bash
python3 tests/check-site.py
```

## โครงสร้างหลัก

| ไฟล์ | หน้าที่ |
|---|---|
| `index.html`, `home-*.css/js`, `hero-*`, `landing.*` | หน้าแรก |
| `products.html`, `product.html`, `live-products.js`, `product-detail-erp.js` | สินค้า (ดึงจาก ERP) |
| `occasion.html`, `brief.html`, `recommendations.html`, `concept.html` | ขั้นตอนบรีฟ |
| `gift-planner.*`, `planner-brief.js` | Gift planner |
| `contact.html`, `contact.js` | ฟอร์มส่ง lead |
| `flow.js`, `language.js` | พฤติกรรมหลักและการสลับ TH/EN |

## API ภายนอก

- `POST https://ruka-erp.vercel.app/api/public-lead`: รับ lead จากฟอร์ม
- `GET https://ruka-erp.vercel.app/api/public-products`: รายการสินค้า

## ข้อควรระวังตอนทดสอบ

**ฟอร์มติดต่อส่งเข้า ERP จริง** ถ้าทดสอบส่งฟอร์ม ให้ขึ้นต้นชื่อด้วย `TEST` เพื่อให้ลบภายหลังได้

## จุดที่ควรตรวจ

- ฟอร์มและการส่ง lead: validation, honeypot, กรณี API ล่ม
- ข้อมูลที่เปิดเผยต่อสาธารณะ: ราคา ข้อความภายใน ค่า key
- การใช้งานบนมือถือและ TH/EN ครบทุกหน้า
- ความเร็วโหลด: ภาพขนาดใหญ่ใน `assets/`
- ไฟล์ที่ไม่ควรขึ้นจริง: `gradient-preview.html` เป็นหน้าทดลอง
