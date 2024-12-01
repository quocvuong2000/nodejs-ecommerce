'use strict';

const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model');

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

    if (!productClass) {
      throw new BadRequestError('Invalid product type');
    }

    return new productClass(payload).createProduct();
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
    return await product.create({ ...this, _id: product_id });
  }
}

// Define sub-class for each Clothing type
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) {
      return new BadRequestError('Create new cloth error');
    }
    const newProduct = await super.createProduct();
    if (!newProduct) return new BadRequestError('Create new product error');

    return newProduct;
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