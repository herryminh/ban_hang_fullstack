const mongoose = require('mongoose');
const ProductVariant = require('../models/ProductVariant');
const fs = require('fs');
const path = require('path');
// Lấy tất cả variant của 1 product
exports.getVariantById = async (req, res) => {
  try {
    // Lấy variant theo id
    const variant = await ProductVariant.findById(req.params.id);

    if (!variant) return res.status(404).json({ message: 'Variant not found' });

    // In ra console để kiểm tra
    console.log('Variant:', variant);

    res.json(variant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// Tạo variant mới
exports.createVariant = async (req, res) => {
  try {
    const images = req.files
      ? req.files.map(f => `/uploads/variants/${f.filename}`)
      : [];

    const variant = new ProductVariant({
      productId: req.body.productId,
      color: req.body.color,
      price: req.body.price,
      size: JSON.parse(req.body.size),
      images,
      sku: req.body.sku || undefined
    });

    await variant.save();
    res.status(201).json(variant);

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


// Cập nhật variant
exports.updateVariant = async (req, res) => {
  try {
    const variant = await ProductVariant.findById(req.params.id);
    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    /* ===== 1. XÓA ẢNH CŨ NẾU CÓ ẢNH MỚI ===== */
    if (req.files && req.files.length > 0) {
      variant.images.forEach((imgPath) => {
        const fullPath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });

      // Gán ảnh mới
      variant.images = req.files.map((file) => `/uploads/variants/${file.filename}`);
    }

    /* ===== 2. UPDATE FIELD ===== */
    if (req.body.color) variant.color = req.body.color;
    if (req.body.price) variant.price = req.body.price;
    if (req.body.size) variant.size = JSON.parse(req.body.size);

    await variant.save();

    res.json(variant);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Xóa variant
exports.deleteVariant = async (req, res) => {
  try {
    await ProductVariant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Variant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
