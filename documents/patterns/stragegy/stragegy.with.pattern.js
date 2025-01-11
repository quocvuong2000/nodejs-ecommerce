/**
 * Giảm giá khi người dùng đặt trước một sản phẩm của VINFAST
 * @param {*} originalPrice
 * @returns
 */
function preOrderPrice(originalPrice) {
  return originalPrice * 0.8;
}

/**
 * Tiếp tục thêm tính năng khuyến mãi thông thường, ví dụ nếu giá gốc < 200 thì giảm 10%,
 * còn > thì giảm tối đa 30
 * @param {*} originalPrice
 * @returns
 */
function promotionPrice(originalPrice) {
  return originalPrice <= 200 ? originalPrice * 0.9 : originalPrice - 30;
}

/**
 * Giá mặc định
 * @param {*} originalPrice
 * @returns
 */
function defaultPrice(originalPrice) {
  return originalPrice;
}

/**
 * Giá đặc biệt trong ngày (ví dụ giảm giá 40%)
 * @param {*} originalPrice
 * @returns
 */
function dayPrice(originalPrice) {
  return originalPrice * 0.6;
}

// Và chúng ta sẽ sửa đổi lại như sau:
// function getPrice(originalPrice, typePromotion) {
//   if (typePromotion === 'preOrder') {
//     return preOrderPrice(originalPrice);
//   }

//   if (typePromotion === 'promotion') {
//     return promotionPrice(originalPrice);
//   }

//   if (typePromotion === 'default') {
//     return defaultPrice(originalPrice);
//   }
// }

// REFACTOR
const getPriceStragegy = {
  preOrder: preOrderPrice,
  promotion: promotionPrice,
  default: defaultPrice,
  dayPrice: dayPrice,
}

function getPrice(originalPrice, typePromotion = 'default') {
  return getPriceStragegy[typePromotion](originalPrice);
}

console.log('-->>>', getPrice(200, 'dayPrice'));
