const { cart } = require("../models/cart.model");

/*
  Key features: Cart Service
  - Add product to cart [User]
  - Reduce product quantity by one [User]
  - Increase product quantity by one [User]
  - Get cart [User]
  - Delete cart [User]
  - Delete cart item [User]
*/

class CartService {
  /// START REPO CART ///
  static async createUserCart({ userId, product }) {
    /*
      $addToSet ensures that the product is added to the cart’s cart_products array without duplicates.
	    •	The options object (upsert: true) ensures a new cart is created if it doesn’t exist.
	    •	The new: true option ensures the updated cart is returned after the operation.
    */
    const query = { cart_userId: userId, cart_state: "active" };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = { upsert: true, new: true };

    return await cart.findOneAndUpdate(query, updateOrInsert, options);
  }
  /// END REPO CART ///

  static async updateUserCartQuantity({ userId, product }) {
    const { quantity, productId } = product;
    const query = {
      cart_userId: userId,
      cart_state: "active",
      "cart_products.productId": productId,
    };
    const update = { $inc: { "cart_products.$.quantity": quantity } };
    return await cart.findOneAndUpdate(query, update);
  }

  static async addToCart({ userId, product = {} }) {
    // Check if the cart exists
    const userCart = await cart.findOne({ cart_userId: userId });

    if (!userCart) {
      // Cart does not exist - create cart for the user
      return await CartService.createUserCart({ userId, product });
    }

    // neu co gio hang roi nhung chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // gio hang ton tai, va co san pham nay thi update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // update cart
  /*
shop_order_ids: [
  {
    shopId,
    item_products: [
      {
        quantity,
        price,
        shopId,
        old_quantity,
        productId
      }
    ],
    version
  }
]
*/

  static async addToCartV2({ userId, product = {} }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    // Check product
    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw new NotFoundError("");

    // Compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      // DELETED
    }

    return await CartService.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleteCart = await cart.updateOne(query, updateSet);
    return deleteCart;
  }
}

module.exports = CartService;
