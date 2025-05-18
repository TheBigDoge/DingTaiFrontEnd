"use strict";
const utils_http = require("../utils/http.js");
function newProduct(pr) {
  return {
    id: pr.id,
    number: pr.number,
    name: pr.name,
    description: pr.description,
    vip_only: pr.vip_only,
    total_stock: pr.total_stock / 100,
    sold_stock: pr.sold_stock / 100,
    lock_stock: pr.lock_stock / 100,
    available_stock: pr.available_stock / 100,
    min_order_stock: pr.min_order_stock / 100,
    image: pr.media.filter((m) => m.type === "image").map((m) => m.image.url).at(0) ?? "",
    memberPrice: pr.vip_price * 100,
    price: pr.normal_price * 100,
    allow_partial_sale: pr.allow_partial_sale,
    order_quantity: pr.order_quantity,
    media: pr.media
  };
}
var ProductListSorting = /* @__PURE__ */ ((ProductListSorting2) => {
  ProductListSorting2["General"] = "general";
  ProductListSorting2["Price"] = "price";
  ProductListSorting2["PriceDesc"] = "price_desc";
  ProductListSorting2["Sell"] = "sell";
  ProductListSorting2["SellDesc"] = "sell_desc";
  ProductListSorting2["Recommend"] = "recommend";
  return ProductListSorting2;
})(ProductListSorting || {});
async function GetProducts(keyword, sort, category_id) {
  return await utils_http.http.get("/api/v1/products", {
    keyword: keyword || void 0,
    sort: sort || void 0,
    category_id: void 0
    // 接受category_id == 0的请求，虽然非法
  });
}
async function GetProductById(id) {
  return await utils_http.http.get(`/api/v1/products/${id}`);
}
exports.GetProductById = GetProductById;
exports.GetProducts = GetProducts;
exports.ProductListSorting = ProductListSorting;
exports.newProduct = newProduct;
