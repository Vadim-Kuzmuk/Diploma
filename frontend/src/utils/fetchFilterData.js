import queryString from "query-string";

export const fetchFilterData = (data) => {
  let filterUrl = "", firstLoopIteration = true;

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === "") {
      continue;
    }

    if (firstLoopIteration) {
      filterUrl = filterUrl.concat("?" + key + "=" + value);

      firstLoopIteration = false;
    } else {
      filterUrl = filterUrl.concat("&" + key + "=" + value);
    }
  }

  return filterUrl;
};

export const checkFilterItem = (searchParams, item, defaultValue, isNumber = false, isConstant = false) => {
  let filterItems = queryString.parse(searchParams.toString());

  return filterItems[item] !== undefined && !isConstant ? (isNumber ? parseInt(filterItems[item]) : filterItems[item]) : defaultValue;
};