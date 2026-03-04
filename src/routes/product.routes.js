import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all products with filters
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, sort, search, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (category) {
      // Support both slug and ObjectId
      const mongoose = await import('mongoose');
      if (mongoose.default.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          query.category = cat._id;
        } else {
          return res.json({ products: [], total: 0, page: Number(page), pages: 0 });
        }
      }
    }
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = Number(minPrice);
      if (maxPrice) query['variants.price'].$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { 'variants.price': 1 };
    if (sort === 'price_desc') sortOption = { 'variants.price': -1 };
    if (sort === 'popular') sortOption = { totalSold: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate('category', 'name slug')
      .limit(12);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get flash sale products
router.get('/flash-sale', async (req, res) => {
  try {
    const products = await Product.find({ 
      isFlashSale: true, 
      isActive: true,
      flashSaleEnd: { $gt: new Date() }
    }).populate('category', 'name slug').limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by slug
router.get('/slug/:slug', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .populate('reviews.user', 'fullName avatar');
    
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    
    product.views += 1;
    await product.save();
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

    const review = {
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
      images: req.body.images || []
    };

    product.reviews.push(review);
    product.totalReviews = product.reviews.length;
    product.averageRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
