function getPrice(originalPrice, typePromotion = 'default') {
  // Giảm giá khi người dùng đặt trước một sản phẩm của VINFAST
  if (typePromotion === 'preOrder') {
    return originalPrice * 0.8; // giảm 20%
  }
  // Tiếp tục thêm tính năng khuyến mãi thông thường
  // Nếu giá gốc < 200 thì giảm 10%, còn > thì giảm tối đa 30
  if (typePromotion === 'promotion') {
    return originalPrice <= 200 ? originalPrice * 0.9 : originalPrice - 30;
  }

  // Đến ngày blackFriday promotion
  if (typePromotion === 'blackFriday') {
    return originalPrice <= 200 ? originalPrice * 0.9 : originalPrice - 30;
  }

  // Thời xưa chưa có marketing như bây giờ.
  if (typePromotion === 'default') {
    return originalPrice;
  }
}

console.log(`---> PRICE:::`, getPrice(200, 'preOrder'));
