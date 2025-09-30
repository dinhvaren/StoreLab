# 🛒 StoreLab — Vulnerable Web Lab

StoreLab là một **môi trường web ứng dụng giả lập** được xây dựng để sinh viên và người học bảo mật có thể thực hành khai thác các lỗ hổng phổ biến.  
Dự án sử dụng **Node.js, Express, MongoDB** và **Bootstrap (dark theme)** để mô phỏng một cửa hàng trực tuyến đơn giản.

> ⚠️ **Lưu ý quan trọng:** Đây là ứng dụng **dành cho mục đích học tập/CTF**. Không triển khai lên môi trường production.


## ✨ Các tính năng & lỗ hổng mô phỏng

- **Authentication**
  - Đăng ký / Đăng nhập (JWT token)
  - Lưu trữ session cơ bản

- **Dashboard**
  - Danh sách 10 sản phẩm mẫu
  - Chức năng "View image" → SSRF Lab

- **Orders**
  - Người dùng xem đơn hàng của mình
  - Lỗi **Broken Access Control** (có thể truy cập đơn hàng người khác qua URL)

- **Profile (Users)**
  - Hiển thị thông tin tài khoản
  - Recent activity

- **Admin Panel**
  - Trang quản lý user (CRUD)
  - Lỗi **IDOR / BAC** nếu không kiểm tra role

- **Lỗ hổng mô phỏng**
  - 🗄️ **NoSQL Injection**
  - 🔑 **JWT bypass / forgery**
  - 🔓 **Broken Access Control**
  - 🌐 **SSRF**

## 📂 Cấu trúc thư mục

```bash
StoreLab/
├── public/
│   ├── index.html        # Trang đăng ký / đăng nhập
│   ├── dashboard.html    # Trang dashboard store
│   ├── orders.html       # Danh sách orders
│   ├── order-view.html   # Chi tiết order
│   ├── users.html        # Profile người dùng
│   ├── admin-users.html  # Quản lý user (Admin)
│   ├── product-view.html # SSRF lab (fetch ảnh qua server)
│   └── assets/           # CSS, JS, hình ảnh tĩnh
├── server/
│   ├── app.js            # Express app
│   ├── routes/           # Định nghĩa route
│   └── models/           # Schema MongoDB
└── README.md
````


## 🚀 Cài đặt & chạy

### Yêu cầu

* Node.js >= 16
* MongoDB Community Server (chạy local hoặc Docker)

### Cách chạy

```bash
# Clone repo
git clone https://github.com/dinhvaren/StoreLab.git
cd StoreLab

# Cài dependencies
npm install

# Chạy server
npm start
```

Ứng dụng sẽ chạy ở:
👉 [http://127.0.0.1:3000/](http://127.0.0.1:3000/)


## 🎯 Hướng dẫn khai thác

* **NoSQLi:** Đăng nhập với payload đặc biệt để bypass auth.
* **JWT:** Thử sửa / forge token để truy cập role cao hơn.
* **Broken Access Control:** Truy cập `orders/:id` hoặc `admin/users` trực tiếp.
* **SSRF:** Dùng `product-view.html?url=http://127.0.0.1:27017/` để test.


## ⚠️ Cảnh báo

Ứng dụng này **chỉ phục vụ nghiên cứu và học tập**.
Không triển khai lên môi trường internet công khai hoặc sử dụng cho mục đích trái phép.


## 👨‍💻 Tác giả

* Dự án được xây dựng bởi [dinhvaren](https://github.com/dinhvaren)
* Phục vụ học tập và thực hành CTF / Pentest tại trường & cộng đồng.