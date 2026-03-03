import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã được sử dụng' });

    const user = await User.create({ email, password, fullName, phone });
    const token = generateToken(user._id);

    res.status(201).json({
      user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    if (!user.isActive) return res.status(401).json({ message: 'Tài khoản đã bị khóa' });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      user: { id: user._id, email: user.email, fullName: user.fullName, phone: user.phone, role: user.role, avatar: user.avatar },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Google Login
router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: 'Google credential is required' });

    // Decode the JWT credential from Google (header.payload.signature)
    const parts = credential.split('.');
    if (parts.length !== 3) return res.status(400).json({ message: 'Invalid Google credential' });

    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    const { email, name, picture, sub: googleId } = payload;

    if (!email) return res.status(400).json({ message: 'Cannot get email from Google' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        fullName: name || email.split('@')[0],
        avatar: picture || '',
        password: `google_${googleId}_${Date.now()}`,
        isActive: true,
        role: 'user',
      });
    } else {
      if (picture && !user.avatar) {
        user.avatar = picture;
        await user.save();
      }
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);
    res.json({
      user: {
        _id: user._id,
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        vipPoints: user.vipPoints || 0,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, phone, avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Change password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Address management
router.post('/addresses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    user.addresses.push(req.body);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);
    if (!address) return res.status(404).json({ message: 'Địa chỉ không tồn tại' });
    
    if (req.body.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    Object.assign(address, req.body);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.pull(req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Wishlist
router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(req.params.productId)) {
      user.wishlist.push(req.params.productId);
      await user.save();
    }
    res.json(user.wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist.pull(req.params.productId);
    await user.save();
    res.json(user.wishlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Get all users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
