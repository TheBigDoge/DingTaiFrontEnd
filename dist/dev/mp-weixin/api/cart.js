"use strict";
const api_product = require("./product.js");
const utils_http = require("../utils/http.js");
function newCartItem(response) {
  return {
    id: response.id,
    product_id: response.product_id,
    is_partial_sale: response.is_partial_sale,
    stock: response.stock / 100,
    product: api_product.newProduct(response.product)
  };
}
async function AddCartItem(req) {
  return await utils_http.http.post("/api/v1/carts", req);
}
async function ListCartItems(page, page_size) {
  return await utils_http.http.get("/api/v1/carts", {
    page,
    page_size
  });
}
async function DeleteCartItem(id) {
  return await utils_http.http.delete(`/api/v1/carts/${id}`);
}
async function DeleteCartItems(ids) {
  const future = [];
  for (const id of ids) {
    future.push(DeleteCartItem(id));
  }
  return Promise.all(future).then();
}
exports.AddCartItem = AddCartItem;
exports.DeleteCartItem = DeleteCartItem;
exports.DeleteCartItems = DeleteCartItems;
exports.ListCartItems = ListCartItems;
exports.newCartItem = newCartItem;
