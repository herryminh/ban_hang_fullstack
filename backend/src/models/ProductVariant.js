
const mongoose = require('mongoose');

const ProductVariantSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  size: { type: [Object], required: true },
  color: { type: String, required: true }, // ví dụ: "Đen", "Trắng"
  price: { type: Number, default: 0 },
  sku: { type: String }, // mã quản lý
  images: [{ type: String }] // link ảnh
});

const ProductVariant = mongoose.model('ProductVariant', ProductVariantSchema);
module.exports = ProductVariant;
