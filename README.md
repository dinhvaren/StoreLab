# StoreLab — Vulnerable Web Application for Security Learning & CTF

**StoreLab** là một môi trường web giả lập, được thiết kế để sinh viên và người học bảo mật thực hành khai thác các lỗi bảo mật phổ biến. Ứng dụng mô phỏng một cửa hàng trực tuyến đơn giản (sản phẩm, đơn hàng, quản lý người dùng) và chứa một số lỗ hổng phục vụ mục đích học tập/CTF: Broken Access Control, NoSQL Injection, SSRF, JWT tampering, v.v.

> ⚠️ **Cảnh báo**: Đây là app dùng cho mục đích học tập/CTF. **Không** triển khai lên production hoặc hệ thống thật.

# 📦 Tính năng & lỗ hổng mô phỏng

* Đăng ký / Đăng nhập — JWT + session
* User Dashboard — xem profile, lịch sử đơn hàng
* Orders — mỗi user chỉ xem đơn của mình (mục tiêu IDOR)
* Admin Panel — CRUD user (dùng để luyện Broken Access Control)
* Sản phẩm mẫu — có 1 sản phẩm “flag” trả flag nếu mua
* Lỗ hổng mô phỏng:

  * Broken Access Control / IDOR
  * NoSQL Injection
  * JWT Forgery / Tampering
  * SSRF (khi server fetch URL)
  * Logic bugs (ví dụ: bypass nghiệp vụ mua hàng)

# 📂 Cấu trúc thư mục

```
StoreLab/
├── images/                # ảnh, uploads
├── src/
│   ├── app/
│   │   ├── controllers/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   └── views/
│   ├── index.js
│   └── .env                # cấu hình môi trường (MONGODB_URI, JWT_SECRET,...)
├── seedUsers.js            # seed users (admin,test,...)
├── seedProducts.js         # seed products (bao gồm product flag)
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

# 🛠️ Cài đặt & chạy

## Yêu cầu

* Docker & Docker Compose (khuyến nghị)
* Node.js ≥ 16 nếu chạy local
* MongoDB (nếu không dùng Docker)

## Chạy bằng Docker (khuyến nghị)

1. Clone:

```bash
git clone https://github.com/dinhvaren/StoreLab.git
cd StoreLab
```

2. Build & chạy:

```bash
docker compose up -d --build
```

3. Truy cập:

```
http://localhost:3000
```

# ⏲️ Reset dữ liệu định kỳ mỗi 2 tiếng (Cron seed)

Trong `docker-compose.yml` có service `mongo_cleaner` (node) để:

* chạy seedUsers.js & seedProducts.js **ngay khi container khởi động**;
* tiếp đó **chạy lại mỗi 2 tiếng** theo cron `0 */2 * * *`.

**Nếu bạn muốn seed ngay khi khởi động và sau đó lặp mỗi 2 tiếng**, đảm bảo `mongo_cleaner` command chạy seed lần đầu rồi set cron (mình đã chuẩn hóa sẵn trong ví dụ).

Xem log:

```bash
docker logs -f mongo_cleaner
```

**Muốn chỉ reset products (giữ users)?** chỉnh cron command chỉ gọi `node seedProducts.js` thay vì cả hai.

# 🧪 Cách seed đúng (troubleshooting)

> **Lưu ý lỗi phổ biến:** `E11000 duplicate key error collection: VHUStore.users index: userId_1 dup key: { userId: null }`

Nguyên nhân & cách xử lý:

1. **Nguyên nhân**

   * Bạn dùng plugin `mongoose-sequence` (auto-increment) cho `userId` **và** `_id` cùng lúc, hoặc counters/index cũ còn tồn tại.
   * `insertMany()` **bypass** middleware `pre('save')` của plugin → plugin không gán giá trị auto-increment → `userId` = `null` → trùng key.

2. **Cách khắc phục (đã chuẩn hóa trong seed script)**

   * Trước khi insert, **drop index `userId_1`** (nếu tồn tại) và **xóa collection `counters`**:

     ```js
     await db.collection("users").dropIndex("userId_1").catch(()=>{});
     await db.collection("counters").deleteMany({}).catch(()=>{});
     ```
   * Xóa documents cũ (nếu cần) rồi insert.
   * **Dùng `new Model(doc).save()`** thay vì `insertMany()` nếu muốn middleware (plugin) chạy và gán `_id`/`userId` chính xác.

3. **Nếu bạn muốn giữ model nguyên (auto-increment cho _id và userId)**:

   * Thì seed script **phải** làm sạch index + counters trước khi insert — seed script mẫu mình cung cấp đã thực hiện các bước này.

---

# 🎯 Hướng dẫn khai thác (ideas)

* **NoSQLi**: thử bypass login bằng payload JSON (ví dụ `{ "$ne": null }` kiểu truy vấn)
* **JWT tamper**: chỉnh payload token, thay `role` thành `admin` nếu backend không verify signature đúng
* **IDOR**: truy vấn `/orders/:id` của người khác
* **SSRF**: truyền URL đến param hiển thị ảnh, xem server fetch nội dung
* **Logic bug**: thao tác trái phép trong flow mua hàng để lấy `flagValue`

# 🧩 Ghi chú & cảnh báo

* Không deploy công khai.
* Không chứa dữ liệu thật.
* Thử nghiệm chỉ trong môi trường cách ly (lab, VM, local).
* Nếu gặp lỗi auto-increment / counters, dùng seed script đã chuẩn hóa hoặc thủ công chạy:

  ```bash
  docker exec -it storelab_mongo mongosh --eval 'use VHUStore; db.users.dropIndexes(); db.counters.deleteMany({});'
  ```

# 👤 Tác giả & đóng góp

* Tác giả: **dinhvaren**
* Mục đích: môi trường CTF / lab bảo mật cho sinh viên & cộng đồng
* Chào đón PR / issue / feature request (đặc biệt: thêm challenge, write-up mẫu, docs).