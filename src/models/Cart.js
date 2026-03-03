import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant: {
    name: String,
    color: String,
    storage: String,
    price: Number,
    sku: String
  },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  voucher: {
    code: String,
    discount: Number,
    type: { type: String, enum: ['percent', 'fixed'] }
  }
}, { timestamps: true });

cartSchema.methods.calculateTotal = function() {
  let subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let discount = 0;
  
  if (this.voucher) {
    if (this.voucher.type === 'percent') {
      discount = subtotal * (this.voucher.discount / 100);
    } else {
      discount = this.voucher.discount;
    }
  }
  
  return { subtotal, discount, total: subtotal - discount };
};

export default mongoose.model('Cart', cartSchema);
