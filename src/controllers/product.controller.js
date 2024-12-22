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

  updateProduct = async (req, res) => {
    const productType = req.body.product_type;
    const productId = req.params.product_id;
    const productPayload = { ...req.body, product_shop: req.user.userId };
    return new SuccessResponse({
      message: "Update product successfully",
      metadata: await ProductFactoryV2.updateProduct(
        productType,
        productId,
        productPayload
      ),
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

  getListSearchProducts = async (req, res) => {
    return new SuccessResponse({
      message: "Get all list product published by name successfully",
      metadata: await ProductFactoryV2.searchProducts(req.params),
    }).send(res);
  };

  getAllProducts = async (req, res) => {
    return new SuccessResponse({
      message: "Get all list product successfully",
      metadata: await ProductFactoryV2.getAllProducts(req),
    }).send(res);
  };

  getDetailProduct = async (req, res) => {
    return new SuccessResponse({
      message: "Get detail product successfully",
      metadata: await ProductFactoryV2.getDetailProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // END QUERY //

  // PUT //
  publishProductByShop = async (req, res) => {
    return new SuccessResponse({
      message: "Publish product successfully",
      metadata: await ProductFactoryV2.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res) => {
    return new SuccessResponse({
      message: "Unpublish product successfully",
      metadata: await ProductFactoryV2.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res);
  };

  // END PUT //
}

module.exports = new ProductController();
