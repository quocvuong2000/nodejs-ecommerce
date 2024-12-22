'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.repo');
const {
  checkProductsByServer,
} = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');

class CheckoutService {
  // login and without login

  /*
    {
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId,
                shop_discount: [
                    {
                        "shopId",
                        "discountId",
                        codeId
                    }
                ],
                item_products: [
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
            }
        ]
    }
    */

  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    // check cartId ton tai khong?
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new BadRequestError('Cart does not exist!');

    const checkout_order = {
        totalPrice: 0, // tổng tiền hàng
        feeShip: 0, // phí vận chuyển
        totalDiscount: 0, // tổng tiền giảm giá
        totalCheckout: 0, // tổng thanh toán
      },
      shop_order_ids_new = [];

    // tính tổng tiền bill
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];
      // check product available
      const checkProductServer = await checkProductsByServer(item_products);
      if (!checkProductServer[0]) throw new BadRequestError('Order wrong!!!');

      // tổng tiền đơn hàng
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tổng tiền trước khi xử lý
      checkout_order.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tiền trước khi giảm giá
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };
      // nếu shop_discounts tồn tại > 0, check xem có hợp lệ hay không
      if (shop_discounts.length > 0) {
        // giả sử chỉ có một discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });

        // tổng cộng discount giảm giá
        checkout_order.totalDiscount += discount;

        // nếu tiền giảm giá lớn hơn 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      // tổng thanh toán cuối cùng
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  /*
    1. Kiểm kê lại đơn hàng có đúng hay không
    2. Check trong kho hàng (inventory) có tồn tại đủ sl hàng mà người dùng có đặt hay không
    3. 
  */
}

module.exports = CheckoutService;
