"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  methods: {
    viewOrder() {
      common_vendor.index.navigateTo({
        url: "/pages/order/orderlist",
        success: () => {
          console.log("Successfully navigated to order list");
        },
        fail: (err) => {
          console.error("Navigation failed:", err);
        }
      });
    },
    continueShopping() {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.viewOrder && $options.viewOrder(...args)),
    b: common_vendor.o((...args) => $options.continueShopping && $options.continueShopping(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8d67ee03"]]);
wx.createPage(MiniProgramPage);
