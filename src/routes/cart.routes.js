import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Voucher from '../models/Voucher.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name thumbnail slug');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    const totals = cart.calculateTotal();
    res.json({ ...cart.toObject(), ...totals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add item to cart
router.post('/items', protect, async (req, res) => {
  try {
    const { productId, variantSku, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

    const variant = product.variants.find(v => v.sku === variantSku);
    if (!variant) return res.status(404).json({ message: 'Phiên bản không tồn tại' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const existingItem = cart.items.find(item => 
      item.product.toString() === productId && item.variant.sku === variantSku
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        variant: { name: variant.name, color: variant.color, storage: variant.storage, price: variant.price, sku: variant.sku },
        quantity,
        price: variant.price
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name thumbnail slug');
    const totals = cart.calculateTotal();
    res.json({ ...cart.toObject(), ...totals });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item quantity
router.put('/items/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Sản phẩm không có trong giỏ' });

    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name thumbnail slug');
    const totals = cart.calculateTotal();
    res.json({ ...cart.toObject(), ...totals });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove item from cart
router.delete('/items/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });

    cart.items.pull(req.params.itemId);
    await cart.save();
    await cart.populate('items.product', 'name thumbnail slug');
    const totals = cart.calculateTotal();
    res.json({ ...cart.toObject(), ...totals });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Apply voucher
router.post('/voucher', protect, async (req, res) => {
  try {
    const { code } = req.body;
    const voucher = await Voucher.findOne({ 
      code: code.toUpperCase(), 
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    if (!voucher) return res.status(404).json({ message: 'Mã giảm giá không hợp lệ' });
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    const { subtotal } = cart.calculateTotal();

    if (subtotal < voucher.minOrderValue) {
      return res.status(400).json({ message: `Đơn hàng tối thiểu ${voucher.minOrderValue.toLocaleString()}đ` });
    }

    let discount = voucher.type === 'percent' ? subtotal * (voucher.value / 100) : voucher.value;
    if (voucher.maxDiscount && discount > voucher.maxDiscount) {
      discount = voucher.maxDiscount;
    }

    cart.voucher = { code: voucher.code, discount, type: voucher.type };
    await cart.save();
    await cart.populate('items.product', 'name thumbnail slug');
    const totals = cart.calculateTotal();
    res.json({ ...cart.toObject(), ...totals });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove voucher
router.delete('/voucher', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    cart.voucher = undefined;
    await cart.save();
    await cart.populate('items.product', 'name thumbnail slug');
    const totals = cart.calculateTotal();
    res.json({ ...cart.toObject(), ...totals });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Clear cart
router.delete('/', protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], voucher: undefined });
    res.json({ message: 'Đã xóa giỏ hàng' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
