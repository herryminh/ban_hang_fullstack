const express = require('express');
const router = express.Router();
const productsController = require('../../src/controllers/productControllers');
const uploadVariant = require('../middleware/uploadVariant');

router.get('/', productsController.index);
router.get('/:slug', productsController.getBySlug);
router.post('/create',uploadVariant.any(), productsController.create);
router.put('/:id',uploadVariant.any(),productsController.update);
router.delete('/:id', productsController.delete);




module.exports = router;
