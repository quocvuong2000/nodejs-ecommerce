'use strict';

const express = require('express');
const router = express.Router();
const { authenticationV2 } = require('../../auth/authUtils');
const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');

// get amount a discount
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get(
  '/list_product_code',
  asyncHandler(discountController.getAllDiscountCodesWithProducts)
);

// authentication
router.use(authenticationV2);

router.post('/', asyncHandler(discountController.createDiscountCode));
router.get('/', asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;