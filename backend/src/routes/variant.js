const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadVariant');
const variantController = require('../controllers/variantController');

router.post('/create',upload.array('images', 10),variantController.createVariant);
router.get('/:id', variantController.getVariantById);
router.put('/:id', upload.array('images', 10), variantController.updateVariant);
router.delete('/:id', variantController.deleteVariant);


module.exports = router;
