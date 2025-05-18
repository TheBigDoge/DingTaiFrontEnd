"use strict";
const utils_http = require("../utils/http.js");
function newUser(ur) {
  var _a;
  return {
    id: ur.id,
    nickname: ur.nickname,
    phone: ur.phone,
    avatar: ((_a = ur.avatar.image) == null ? void 0 : _a.url) ?? ""
  };
}
async function fetchUserInfo() {
  return await utils_http.http.get("/api/v1/users");
}
exports.fetchUserInfo = fetchUserInfo;
exports.newUser = newUser;
