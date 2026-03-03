import express from 'express';
import ChatSession from '../models/ChatSession.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Create or get chat session
router.post('/session', optionalAuth, async (req, res) => {
  try {
    const sessionId = req.body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = await ChatSession.create({
        sessionId,
        user: req.user?._id,
        messages: [{
          role: 'bot',
          content: 'Xin chào! Tôi là trợ lý ảo của TGDD. Tôi có thể giúp gì cho bạn?'
        }]
      });
    }
    
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get session
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId })
      .populate('assignedAdmin', 'fullName');
    if (!session) return res.status(404).json({ message: 'Phiên chat không tồn tại' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send message
router.post('/session/:sessionId/messages', async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ message: 'Phiên chat không tồn tại' });

    session.messages.push({
      role: req.body.role || 'user',
      content: req.body.content
    });

    // Simple bot response if not with admin
    if (session.status === 'active' && req.body.role === 'user') {
      session.messages.push({
        role: 'bot',
        content: 'Cảm ơn bạn đã liên hệ. Nếu cần hỗ trợ từ nhân viên, vui lòng nhấn "Gặp nhân viên".'
      });
    }

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Request admin
router.post('/session/:sessionId/request-admin', async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ message: 'Phiên chat không tồn tại' });

    session.status = 'waiting_admin';
    session.messages.push({
      role: 'bot',
      content: 'Đang kết nối với nhân viên hỗ trợ, vui lòng chờ trong giây lát...'
    });

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Get pending sessions
router.get('/admin/pending', protect, adminOnly, async (req, res) => {
  try {
    const sessions = await ChatSession.find({ status: 'waiting_admin' })
      .populate('user', 'fullName email')
      .sort('-updatedAt');
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Join session
router.post('/admin/join/:sessionId', protect, adminOnly, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ message: 'Phiên chat không tồn tại' });

    session.status = 'with_admin';
    session.assignedAdmin = req.user._id;
    session.messages.push({
      role: 'admin',
      content: `Xin chào! Tôi là ${req.user.fullName}, tôi sẽ hỗ trợ bạn.`
    });

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Close session
router.post('/admin/close/:sessionId', protect, adminOnly, async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.sessionId });
    if (!session) return res.status(404).json({ message: 'Phiên chat không tồn tại' });

    session.status = 'closed';
    session.messages.push({
      role: 'bot',
      content: 'Phiên chat đã kết thúc. Cảm ơn bạn đã liên hệ!'
    });

    await session.save();
    res.json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
