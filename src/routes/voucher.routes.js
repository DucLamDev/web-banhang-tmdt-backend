import express from 'express';
import Voucher from '../models/Voucher.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Admin: Get all vouchers
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const vouchers = await Voucher.find().sort('-createdAt');
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create voucher
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const voucher = await Voucher.create(req.body);
    res.status(201).json(voucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Update voucher
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const voucher = await Voucher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!voucher) return res.status(404).json({ message: 'Voucher không tồn tại' });
    res.json(voucher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Delete voucher
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Voucher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa voucher' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
