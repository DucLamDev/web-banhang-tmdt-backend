import express from 'express';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('order');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category tree
router.get('/tree', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true, parent: null }).sort('order');
    const tree = await Promise.all(categories.map(async (cat) => {
      const children = await Category.find({ parent: cat._id, isActive: true }).sort('order');
      return { ...cat.toObject(), children };
    }));
    res.json(tree);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get category by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) return res.status(404).json({ message: 'Danh mục không tồn tại' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create category (Admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category (Admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Danh mục không tồn tại' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category (Admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Đã xóa danh mục' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
