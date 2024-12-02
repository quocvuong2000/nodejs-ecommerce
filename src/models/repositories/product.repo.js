"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../product.model");

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    // Return the newest
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
};
const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const shopFound = await product.findOne({ _id: product_id, product_shop });
  if (!shopFound) return null;

  shopFound.isDraft = false;
  shopFound.isPublished = true;
  const { modifiedCount } = await shopFound.updateOne(shopFound);

  return modifiedCount;
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
};
