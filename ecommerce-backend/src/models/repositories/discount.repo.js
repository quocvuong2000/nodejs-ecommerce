const {
  unSelectMongooseFields,
  selectMongooseFields,
} = require("../../utils/helper");
const discount = require("../discount.model");

const findAllDiscountCodeUnselect = async ({
  page = 1,
  limit = 50,
  sort,
  filter,
  unSelect,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await discount
    .find(filter)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(unSelectMongooseFields(unSelect))
    .lean();
};

const findAllDiscountCodeSelect = async ({
  page = 1,
  limit = 50,
  sort,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  return await discount
    .find(filter)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(selectMongooseFields(select))
    .lean();
};

const checkDiscountExistsByShop = async ({
  discount_code,
  discount_shopId,
}) => {
  return await discount.findOne({ discount_code, discount_shopId }).lean();
};

module.exports = {
  findAllDiscountCodeUnselect,
  findAllDiscountCodeSelect,
  checkDiscountExistsByShop,
};
