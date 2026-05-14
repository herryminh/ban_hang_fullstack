const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  // ID giỏ hàng bạn muốn: productId-sku
  _id: { type: String, required: true }, 
  userId: { type: String, required: true },
  items: [
    {
      productId: String,
      variantId: String,
      name: String,
      color: String,
      size: String,
      sku: String,
      price: Number,
      image: String,
      quantity: Number,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema);