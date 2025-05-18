"use strict";
const common_vendor = require("../../common/vendor.js");
const api_cart = require("../../api/cart.js");
const store_index = require("../../store/index.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      isManageMode: false,
      cartList: [],
      page_size: 10,
      page: 1,
      loading: false,
      has_more: true
    };
  },
  computed: {
    isAllSelected() {
      return this.cartList.length > 0 && this.cartList.every((item) => item.selected);
    },
    selectedCount() {
      return this.cartList.filter((item) => item.selected).length;
    },
    isPremium() {
      return store_index.GlobalData.is_premium();
    }
  },
  onLoad() {
    this.reset();
    this.fetchCartItems();
  },
  onShow() {
    console.log("on show");
    this.reset();
    this.fetchCartItems();
  },
  methods: {
    reset() {
      this.isManageMode = false;
      this.cartList = [];
      this.loading = false;
      this.has_more = true;
      this.page = 1;
    },
    fetchCartItems() {
      if (!this.loading && this.has_more) {
        console.log("fetch cart items");
        this.loading = true;
        api_cart.ListCartItems(this.page, this.page_size).then((response) => {
          console.log(response);
          const list = [];
          for (const item of response.results) {
            const cartItem = api_cart.newCartItem(item);
            list.push({
              ...cartItem,
              selected: false
            });
          }
          if (list.length > 0) {
            console.log("has list", list);
            const newList = [
              ...this.cartList,
              ...list
            ];
            const existsIds = /* @__PURE__ */ new Set();
            const toSet = newList.filter((item) => {
              if (existsIds.has(item.id)) {
                return false;
              }
              existsIds.add(item.id);
              return true;
            });
            console.log("toSet", toSet);
            this.cartList = toSet;
            this.has_more = true;
            this.page += 1;
          } else {
            console.log("no list");
            this.has_more = false;
          }
          this.loading = false;
        });
      }
    },
    totalPrice() {
      const isPremium = this.isPremium;
      return this.cartList.filter((item) => item.selected).map((item) => {
        if (isPremium) {
          return item.product.memberPrice * (item.is_partial_sale ? item.stock : item.product.available_stock);
        } else {
          return item.product.price * (item.is_partial_sale ? item.stock : item.product.available_stock);
        }
      }).reduce((a, b) => a + b, 0);
    },
    toggleSelect(index) {
      this.cartList[index].selected = !this.cartList[index].selected;
    },
    toggleSelectAll() {
      const newStatus = !this.isAllSelected;
      this.cartList.forEach((item) => item.selected = newStatus);
    },
    handleCheckout() {
    },
    goShopping() {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    },
    toggleManageMode() {
      this.isManageMode = !this.isManageMode;
      if (!this.isManageMode) {
        this.cartList.forEach((item) => item.selected = false);
      }
    },
    handleDeleteSelected() {
      const selectedItems = this.cartList.filter((item) => item.selected);
      if (selectedItems.length === 0) {
        common_vendor.index.showToast({
          title: "请选择要删除的商品",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "提示",
        content: `确定要删除选中的${selectedItems.length}件商品吗？`,
        success: (res) => {
          if (res.confirm) {
            const toDeleteItems = this.cartList.filter((item) => item.selected);
            const toDeleteIds = toDeleteItems.map((item) => item.id);
            common_vendor.index.showLoading({ title: "删除中" });
            api_cart.DeleteCartItems(toDeleteIds).then(() => common_vendor.index.hideLoading()).then(() => {
              this.reset();
              return this.fetchCartItems();
            }).then(() => common_vendor.index.showToast({ title: "删除成功" }));
          }
        }
      });
    },
    handleDeleteItem(index) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该商品吗？",
        success: (res) => {
          if (res.confirm) {
            const item = this.cartList[index];
            common_vendor.index.showLoading({ title: "删除中" });
            api_cart.DeleteCartItem(item.id).then(() => common_vendor.index.hideLoading()).then(() => {
              this.reset();
              return this.fetchCartItems();
            }).then(() => common_vendor.index.showToast({ title: "删除成功" }));
          }
        }
      });
    },
    goToProductDetail(productId) {
      if (this.isManageMode) {
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${productId}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.cartList.length > 0
  }, $data.cartList.length > 0 ? {
    b: common_vendor.t($data.cartList.length)
  } : {}, {
    c: common_vendor.t($data.isManageMode ? "退出管理" : "管理"),
    d: common_vendor.o((...args) => $options.toggleManageMode && $options.toggleManageMode(...args)),
    e: $data.cartList.length > 0
  }, $data.cartList.length > 0 ? common_vendor.e({
    f: common_vendor.f($data.cartList, (item, index, i0) => {
      return common_vendor.e({
        a: item.selected,
        b: common_vendor.o(($event) => $options.toggleSelect(index), item.id),
        c: item.product.image,
        d: common_vendor.t(item.product.name),
        e: common_vendor.t(item.is_partial_sale ? item.stock : item.product.available_stock),
        f: !item.is_partial_sale
      }, !item.is_partial_sale ? {} : {}, $options.isPremium ? {
        g: common_vendor.t(item.product.memberPrice.toFixed(2)),
        h: common_vendor.t(item.product.price.toFixed(2))
      } : {
        i: common_vendor.t(item.product.price.toFixed(2)),
        j: common_vendor.t(item.product.memberPrice.toFixed(2))
      }, $data.isManageMode ? {
        k: common_vendor.o(($event) => $options.handleDeleteItem(index), item.id)
      } : {}, {
        l: item.id,
        m: common_vendor.o(($event) => $options.goToProductDetail(item.product_id), item.id)
      });
    }),
    g: $options.isPremium,
    h: $data.isManageMode,
    i: common_vendor.o((...args) => $options.fetchCartItems && $options.fetchCartItems(...args)),
    j: $options.isAllSelected,
    k: common_vendor.o((...args) => $options.toggleSelectAll && $options.toggleSelectAll(...args)),
    l: $data.isManageMode
  }, $data.isManageMode ? {
    m: common_vendor.o((...args) => $options.handleDeleteSelected && $options.handleDeleteSelected(...args))
  } : {
    n: common_vendor.t($options.totalPrice()),
    o: common_vendor.t($options.selectedCount),
    p: common_vendor.o((...args) => $options.handleCheckout && $options.handleCheckout(...args))
  }) : {
    q: common_assets._imports_0,
    r: common_vendor.o((...args) => $options.goShopping && $options.goShopping(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fb6ea9e5"]]);
wx.createPage(MiniProgramPage);
