"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      orderData: null,
      address: {
        name: "",
        phone: "",
        province: "",
        city: "",
        district: "",
        detail: "",
        isDefault: false
      },
      orderItems: [],
      deliveryMethod: "快递配送",
      orderNote: "",
      shippingFee: 0
    };
  },
  computed: {
    totalAmount() {
      return this.orderItems.reduce((total, item) => {
        return total + item.unitPrice * item.length;
      }, 0);
    },
    discount() {
      return this.totalAmount * 0.2;
    },
    finalAmount() {
      return this.totalAmount - this.discount + this.shippingFee;
    }
  },
  onLoad(options) {
    this.loadDefaultAddress();
    this.loadOrderItems();
  },
  onShow() {
    this.loadDefaultAddress();
  },
  onHide() {
    common_vendor.index.$off("addressSelected");
  },
  methods: {
    loadDefaultAddress() {
      let selectedAddress = common_vendor.index.getStorageSync("selectedAddress");
      if (selectedAddress) {
        this.address = selectedAddress;
        return;
      }
      const addressList = common_vendor.index.getStorageSync("addressList") || [];
      const defaultAddress = addressList.find((addr) => addr.isDefault);
      if (defaultAddress) {
        this.address = defaultAddress;
        return;
      }
      if (addressList.length > 0) {
        this.address = addressList[0];
      }
    },
    loadOrderItems() {
      try {
        const orderData = common_vendor.index.getStorageSync("currentOrder");
        if (orderData) {
          this.orderItems = orderData.items;
        }
      } catch (e) {
        console.error("加载订单数据失败:", e);
        common_vendor.index.showToast({
          title: "加载订单失败",
          icon: "error"
        });
      }
    },
    changeAddress() {
      common_vendor.index.navigateTo({
        url: "/pages/address/address",
        success: () => {
          console.log("Navigation to address page successful");
        },
        fail: (err) => {
          console.error("Navigation to address page failed:", err);
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "error"
          });
        }
      });
    },
    updateQuantity(index, change) {
      const item = this.orderItems[index];
      if (item.isWholePiece)
        return;
      const newLength = parseFloat((item.length + change).toFixed(1));
      if (newLength >= 0.85) {
        item.length = newLength;
      }
    },
    toggleWholePiece(index) {
      const item = this.orderItems[index];
      item.isWholePiece = !item.isWholePiece;
      if (item.isWholePiece) {
        item.length = 10;
      } else {
        item.length = 2;
      }
    },
    selectDelivery(method) {
      this.deliveryMethod = method;
    },
    submitOrder() {
      if (!this.address.name || !this.address.phone || !this.address.detail) {
        common_vendor.index.showToast({
          title: "请选择收货地址",
          icon: "none"
        });
        return;
      }
      if (this.orderItems.length === 0) {
        common_vendor.index.showToast({
          title: "请选择商品",
          icon: "none"
        });
        return;
      }
      ({
        items: this.orderItems,
        receiver: this.address,
        note: this.orderNote,
        deliveryMethod: this.deliveryMethod,
        totalAmount: this.totalAmount,
        discount: this.discount,
        finalAmount: this.finalAmount,
        orderTime: (/* @__PURE__ */ new Date()).toISOString()
      });
      common_vendor.index.showLoading({
        title: "提交中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "下单成功",
          icon: "success",
          duration: 2e3,
          success: () => {
            setTimeout(() => {
              this.handleSubmitOrder();
            }, 1500);
          }
        });
      }, 1500);
    },
    handleSubmitOrder() {
      common_vendor.index.showLoading({
        title: "提交订单中..."
      });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        const cartList = common_vendor.index.getStorageSync("cartList") || [];
        const currentOrder = common_vendor.index.getStorageSync("currentOrder");
        const orderItemIds = currentOrder.items.map((item) => item.id);
        const updatedCartList = cartList.filter((item) => !orderItemIds.includes(item.id));
        common_vendor.index.setStorageSync("cartList", updatedCartList);
        const orderData = {
          orderNo: "DT" + (/* @__PURE__ */ new Date()).getTime(),
          status: "pending",
          items: currentOrder.items,
          totalAmount: this.totalAmount,
          discount: this.discount,
          shippingFee: this.shippingFee,
          finalAmount: this.finalAmount,
          orderTime: (/* @__PURE__ */ new Date()).toISOString()
        };
        const orderList = common_vendor.index.getStorageSync("orderList") || [];
        orderList.unshift(orderData);
        common_vendor.index.setStorageSync("orderList", orderList);
        common_vendor.index.removeStorageSync("currentOrder");
        common_vendor.index.redirectTo({
          url: `/pages/order/success?orderNo=${orderData.orderNo}`
        });
      }, 1500);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.address.name
  }, $data.address.name ? {
    b: common_vendor.t($data.address.name),
    c: common_vendor.t($data.address.phone),
    d: common_vendor.t($data.address.province),
    e: common_vendor.t($data.address.city),
    f: common_vendor.t($data.address.district),
    g: common_vendor.t($data.address.detail)
  } : {}, {
    h: common_vendor.o((...args) => $options.changeAddress && $options.changeAddress(...args)),
    i: common_vendor.f($data.orderItems, (item, index, i0) => {
      return {
        a: item.image,
        b: common_vendor.t(item.name),
        c: common_vendor.t((item.unitPrice * 0.9).toFixed(2)),
        d: common_vendor.t(item.unitPrice.toFixed(2)),
        e: common_vendor.t(item.length),
        f: common_vendor.o(($event) => $options.updateQuantity(index, -0.1), index),
        g: item.isWholePiece ? 1 : "",
        h: common_vendor.t(item.length),
        i: common_vendor.o(($event) => $options.updateQuantity(index, 0.1), index),
        j: item.isWholePiece ? 1 : "",
        k: item.isWholePiece ? 1 : "",
        l: item.isWholePiece ? 1 : "",
        m: common_vendor.o(($event) => $options.toggleWholePiece(index), index),
        n: index
      };
    }),
    j: $data.deliveryMethod === "快递配送" ? 1 : "",
    k: common_vendor.o(($event) => $options.selectDelivery("快递配送")),
    l: $data.deliveryMethod === "到店自提" ? 1 : "",
    m: common_vendor.o(($event) => $options.selectDelivery("到店自提")),
    n: $data.orderNote,
    o: common_vendor.o(($event) => $data.orderNote = $event.detail.value),
    p: common_vendor.t($data.orderNote.length),
    q: common_vendor.t($options.totalAmount.toFixed(2)),
    r: common_vendor.t($data.shippingFee.toFixed(2)),
    s: common_vendor.t($options.discount.toFixed(2)),
    t: common_vendor.t($options.finalAmount.toFixed(2)),
    v: !$data.address.name ? 1 : "",
    w: common_vendor.o((...args) => $options.submitOrder && $options.submitOrder(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-88bf5328"]]);
wx.createPage(MiniProgramPage);
