# Backend Setup Guide

## Cấu hình môi trường

Tạo file `.env` trong thư mục `backend` với nội dung sau:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/web-banhang
JWT_SECRET=minishop-secret-key-2024-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
GOOGLE_CLIENT_ID=your-google-client-id-here
```

## Quan trọng

1. **JWT_SECRET**: Đây là key bí mật để mã hóa token. Trong production, hãy thay đổi thành một chuỗi ngẫu nhiên phức tạp.

2. **MONGODB_URI**: Đảm bảo MongoDB đang chạy trên máy local hoặc cập nhật URI để kết nối đến MongoDB Atlas.

3. **GOOGLE_CLIENT_ID**: Nếu muốn sử dụng đăng nhập Google, cần tạo OAuth credentials tại Google Cloud Console.

## Khởi động server

```bash
npm install
npm run dev
```

Server sẽ chạy tại `http://localhost:5000`

## Seed dữ liệu mẫu

```bash
npm run seed
```

Lệnh này sẽ tạo:
- Categories (Điện thoại, Laptop, Phụ kiện, Smartwatch, Đồng hồ, Tablet)
- 40+ sản phẩm mẫu
- User admin mặc định
