'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findCartById } = require('../models/repositories/cart.repo');
const {
  checkProductsByServer,
} = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.service');
const { acquireLock, releaseLock } = require('./redis.service');
const order = require('../models/order.model');
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
  static async orderByUser({
    cartId,
    userId,
    shop_order_ids = [],
    user_address,
    user_payment,
  }) {
    const { checkout_order, shop_order_ids_new } =
      await CheckoutService.checkoutReview({ cartId, userId, shop_order_ids });
    const products = shop_order_ids_new.flatMap((item) => item.item_products);
    const acquireProduct = [];
    console.log('products', products);
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock();
      }
    }

    // check if co mot san pham het han trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        'Mot so san pham da duoc cap nhat, vui long thu lai!'
      );
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_payment,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
      order_trackingNumber: '#0000118052022',
      order_status: 'pending',
    });

    // truong hop: neu insert thanh cong , thi remove product co trong cart
    if (newOrder) {
      await CartService.deleteUserCart({ userId, productId: cartId });
    }

    return newOrder;
  }

  // > Query Orders [Users]
  static async getOrdersByUser() {
    // Implementation for fetching all orders for a user
  }

  // > Query Order Using Id [Users]
  static async getOneOrderByUser() {
    // Implementation for fetching a single order by ID for a user
  }

  /*
  > Cancel Order [Users]
  */
  static async cancelOrderByUser() {
    // Implementation for canceling an order by a user
  }

  /*
  > Update Order Status [Shop | Admin]
  */
  static async updateOrderStatusByShop() {
    // Implementation for updating order status by shop or admin
  }
}

module.exports = CheckoutService;
