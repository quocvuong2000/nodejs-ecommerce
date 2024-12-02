"use strict";

const { SuccessResponse } = require("../core/success.response");
// const ProductFactory = require("../services/product.service");
const ProductFactoryV2 = require("../services/product.service.xxx");

class ProductController {
  createProduct = async (req, res) => {
    return new SuccessResponse({
      message: "Create product successfully",
      metadata: await ProductFactoryV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  // QUERY //
  /**
   * @desc Get all Drafts for shop
   * @param {number} limit
   * @param {number} skip
   * @returns {JSON}
   */
  getAllDraftProductsByShop = async (req, res) => {
    return new SuccessResponse({
      message: "Get all list draft products by shop successfully",
      metadata: await ProductFactoryV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all Drafts for shop
   * @param {number} limit
   * @param {number} skip
   * @returns {JSON}
   */
  getAllPublishedProductsByShop = async (req, res) => {
    return new SuccessResponse({
      message: "Get all list product published by shop successfully",
      metadata: await ProductFactoryV2.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // END QUERY //
}

module.exports = new ProductController();
