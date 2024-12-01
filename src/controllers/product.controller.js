"use strict";

const { SuccessResponse } = require("../core/success.response");
// const ProductFactory = require("../services/product.service");
const ProductFactoryV2 = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res) => {
    console.log('req', req)
    return new SuccessResponse({
      message: "Create product successfully",
      metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
        ...req.body,
        userId: req.keyStore.userId,
      }),
    }).send(res);


  };
}

module.exports = new ProductController();
