'use strict';

const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');
const { insertInventory } = require('../models/repositories/inventory.repo');
const {
  publishProductByShop,
  findAllDraftsForShop,
  unPublishProductByShop,
  findAllPublishedForShop,
  searchProducts,
  getAllProducts,
  findProduct,
  findAndUpdateProduct,
} = require('../models/repositories/product.repo');
const {
  unSelectMongooseFields,
  selectMongooseFields,
} = require('../utils/helper');

//Define Factory class to create product

class ProductFactory {
  /*
    type : "Clothing" or "Electronic"
    payload
  */
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError('Invalid product type');
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestError('Invalid product type');
    return new productClass(payload).updateProduct(productId);
  }

  // PUT //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  // END PUT //

  // QUERY //
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { isDraft: true, product_shop };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { isPublished: true, product_shop };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static async getAllProducts({
    select = selectMongooseFields([
      '_id',
      'product_name',
      'product_price',
      'product_thumb',
      'product_description',
      'product_shop',
    ]),
    limit = 50,
    page = 1,
  }) {
    return await getAllProducts({
      select,
      limit,
      page,
    });
  }

  static async getDetailProduct({ product_id }) {
    return await findProduct({
      id: product_id,
      select: unSelectMongooseFields(['__v', 'product_variants']),
    });
  }

  static async searchProducts({ keySearch }) {
    return await searchProducts({ keySearch });
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_attributes,
    product_thumb,
    product_shop,
  }) {
    this.product_name = product_name;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_attributes = product_attributes;
    this.product_thumb = product_thumb;
    this.product_shop = product_shop;
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      // add product_stock in inventory collection
      const invenData = await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });

      // push notification to system collection
      pushNotiToSystem({
        type: 'SHOP-001',
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop,
        },
      })
        .then((rs) => console.log(rs))
        .catch((err) => console.error(err));

      console.log('Inventory Data::', invenData);
    }
    return product
  }

  async updateProduct({ productId, payload }) {
    return await findAndUpdateProduct({ productId, payload, model: product });
  }
}

// Define sub-class for each Clothing type
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) {
      return new BadRequestError('Create new cloth error');
    }
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) return new BadRequestError('Create new product error');

    return newProduct;
  }

  async updateProduct(productId) {
    const paramsObject = updatedNestedObject(this);
    const productAttribute = this.product_attributes;
    if (productAttribute) {
      // update child
      return await clothing.findByIdAndUpdate(
        productId,
        updatedNestedObject(productAttribute)
      );
    }
    return await findAndUpdateProduct({
      productId: productId,
      payload: paramsObject,
      model: clothing,
    });
  }
}

// Define sub-class for each Electronic type
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      return new BadRequestError('Create new electronic error');
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) return new BadRequestError('Create new product error');

    return newProduct;
  }
}

// Define sub-class for each Furniture type
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      return new BadRequestError('Create new Furniture error');
    }
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) return new BadRequestError('Create new product error');

    return newProduct;
  }
}

//register product types
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronic', Electronic);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
