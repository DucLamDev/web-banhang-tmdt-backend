import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'bot', 'admin'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [messageSchema],
  status: { type: String, enum: ['active', 'waiting_admin', 'with_admin', 'closed'], default: 'active' },
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  context: {
    currentProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    intent: String
  }
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);
