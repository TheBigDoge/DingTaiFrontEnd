"use strict";
const common_vendor = require("../../common/vendor.js");
const api_login = require("../../api/login.js");
const _sfc_main = {
  data() {
    return {
      form: {
        phone: "",
        password: ""
      },
      showPassword: false
    };
  },
  methods: {
    handleLogin(e) {
      console.log("授权信息", e);
      if (e) {
        common_vendor.index.login().then((loginRes) => {
          return this.customLogin(e, loginRes);
        }).then(() => common_vendor.index.navigateBack());
      }
    },
    async customLogin(e, loginRes) {
      var _a, _b, _c;
      {
        if (((_a = e.detail) == null ? void 0 : _a.errMsg) === "getPhoneNumber:ok") {
          const payload = {
            code: loginRes.code,
            encrypted_data: (_b = e.detail) == null ? void 0 : _b.encryptedData,
            iv: (_c = e.detail) == null ? void 0 : _c.iv
          };
          console.log("微信注册payload", payload);
          const response = await api_login.WechatRegister(payload);
          console.log("微信注册结果", response);
          api_login.handleAfterLogin();
        }
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cdfe2409"]]);
wx.createPage(MiniProgramPage);
