"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      addressList: []
    };
  },
  onShow() {
    this.loadAddressList();
  },
  methods: {
    loadAddressList() {
      console.log("trying to load address list");
      api_address.listAddresses().then((addresses) => {
        this.addressList = addresses.results.map(api_address.newAddress);
      });
    },
    addAddress() {
      console.log("trying to goto add_address");
      common_vendor.index.navigateTo({
        url: "/pages/address/edit"
      });
    },
    editAddress(index) {
      console.log("trying to goto edit_address", this.addressList[index]);
      common_vendor.index.navigateTo({
        url: `/pages/address/edit?id=${this.addressList[index].id}`
      });
    },
    deleteAddress(index) {
      console.log(`trying to delete address at ${index}`);
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该地址吗？",
        success: (res) => {
          if (res.confirm) {
            const address = this.addressList[index];
            api_address.deleteAddress(address.id).then(() => this.loadAddressList());
          }
        }
      });
    },
    setDefault(index) {
      const address = this.addressList[index];
      if (address.isDefault) {
        return;
      }
      console.log(`trying to set default to address at index ${index}`);
      for (const address2 of this.addressList) {
        address2.isDefault = false;
      }
      address.isDefault = true;
      api_address.updateAddress(address).then(() => this.loadAddressList());
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.addressList.length > 0
  }, $data.addressList.length > 0 ? {
    b: common_vendor.f($data.addressList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.phone),
        c: item.isDefault
      }, item.isDefault ? {} : {}, {
        d: common_vendor.f(item.tags, (tag, index2, i1) => {
          return {
            a: common_vendor.t(tag),
            b: index2
          };
        }),
        e: common_vendor.t(item.province),
        f: common_vendor.t(item.city),
        g: common_vendor.t(item.district),
        h: common_vendor.t(item.address),
        i: common_vendor.n(item.isDefault ? "icon-check" : "icon-circle"),
        j: common_vendor.t(item.isDefault ? "本地址为默认地址" : "设为默认地址"),
        k: common_vendor.o(($event) => $options.setDefault(index), index),
        l: common_vendor.o(($event) => $options.editAddress(index), index),
        m: common_vendor.o(($event) => $options.deleteAddress(index), index),
        n: index
      });
    })
  } : {
    c: common_assets._imports_0$1
  }, {
    d: common_vendor.o((...args) => $options.addAddress && $options.addAddress(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2312e3da"]]);
wx.createPage(MiniProgramPage);
