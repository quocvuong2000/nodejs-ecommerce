'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');

/*
  Discount Services
  1 – Generator Discount Code [Shop | Admin]
  2 – Get discount amount [User]
  3 – Get all discount codes [User | Shop]
  4 – Verify discount code [User]
  5 – Delete discount Code [Admin | Shop]
  6 – Cancel discount code [usre]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // check if date is valid
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError('Discount code has expired!');
    }

    // create index for discount code
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: shopId,
    });
  }
}
