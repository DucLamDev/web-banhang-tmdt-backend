import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: String,
  position: { type: String, enum: ['hero', 'side_right', 'category', 'promotion'], default: 'hero' },
  order: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
