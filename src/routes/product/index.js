'use strict';

const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

router.get('', asyncHandler(ProductController.getAllProducts));
router.get(
  '/:product_id',
  asyncHandler(ProductController.getDetailProduct)
);
router.get(
  '/search/:keySearch',
  asyncHandler(ProductController.getListSearchProducts)
);

// AUTHENTICATION MIDDLEWARE
router.use(authenticationV2);
///////////////////
router.post('', asyncHandler(ProductController.createProduct));

// QUERY //
router.get(
  '/draft/all',
  asyncHandler(ProductController.getAllDraftProductsByShop)
);
router.get(
  '/published/all',
  asyncHandler(ProductController.getAllPublishedProductsByShop)
);

module.exports = router;
