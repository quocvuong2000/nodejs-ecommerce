'use strict';

const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const {authentication} = require('../../auth/authUtils');

// AUTHENTICATION MIDDLEWARE
router.use(authentication);

router.post('/product', asyncHandler(ProductController.createProduct));

//////////////

module.exports = router;
