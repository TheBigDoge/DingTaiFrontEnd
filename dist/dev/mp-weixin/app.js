"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const api_login = require("./api/login.js");
const store_index = require("./store/index.js");
const utils_auth = require("./utils/auth.js");
const utils_error = require("./utils/error.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/cart/cart.js";
  "./pages/category/category.js";
  "./pages/user/user.js";
  "./pages/product/detail.js";
  "./pages/order/order.js";
  "./pages/order/success.js";
  "./pages/login/login.js";
  "./pages/address/address.js";
  "./pages/address/edit.js";
  "./pages/order/orderlist.js";
  "./pages/membership/membership.js";
  "./pages/membership/detail.js";
}
async function userLogin(res) {
  {
    console.log(`平台为微信小程序, 登录code=${res.code}`);
    return await api_login.WechatLogin({ code: res.code });
  }
}
const _sfc_main = {
  onShow: function() {
    console.log("App Launch");
    const token = utils_auth.getAuthToken();
    if (token) {
      api_login.startup().then((res) => {
        if (!res.token) {
          common_vendor.index.login().then(userLogin).then((res2) => {
            if (res2) {
              console.log("平台登录成功", res2);
              return api_login.handleAfterLogin();
            }
          }).catch((err) => {
            console.log("登录失败", err);
            utils_auth.delAuthToken();
            store_index.GlobalData.set_premium_status(null);
            store_index.GlobalData.set_user(null);
            if (err.code === utils_error.ErrorCode.WechatRegisterRequired) {
              common_vendor.index.navigateTo({
                "url": "/pages/login/login"
              });
            }
          });
        }
      });
    }
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
