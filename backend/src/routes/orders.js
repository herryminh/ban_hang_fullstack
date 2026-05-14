const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderControllers');

// Định nghĩa các route
router.get('/', orderController.index);      // Lấy tất cả (Admin)
router.post('/', orderController.create);    // Tạo mới (User)
router.put('/:id', orderController.update);  // Sửa (Admin)
router.delete('/:id', orderController.delete); // Xóa (Admin)

module.exports = router;