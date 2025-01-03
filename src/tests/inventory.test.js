const redisPubSubService = require("../services/redisPubSub.service");


class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe('purchase_events', (message) => {
      InventoryServiceTest.updateInventory(message);
    })
  }

  static updateInventory(productId,quantity) {
    console.log(`updateInventory ${productId} ${quantity}`);
  }
}

module.exports = new InventoryServiceTest();