export const getPriceRange = (goods) => {
  if (!goods) {
    return [0, 0];
  }

  let result = [Number.MAX_SAFE_INTEGER, 0];

  goods.forEach((item) => {
    if (Number(item.price) < result[0]) result[0] = Number(item.price);
    if (Number(item.price) > result[1]) result[1] = Number(item.price);
  });

  return result;
};