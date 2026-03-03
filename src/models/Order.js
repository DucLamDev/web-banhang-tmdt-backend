import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  thumbnail: String,
  variant: {
    name: String,
    color: String,
    storage: String,
    sku: String
  },
  price: Number,
  quantity: Number
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    province: String,
    district: String,
    ward: String,
    street: String
  },
  paymentMethod: { type: String, enum: ['cod', 'banking', 'momo', 'vnpay'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  subtotal: Number,
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  voucher: { code: String, discount: Number },
  total: Number,
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date, default: Date.now }
  }],
  note: String,
  cancelReason: String,
  estimatedDelivery: Date
}, { timestamps: true });

orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `TG${Date.now().toString().slice(-8)}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
