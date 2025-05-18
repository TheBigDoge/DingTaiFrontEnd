"use strict";
const common_vendor = require("../../common/vendor.js");
const store_index = require("../../store/index.js");
const _sfc_main = {
  name: "ProductCard",
  props: {
    product: {
      type: Object,
      required: true
    },
    onclick: {
      type: Function,
      required: false
    }
  },
  data() {
    return {
      user: store_index.GlobalData.get_user(),
      isPremium: store_index.GlobalData.is_premium()
    };
  },
  methods: {
    handleClick() {
      if (this.onclick) {
        this.onclick(this.product);
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/product/detail?id=${this.product.id}`
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.product.image,
    b: common_vendor.t($props.product.name),
    c: common_vendor.t($props.product.memberPrice),
    d: $data.isPremium
  }, $data.isPremium ? {
    e: common_vendor.t($props.product.price)
  } : {}, {
    f: !$data.isPremium
  }, !$data.isPremium ? {
    g: common_vendor.t($props.product.price)
  } : {}, {
    h: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0ce9e723"]]);
wx.createComponent(Component);
