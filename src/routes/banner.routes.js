import express from 'express';
import Banner from '../models/Banner.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get active banners
router.get('/', async (req, res) => {
  try {
    const { position } = req.query;
    const query = { isActive: true };
    if (position) query.position = position;

    const now = new Date();
    query.$or = [
      { startDate: null, endDate: null },
      { startDate: { $lte: now }, endDate: { $gte: now } },
      { startDate: { $lte: now }, endDate: null },
      { startDate: null, endDate: { $gte: now } }
    ];

    const banners = await Banner.find(query).sort('order');
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create banner
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Update banner
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: 'Banner không tồn tại' });
    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Delete banner
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa banner' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
