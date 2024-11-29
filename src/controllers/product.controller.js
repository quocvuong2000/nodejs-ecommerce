"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
  createProduct = async (req, res) => {
    return new SuccessResponse({
      message: "Create product successfully",
      metadata: await ProductFactory.createProduct(req.body.type, {
        ...req.body,
        userId: req.keyStore.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
