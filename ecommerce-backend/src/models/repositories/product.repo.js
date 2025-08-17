'use strict';

const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../product.model');

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    // Return the newest
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
};

const searchProducts = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const resutls = await product
    .find(
      {
        isDraft: false,
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: 'textScore' },
      }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();
  return resutls;
};

const findAndUpdateProduct = async ({
  productId,
  payload,
  model,
  options = { new: true },
}) => {
  return await model.findByIdAndUpdate(productId, payload, options);
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

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const shopFound = await product.findOne({ _id: product_id, product_shop });
  if (!shopFound) return null;

  shopFound.isDraft = true;
  shopFound.isPublished = false;
  const { modifiedCount } = await shopFound.updateOne(shopFound);

  return modifiedCount;
};

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
  return await product
    .find(filter)
    .sort(sortBy)
    .select(select)
    .limit(limit)
    .skip(skip)
    .lean();
};

// findone
const findProduct = async ({ id, select }) => {
  return await product.findById(id).select(select).lean();
};

const getAllProducts = async ({ select, limit, page }) => {
  const skip = (page - 1) * limit;
  return await product
    .find({
      isDraft: false,
    })
    .select(select)
    .limit(limit)
    .skip(skip)
    .lean();
};

const getProductById = async ({ id, select }) => {
  return await product.findById(id).select(select).lean();
};

const checkProductsByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById({ id: product.productId });
      // Kiểm tra giá mới có phù hợp hay không
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};
module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  unPublishProductByShop,
  findAllPublishedForShop,
  searchProducts,
  findAllProducts,
  findProduct,
  getAllProducts,
  findAndUpdateProduct,
  getProductById,
  checkProductsByServer
};
