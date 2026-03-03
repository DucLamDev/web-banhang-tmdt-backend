import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Banner from '../models/Banner.js';

dotenv.config();

const categories = [
  { name: 'Điện thoại', slug: 'dien-thoai', icon: '📱', order: 1 },
  { name: 'Laptop', slug: 'laptop', icon: '💻', order: 2 },
  { name: 'Tablet', slug: 'tablet', icon: '📟', order: 3 },
  { name: 'Phụ kiện', slug: 'phu-kien', icon: '🎧', order: 4 },
  { name: 'Smartwatch', slug: 'smartwatch', icon: '⌚', order: 5 },
  { name: 'Đồng hồ', slug: 'dong-ho', icon: '🕐', order: 6 },
];

const users = [
  { email: 'admin@tgdd.vn', password: 'Admin@123', fullName: 'Admin TGDD', phone: '0901234567', role: 'admin' },
  { email: 'user@test.com', password: 'User@123', fullName: 'Nguyễn Văn Test', phone: '0909876543', role: 'user' },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Promise.all([Category.deleteMany({}), Product.deleteMany({}), User.deleteMany({}), Banner.deleteMany({})]);
    console.log('🗑️ Cleared existing data');

    const createdCategories = await Category.insertMany(categories);
    const categoryMap = {};
    createdCategories.forEach(cat => { categoryMap[cat.slug] = cat._id; });

    const products = [
      // iPhone 17 Pro Max
      {
        name: 'iPhone 17 Pro Max', slug: 'iphone-17-pro-max', brand: 'Apple',
        category: categoryMap['dien-thoai'],
        shortDescription: 'iPhone 17 Pro Max - Đột phá công nghệ 2026',
        description: 'iPhone 17 Pro Max với chip A18 Pro thế hệ mới, camera 48MP tiên tiến, màn hình Super Retina XDR 6.9 inch. Thiết kế titanium cấp độ vũ trụ.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/342679/iphone-17-pro-max-cam-thumb-600x600.jpg',
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/342679/iphone-17-pro-max-cam-thumb-600x600.jpg'
        ],
        variants: [
          { name: '256GB - Cam', color: 'Cam', colorCode: '#ff6b35', storage: '256GB', price: 35990000, originalPrice: 37990000, stock: 50, sku: 'IP17PM-256-ORG' },
          { name: '512GB - Cam', color: 'Cam', colorCode: '#ff6b35', storage: '512GB', price: 39990000, originalPrice: 41990000, stock: 30, sku: 'IP17PM-512-ORG' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '6.9 inch Super Retina XDR' }, { label: 'Độ phân giải', value: '2868 x 1320 pixels' }] },
          { group: 'Hệ điều hành', items: [{ label: 'OS', value: 'iOS 18' }] },
          { group: 'Camera', items: [{ label: 'Camera sau', value: '48MP + 48MP + 12MP' }, { label: 'Camera trước', value: '12MP' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Apple A18 Pro' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '4685 mAh' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 33990000, flashSaleEnd: new Date(Date.now() + 86400000 * 5), flashSaleStock: 25,
        averageRating: 5, totalReviews: 45, totalSold: 120, views: 890
      },
      // iPhone 16 Pro Max
      {
        name: 'iPhone 16 Pro Max', slug: 'iphone-16-pro-max', brand: 'Apple',
        category: categoryMap['dien-thoai'],
        shortDescription: 'iPhone 16 Pro Max - Titan Sa Mạc',
        description: 'iPhone 16 Pro Max với chip A17 Pro, camera 48MP, màn hình Super Retina XDR 6.7 inch. Màu sắc độc đáo Sa Mạc.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-sa-mac-thumb-1-600x600.jpg',
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-sa-mac-thumb-1-600x600.jpg'
        ],
        variants: [
          { name: '256GB - Sa Mạc', color: 'Sa Mạc', colorCode: '#d4a574', storage: '256GB', price: 33990000, originalPrice: 34990000, stock: 45, sku: 'IP16PM-256-DST' },
          { name: '512GB - Sa Mạc', color: 'Sa Mạc', colorCode: '#d4a574', storage: '512GB', price: 37990000, originalPrice: 38990000, stock: 35, sku: 'IP16PM-512-DST' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '6.7 inch Super Retina XDR' }, { label: 'Độ phân giải', value: '2796 x 1290 pixels' }] },
          { group: 'Hệ điều hành', items: [{ label: 'OS', value: 'iOS 17' }] },
          { group: 'Camera', items: [{ label: 'Camera sau', value: '48MP + 12MP + 12MP' }, { label: 'Camera trước', value: '12MP' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Apple A17 Pro' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '4422 mAh' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 31990000, flashSaleEnd: new Date(Date.now() + 86400000 * 3), flashSaleStock: 20,
        averageRating: 4.9, totalReviews: 156, totalSold: 340, views: 1250
      },
      // iPhone 15 Plus
      {
        name: 'iPhone 15 Plus 128GB', slug: 'iphone-15-plus-128gb', brand: 'Apple',
        category: categoryMap['dien-thoai'],
        shortDescription: 'iPhone 15 Plus - Màn hình lớn, giá tốt',
        description: 'iPhone 15 Plus với màn hình 6.7 inch, chip A16 Bionic, camera 48MP. Thiết kế nhôm cao cấp.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-128gb-den-thumb-600x600.jpg',
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/303891/iphone-15-plus-128gb-den-thumb-600x600.jpg'
        ],
        variants: [
          { name: '128GB - Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '128GB', price: 24990000, originalPrice: 25990000, stock: 60, sku: 'IP15P-128-BLK' },
          { name: '256GB - Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '256GB', price: 27990000, originalPrice: 28990000, stock: 40, sku: 'IP15P-256-BLK' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '6.7 inch Super Retina XDR' }, { label: 'Độ phân giải', value: '2796 x 1290 pixels' }] },
          { group: 'Hệ điều hành', items: [{ label: 'OS', value: 'iOS 17' }] },
          { group: 'Camera', items: [{ label: 'Camera sau', value: '48MP + 12MP' }, { label: 'Camera trước', value: '12MP' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Apple A16 Bionic' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '4383 mAh' }] }
        ],
        isFeatured: true, averageRating: 4.8, totalReviews: 234, totalSold: 567, views: 2100
      },
      // iPhone 14 Plus
      {
        name: 'iPhone 14 Plus', slug: 'iphone-14-plus', brand: 'Apple',
        category: categoryMap['dien-thoai'],
        shortDescription: 'iPhone 14 Plus - Giá tốt nhất',
        description: 'iPhone 14 Plus với màn hình 6.7 inch, chip A15 Bionic, camera kép 12MP. Pin trâu, giá hợp lý.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-plus-thumb-xanh-600x600.jpg',
        images: [
          'https://cdn.tgdd.vn/Products/Images/42/240259/iPhone-14-plus-thumb-xanh-600x600.jpg'
        ],
        variants: [
          { name: '128GB - Xanh', color: 'Xanh', colorCode: '#4a90e2', storage: '128GB', price: 20990000, originalPrice: 22990000, stock: 70, sku: 'IP14P-128-BLU' },
          { name: '256GB - Xanh', color: 'Xanh', colorCode: '#4a90e2', storage: '256GB', price: 23990000, originalPrice: 25990000, stock: 50, sku: 'IP14P-256-BLU' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '6.7 inch Super Retina XDR' }, { label: 'Độ phân giải', value: '2778 x 1284 pixels' }] },
          { group: 'Hệ điều hành', items: [{ label: 'OS', value: 'iOS 16' }] },
          { group: 'Camera', items: [{ label: 'Camera sau', value: '12MP + 12MP' }, { label: 'Camera trước', value: '12MP' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Apple A15 Bionic' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '4325 mAh' }] }
        ],
        isFeatured: false, averageRating: 4.7, totalReviews: 456, totalSold: 890, views: 3200
      },
      // MacBook Air 13 M4
      {
        name: 'MacBook Air 13 inch M4', slug: 'macbook-air-13-m4', brand: 'Apple',
        category: categoryMap['laptop'],
        shortDescription: 'MacBook Air M4 - Mỏng nhẹ, mạnh mẽ',
        description: 'MacBook Air 13 inch với chip M4 thế hệ mới, màn hình Liquid Retina, pin 18 giờ. Thiết kế siêu mỏng nhẹ.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/44/335362/macbook-air-13-inch-m4-xanh-den-600x600.jpg',
        images: [
          'https://cdn.tgdd.vn/Products/Images/44/335362/macbook-air-13-inch-m4-xanh-den-600x600.jpg'
        ],
        variants: [
          { name: 'M4 8GB 256GB', color: 'Xanh Đen', colorCode: '#1c3d5a', storage: '256GB', price: 28990000, originalPrice: 28990000, stock: 40, sku: 'MBA13-M4-256' },
          { name: 'M4 16GB 512GB', color: 'Xanh Đen', colorCode: '#1c3d5a', storage: '512GB', price: 35990000, originalPrice: 35990000, stock: 30, sku: 'MBA13-M4-512' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '13.6 inch Liquid Retina' }, { label: 'Độ phân giải', value: '2560 x 1664 pixels' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'Apple M4 8-core' }] },
          { group: 'GPU', items: [{ label: 'GPU', value: '10-core GPU' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB - 16GB' }] },
          { group: 'Pin', items: [{ label: 'Thời lượng', value: 'Lên đến 18 giờ' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 26990000, flashSaleEnd: new Date(Date.now() + 86400000 * 4), flashSaleStock: 15,
        averageRating: 4.9, totalReviews: 89, totalSold: 210, views: 780
      },
      // Dell Inspiron 15
      {
        name: 'Dell Inspiron 15 DC15250 i5', slug: 'dell-inspiron-15-dc15250-i5', brand: 'Dell',
        category: categoryMap['laptop'],
        shortDescription: 'Dell Inspiron 15 - Hiệu suất ổn định',
        description: 'Dell Inspiron 15 với Intel Core i5 thế hệ 13, RAM 8GB, SSD 512GB. Phù hợp văn phòng và học tập.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/340561/dell-15-dc15250-i5-dc5i5357w1-638900114676211077-600x600.jpg',
        images: [
          'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/340561/dell-15-dc15250-i5-dc5i5357w1-638900114676211077-600x600.jpg'
        ],
        variants: [
          { name: 'i5 8GB 512GB', color: 'Bạc', colorCode: '#c0c0c0', storage: '512GB', price: 15990000, originalPrice: 17990000, stock: 55, sku: 'DELL15-I5-512' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '15.6 inch FHD' }, { label: 'Độ phân giải', value: '1920 x 1080 pixels' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'Intel Core i5-1335U' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB DDR4' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD' }] }
        ],
        isFeatured: false, averageRating: 4.5, totalReviews: 67, totalSold: 145, views: 450
      },
      // Lenovo IdeaPad Slim 3
      {
        name: 'Lenovo IdeaPad Slim 3 15IRH10 i5', slug: 'lenovo-ideapad-slim-3-15irh10-i5', brand: 'Lenovo',
        category: categoryMap['laptop'],
        shortDescription: 'Lenovo IdeaPad - Mỏng nhẹ, giá tốt',
        description: 'Lenovo IdeaPad Slim 3 với Intel Core i5, RAM 8GB, SSD 512GB. Thiết kế mỏng nhẹ, phù hợp di động.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/334442/lenovo-ideapad-slim-3-15irh10-i5-83k1000hvn-638775478046964172-600x600.jpg',
        images: [
          'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/334442/lenovo-ideapad-slim-3-15irh10-i5-83k1000hvn-638775478046964172-600x600.jpg'
        ],
        variants: [
          { name: 'i5 8GB 512GB', color: 'Xám', colorCode: '#6b7280', storage: '512GB', price: 14990000, originalPrice: 16990000, stock: 60, sku: 'LNV-SLIM3-I5-512' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '15.6 inch FHD' }, { label: 'Độ phân giải', value: '1920 x 1080 pixels' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'Intel Core i5-13420H' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB DDR5' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD' }] }
        ],
        isFeatured: true, averageRating: 4.6, totalReviews: 123, totalSold: 289, views: 890
      },
      // iMac 24 M4
      {
        name: 'iMac 24 inch M4 16GB 512GB', slug: 'imac-24-m4-16gb-512gb', brand: 'Apple',
        category: categoryMap['laptop'],
        shortDescription: 'iMac 24 M4 - Máy tính để bàn All-in-One',
        description: 'iMac 24 inch với chip M4, màn hình 4.5K Retina, thiết kế siêu mỏng. Màu xanh dương độc đáo.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/5698/331482/imac-24-inch-m4-16gb-512gb-blue-600x600.jpg',
        images: [
          'https://cdn.tgdd.vn/Products/Images/5698/331482/imac-24-inch-m4-16gb-512gb-blue-600x600.jpg'
        ],
        variants: [
          { name: 'M4 16GB 512GB', color: 'Xanh Dương', colorCode: '#4a90e2', storage: '512GB', price: 42990000, originalPrice: 42990000, stock: 25, sku: 'IMAC24-M4-512' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '24 inch 4.5K Retina' }, { label: 'Độ phân giải', value: '4480 x 2520 pixels' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'Apple M4 10-core' }] },
          { group: 'GPU', items: [{ label: 'GPU', value: '10-core GPU' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '16GB' }] }
        ],
        isFeatured: true, averageRating: 4.9, totalReviews: 34, totalSold: 78, views: 340
      },
      // Samsung Galaxy Buds 3
      {
        name: 'Samsung Galaxy Buds 3 R530N', slug: 'samsung-galaxy-buds-3-r530n', brand: 'Samsung',
        category: categoryMap['phu-kien'],
        shortDescription: 'Galaxy Buds 3 - Tai nghe cao cấp',
        description: 'Samsung Galaxy Buds 3 với chống ồn chủ động ANC, âm thanh 360 độ, pin 24 giờ. Thiết kế hiện đại.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/327553/tai-nghe-bluetooth-true-wireless-samsung-galaxy-buds-3-r530n-thumb-639026927533860547-600x600.jpg',
        images: [
          'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/327553/tai-nghe-bluetooth-true-wireless-samsung-galaxy-buds-3-r530n-thumb-639026927533860547-600x600.jpg'
        ],
        variants: [
          { name: 'Trắng', color: 'Trắng', colorCode: '#ffffff', storage: '', price: 3990000, originalPrice: 4490000, stock: 100, sku: 'BUDS3-WHT' },
          { name: 'Đen', color: 'Đen', colorCode: '#000000', storage: '', price: 3990000, originalPrice: 4490000, stock: 100, sku: 'BUDS3-BLK' }
        ],
        specifications: [
          { group: 'Kết nối', items: [{ label: 'Bluetooth', value: '5.3' }] },
          { group: 'Pin', items: [{ label: 'Thời lượng', value: 'Lên đến 24 giờ' }] },
          { group: 'Tính năng', items: [{ label: 'Chống ồn', value: 'ANC chủ động' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 3490000, flashSaleEnd: new Date(Date.now() + 86400000 * 2), flashSaleStock: 50,
        averageRating: 4.7, totalReviews: 234, totalSold: 567, views: 1890
      },
      // Apple Watch
      {
        name: 'Apple Watch Series 9 GPS 41mm', slug: 'apple-watch-series-9-gps-41mm', brand: 'Apple',
        category: categoryMap['smartwatch'],
        shortDescription: 'Apple Watch S9 - Đồng hồ thông minh',
        description: 'Apple Watch Series 9 với chip S9, màn hình Always-On Retina, theo dõi sức khỏe toàn diện.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/7264/278564/mvw-ms078-02-nam-thumb-fix-600x600.jpeg',
        images: [
          'https://cdn.tgdd.vn/Products/Images/7264/278564/mvw-ms078-02-nam-thumb-fix-600x600.jpeg'
        ],
        variants: [
          { name: '41mm GPS', color: 'Đen', colorCode: '#1c1c1e', storage: '', price: 10990000, originalPrice: 11990000, stock: 45, sku: 'AWS9-41-BLK' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '41mm Always-On Retina' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Apple S9' }] },
          { group: 'Tính năng', items: [{ label: 'Sức khỏe', value: 'ECG, SpO2, Nhịp tim' }] },
          { group: 'Pin', items: [{ label: 'Thời lượng', value: 'Lên đến 18 giờ' }] }
        ],
        isFeatured: false, averageRating: 4.8, totalReviews: 178, totalSold: 345, views: 980
      },
      // HP Laptop
      {
        name: 'HP 15 FC0085AU R5', slug: 'hp-15-fc0085au-r5', brand: 'HP',
        category: categoryMap['laptop'],
        shortDescription: 'HP 15 - Laptop AMD Ryzen 5',
        description: 'HP 15 với AMD Ryzen 5, RAM 8GB, SSD 512GB. Hiệu năng tốt, giá cả phải chăng.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327098/hp-15-fc0085au-r5-a6vv8pa-170225-110652-878-600x600.jpg',
        images: [
          'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/327098/hp-15-fc0085au-r5-a6vv8pa-170225-110652-878-600x600.jpg'
        ],
        variants: [
          { name: 'R5 8GB 512GB', color: 'Bạc', colorCode: '#c0c0c0', storage: '512GB', price: 13990000, originalPrice: 15990000, stock: 65, sku: 'HP15-R5-512' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '15.6 inch FHD' }, { label: 'Độ phân giải', value: '1920 x 1080 pixels' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'AMD Ryzen 5 7530U' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB DDR4' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD' }] }
        ],
        isFeatured: false, averageRating: 4.4, totalReviews: 89, totalSold: 198, views: 560
      },

      // ===== LAPTOPS MỚI =====
      {
        name: 'Lenovo IdeaPad Slim 3 15AMN8 R5', slug: 'lenovo-ideapad-slim-3-15amn8-r5', brand: 'Lenovo',
        category: categoryMap['laptop'],
        shortDescription: 'Lenovo IdeaPad Slim 3 - AMD Ryzen 5 siêu mỏng',
        description: 'Lenovo IdeaPad Slim 3 15AMN8 với chip AMD Ryzen 5 7520U, RAM 8GB, SSD 512GB, màn hình 15.6 inch FHD. Thiết kế mỏng nhẹ, pin bền.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/325500/lenovo-ideapad-slim-3-15amn8-r5-82xq00j0vn-thumb-638754862828598408-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/325500/lenovo-ideapad-slim-3-15amn8-r5-82xq00j0vn-thumb-638754862828598408-600x600.jpg'],
        variants: [{ name: 'R5 8GB 512GB', color: 'Xám', colorCode: '#6b7280', storage: '512GB', price: 11490000, originalPrice: 12990000, stock: 70, sku: 'LNV-S3-15AMN8-512' }],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '15.6 inch FHD IPS' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'AMD Ryzen 5 7520U' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB LPDDR5' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD NVMe' }] }
        ],
        isFeatured: true, averageRating: 4.5, totalReviews: 134, totalSold: 312, views: 980
      },
      {
        name: 'Lenovo IdeaPad Slim 3 16IRH10 i5', slug: 'lenovo-ideapad-slim-3-16irh10-i5-83k2', brand: 'Lenovo',
        category: categoryMap['laptop'],
        shortDescription: 'Lenovo IdeaPad Slim 3 16 inch - Intel Core i5',
        description: 'Lenovo IdeaPad Slim 3 16IRH10 với Intel Core i5-13420H, RAM 8GB, SSD 512GB, màn hình 16 inch FHD+ IPS. Hiệu suất mạnh mẽ cho học tập và làm việc.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/334450/lenovo-ideapad-slim-3-16irh10-i5-83k20003vn-638775477302248017-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/334450/lenovo-ideapad-slim-3-16irh10-i5-83k20003vn-638775477302248017-600x600.jpg'],
        variants: [{ name: 'i5 8GB 512GB', color: 'Xám', colorCode: '#6b7280', storage: '512GB', price: 14990000, originalPrice: 16490000, stock: 55, sku: 'LNV-S3-16IRH10-I5' }],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '16 inch FHD+ IPS' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'Intel Core i5-13420H' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB DDR5' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD NVMe' }] }
        ],
        isFeatured: false, averageRating: 4.6, totalReviews: 89, totalSold: 201, views: 720
      },
      {
        name: 'ASUS VivoBook Go 15 E1504FA R5', slug: 'asus-vivobook-go-15-e1504fa-r5', brand: 'ASUS',
        category: categoryMap['laptop'],
        shortDescription: 'ASUS VivoBook Go 15 - AMD Ryzen 5 giá tốt',
        description: 'ASUS VivoBook Go 15 E1504FA với AMD Ryzen 5 7520U, RAM 8GB, SSD 512GB, màn hình 15.6 inch FHD. Laptop học sinh, sinh viên lý tưởng.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/311178/asus-vivobook-go-15-e1504fa-r5-nj776w-140225-100949-251-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/311178/asus-vivobook-go-15-e1504fa-r5-nj776w-140225-100949-251-600x600.jpg'],
        variants: [{ name: 'R5 8GB 512GB', color: 'Bạc', colorCode: '#c0c0c0', storage: '512GB', price: 12990000, originalPrice: 13990000, stock: 80, sku: 'ASUS-VBG15-R5' }],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '15.6 inch FHD' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'AMD Ryzen 5 7520U' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB LPDDR5' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 11990000, flashSaleEnd: new Date(Date.now() + 86400000 * 3), flashSaleStock: 30,
        averageRating: 4.4, totalReviews: 201, totalSold: 445, views: 1340
      },
      {
        name: 'HP 15-fd0234TU i5', slug: 'hp-15-fd0234tu-i5', brand: 'HP',
        category: categoryMap['laptop'],
        shortDescription: 'HP 15 - Intel Core i5 hiệu suất ổn định',
        description: 'HP 15-fd0234TU với Intel Core i5-1334U, RAM 8GB, SSD 512GB, màn hình 15.6 inch FHD. Thiết kế bền bỉ, phù hợp văn phòng.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/323920/hp-15-fd0234tu-i5-9q969pa-170225-105831-192-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/323920/hp-15-fd0234tu-i5-9q969pa-170225-105831-192-600x600.jpg'],
        variants: [{ name: 'i5 8GB 512GB', color: 'Bạc', colorCode: '#c0c0c0', storage: '512GB', price: 13490000, originalPrice: 14990000, stock: 60, sku: 'HP15-FD0234-I5' }],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '15.6 inch FHD' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'Intel Core i5-1334U' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB DDR4' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD' }] }
        ],
        isFeatured: false, averageRating: 4.5, totalReviews: 76, totalSold: 178, views: 590
      },
      {
        name: 'Dell Inspiron 15 3520 i5', slug: 'dell-inspiron-15-3520-i5', brand: 'Dell',
        category: categoryMap['laptop'],
        shortDescription: 'Dell Inspiron 15 3520 - Bền bỉ, hiệu quả',
        description: 'Dell Inspiron 15 3520 với Intel Core i5-1235U, RAM 8GB, SSD 512GB, màn hình 15.6 inch FHD. Laptop văn phòng đáng tin cậy từ Dell.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/321192/dell-inspiron-15-3520-i5-25p231-thumb-638754902669914908-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/321192/dell-inspiron-15-3520-i5-25p231-thumb-638754902669914908-600x600.jpg'],
        variants: [{ name: 'i5 8GB 512GB', color: 'Bạc', colorCode: '#c0c0c0', storage: '512GB', price: 14990000, originalPrice: 16990000, stock: 50, sku: 'DELL-3520-I5' }],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '15.6 inch FHD' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'Intel Core i5-1235U' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB DDR4' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD' }] }
        ],
        isFeatured: false, averageRating: 4.5, totalReviews: 112, totalSold: 267, views: 810
      },
      {
        name: 'Lenovo IdeaPad Slim 3 15IRH10 i7', slug: 'lenovo-ideapad-slim-3-15irh10-i7', brand: 'Lenovo',
        category: categoryMap['laptop'],
        shortDescription: 'Lenovo IdeaPad Slim 3 - Intel Core i7 mạnh mẽ',
        description: 'Lenovo IdeaPad Slim 3 15IRH10 i7 với Intel Core i7-13620H, RAM 16GB, SSD 512GB, màn hình 15.6 inch FHD IPS. Hiệu suất vượt trội cho mọi tác vụ.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/334446/lenovo-ideapad-slim-3-15irh10-i7-83k1000fvn-638775476922755568-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/334446/lenovo-ideapad-slim-3-15irh10-i7-83k1000fvn-638775476922755568-600x600.jpg'],
        variants: [{ name: 'i7 16GB 512GB', color: 'Xám', colorCode: '#6b7280', storage: '512GB', price: 17990000, originalPrice: 19990000, stock: 40, sku: 'LNV-S3-15IRH10-I7' }],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '15.6 inch FHD IPS' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'Intel Core i7-13620H' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '16GB DDR5' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD NVMe' }] }
        ],
        isFeatured: true, averageRating: 4.7, totalReviews: 67, totalSold: 145, views: 560
      },
      {
        name: 'Lenovo IdeaPad Slim 3 OLED 14IRH10 i5', slug: 'lenovo-ideapad-slim-3-oled-14irh10-i5', brand: 'Lenovo',
        category: categoryMap['laptop'],
        shortDescription: 'Lenovo IdeaPad Slim 3 OLED - Màn hình OLED rực rỡ',
        description: 'Lenovo IdeaPad Slim 3 OLED 14IRH10 với Intel Core i5-13420H, màn hình 14 inch 2.8K OLED 90Hz, RAM 16GB, SSD 512GB. Màu sắc chân thực.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/337233/lenovo-ideapad-slim-3-oled-14irh10-i5-83k0000cvn-thumb-638828193578993263-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/337233/lenovo-ideapad-slim-3-oled-14irh10-i5-83k0000cvn-thumb-638828193578993263-600x600.jpg'],
        variants: [{ name: 'i5 16GB 512GB OLED', color: 'Xanh Xám', colorCode: '#4a6fa5', storage: '512GB', price: 18490000, originalPrice: 19990000, stock: 35, sku: 'LNV-S3-OLED-14-I5' }],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '14 inch 2.8K OLED 90Hz' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'Intel Core i5-13420H' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '16GB DDR5' }] },
          { group: 'Ổ cứng', items: [{ label: 'Dung lượng', value: '512GB SSD NVMe' }] }
        ],
        isFeatured: true, averageRating: 4.8, totalReviews: 45, totalSold: 98, views: 430
      },
      {
        name: 'Acer Nitro V 15 ANV15-41 R5', slug: 'acer-nitro-v-15-anv15-41-r5', brand: 'Acer',
        category: categoryMap['laptop'],
        shortDescription: 'Acer Nitro V 15 - Laptop gaming AMD Ryzen 5',
        description: 'Acer Nitro V 15 ANV15-41 với AMD Ryzen 5 7535HS, RAM 16GB, SSD 512GB, GPU RTX 2050, màn hình 15.6 inch FHD 144Hz. Gaming mượt mà trong tầm giá.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/333430/acer-nitro-v-15-anv15-41-r2up-r5-nhqpgsv004-638774737367845195-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/333430/acer-nitro-v-15-anv15-41-r2up-r5-nhqpgsv004-638774737367845195-600x600.jpg'],
        variants: [{ name: 'R5 16GB 512GB RTX2050', color: 'Đen', colorCode: '#1c1c1e', storage: '512GB', price: 18990000, originalPrice: 22990000, stock: 45, sku: 'ACER-NV15-R5' }],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '15.6 inch FHD IPS 144Hz' }] },
          { group: 'CPU', items: [{ label: 'Chip', value: 'AMD Ryzen 5 7535HS' }] },
          { group: 'GPU', items: [{ label: 'Card đồ hoạ', value: 'NVIDIA RTX 2050 4GB' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '16GB DDR5' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 17490000, flashSaleEnd: new Date(Date.now() + 86400000 * 2), flashSaleStock: 20,
        averageRating: 4.7, totalReviews: 156, totalSold: 321, views: 1120
      },

      // ===== ĐIỆN THOẠI MỚI =====
      {
        name: 'Samsung Galaxy S26 Ultra 12GB 256GB', slug: 'samsung-galaxy-s26-ultra', brand: 'Samsung',
        category: categoryMap['dien-thoai'],
        shortDescription: 'Samsung Galaxy S26 Ultra - Siêu phẩm 2026',
        description: 'Samsung Galaxy S26 Ultra với chip Snapdragon 8 Elite Gen 2, camera 200MP, màn hình Dynamic AMOLED 6.9 inch. Kèm bút S Pen.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/361951/samsung-galaxy-s26-ultra-12gb-256gb-den-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/42/361951/samsung-galaxy-s26-ultra-12gb-256gb-den-thumb-600x600.jpg'],
        variants: [
          { name: '12GB 256GB - Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '256GB', price: 31990000, originalPrice: 33990000, stock: 30, sku: 'SS-S26U-256-BLK' },
          { name: '12GB 512GB - Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '512GB', price: 35990000, originalPrice: 37990000, stock: 20, sku: 'SS-S26U-512-BLK' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '6.9 inch Dynamic AMOLED 2X' }] },
          { group: 'Camera', items: [{ label: 'Camera sau', value: '200MP + 50MP + 10MP + 50MP' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Snapdragon 8 Elite Gen 2' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '5000mAh' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 29990000, flashSaleEnd: new Date(Date.now() + 86400000 * 4), flashSaleStock: 15,
        averageRating: 4.9, totalReviews: 78, totalSold: 156, views: 2100
      },
      {
        name: 'OPPO Reno15F 5G 12GB 256GB', slug: 'oppo-reno15f-5g', brand: 'OPPO',
        category: categoryMap['dien-thoai'],
        shortDescription: 'OPPO Reno15F - Camera AI thế hệ mới',
        description: 'OPPO Reno15F 5G với Dimensity 7300 Energy, camera 50MP AI, màn hình 6.7 inch AMOLED 120Hz. Pin 5000mAh sạc nhanh 45W.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/360239/oppo-reno15f-5g-12gb-256gb-hong-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/42/360239/oppo-reno15f-5g-12gb-256gb-hong-thumb-600x600.jpg'],
        variants: [
          { name: '12GB 256GB - Hồng', color: 'Hồng', colorCode: '#ff69b4', storage: '256GB', price: 7990000, originalPrice: 9490000, stock: 60, sku: 'OPPO-R15F-256-PNK' },
          { name: '12GB 256GB - Xanh', color: 'Xanh', colorCode: '#4a90e2', storage: '256GB', price: 7990000, originalPrice: 9490000, stock: 50, sku: 'OPPO-R15F-256-BLU' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '6.7 inch AMOLED 120Hz' }] },
          { group: 'Camera', items: [{ label: 'Camera sau', value: '50MP + 8MP + 2MP' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'MediaTek Dimensity 7300 Energy' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '5000mAh 45W' }] }
        ],
        isFeatured: true, averageRating: 4.5, totalReviews: 134, totalSold: 289, views: 890
      },
      {
        name: 'Xiaomi Redmi Note 15 5G 8GB 256GB', slug: 'xiaomi-redmi-note-15-5g', brand: 'Xiaomi',
        category: categoryMap['dien-thoai'],
        shortDescription: 'Redmi Note 15 5G - Hiệu năng cao, giá sinh viên',
        description: 'Xiaomi Redmi Note 15 5G với Snapdragon 4s Gen 2, camera 108MP, màn hình 6.77 inch FHD+ 120Hz. Pin 5030mAh sạc nhanh 33W.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/360310/xiaomi-redmi-note-15-5g-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/42/360310/xiaomi-redmi-note-15-5g-thumb-600x600.jpg'],
        variants: [
          { name: '8GB 256GB - Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '256GB', price: 5990000, originalPrice: 7490000, stock: 80, sku: 'XM-RN15-256-BLK' },
          { name: '8GB 256GB - Xanh', color: 'Xanh', colorCode: '#4a90e2', storage: '256GB', price: 5990000, originalPrice: 7490000, stock: 70, sku: 'XM-RN15-256-BLU' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '6.77 inch FHD+ 120Hz' }] },
          { group: 'Camera', items: [{ label: 'Camera sau', value: '108MP + 2MP + 2MP' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Snapdragon 4s Gen 2' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '5030mAh 33W' }] }
        ],
        isFeatured: false, averageRating: 4.4, totalReviews: 312, totalSold: 678, views: 2340
      },
      {
        name: 'Realme 16 Pro 5G 12GB 256GB', slug: 'realme-16-pro-5g', brand: 'Realme',
        category: categoryMap['dien-thoai'],
        shortDescription: 'Realme 16 Pro 5G - Camera periscope chụp xa',
        description: 'Realme 16 Pro 5G với Snapdragon 7s Gen 3, camera periscope zoom 3x, màn hình 6.77 inch AMOLED 120Hz. Sạc nhanh SUPERVOOC 80W.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/361707/realme-16-pro-5g-12gb-256gb-tim-thumb-1-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/42/361707/realme-16-pro-5g-12gb-256gb-tim-thumb-1-600x600.jpg'],
        variants: [
          { name: '12GB 256GB - Tím', color: 'Tím', colorCode: '#8b5cf6', storage: '256GB', price: 9490000, originalPrice: 10990000, stock: 55, sku: 'RM-16PRO-256-PRP' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '6.77 inch AMOLED 120Hz' }] },
          { group: 'Camera', items: [{ label: 'Camera sau', value: '50MP + 50MP periscope + 8MP' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Snapdragon 7s Gen 3' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '5200mAh 80W' }] }
        ],
        isFeatured: false, averageRating: 4.5, totalReviews: 89, totalSold: 198, views: 670
      },
      {
        name: 'Honor X8D 8GB 128GB', slug: 'honor-x8d-8gb-128gb', brand: 'Honor',
        category: categoryMap['dien-thoai'],
        shortDescription: 'Honor X8D - Giá rẻ, pin trâu',
        description: 'Honor X8D với Snapdragon 6 Gen 1, camera 108MP, màn hình 6.8 inch FHD+ 90Hz. Pin 6000mAh, giá siêu tốt cho phân khúc phổ thông.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/42/362919/honor-x8d-8gb-128gb-xanh-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/42/362919/honor-x8d-8gb-128gb-xanh-thumb-600x600.jpg'],
        variants: [
          { name: '8GB 128GB - Xanh', color: 'Xanh', colorCode: '#06b6d4', storage: '128GB', price: 4490000, originalPrice: 5490000, stock: 90, sku: 'HNR-X8D-128-BLU' },
          { name: '8GB 256GB - Xanh', color: 'Xanh', colorCode: '#06b6d4', storage: '256GB', price: 5490000, originalPrice: 6490000, stock: 70, sku: 'HNR-X8D-256-BLU' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '6.8 inch FHD+ 90Hz' }] },
          { group: 'Camera', items: [{ label: 'Camera sau', value: '108MP + 5MP + 2MP' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Snapdragon 6 Gen 1' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '6000mAh' }] }
        ],
        isFeatured: false, averageRating: 4.3, totalReviews: 178, totalSold: 389, views: 1100
      },

      // ===== PHỤ KIỆN MỚI =====
      {
        name: 'Pin sạc dự phòng XMobile Snapgo R38 10000mAh', slug: 'pin-sac-xmobile-snapgo-r38', brand: 'XMobile',
        category: categoryMap['phu-kien'],
        shortDescription: 'Pin sạc XMobile Snapgo - Sạc nhanh 22.5W',
        description: 'Pin sạc dự phòng XMobile Snapgo R38 dung lượng 10000mAh, hỗ trợ PD 22.5W, 2 cổng USB-A + 1 USB-C. Thiết kế nhỏ gọn, nhẹ.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/57/337129/pin-sac-du-phong-10000mah-type-c-pd-22-5w-xmobile-snapgo-r-38-thumb-1-638813647827007985-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/57/337129/pin-sac-du-phong-10000mah-type-c-pd-22-5w-xmobile-snapgo-r-38-thumb-1-638813647827007985-600x600.jpg'],
        variants: [{ name: 'Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '', price: 299000, originalPrice: 399000, stock: 150, sku: 'XMB-SNAPGO-R38' }],
        specifications: [
          { group: 'Thông số', items: [{ label: 'Dung lượng', value: '10000mAh' }, { label: 'Sạc nhanh', value: 'PD 22.5W' }] }
        ],
        isFeatured: false, averageRating: 4.4, totalReviews: 89, totalSold: 234, views: 560
      },
      {
        name: 'Balo laptop 16 inch Arctic Hunter GB00433', slug: 'balo-laptop-arctic-hunter-gb00433', brand: 'Arctic Hunter',
        category: categoryMap['phu-kien'],
        shortDescription: 'Balo laptop Arctic Hunter - Chống sốc, chống nước',
        description: 'Balo laptop 16 inch Arctic Hunter GB00433 với chất liệu chống nước, ngăn laptop có đệm chống sốc, cổng USB sạc ngoài. Dung tích 25L.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7923/339544/balo-laptop-16-inch-arctic-hunter-gb00433-040725-031543-493-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7923/339544/balo-laptop-16-inch-arctic-hunter-gb00433-040725-031543-493-600x600.jpg'],
        variants: [{ name: 'Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '', price: 449000, originalPrice: 549000, stock: 120, sku: 'AH-GB00433-BLK' }],
        specifications: [
          { group: 'Thông số', items: [{ label: 'Kích thước laptop tối đa', value: '16 inch' }, { label: 'Dung tích', value: '25 lít' }] }
        ],
        isFeatured: false, averageRating: 4.5, totalReviews: 134, totalSold: 312, views: 780
      },
      {
        name: 'Tai nghe Bluetooth AVA Buds Life Air 3', slug: 'tai-nghe-ava-buds-life-air-3', brand: 'AVA',
        category: categoryMap['phu-kien'],
        shortDescription: 'AVA Buds Life Air 3 - Tai nghe True Wireless',
        description: 'AVA Buds Life Air 3 True Wireless với chống ồn ANC, pin 30 giờ tổng, kết nối Bluetooth 5.3. Âm thanh Hi-Fi chất lượng cao.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/54/325122/tai-nghe-bluetooth-true-wireless-ava-buds-life-air-3-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/54/325122/tai-nghe-bluetooth-true-wireless-ava-buds-life-air-3-600x600.jpg'],
        variants: [{ name: 'Trắng', color: 'Trắng', colorCode: '#ffffff', storage: '', price: 590000, originalPrice: 790000, stock: 100, sku: 'AVA-BAIR3-WHT' }],
        specifications: [
          { group: 'Kết nối', items: [{ label: 'Bluetooth', value: '5.3' }] },
          { group: 'Pin', items: [{ label: 'Tổng thời lượng', value: '30 giờ' }] },
          { group: 'Tính năng', items: [{ label: 'Chống ồn', value: 'ANC' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 490000, flashSaleEnd: new Date(Date.now() + 86400000 * 2), flashSaleStock: 50,
        averageRating: 4.4, totalReviews: 201, totalSold: 456, views: 1230
      },
      {
        name: 'Pin sạc dự phòng XMobile MH806 10000mAh', slug: 'pin-sac-xmobile-mh806', brand: 'XMobile',
        category: categoryMap['phu-kien'],
        shortDescription: 'Pin sạc XMobile MH806 - QC 3.0 & PD 22.5W',
        description: 'Pin sạc dự phòng XMobile MH806 10000mAh với QC 3.0 và PD 22.5W, 3 cổng sạc. Thiết kế siêu mỏng, dễ mang theo.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/57/337130/pin-sac-du-phong-10000mah-type-c-pd-qc-3-0-22-5w-xmobile-mh806-thumb-638813644238040085-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/57/337130/pin-sac-du-phong-10000mah-type-c-pd-qc-3-0-22-5w-xmobile-mh806-thumb-638813644238040085-600x600.jpg'],
        variants: [{ name: 'Trắng', color: 'Trắng', colorCode: '#ffffff', storage: '', price: 249000, originalPrice: 349000, stock: 200, sku: 'XMB-MH806-WHT' }],
        specifications: [
          { group: 'Thông số', items: [{ label: 'Dung lượng', value: '10000mAh' }, { label: 'Sạc nhanh', value: 'QC 3.0 & PD 22.5W' }] }
        ],
        isFeatured: false, averageRating: 4.3, totalReviews: 67, totalSold: 189, views: 450
      },
      {
        name: 'Router WiFi 7 ASUS RT-BE50', slug: 'router-wifi-7-asus-rt-be50', brand: 'ASUS',
        category: categoryMap['phu-kien'],
        shortDescription: 'ASUS RT-BE50 - Router WiFi 7 băng tần kép',
        description: 'Router WiFi 7 ASUS RT-BE50 băng tần kép BE3600, tốc độ 2.4GHz + 5GHz, 4 anten, MU-MIMO. Phủ sóng rộng cho ngôi nhà thông minh.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/4727/358473/router-wifi-chuan-wifi-7-asus-rt-be50-thumb-638980442857185481-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/4727/358473/router-wifi-chuan-wifi-7-asus-rt-be50-thumb-638980442857185481-600x600.jpg'],
        variants: [{ name: 'Trắng', color: 'Trắng', colorCode: '#ffffff', storage: '', price: 2890000, originalPrice: 3490000, stock: 60, sku: 'ASUS-RTBE50-WHT' }],
        specifications: [
          { group: 'Chuẩn WiFi', items: [{ label: 'Chuẩn', value: 'WiFi 7 (802.11be)' }, { label: 'Tốc độ', value: 'BE3600' }] }
        ],
        isFeatured: false, averageRating: 4.6, totalReviews: 45, totalSold: 98, views: 340
      },
      {
        name: 'Camera IP 360 độ 3MP EZVIZ TY1', slug: 'camera-ip-ezviz-ty1', brand: 'EZVIZ',
        category: categoryMap['phu-kien'],
        shortDescription: 'Camera EZVIZ TY1 - Góc nhìn 360 độ, AI thông minh',
        description: 'Camera IP EZVIZ TY1 360 độ 3MP, AI nhận diện người và chuyển động, tích hợp đèn LED trắng và hồng ngoại. Lưu trữ cloud và thẻ nhớ.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/4728/329241/camera-ip-360-do-3mp-ezviz-ty1-thumb-1-638665876017214332-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/4728/329241/camera-ip-360-do-3mp-ezviz-ty1-thumb-1-638665876017214332-600x600.jpg'],
        variants: [{ name: 'Trắng', color: 'Trắng', colorCode: '#ffffff', storage: '', price: 549000, originalPrice: 649000, stock: 100, sku: 'EZVIZ-TY1-WHT' }],
        specifications: [
          { group: 'Camera', items: [{ label: 'Độ phân giải', value: '3MP (2304×1296)' }, { label: 'Góc nhìn', value: '360 độ' }] }
        ],
        isFeatured: false, averageRating: 4.5, totalReviews: 89, totalSold: 201, views: 560
      },
      {
        name: 'Tai nghe Bluetooth Sony WH-CH520', slug: 'tai-nghe-sony-wh-ch520', brand: 'Sony',
        category: categoryMap['phu-kien'],
        shortDescription: 'Sony WH-CH520 - Tai nghe chụp tai không dây',
        description: 'Tai nghe Sony WH-CH520 chụp tai Bluetooth 5.2, pin 50 giờ, sạc nhanh USB-C, kết nối Multipoint 2 thiết bị cùng lúc. Âm thanh LDAC chất lượng cao.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/313694/tai-nghe-bluetooth-chup-tai-sony-wh-ch520-210425-043507-151-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/313694/tai-nghe-bluetooth-chup-tai-sony-wh-ch520-210425-043507-151-600x600.jpg'],
        variants: [
          { name: 'Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '', price: 990000, originalPrice: 1190000, stock: 80, sku: 'SONY-WHCH520-BLK' },
          { name: 'Trắng', color: 'Trắng', colorCode: '#ffffff', storage: '', price: 990000, originalPrice: 1190000, stock: 80, sku: 'SONY-WHCH520-WHT' }
        ],
        specifications: [
          { group: 'Kết nối', items: [{ label: 'Bluetooth', value: '5.2' }] },
          { group: 'Pin', items: [{ label: 'Thời lượng', value: '50 giờ' }] }
        ],
        isFeatured: true, averageRating: 4.6, totalReviews: 312, totalSold: 678, views: 2100
      },
      {
        name: 'Adapter sạc Apple 20W USB-C MHJE3', slug: 'adapter-apple-20w-usb-c', brand: 'Apple',
        category: categoryMap['phu-kien'],
        shortDescription: 'Apple 20W USB-C - Sạc nhanh chính hãng',
        description: 'Adapter sạc Apple 20W USB-C MHJE3 chính hãng, hỗ trợ sạc nhanh Power Delivery cho iPhone, iPad. Nhỏ gọn, bảo vệ pin.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/9499/230315/adapter-sac-type-c-20w-cho-iphone-ipad-apple-mhje3-avatar-1-1-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/9499/230315/adapter-sac-type-c-20w-cho-iphone-ipad-apple-mhje3-avatar-1-1-600x600.jpg'],
        variants: [{ name: 'Trắng', color: 'Trắng', colorCode: '#ffffff', storage: '', price: 590000, originalPrice: 690000, stock: 200, sku: 'APL-20W-MHJE3' }],
        specifications: [
          { group: 'Thông số', items: [{ label: 'Công suất', value: '20W' }, { label: 'Cổng kết nối', value: 'USB-C' }] }
        ],
        isFeatured: false, averageRating: 4.7, totalReviews: 456, totalSold: 1234, views: 3400
      },
      {
        name: 'Ốp lưng MagSafe iPhone 15 Pro Silicone Apple MT1E3', slug: 'op-lung-magsafe-iphone-15-pro', brand: 'Apple',
        category: categoryMap['phu-kien'],
        shortDescription: 'Ốp lưng Apple Silicone MagSafe - Chính hãng',
        description: 'Ốp lưng Silicone MagSafe Apple MT1E3 cho iPhone 15 Pro, chất liệu silicone cao cấp, tích hợp từ tính MagSafe. Màu sắc đa dạng.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/60/315050/op-lung-magsafe-iphone-15-pro-silicone-apple-mt1e3-thumbnew-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/60/315050/op-lung-magsafe-iphone-15-pro-silicone-apple-mt1e3-thumbnew-600x600.jpg'],
        variants: [{ name: 'Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '', price: 1290000, originalPrice: 1490000, stock: 100, sku: 'APL-SILICONE-IP15PRO' }],
        specifications: [
          { group: 'Tương thích', items: [{ label: 'Máy', value: 'iPhone 15 Pro' }] },
          { group: 'Tính năng', items: [{ label: 'MagSafe', value: 'Có' }] }
        ],
        isFeatured: false, averageRating: 4.8, totalReviews: 234, totalSold: 567, views: 1560
      },
      {
        name: 'Loa Bluetooth Party Alpha Works Sonik 120', slug: 'loa-bluetooth-alpha-works-sonik-120', brand: 'Alpha Works',
        category: categoryMap['phu-kien'],
        shortDescription: 'Loa Alpha Works Sonik 120 - Âm bass mạnh',
        description: 'Loa Bluetooth Alpha Works Sonik 120 với công suất 60W, IP67 chống nước, pin 20 giờ, đèn LED RGB. Kết nối True Wireless 2 loa cùng lúc.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/2162/338428/loa-bluetooth-party-alpha-works-sonik-120-230525-110824-497-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/2162/338428/loa-bluetooth-party-alpha-works-sonik-120-230525-110824-497-600x600.jpg'],
        variants: [{ name: 'Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '', price: 1190000, originalPrice: 1490000, stock: 70, sku: 'AW-SONIK120-BLK' }],
        specifications: [
          { group: 'Âm thanh', items: [{ label: 'Công suất', value: '60W' }] },
          { group: 'Chống nước', items: [{ label: 'Chuẩn', value: 'IP67' }] },
          { group: 'Pin', items: [{ label: 'Thời lượng', value: '20 giờ' }] }
        ],
        isFeatured: false, averageRating: 4.5, totalReviews: 78, totalSold: 167, views: 490
      },
      {
        name: 'Loa Bluetooth JBL Flip 7', slug: 'loa-bluetooth-jbl-flip-7', brand: 'JBL',
        category: categoryMap['phu-kien'],
        shortDescription: 'JBL Flip 7 - Loa không dây chống nước IP67',
        description: 'Loa Bluetooth JBL Flip 7 với công suất 30W, IP67 chống nước và bụi, pin 12 giờ, kết nối Bluetooth 5.3. Âm thanh JBL Pro Sound.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/2162/337463/loa-bluetooth-jbl-flip-7-160525-022117-037-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/2162/337463/loa-bluetooth-jbl-flip-7-160525-022117-037-600x600.jpg'],
        variants: [
          { name: 'Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '', price: 3490000, originalPrice: 3990000, stock: 60, sku: 'JBL-FLIP7-BLK' },
          { name: 'Đỏ', color: 'Đỏ', colorCode: '#ef4444', storage: '', price: 3490000, originalPrice: 3990000, stock: 50, sku: 'JBL-FLIP7-RED' }
        ],
        specifications: [
          { group: 'Âm thanh', items: [{ label: 'Công suất', value: '30W' }] },
          { group: 'Chống nước', items: [{ label: 'Chuẩn', value: 'IP67' }] },
          { group: 'Pin', items: [{ label: 'Thời lượng', value: '12 giờ' }] }
        ],
        isFeatured: true, averageRating: 4.7, totalReviews: 289, totalSold: 612, views: 1890
      },

      // ===== ĐỒNG HỒ =====
      {
        name: 'Casio LW-204-4ADF Nữ', slug: 'casio-lw-204-4adf-nu', brand: 'Casio',
        category: categoryMap['dong-ho'],
        shortDescription: 'Casio LW-204 - Đồng hồ nữ thể thao',
        description: 'Đồng hồ Casio LW-204-4ADF dành cho nữ, chống nước 100m, đèn LED, hiển thị giờ kép, báo thức. Thiết kế thể thao năng động.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/7264/313969/casio-lw-204-4adf-nu-thumb-fix-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/7264/313969/casio-lw-204-4adf-nu-thumb-fix-600x600.jpg'],
        variants: [{ name: 'Hồng', color: 'Hồng', colorCode: '#ff69b4', storage: '', price: 490000, originalPrice: 590000, stock: 100, sku: 'CASIO-LW204-PNK' }],
        specifications: [
          { group: 'Chống nước', items: [{ label: 'Chuẩn', value: '100m' }] },
          { group: 'Tính năng', items: [{ label: 'Đặc biệt', value: 'Đèn LED, Báo thức, Giờ kép' }] }
        ],
        isFeatured: false, averageRating: 4.5, totalReviews: 234, totalSold: 567, views: 1450
      },
      {
        name: 'Đồng hồ Fossil Nam', slug: 'dong-ho-fossil-nam', brand: 'Fossil',
        category: categoryMap['dong-ho'],
        shortDescription: 'Fossil - Đồng hồ cơ nam phong cách',
        description: 'Đồng hồ Fossil nam thiết kế cổ điển hiện đại, mặt số 42mm, dây da cao cấp, kính chịu lực. Phù hợp đi làm và các buổi tiệc.',
        thumbnail: 'https://cdn.tgdd.vn/2024/09/timerseo/278445.jpg',
        images: ['https://cdn.tgdd.vn/2024/09/timerseo/278445.jpg'],
        variants: [{ name: 'Dây Da Nâu', color: 'Nâu', colorCode: '#8B4513', storage: '', price: 3490000, originalPrice: 4290000, stock: 40, sku: 'FOSSIL-NAM-BRN' }],
        specifications: [
          { group: 'Thiết kế', items: [{ label: 'Đường kính mặt', value: '42mm' }, { label: 'Dây đeo', value: 'Da bò thật' }] }
        ],
        isFeatured: false, averageRating: 4.6, totalReviews: 89, totalSold: 178, views: 670
      },
      {
        name: 'MVW MSA103-02 Nam', slug: 'mvw-msa103-02-nam', brand: 'MVW',
        category: categoryMap['dong-ho'],
        shortDescription: 'MVW MSA103 - Đồng hồ nam lịch lãm',
        description: 'Đồng hồ MVW MSA103-02 nam với máy Nhật Miyota, kính Sapphire chống xước, chống nước 50m. Thiết kế lịch lãm, phù hợp mọi phong cách.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332318/mvw-msa103-02-nam-thumb-638711663036543197-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332318/mvw-msa103-02-nam-thumb-638711663036543197-600x600.jpg'],
        variants: [{ name: 'Dây Thép', color: 'Bạc', colorCode: '#c0c0c0', storage: '', price: 890000, originalPrice: 990000, stock: 60, sku: 'MVW-MSA103-SLV' }],
        specifications: [
          { group: 'Máy', items: [{ label: 'Bộ máy', value: 'Nhật Miyota' }] },
          { group: 'Kính', items: [{ label: 'Chất liệu', value: 'Sapphire chống xước' }] }
        ],
        isFeatured: false, averageRating: 4.4, totalReviews: 112, totalSold: 245, views: 780
      },
      {
        name: 'Casio B650WD-1ADF Nam', slug: 'casio-b650wd-1adf-nam', brand: 'Casio',
        category: categoryMap['dong-ho'],
        shortDescription: 'Casio B650WD - Đồng hồ điện tử retro',
        description: 'Casio B650WD-1ADF với thiết kế retro vintage, màn hình điện tử, chống nước 50m, đèn LED. Hơi thở vintage trong vỏ bọc hiện đại.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/7264/199519/casio-b650wd-1adf-bac-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/7264/199519/casio-b650wd-1adf-bac-thumb-600x600.jpg'],
        variants: [{ name: 'Bạc', color: 'Bạc', colorCode: '#c0c0c0', storage: '', price: 1290000, originalPrice: 1490000, stock: 80, sku: 'CASIO-B650WD-SLV' }],
        specifications: [
          { group: 'Chống nước', items: [{ label: 'Chuẩn', value: '50m' }] },
          { group: 'Màn hình', items: [{ label: 'Loại', value: 'Điện tử LCD' }] }
        ],
        isFeatured: false, averageRating: 4.6, totalReviews: 178, totalSold: 389, views: 1120
      },
      {
        name: 'Elio ES191-01 Nữ', slug: 'elio-es191-01-nu', brand: 'Elio',
        category: categoryMap['dong-ho'],
        shortDescription: 'Elio ES191 - Đồng hồ nữ thanh lịch',
        description: 'Đồng hồ Elio ES191-01 nữ thiết kế thanh lịch, mặt số tròn 30mm, dây thép không gỉ, kính khoáng chống xước. Phù hợp làm quà tặng.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332291/elio-es191-01-nu-thumb-638684015664020045-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/332291/elio-es191-01-nu-thumb-638684015664020045-600x600.jpg'],
        variants: [{ name: 'Dây Thép Bạc', color: 'Bạc', colorCode: '#c0c0c0', storage: '', price: 590000, originalPrice: 690000, stock: 90, sku: 'ELIO-ES191-SLV' }],
        specifications: [
          { group: 'Thiết kế', items: [{ label: 'Đường kính mặt', value: '30mm' }, { label: 'Dây đeo', value: 'Thép không gỉ' }] }
        ],
        isFeatured: false, averageRating: 4.3, totalReviews: 89, totalSold: 201, views: 590
      },
      {
        name: 'Casio MTP-1381L-7AVDF Nam', slug: 'casio-mtp-1381l-7avdf-nam', brand: 'Casio',
        category: categoryMap['dong-ho'],
        shortDescription: 'Casio MTP-1381L - Đồng hồ nam 3 kim cổ điển',
        description: 'Casio MTP-1381L-7AVDF nam 3 kim lịch ngày, chống nước 50m, kính khoáng. Thiết kế cổ điển sang trọng, bền bỉ theo thời gian.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/7264/209027/casio-mtp-1381l-7avdf-nam-avatar-1-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/7264/209027/casio-mtp-1381l-7avdf-nam-avatar-1-600x600.jpg'],
        variants: [{ name: 'Dây Da Trắng', color: 'Trắng', colorCode: '#f5f5f5', storage: '', price: 1490000, originalPrice: 1890000, stock: 70, sku: 'CASIO-MTP1381-WHT' }],
        specifications: [
          { group: 'Chống nước', items: [{ label: 'Chuẩn', value: '50m' }] },
          { group: 'Tính năng', items: [{ label: 'Lịch', value: 'Ngày' }] }
        ],
        isFeatured: false, averageRating: 4.5, totalReviews: 134, totalSold: 289, views: 870
      },
      {
        name: 'Orient RA-AG0003S30B Nam', slug: 'orient-ra-ag0003s30b-nam', brand: 'Orient',
        category: categoryMap['dong-ho'],
        shortDescription: 'Orient RA-AG0003S - Đồng hồ tự động cao cấp',
        description: 'Orient RA-AG0003S30B nam đồng hồ cơ tự động, lộ máy, chống nước 100m. Thiết kế thể thao mạnh mẽ, máy cơ Orient in-house.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/360569/orient-ra-ag0003s30b-nam-thumb-639020178370683475-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/360569/orient-ra-ag0003s30b-nam-thumb-639020178370683475-600x600.jpg'],
        variants: [{ name: 'Dây Thép', color: 'Bạc', colorCode: '#c0c0c0', storage: '', price: 6490000, originalPrice: 7990000, stock: 30, sku: 'ORIENT-RAAG0003-SLV' }],
        specifications: [
          { group: 'Máy', items: [{ label: 'Loại', value: 'Cơ tự động (Automatic)' }, { label: 'Bộ máy', value: 'Orient in-house' }] },
          { group: 'Chống nước', items: [{ label: 'Chuẩn', value: '100m' }] }
        ],
        isFeatured: true, averageRating: 4.8, totalReviews: 45, totalSold: 89, views: 340
      },
      {
        name: 'Citizen BI5006-81P Nam Vàng', slug: 'citizen-bi5006-81p-vang', brand: 'Citizen',
        category: categoryMap['dong-ho'],
        shortDescription: 'Citizen BI5006-81P - Đồng hồ nam mạ vàng',
        description: 'Citizen BI5006-81P nam mặt số màu vàng, dây thép mạ vàng, kính khoáng chịu lực. Thiết kế sang trọng, phù hợp dịp lễ.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/7264/201741/dong-ho-nam-citizen-bi5006-81p-vang-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/7264/201741/dong-ho-nam-citizen-bi5006-81p-vang-600x600.jpg'],
        variants: [{ name: 'Vàng', color: 'Vàng', colorCode: '#ffd700', storage: '', price: 4990000, originalPrice: 5990000, stock: 35, sku: 'CITIZEN-BI5006-GLD' }],
        specifications: [
          { group: 'Thiết kế', items: [{ label: 'Màu', value: 'Vàng mạ' }, { label: 'Chất liệu dây', value: 'Thép không gỉ mạ vàng' }] }
        ],
        isFeatured: false, averageRating: 4.6, totalReviews: 67, totalSold: 134, views: 450
      },
      {
        name: 'MVW SS30725-14 Nam', slug: 'mvw-ss30725-14-nam', brand: 'MVW',
        category: categoryMap['dong-ho'],
        shortDescription: 'MVW SS30725 - Đồng hồ nam thể thao hiện đại',
        description: 'Đồng hồ MVW SS30725-14 nam thiết kế thể thao hiện đại, máy Miyota Nhật, chống nước 100m, kính Sapphire. Phong cách mạnh mẽ.',
        thumbnail: 'https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/360578/mvw-ss30725-14-nam-thumb-639023132849723031-600x600.jpg',
        images: ['https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/7264/360578/mvw-ss30725-14-nam-thumb-639023132849723031-600x600.jpg'],
        variants: [{ name: 'Dây Cao Su', color: 'Đen', colorCode: '#1c1c1e', storage: '', price: 1190000, originalPrice: 1390000, stock: 55, sku: 'MVW-SS30725-BLK' }],
        specifications: [
          { group: 'Máy', items: [{ label: 'Bộ máy', value: 'Miyota Nhật' }] },
          { group: 'Chống nước', items: [{ label: 'Chuẩn', value: '100m' }] }
        ],
        isFeatured: false, averageRating: 4.4, totalReviews: 89, totalSold: 198, views: 560
      },
      {
        name: 'Citizen NJ0154-80H Nam', slug: 'citizen-nj0154-80h-nam', brand: 'Citizen',
        category: categoryMap['dong-ho'],
        shortDescription: 'Citizen NJ0154 - Đồng hồ cơ tự động Eco-Drive',
        description: 'Citizen NJ0154-80H nam cơ tự động, bộ máy Citizen 8210, chống nước 100m, kính khoáng. Thiết kế 3 kim classic sang trọng.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/7264/287033/citizen-nj0154-80h-nam-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/7264/287033/citizen-nj0154-80h-nam-thumb-600x600.jpg'],
        variants: [{ name: 'Dây Da Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '', price: 7490000, originalPrice: 8990000, stock: 25, sku: 'CITIZEN-NJ0154-BLK' }],
        specifications: [
          { group: 'Máy', items: [{ label: 'Loại', value: 'Cơ tự động' }, { label: 'Bộ máy', value: 'Citizen 8210' }] },
          { group: 'Chống nước', items: [{ label: 'Chuẩn', value: '100m' }] }
        ],
        isFeatured: true, averageRating: 4.8, totalReviews: 56, totalSold: 112, views: 430
      },

      // ===== TABLET =====
      {
        name: 'OPPO Pad 5 8GB 256GB', slug: 'oppo-pad-5-8gb-256gb', brand: 'OPPO',
        category: categoryMap['tablet'],
        shortDescription: 'OPPO Pad 5 - Tablet mỏng nhẹ, màn đẹp',
        description: 'OPPO Pad 5 với Snapdragon 7s Gen 3, màn hình 11.6 inch 2.8K OLED 120Hz, RAM 8GB, pin 9510mAh sạc nhanh 67W. Lý tưởng cho giải trí.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/522/361231/oppo-pad-5-8gb-256gb-hong-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/522/361231/oppo-pad-5-8gb-256gb-hong-thumb-600x600.jpg'],
        variants: [
          { name: '8GB 256GB - Hồng', color: 'Hồng', colorCode: '#ff69b4', storage: '256GB', price: 9490000, originalPrice: 10990000, stock: 50, sku: 'OPPO-PAD5-256-PNK' },
          { name: '8GB 256GB - Xanh', color: 'Xanh', colorCode: '#4a90e2', storage: '256GB', price: 9490000, originalPrice: 10990000, stock: 40, sku: 'OPPO-PAD5-256-BLU' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '11.6 inch 2.8K OLED 120Hz' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Snapdragon 7s Gen 3' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '9510mAh 67W' }] }
        ],
        isFeatured: true, averageRating: 4.6, totalReviews: 89, totalSold: 198, views: 670
      },
      {
        name: 'iPad Pro M5 WiFi 11 inch', slug: 'ipad-pro-m5-wifi-11-inch', brand: 'Apple',
        category: categoryMap['tablet'],
        shortDescription: 'iPad Pro M5 - Sức mạnh máy tính bảng đỉnh cao',
        description: 'iPad Pro 11 inch M5 với chip M5, màn hình Ultra Retina XDR 120Hz, 8GB RAM, hỗ trợ Apple Intelligence AI. Mỏng nhất thế giới.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/522/358082/ipad-pro-m5-wifi-11-inch-black-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/522/358082/ipad-pro-m5-wifi-11-inch-black-thumb-600x600.jpg'],
        variants: [
          { name: 'WiFi 256GB - Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '256GB', price: 26990000, originalPrice: 28990000, stock: 30, sku: 'IPADPRO-M5-11-256-BLK' },
          { name: 'WiFi 512GB - Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '512GB', price: 32990000, originalPrice: 34990000, stock: 20, sku: 'IPADPRO-M5-11-512-BLK' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '11 inch Ultra Retina XDR 120Hz' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Apple M5' }] },
          { group: 'RAM', items: [{ label: 'Bộ nhớ', value: '8GB' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 24990000, flashSaleEnd: new Date(Date.now() + 86400000 * 5), flashSaleStock: 10,
        averageRating: 4.9, totalReviews: 56, totalSold: 112, views: 890
      },
      {
        name: 'Xiaomi Pad 8 8GB 256GB', slug: 'xiaomi-pad-8-8gb-256gb', brand: 'Xiaomi',
        category: categoryMap['tablet'],
        shortDescription: 'Xiaomi Pad 8 - Màn 3K, hiệu năng cao',
        description: 'Xiaomi Pad 8 với Snapdragon 8s Gen 4, màn hình 12.1 inch 3K LCD 144Hz, RAM 8GB, pin 11000mAh. Trải nghiệm giải trí đỉnh cao.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/522/362716/xiaomi-pad-8-xam-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/522/362716/xiaomi-pad-8-xam-thumb-600x600.jpg'],
        variants: [
          { name: '8GB 256GB - Xám', color: 'Xám', colorCode: '#6b7280', storage: '256GB', price: 7990000, originalPrice: 9490000, stock: 55, sku: 'XM-PAD8-256-GRY' },
          { name: '8GB 256GB - Đen', color: 'Đen', colorCode: '#1c1c1e', storage: '256GB', price: 7990000, originalPrice: 9490000, stock: 50, sku: 'XM-PAD8-256-BLK' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '12.1 inch 3K LCD 144Hz' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Snapdragon 8s Gen 4' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '11000mAh' }] }
        ],
        isFeatured: true, averageRating: 4.7, totalReviews: 67, totalSold: 145, views: 560
      },
      {
        name: 'Samsung Galaxy Tab S10 FE 8GB 256GB', slug: 'samsung-galaxy-tab-s10-fe', brand: 'Samsung',
        category: categoryMap['tablet'],
        shortDescription: 'Samsung Galaxy Tab S10 FE - S Pen, AI thông minh',
        description: 'Samsung Galaxy Tab S10 FE với Exynos 1580, màn hình 10.9 inch FHD+ 90Hz, kèm S Pen, RAM 8GB, pin 10090mAh. Hỗ trợ Galaxy AI.',
        thumbnail: 'https://cdn.tgdd.vn/2026/02/timerseo/359089-600x600-3.jpg',
        images: ['https://cdn.tgdd.vn/2026/02/timerseo/359089-600x600-3.jpg'],
        variants: [
          { name: '8GB 256GB - Hồng', color: 'Hồng', colorCode: '#ff69b4', storage: '256GB', price: 13990000, originalPrice: 15990000, stock: 40, sku: 'SS-TABS10FE-256-PNK' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '10.9 inch FHD+ 90Hz' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Exynos 1580' }] },
          { group: 'Bút', items: [{ label: 'Kèm theo', value: 'S Pen' }] }
        ],
        isFeatured: false, averageRating: 4.6, totalReviews: 78, totalSold: 167, views: 580
      },
      {
        name: 'Xiaomi Pad 8 Pro 12GB 256GB', slug: 'xiaomi-pad-8-pro-12gb-256gb', brand: 'Xiaomi',
        category: categoryMap['tablet'],
        shortDescription: 'Xiaomi Pad 8 Pro - Hiệu năng Pro, màn 3K',
        description: 'Xiaomi Pad 8 Pro với Snapdragon 8 Gen 3, màn hình 12.1 inch 3K LCD 144Hz, RAM 12GB, pin 11000mAh sạc 67W. Flagship tablet.',
        thumbnail: 'https://cdn.tgdd.vn/Products/Images/522/362718/xiaomi-pad-8-pro-xanh-la-thumb-600x600.jpg',
        images: ['https://cdn.tgdd.vn/Products/Images/522/362718/xiaomi-pad-8-pro-xanh-la-thumb-600x600.jpg'],
        variants: [
          { name: '12GB 256GB - Xanh Lá', color: 'Xanh Lá', colorCode: '#22c55e', storage: '256GB', price: 11990000, originalPrice: 13990000, stock: 35, sku: 'XM-PAD8PRO-256-GRN' }
        ],
        specifications: [
          { group: 'Màn hình', items: [{ label: 'Kích thước', value: '12.1 inch 3K LCD 144Hz' }] },
          { group: 'Chip', items: [{ label: 'CPU', value: 'Snapdragon 8 Gen 3' }] },
          { group: 'Pin', items: [{ label: 'Dung lượng', value: '11000mAh 67W' }] }
        ],
        isFeatured: true, isFlashSale: true, flashSalePrice: 10990000, flashSaleEnd: new Date(Date.now() + 86400000 * 3), flashSaleStock: 20,
        averageRating: 4.8, totalReviews: 45, totalSold: 98, views: 430
      }
    ];

    await Product.insertMany(products);
    console.log(`📦 Created ${products.length} products`);

    for (const userData of users) { await new User(userData).save(); }
    console.log(`👤 Created ${users.length} users`);

    // Banners
    const banners = [
      // Hero Banners (Main Slider)
      {
        title: 'iPhone 15 Pro Max - Titan Đen',
        image: 'http://localhost:3001/uploads/banner-slider1.png',
        link: '/san-pham/iphone-15-pro-max-256gb',
        position: 'hero',
        order: 1,
        isActive: true
      },
      {
        title: 'Samsung Galaxy S24 Ultra',
        image: 'http://localhost:3001/uploads/banner-slider2.png',
        link: '/san-pham/samsung-galaxy-s24-ultra-12gb512gb',
        position: 'hero',
        order: 2,
        isActive: true
      },
      {
        title: 'MacBook Pro M3 Pro',
        image: 'http://localhost:3001/uploads/banner-slider3.png',
        link: '/san-pham/macbook-pro-14-m3-pro-18gb512gb',
        position: 'hero',
        order: 3,
        isActive: true
      },
      // Side Right Banners
      {
        title: 'AirPods Pro 2 - Giảm sốc',
        image: 'http://localhost:3001/uploads/banner-khuyenmai.png',
        link: '/san-pham/airpods-pro-2nd-generation',
        position: 'side_right',
        order: 1,
        isActive: true
      },
      {
        title: 'Apple Watch Ultra 2',
        image: 'http://localhost:3001/uploads/banner-khuyenmai.png',
        link: '/san-pham/apple-watch-ultra-2',
        position: 'side_right',
        order: 2,
        isActive: true
      },
      // Promotion Banners
      {
        title: 'Flash Sale Tết 2026',
        image: 'http://localhost:3001/uploads/banner-khuyenmai.png',
        link: '/khuyen-mai/tet-2026',
        position: 'promotion',
        order: 1,
        isActive: true
      },
      {
        title: 'iPad Pro M2 - Trả góp 0%',
        image: 'http://localhost:3001/uploads/banner-khuyenmai.png',
        link: '/san-pham/ipad-pro-11-m2-wi-fi-128gb',
        position: 'promotion',
        order: 2,
        isActive: true
      },
      {
        title: 'Phụ kiện Apple - Giảm 30%',
        image: 'http://localhost:3001/uploads/banner-khuyenmai.png',
        link: '/danh-muc/phu-kien',
        position: 'promotion',
        order: 3,
        isActive: true
      },
      {
        title: 'Laptop Gaming - Ưu đãi khủng',
        image: 'http://localhost:3001/uploads/banner-khuyenmai.png',
        link: '/danh-muc/laptop',
        position: 'promotion',
        order: 4,
        isActive: true
      }
    ];

    await Banner.insertMany(banners);
    console.log(`🎨 Created ${banners.length} banners`);

    console.log('\n✅ Database seeded successfully!');
    console.log('📋 Test accounts: admin@tgdd.vn / Admin@123, user@test.com / User@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
