const express = require('express');
const router = express.Router();
const cartController = require('../controller/cart-controller');

router.post('/', cartController.addToCart);
router.get('/', cartController.viewCart);
router.post('/remove', cartController.removeFromCart);
router.get('/total', cartController.calculateCartTotal);
router.post('/checkout', cartController.handleCheckout);
router.post('/checkout-success', cartController.handleCheckoutSuccess);

module.exports = router;
 