const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/categoryControllers');

// ✅ PHẢI truyền reference function
router.get('/', CategoryController.index);
router.get('/:slug', CategoryController.getBySlug);
router.post('/', CategoryController.create);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

module.exports = router;
