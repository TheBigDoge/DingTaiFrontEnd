"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const _sfc_main = {
  data() {
    return {
      address: {
        id: 0,
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        address: "",
        isDefault: false,
        tags: []
      }
    };
  },
  onLoad(options) {
    console.log("onload, opts", options);
    if (options == null ? void 0 : options.id) {
      this.address.id = parseInt(options.id);
      this.loadAddress();
    }
  },
  methods: {
    loadAddress() {
      if (this.address.id) {
        api_address.listAddresses().then((result) => result.results).then((addresses) => addresses.filter((addr) => addr.id === this.address.id)).then((addresses) => {
          if (addresses) {
            const first = api_address.newAddress(addresses[0]);
            this.address = first;
          } else {
            this.address.id = 0;
          }
        });
      }
    },
    handleRegionChange(e) {
      const [province, city, district] = e.detail.value;
      this.address.province = province;
      this.address.city = city;
      this.address.district = district;
    },
    handleDefaultChange(e) {
      this.address.isDefault = e.detail.value;
    },
    validateForm() {
      if (!this.address.name) {
        common_vendor.index.showToast({
          title: "请输入收货人姓名",
          icon: "none"
        });
        return false;
      }
      if (!this.address.phone || !/^1\d{10}$/.test(this.address.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号码",
          icon: "none"
        });
        return false;
      }
      if (!this.address.province || !this.address.city || !this.address.district) {
        common_vendor.index.showToast({
          title: "请选择所在地区",
          icon: "none"
        });
        return false;
      }
      if (!this.address.address) {
        common_vendor.index.showToast({
          title: "请输入详细地址",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    saveAddress() {
      if (!this.validateForm())
        return;
      if (this.address.id) {
        api_address.updateAddress(this.address).then(() => common_vendor.index.navigateBack());
      } else {
        api_address.createAddress(this.address).then(() => common_vendor.index.navigateBack());
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.address.id ? "编辑地址" : "新增地址"),
    b: $data.address.name,
    c: common_vendor.o(($event) => $data.address.name = $event.detail.value),
    d: $data.address.phone,
    e: common_vendor.o(($event) => $data.address.phone = $event.detail.value),
    f: $data.address.province || $data.address.city || $data.address.district
  }, $data.address.province || $data.address.city || $data.address.district ? {
    g: common_vendor.t($data.address.province),
    h: common_vendor.t($data.address.city),
    i: common_vendor.t($data.address.district)
  } : {}, {
    j: common_vendor.o((...args) => $options.handleRegionChange && $options.handleRegionChange(...args)),
    k: [$data.address.province, $data.address.city, $data.address.district],
    l: $data.address.address,
    m: common_vendor.o(($event) => $data.address.address = $event.detail.value),
    n: $data.address.isDefault,
    o: common_vendor.o((...args) => $options.handleDefaultChange && $options.handleDefaultChange(...args)),
    p: common_vendor.o((...args) => $options.saveAddress && $options.saveAddress(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-24ed4d92"]]);
wx.createPage(MiniProgramPage);
