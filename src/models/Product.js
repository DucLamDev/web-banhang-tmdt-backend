import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: String,
  color: String,
  colorCode: String,
  storage: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true, sparse: true },
  images: [String]
});

const specificationItemSchema = new mongoose.Schema({
  label: String,
  value: String
});

const specificationGroupSchema = new mongoose.Schema({
  group: String,
  items: [specificationItemSchema]
});

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  images: [String],
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  brand: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  shortDescription: String,
  description: String,
  images: [String],
  thumbnail: String,
  variants: [variantSchema],
  specifications: [specificationGroupSchema],
  badges: [{
    text: String,
    bgColor: String,
    color: String
  }],
  promotions: [{
    type: { type: String, enum: ['discount', 'gift', 'installment', 'combo'] },
    title: String,
    description: String,
    value: Number
  }],
  warranty: {
    months: Number,
    description: String
  },
  isFeatured: { type: Boolean, default: false },
  isFlashSale: { type: Boolean, default: false },
  flashSalePrice: Number,
  flashSaleEnd: Date,
  flashSaleStock: Number,
  flashSaleSold: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  reviews: [reviewSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

productSchema.index({ name: 'text', brand: 'text', shortDescription: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

export default mongoose.model('Product', productSchema);
