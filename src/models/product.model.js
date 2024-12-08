'use strict';
const { model, Schema } = require('mongoose'); // Erase if already required 516K (gzipped: 124.1K)
const { default: slugify } = require('slugify');
const DOCUMENT_NAME = 'Product';

const COLLECTION_NAME = 'Products';
const CLOTH_COLLECTION_NAME = 'Clothes';
const ELEC_COLLECTION_NAME = 'Electronics';
const FURN_COLLECTION_NAME = 'Furnitures';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true }, // quan jean cao cap
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String, // quan-jean-cao-cap
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating must be at most 5'],
      // 4.345666 -> 4.3
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variants: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);
// create index for search
productSchema.index({
  product_name: 'text',
  product_description: 'text',
});

// Document middleware run before .save() and .create()
productSchema.pre('save', function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// define the product type = clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
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
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
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
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
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
