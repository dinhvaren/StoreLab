# StoreLab — Vulnerable Web Application for Security Learning & CTF

**StoreLab** là một môi trường web giả lập, được thiết kế để sinh viên, người học bảo mật có thể thực hành khai thác các lỗi bảo mật phổ biến. Ứng dụng mô phỏng một cửa hàng trực tuyến đơn giản, có sản phẩm, đơn hàng, quản lý người dùng, và các lỗ hổng như Broken Access Control, NoSQL Injection, SSRF, JWT tampering, v.v.

> **⚠️ Cảnh báo**: Đây là ứng dụng dành cho mục đích **học tập/CTF**. Không nên triển khai lên môi trường production hoặc hệ thống thực tế.

## 📦 Tính năng & lỗ hổng mô phỏng

- **Đăng ký / Đăng nhập** — sử dụng JWT + session
- **User Dashboard** — xem profile, lịch sử đơn hàng
- **Orders** — mỗi user chỉ nên xem đơn hàng của mình
- **Quản lý người dùng (Admin Panel)** — CRUD user
- **Sản phẩm mẫu** — trong đó có 1 sản phẩm “flag” trả về flag nếu mua
- **Lỗ hổng mô phỏng**:
  - Broken Access Control / IDOR (truy cập đơn hàng người khác, truy cập endpoint admin khi không kiểm tra role)
  - NoSQL Injection (bypass login, truy vấn độc hại)
  - JWT Forgery / Tampering (thay đổi payload để leo quyền)
  - SSRF (view hình ảnh sản phẩm — gọi URL từ server)
  - Logic bugs khác (quyền, nghiệp vụ mua hàng)

## 📂 Cấu trúc thư mục

```

StoreLab/
├── images/                # Thư mục chứa ảnh hoặc ảnh upload
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
│   └── .env  (cấu hình môi trường, connect DB)
├── seedUsers.js            # Script seed user mẫu (admin, test, etc.)
├── seedProducts.js         # Script seed sản phẩm mẫu (bao gồm product flag)
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md

````

## 🛠️ Cài đặt & chạy

### Yêu cầu

- Docker & Docker Compose  
- Node.js ≥ 16 nếu chạy local (không Docker)  
- MongoDB (nếu không dùng Docker)

### Chạy bằng Docker (cách được khuyến nghị)

1. Clone repo:

   ```bash
   git clone https://github.com/dinhvaren/StoreLab.git
   cd StoreLab
````

2. Xây dựng & chạy:

   ```bash
   docker compose up -d --build
   ```

3. Truy cập ứng dụng:

   ```
   http://localhost:3000
   ```


## ⏲️ Reset dữ liệu định kỳ mỗi 2 tiếng (Cron seed)

Đã cấu hình trong `docker-compose.yml` một service tên `mongo_cleaner` để:

* Chạy seed user & product ngay khi container khởi động
* Sau đó chạy lại seed mỗi 2 tiếng (cron: `0 */2 * * *`)

Bạn có thể xem log:

```bash
docker logs -f mongo_cleaner
```

Nếu bạn muốn chỉ seed `products` (giữ user admin bất biến), có thể chỉnh dòng cron trong `docker-compose.yml` thành:

```bash
node seedProducts.js
```

---

## 🧪 Sử dụng script seed đúng cách

* `seedUsers.js` — tạo user mẫu (admin, user bình thường) — nên drop index & reset counters trước khi insert nếu dùng plugin auto-increment.
* `seedProducts.js` — xóa collection `products` rồi insert sản phẩm mẫu (có flag).
* Nên dùng `.save()` thay vì `insertMany` nếu bạn dùng plugin mongoose-sequence để đảm bảo `_id` / `userId` được gán chính xác.

## 🎯 Hướng dẫn khai thác

Dưới đây là một số ý tưởng để thực hành:

* NoSQL Injection: thử bypass login với payload JSON đặc biệt
* JWT Forgery: chỉnh sửa payload token để leo quyền
* IDOR / Broken Access Control: truy cập `/orders/:id` hoặc admin routes người dùng khác
* SSRF: thử truyền URL tới `product-view` parameter
* Logic flaw: mua sản phẩm flag, kiểm tra phản hồi flagValue

## 🧩 Ghi chú & cảnh báo

* Không thích hợp để deploy công khai
* Không nên chứa dữ liệu thật
* Chỉ dùng cho mục đích học tập, thí nghiệm bảo mật
* Có thể gây lỗi nếu plugin auto-increment hoặc counters bị xung đột — hãy reset counters / drop index khi seed lại

## 👤 Tác giả & đóng góp

* Dự án xây dựng bởi **dinhvaren**
* Mục đích: môi trường CTF / lab bảo mật cho sinh viên & cộng đồng
* Rất hoan nghênh các PR, issue sửa lỗi, bổ sung lỗ hổng mới

