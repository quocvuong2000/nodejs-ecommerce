const { inventory } = require('../models/inventory.model');
import { BadRequestError } from '../core/error.response';
import { findProductById } from '../models/repositories/product.repo';
class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = '134, Tran Phu, HCM City',
  }) {
    const product = await findProductById({ id: productId, select: 'product_shop' });
    if(!product) throw new BadRequestError('Product does not exist!');

    
  }
}

module.exports = { InventoryService };
