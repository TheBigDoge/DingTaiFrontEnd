"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isMember: false,
      selectedPackage: "monthly"
    };
  },
  onLoad() {
    this.checkMembershipStatus();
  },
  methods: {
    checkMembershipStatus() {
      const membershipStatus = common_vendor.index.getStorageSync("membershipStatus");
      this.isMember = membershipStatus && membershipStatus.expiresAt > (/* @__PURE__ */ new Date()).getTime();
    },
    selectPackage(packageType) {
      this.selectedPackage = packageType;
    },
    handlePurchase() {
      common_vendor.index.showLoading({
        title: "处理中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const now = /* @__PURE__ */ new Date();
        let expiresAt;
        switch (this.selectedPackage) {
          case "monthly":
            expiresAt = now.setMonth(now.getMonth() + 1);
            break;
          case "quarterly":
            expiresAt = now.setMonth(now.getMonth() + 3);
            break;
          case "yearly":
            expiresAt = now.setFullYear(now.getFullYear() + 1);
            break;
        }
        common_vendor.index.setStorageSync("membershipStatus", {
          isMember: true,
          expiresAt,
          packageType: this.selectedPackage
        });
        this.isMember = true;
        common_vendor.index.showToast({
          title: "开通成功",
          icon: "success",
          duration: 2e3
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isMember ? "/static/images/member-active.png" : "/static/images/member-inactive.png",
    b: common_vendor.t($data.isMember ? "尊享会员" : "普通用户"),
    c: common_vendor.t($data.isMember ? "您已开通会员，享受专属优惠" : "开通会员，享受专属优惠"),
    d: $data.isMember
  }, $data.isMember ? {} : {}, {
    e: !$data.isMember
  }, !$data.isMember ? {
    f: $data.selectedPackage === "monthly" ? 1 : "",
    g: common_vendor.o(($event) => $options.selectPackage("monthly")),
    h: $data.selectedPackage === "quarterly" ? 1 : "",
    i: common_vendor.o(($event) => $options.selectPackage("quarterly")),
    j: $data.selectedPackage === "yearly" ? 1 : "",
    k: common_vendor.o(($event) => $options.selectPackage("yearly"))
  } : {}, {
    l: common_assets._imports_0$3,
    m: common_assets._imports_1,
    n: common_assets._imports_2,
    o: !$data.isMember
  }, !$data.isMember ? {
    p: common_vendor.o((...args) => $options.handlePurchase && $options.handlePurchase(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e9fd5e59"]]);
wx.createPage(MiniProgramPage);
