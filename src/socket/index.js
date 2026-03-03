import jwt from 'jsonwebtoken';
import ChatSession from '../models/ChatSession.js';

export const setupSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
      }
      next();
    } catch (error) {
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_chat', async (sessionId) => {
      socket.join(sessionId);
      socket.sessionId = sessionId;
      console.log(`Socket ${socket.id} joined chat ${sessionId}`);
    });

    socket.on('leave_chat', (sessionId) => {
      socket.leave(sessionId);
      console.log(`Socket ${socket.id} left chat ${sessionId}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { sessionId, content, role } = data;
        
        const session = await ChatSession.findOne({ sessionId });
        if (session) {
          session.messages.push({ role, content });
          await session.save();
        }

        io.to(sessionId).emit('new_message', {
          role,
          content,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Send message error:', error);
      }
    });

    socket.on('typing_start', (sessionId) => {
      socket.to(sessionId).emit('user_typing', { isTyping: true });
    });

    socket.on('typing_stop', (sessionId) => {
      socket.to(sessionId).emit('user_typing', { isTyping: false });
    });

    socket.on('admin_join', async (sessionId) => {
      socket.join(sessionId);
      io.to(sessionId).emit('admin_joined');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
