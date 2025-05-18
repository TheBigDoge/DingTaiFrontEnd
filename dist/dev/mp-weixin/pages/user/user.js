"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const utils_datetime = require("../../utils/datetime.js");
const _sfc_main = {
  data() {
    return {
      user: store_index.GlobalData.get_user(),
      premium_status: store_index.GlobalData.get_premium_status()
    };
  },
  computed: {
    isPremium() {
      return store_index.GlobalData.is_premium();
    }
  },
  methods: {
    membershipTitle() {
      if (this.isPremium) {
        return "尊享VIP";
      } else {
        return "普通用户";
      }
    },
    membershipDesc() {
      var _a, _b, _c;
      if (this.isPremium) {
        if ((_a = this.premium_status) == null ? void 0 : _a.end_date) {
          return `会员到期日: ${utils_datetime.displayDate(this.premium_status.end_date)}`;
        } else {
          return `欢迎您，尊敬的永久会员`;
        }
      } else {
        if ((_b = this.premium_status) == null ? void 0 : _b.end_date) {
          return `您的会员已于 ${utils_datetime.displayDate((_c = this.premium_status) == null ? void 0 : _c.end_date)} 到期`;
        } else {
          return `开通会员，享受专属优惠`;
        }
      }
    },
    toLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    toSettings() {
      common_vendor.index.navigateTo({
        url: "/pages/settings/index"
      });
    },
    toMemberCenter() {
      common_vendor.index.navigateTo({
        url: "/pages/member/index"
      });
    },
    toOrderList(type) {
      common_vendor.index.navigateTo({
        url: `/pages/order/orderlist?type=${type}`
      });
    },
    toAddressList() {
      common_vendor.index.navigateTo({
        url: "/pages/address/address"
      });
    },
    toCustomService() {
      common_vendor.index.showToast({
        title: "正在连接客服...",
        icon: "none"
      });
    },
    handleViewMembership() {
      common_vendor.index.navigateTo({
        url: "/pages/user/membership-details",
        success: () => {
          console.log("Successfully navigated to membership details page");
        },
        fail: (err) => {
          console.error("Navigation failed:", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b;
  return common_vendor.e({
    a: (_a = $data.user) == null ? void 0 : _a.avatar
  }, ((_b = $data.user) == null ? void 0 : _b.avatar) ? {
    b: $data.user.avatar
  } : {
    c: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args))
  }, {
    d: $data.user
  }, $data.user ? {
    e: common_vendor.t($data.user.nickname)
  } : {
    f: common_vendor.o((...args) => $options.toLogin && $options.toLogin(...args))
  }, {
    g: common_vendor.o((...args) => $options.toSettings && $options.toSettings(...args)),
    h: $options.isPremium ? `/static/images/member-active.png` : "/static/images/member-inactive.png",
    i: common_vendor.t($options.membershipTitle()),
    j: common_vendor.t($options.membershipDesc()),
    k: common_vendor.o((...args) => $options.handleViewMembership && $options.handleViewMembership(...args)),
    l: common_vendor.o(($event) => $options.toOrderList("all")),
    m: common_vendor.o(($event) => $options.toOrderList("shipping")),
    n: common_vendor.o(($event) => $options.toOrderList("completed")),
    o: common_vendor.o((...args) => $options.toAddressList && $options.toAddressList(...args)),
    p: common_vendor.o((...args) => $options.toCustomService && $options.toCustomService(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-99b0ba47"]]);
wx.createPage(MiniProgramPage);
