'use strict';
const { model, Schema } = require('mongoose'); // Erase if already required 516K (gzipped: 124.1K)
const DOCUMENT_NAME = 'Product';

const COLLECTION_NAME = 'Products';
const CLOTH_COLLECTION_NAME = 'Clothes';
const ELEC_COLLECTION_NAME = 'Electronics';
const FURN_COLLECTION_NAME = 'Furnitures';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
// define the product type = clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
  },
  {
    collection: CLOTH_COLLECTION_NAME,
    timestamps: true,
  }
);
// define the product type = electronic
const electronicSchema = new Schema(
  {
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
  },
  {
    collection: ELEC_COLLECTION_NAME,
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    material: { type: String, require: true },
    size: String,
    color: String,
  },
  {
    collection: FURN_COLLECTION_NAME,
    timestamps: true,
  }
);
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicSchema),
  clothing: model('Clothing', clothingSchema),
  furniture: model('Furniture', furnitureSchema),
};
