import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, note, items: requestItems } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    let orderItems = [];
    let subtotal = 0;
    let discount = 0;
    let voucher;

    if (cart && cart.items.length > 0) {
      const totals = cart.calculateTotal();
      subtotal = totals.subtotal;
      discount = totals.discount;
      voucher = cart.voucher;
      orderItems = cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        thumbnail: item.product.thumbnail,
        variant: item.variant,
        price: item.price,
        quantity: item.quantity
      }));
    } else if (Array.isArray(requestItems) && requestItems.length > 0) {
      const productIds = requestItems.map(item => item.productId);
      const products = await Product.find({ _id: { $in: productIds }, isActive: true });
      const productMap = new Map(products.map(product => [product._id.toString(), product]));

      for (const item of requestItems) {
        const product = productMap.get(item.productId);
        if (!product) {
          return res.status(400).json({ message: 'Sản phẩm không tồn tại hoặc đã ngừng kinh doanh' });
        }

        const matchedVariant = product.variants.find(variant => variant.sku === item.variantSku)
          || product.variants.find(variant => variant.name === item.variant);

        if (!matchedVariant) {
          return res.status(400).json({ message: `Biến thể không hợp lệ cho sản phẩm ${product.name}` });
        }

        const quantity = Number(item.quantity) || 1;
        if (matchedVariant.stock < quantity) {
          return res.status(400).json({ message: `Sản phẩm ${product.name} không đủ tồn kho` });
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          thumbnail: product.thumbnail,
          variant: {
            name: matchedVariant.name,
            color: matchedVariant.color,
            storage: matchedVariant.storage,
            sku: matchedVariant.sku,
          },
          price: matchedVariant.price,
          quantity
        });

        subtotal += matchedVariant.price * quantity;
      }
    } else {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    const shippingFee = subtotal >= 2000000 ? 0 : 30000;
    const total = subtotal - discount + shippingFee;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingFee,
      discount,
      voucher,
      total,
      note,
      statusHistory: [{ status: 'pending', note: 'Đơn hàng mới tạo' }]
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { totalSold: item.quantity } });
    }

    if (cart) {
      cart.items = [];
      cart.voucher = undefined;
      await cart.save();
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Không có quyền xem đơn hàng này' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Track order by order number
router.get('/tracking/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .select('orderNumber status statusHistory items total shippingAddress estimatedDelivery createdAt');
    if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel order
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Không có quyền hủy đơn hàng này' });
    }
    
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Không thể hủy đơn hàng ở trạng thái này' });
    }

    order.status = 'cancelled';
    order.cancelReason = req.body.reason;
    order.statusHistory.push({ status: 'cancelled', note: req.body.reason });
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Get all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'fullName email phone')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update order status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Đơn hàng không tồn tại' });

    order.status = status;
    order.statusHistory.push({ status, note, updatedBy: req.user._id });
    
    if (status === 'shipping') {
      order.estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    }

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
