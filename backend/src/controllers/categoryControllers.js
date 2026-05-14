const Category = require('../models/Category');
const slugify = require('slugify');
const mongoose = require('mongoose');

class CategoryController {

  // GET /categories
  async index(req, res) {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.json(categories);
    } catch (err) {
      console.error('Lỗi get categories:', err);
      res.status(500).json({ message: err.message });
    }
  }

  // GET /categories/:slug
  async getBySlug(req, res) {
    try {
      const category = await Category.findOne({ slug: req.params.slug });
      if (!category) {
        return res.status(404).json({ message: 'Category không tồn tại' });
      }
      res.json(category);
    } catch (err) {
      console.error('Lỗi getBySlug:', err);
      res.status(500).json({ message: err.message });
    }
  }

  // POST /categories
  async create(req, res) {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Name là bắt buộc' });
      }

      /* =========================
         1️⃣ TẠO SLUG
      ========================== */
      let slugBase = slugify(name, { lower: true, strict: true });
      let slug = slugBase;
      let count = 1;

      while (await Category.findOne({ slug })) {
        slug = `${slugBase}-${count++}`;
      }

      /* =========================
         2️⃣ TẠO CATEGORY
      ========================== */
      const category = await Category.create({
        name,
        slug
      });

      res.status(201).json({
        message: 'Tạo category thành công',
        data: category
      });

    } catch (err) {
      console.error('Lỗi create category:', err);
      res.status(500).json({ message: err.message });
    }
  }

  // PUT /categories/:id
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, isActive } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
      }

      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).json({ message: 'Category không tồn tại' });
      }

      /* =========================
         1️⃣ NẾU ĐỔI NAME → ĐỔI SLUG
      ========================== */
      if (name && name !== category.name) {
        let slugBase = slugify(name, { lower: true, strict: true });
        let slug = slugBase;
        let count = 1;

        while (await Category.findOne({ slug, _id: { $ne: id } })) {
          slug = `${slugBase}-${count++}`;
        }

        category.slug = slug;
        category.name = name;
      }

      if (typeof isActive === 'boolean') {
        category.isActive = isActive;
      }

      await category.save();

      res.json({
        message: 'Cập nhật category thành công',
        data: category
      });

    } catch (err) {
      console.error('Lỗi update category:', err);
      res.status(500).json({ message: err.message });
    }
  }

  // DELETE /categories/:id
  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
      }

      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({ message: 'Category không tồn tại' });
      }

      res.json({ message: 'Xóa category thành công' });

    } catch (err) {
      console.error('Lỗi delete category:', err);
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new CategoryController();
