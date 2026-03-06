import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalOrders, totalProducts, totalUsers, orders] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments(),
      Order.find().sort('-createdAt').limit(100),
    ]);

    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total || 0), 0);

    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    // Recent orders with user info
    const recentOrders = await Order.find()
      .populate('user', 'fullName email phone')
      .sort('-createdAt')
      .limit(5);

    // Top products by totalSold
    const topProducts = await Product.find({ isActive: true })
      .sort('-totalSold')
      .limit(5)
      .select('name thumbnail totalSold variants');

    res.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalUsers,
      recentOrders,
      topProducts: topProducts.map(p => ({
        _id: p._id,
        name: p.name,
        thumbnail: p.thumbnail,
        totalSold: p.totalSold || 0,
        revenue: (p.totalSold || 0) * (p.variants?.[0]?.price || 0),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
