'use strict';
const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const CheckoutController = require('../../controllers/checkout.controller');

router.post('/review', asyncHandler(CheckoutController.checkoutReview));


module.exports = router;
