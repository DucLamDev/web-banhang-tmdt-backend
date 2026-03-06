import express from 'express';
import Voucher from '../models/Voucher.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const buildVoucherPayload = (body) => {
  const payload = {
    code: body.code?.trim().toUpperCase(),
    description: body.description?.trim() || '',
    type: body.type,
    value: Number(body.value),
    minOrderValue: Number(body.minOrderValue || 0),
    usageLimit: Number(body.usageLimit || 0),
    isActive: Boolean(body.isActive),
    displayLocation: body.displayLocation || 'all',
    targetCategorySlug: body.targetCategorySlug?.trim() || '',
  };

  if (body.maxDiscount !== '' && body.maxDiscount !== null && body.maxDiscount !== undefined) {
    payload.maxDiscount = Number(body.maxDiscount);
  }

  if (body.startDate) {
    payload.startDate = new Date(body.startDate);
  }

  if (body.endDate) {
    payload.endDate = new Date(body.endDate);
  }

  return payload;
};

const validateVoucherPayload = (payload) => {
  if (!payload.code) return 'Mã giảm giá là bắt buộc';
  if (!['percent', 'fixed'].includes(payload.type)) return 'Loại mã giảm giá không hợp lệ';
  if (!['all', 'product_detail'].includes(payload.displayLocation)) return 'Vị trí hiển thị không hợp lệ';
  if (Number.isNaN(payload.value) || payload.value <= 0) return 'Giá trị mã giảm giá phải lớn hơn 0';
  if (Number.isNaN(payload.minOrderValue) || payload.minOrderValue < 0) return 'Đơn tối thiểu không hợp lệ';
  if (Number.isNaN(payload.usageLimit) || payload.usageLimit < 0) return 'Giới hạn sử dụng không hợp lệ';
  if (payload.maxDiscount !== undefined && (Number.isNaN(payload.maxDiscount) || payload.maxDiscount < 0)) {
    return 'Giảm tối đa không hợp lệ';
  }
  if (payload.startDate && Number.isNaN(payload.startDate.getTime())) return 'Ngày bắt đầu không hợp lệ';
  if (payload.endDate && Number.isNaN(payload.endDate.getTime())) return 'Ngày kết thúc không hợp lệ';
  if (payload.startDate && payload.endDate && payload.endDate < payload.startDate) {
    return 'Ngày kết thúc phải sau ngày bắt đầu';
  }
  return null;
};

// Public: Get active vouchers for configured display location/category
router.get('/public', async (req, res) => {
  try {
    const { displayLocation, categorySlug } = req.query;
    const now = new Date();
    const query = {
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: { $exists: false } },
            { startDate: null },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: null },
            { endDate: { $gte: now } },
          ],
        },
      ],
    };

    if (displayLocation) {
      query.displayLocation = displayLocation;
    }

    if (categorySlug) {
      query.$and.push({
        $or: [
          { targetCategorySlug: '' },
          { targetCategorySlug: categorySlug },
        ],
      });
    }

    const vouchers = await Voucher.find(query).sort('-createdAt');
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
    const payload = buildVoucherPayload(req.body);
    const validationError = validateVoucherPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const voucher = await Voucher.create(payload);
    res.status(201).json(voucher);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mã giảm giá đã tồn tại' });
    }

    res.status(400).json({ message: error.message });
  }
});

// Admin: Update voucher
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const payload = buildVoucherPayload(req.body);
    const validationError = validateVoucherPayload(payload);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const voucher = await Voucher.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!voucher) return res.status(404).json({ message: 'Voucher không tồn tại' });
    res.json(voucher);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mã giảm giá đã tồn tại' });
    }

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
