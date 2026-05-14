const Product = require('../models/Product');
const ProductVariant = require('../models/ProductVariant');
const mongoose = require('mongoose');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
class ProductController {

  // GET /products
  async index (req, res) {
  try {
    // Lấy tất cả product
    const products = await Product.find();

    // Lấy variants cho từng product
    const productsWithVariants = await Promise.all(
      products.map(async (product) => {
        const variants = await ProductVariant.find({
          productId: product._id
        });
        return {
          ...product._doc,
          variants
        };
      })
    );

    res.json(productsWithVariants);

  } catch (err) {
    console.error("Lỗi getAllProducts:", err);
    res.status(500).json({ message: err.message });
  }
};

  // GET /products/:slug
  async getBySlug(req, res) {
    try {
      const product = await Product.findOne({ slug: req.params.slug });
      if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

      // Lấy variants đúng ObjectId
      const variants = await ProductVariant.find({ productId: new  mongoose.Types.ObjectId(product._id) });

      res.json({ ...product._doc, variants });
    } catch (err) {
      console.error("Lỗi getBySlug:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  }
// POST /products

async create(req, res) {
  try {
    const { name, description, category, brand, basePrice } = req.body;

    // ⚠️ variants gửi từ FormData → là STRING
    let variants = [];

if (req.body.variants) {
  if (typeof req.body.variants === 'string') {
    // form-data
    variants = JSON.parse(req.body.variants);
  } else {
    // raw json
    variants = req.body.variants;
  }
}


    /* =========================
       1️⃣ TẠO SLUG PRODUCT
    ========================== */
    let slugBase = slugify(name, { lower: true, strict: true });
    let slug = slugBase;
    let count = 1;

    while (await Product.findOne({ slug })) {
      slug = `${slugBase}-${count++}`;
    }

    /* =========================
       2️⃣ TẠO PRODUCT
    ========================== */
    const newProduct = await Product.create({
      name,
      slug,
      description,
      category,
      brand,
      basePrice
    });

    /* =========================
       3️⃣ MAP ẢNH THEO VARIANT
       fieldname: variant_0_images
    ========================== */
    const variantImagesMap = {};

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const match = file.fieldname.match(/variant_(\d+)_images/);
        if (match) {
          const index = match[1];
          if (!variantImagesMap[index]) {
            variantImagesMap[index] = [];
          }
          variantImagesMap[index].push(
            `/uploads/variants/${file.filename}`
          );
        }
      });
    }

    /* =========================
       4️⃣ TẠO VARIANTS + SKU + ẢNH
    ========================== */
    let createdVariants = [];

    if (variants.length > 0) {
      const variantDocs = variants.map((v, idx) => ({
        productId: newProduct._id,
        color: v.color,
        size: v.size,
        price: v.price || basePrice,
        images: variantImagesMap[idx] || [],

        // 🔥 SKU CHUẨN
        sku: `${slug}-${v.color}-${idx + 1}`
      }));

      createdVariants = await ProductVariant.insertMany(variantDocs);
    }

    /* =========================
       5️⃣ RESPONSE
    ========================== */
    res.status(201).json({
      message: "Tạo product + variants + ảnh thành công",
      data: {
        ...newProduct._doc,
        variants: createdVariants
      }
    });

  } catch (err) {
    console.error("Lỗi create product:", err);
    res.status(500).json({
      message: "Lỗi server",
      error: err.message
    });
  }
}


  // PUT /products/id/:id
// controllers/ProductController.js
async update(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID không hợp lệ' });
    }

    // 🔹 parse variants
    let variants = [];

if (req.body.variants) {
  if (typeof req.body.variants === 'string') {
    // form-data
    variants = JSON.parse(req.body.variants);
  } else {
    // raw json
    variants = req.body.variants;
  }
}


    // 🔹 update product info
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        brand: req.body.brand,
        basePrice: req.body.basePrice
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product không tồn tại' });
    }

    // 🔹 update từng variant
    const updatedVariants = [];

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];

      // ảnh mới upload
      const files = req.files?.[`variant_${i}_images`] || [];
      const newImages = files.map(
        f => `/uploads/variants/${f.filename}`
      );

      // merge ảnh cũ + ảnh mới
      const updatedVariant = await ProductVariant.findByIdAndUpdate(
        v._id,
        {
          color: v.color,
          size: v.size,
          price: v.price,
          stock: v.stock,
          $push: { images: { $each: newImages } }
        },
        { new: true }
      );

      if (updatedVariant) {
        updatedVariants.push(updatedVariant);
      }
    }

    res.json({
      message: 'Cập nhật product & variants thành công',
      data: {
        ...product._doc,
        variants: updatedVariants
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
}

  // DELETE /products/:id
// controllers/ProductController.js


async delete(req, res) {
  try {
    const { id } = req.params;

    const variants = await ProductVariant.find({ productId: id });

    // 🔥 XOÁ ẢNH
    variants.forEach(variant => {
      variant.images.forEach(imgPath => {
        const fullPath = path.join(__dirname, '..', imgPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    });

    // 🔥 XOÁ VARIANTS
    await ProductVariant.deleteMany({ productId: id });

    // 🔥 XOÁ PRODUCT
    await Product.findByIdAndDelete(id);

    res.json({
      message: "Xóa product + variants + ảnh thành công"
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}



}

module.exports = new ProductController();



