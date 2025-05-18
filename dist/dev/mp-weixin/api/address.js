"use strict";
const utils_http = require("../utils/http.js");
function newAddress(ar) {
  return {
    id: ar.id,
    name: ar.name,
    phone: ar.phone,
    province: ar.province,
    city: ar.city,
    district: ar.district,
    address: ar.address,
    isDefault: ar.is_default,
    tags: ar.tags
  };
}
async function listAddresses() {
  return await utils_http.http.get("/api/v1/addresses");
}
async function createAddress(address) {
  return await utils_http.http.post("/api/v1/addresses", {
    ...address,
    id: void 0,
    isDefault: void 0,
    is_default: address.isDefault
  });
}
async function deleteAddress(id) {
  return await utils_http.http.delete(`/api/v1/addresses/${id}`);
}
async function updateAddress(address) {
  return await utils_http.http.put(`/api/v1/addresses/${address.id}`, {
    ...address,
    id: void 0,
    isDefault: void 0,
    is_default: address.isDefault
  });
}
exports.createAddress = createAddress;
exports.deleteAddress = deleteAddress;
exports.listAddresses = listAddresses;
exports.newAddress = newAddress;
exports.updateAddress = updateAddress;
