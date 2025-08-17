'use strict';
const { inventory } = require('../inventory.model');
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = 'unknow',
}) => {
  return await inventory.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_location: location,
    inven_shopId: shopId,
  });
};

const reservationInventory = async ({ productId, cartId, quantity }) => {
  // dat hang tru di ton kho
  const query = {
    inven_productId: productId,
    // nhiem vu cua no la phai lon hon quantity
    inven_stock: { $gte: quantity },
    inven_shopId: cartId,
  };
  const update = {
    $inc: { inven_stock: -quantity },
    $push: { inven_reservations: { cartId, quantity, createOn: new Date() } },
  };
  const options = { new: true, upsert: true };
  return await inventory.updateOne(query, update, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
