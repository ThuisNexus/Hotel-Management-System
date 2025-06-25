const express = require('express');
const PaymentController = require('../controller/payment-controller');

const router = express.Router();

router.post('/process', PaymentController.processPayment);

module.exports = router;
