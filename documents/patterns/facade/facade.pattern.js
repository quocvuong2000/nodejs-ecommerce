class Discount {
  calc(value) {
      return value * 0.9;
  }
}

class Shipping {
  calc() {
      return 5;
  }
}

class Fees {
  calc(value) {
      return value * 1.05;
  }
}

class ShopeeFacadePattern {
  constructor() {
      this.discount = new Discount();
      this.shipping = new Shipping();
      this.fees = new Fees();
  }

  calc(price) {
      price = this.discount.calc(price);
      console.log('discount::', price);

      price = this.fees.calc(price);
      console.log('fees::', price);

      const shippingCost = this.shipping.calc();
      console.log('shipping::', shippingCost);

      price += shippingCost;

      return price;
  }
}

// Example usage
const shop = new ShopeeFacadePattern();
console.log('Final Price::', shop.calc(100));