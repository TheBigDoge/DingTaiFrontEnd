"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      benefits: [
        {
          icon: "/static/images/benefit-discount.png",
          name: "会员折扣",
          description: "享受商品专属折扣"
        },
        {
          icon: "/static/images/benefit-points.png",
          name: "积分加速",
          description: "消费获得更多积分"
        },
        {
          icon: "/static/images/benefit-service.png",
          name: "专属客服",
          description: "享受优先客服服务"
        }
      ],
      levels: [
        {
          name: "普通会员",
          condition: "注册即可成为普通会员"
        },
        {
          name: "银卡会员",
          condition: "累计消费满1000元"
        },
        {
          name: "金卡会员",
          condition: "累计消费满5000元"
        },
        {
          name: "钻石会员",
          condition: "累计消费满20000元"
        }
      ]
    };
  },
  onLoad() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo) {
        this.userInfo = userInfo;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.userInfo.avatar || "/static/images/default-avatar.png",
    b: common_vendor.t($data.userInfo.nickname || "未登录"),
    c: common_vendor.t($data.userInfo.memberLevel || "普通会员"),
    d: common_vendor.f($data.benefits, (benefit, index, i0) => {
      return {
        a: benefit.icon,
        b: common_vendor.t(benefit.name),
        c: common_vendor.t(benefit.description),
        d: index
      };
    }),
    e: common_vendor.f($data.levels, (level, index, i0) => {
      return {
        a: common_vendor.t(level.name),
        b: common_vendor.t(level.condition),
        c: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-859c24b9"]]);
wx.createPage(MiniProgramPage);
