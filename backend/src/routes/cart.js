const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartControllers');


router.get('/', CartController.getMyCart);
// router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
// router.put('/:id', CartController.updateCartItem);
router.delete('/:id', CartController.removeCartItem);
// router.delete('/', CartController.clearCart);
router.put('/:id', CartController.updateQuantity);
router.delete('/', CartController.clearCart);


module.exports = router;
