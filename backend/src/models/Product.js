const mongoose = require('mongoose');
// const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  category: { type: String, required: true },
  brand: { type: String },
  basePrice: { type: Number, required: true },
}, { timestamps: true });

// Tạo slug tự động trước khi save
// ProductSchema.pre('save', function(next) {
//   if (!this.slug || this.isModified('name')) {
//     this.slug = slugify(this.name, { lower: true, strict: true });
//     // lower: chữ thường, strict: loại bỏ ký tự đặc biệt
//   }
//   next();
// });

module.exports = mongoose.model('Product', ProductSchema);
