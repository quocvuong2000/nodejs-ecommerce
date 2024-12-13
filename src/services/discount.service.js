"use strict";
const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
  findAllDiscountCodeUnselect,
  checkDiscountExistsByShop,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");

const discount = require("../models/discount.model");
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
      throw new BadRequestError("Discount code has expired!");
    }

    // create index for discount code
    const foundDiscount = await discount.findOne({
      discount_code: code,
      discount_shopId: shopId,
    });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists!");
    }

    const newDiscount = await discount.create({
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_is_active: is_active,
      discount_shopId: shopId,
      discount_min_order_value: min_order_value,
      discount_product_ids: product_ids,
      discount_applies_to: applies_to,
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_max_value: max_value,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
    });
    return newDiscount;
  }

  static async updateDiscountCode(payload) {
    const { id, payload } = payload;
    const updatedDiscount = await discount.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return updatedDiscount;
  }

  static async getAllDiscountCodeWithProduct({ code, shopId, limit, page }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found!");
    }

    const { discount_product_ids, discount_applies_to } = foundDiscount;

    let products;

    if (discount_applies_to === "specific") {
      products = await findAllProducts({
        filter: { _id: { $in: discount_product_ids }, isPublished: true },
        select: ["_id", "product_name", "product_price", "product_thumb"],
        sort: "ctime",
        limit,
        page,
      });
    }

    if (discount_applies_to === "all") {
      products = await findAllProducts({
        filter: { product_shop: shopId, isPublished: true },
        sort: "ctime",
        select: ["_id", "product_name", "product_price", "product_thumb"],
        limit,
        page,
      });
    }
  }

  static async getAllDiscountCodeByShop({ shopId, limit, page }) {
    const discounts = await findAllDiscountCodeUnselect({
      limit: +limit,
      page: +page,
      filter: { discount_shopId: shopId, discount_is_active: true },
      unSelect: ["discount_product_ids", "discount_applies_to", "__v"],
    });
    return discounts;
  }

  /*
  Apply Discount Code
  products = [
    {
      productId,
      shopId,
      quantity,
      name,
      price
    },
    {
      productId,
      shopId,
      quantity,
      name,
      price
    }
  ]
*/

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExistsByShop({
      discount_code: codeId,
      discount_shopId: shopId,
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found!");
    }

    if (!foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code has expired!");
    }

    if (!foundDiscount.discount_max_uses) {
      throw new BadRequestError("Discount code has expired!");
    }
    if (!discount_is_active) throw new NotFoundError("discount expired!");
    if (discount_max_uses) throw new NotFoundError("discount are out!");
    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new NotFoundError("discount code has expired!");
    }

    // check xem co es gia tri toi thieu khong?
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `discount requires a minimum order value of ${discount_min_order_value}!`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUserDiscount) {
        // ....
      }
    }

    // check xem discount nay la fixed_amount –
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  /*
  Cancel Discount Code ()
*/

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExistsByShop({
      discount_code: codeId,
      discount_shopId: shopId,
    });


    if (!foundDiscount) throw new NotFoundError("discount doesn't exist");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
