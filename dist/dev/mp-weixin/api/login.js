"use strict";
const utils_auth = require("../utils/auth.js");
const utils_http = require("../utils/http.js");
const api_user = require("./user.js");
const store_index = require("../store/index.js");
const api_premium = require("./premium.js");
function commonHandleLogin(loginResponse) {
  if (loginResponse == null ? void 0 : loginResponse.token) {
    utils_auth.setAuthToken(loginResponse.token);
  } else {
    utils_auth.delAuthToken();
  }
}
async function handleAfterLogin(loginResponse) {
  return Promise.all([
    store_index.GlobalData.fetchUser(),
    store_index.GlobalData.fetchPremiumStatus()
  ]);
}
async function startup() {
  const response = await utils_http.http.get("/api/v1/login");
  if (response.token) {
    commonHandleLogin(response);
  }
  if (response.user) {
    const user = api_user.newUser(response.user);
    store_index.GlobalData.set_user(user);
  }
  if (response.premium_status) {
    const status = api_premium.newPremiumStatus(response.premium_status);
    store_index.GlobalData.set_premium_status(status);
  } else {
    store_index.GlobalData.set_premium_status(null);
  }
  return response;
}
async function WechatLogin(req) {
  let response = await utils_http.http.post("/api/v1/login/wechat", req);
  commonHandleLogin(response);
  return response;
}
async function WechatRegister(req) {
  let response = await utils_http.http.post("/api/v1/login/wechat/register", req);
  commonHandleLogin(response);
  return response;
}
exports.WechatLogin = WechatLogin;
exports.WechatRegister = WechatRegister;
exports.handleAfterLogin = handleAfterLogin;
exports.startup = startup;
