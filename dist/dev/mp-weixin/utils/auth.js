"use strict";
const common_vendor = require("../common/vendor.js");
function setAuthToken(token) {
  console.log("setAuthToken", token);
  common_vendor.index.setStorageSync("token", token);
  console.log("try getAuthToken", getAuthToken());
}
function getAuthToken() {
  return common_vendor.index.getStorageSync("token");
}
function delAuthToken() {
  setAuthToken("");
}
exports.delAuthToken = delAuthToken;
exports.getAuthToken = getAuthToken;
exports.setAuthToken = setAuthToken;
