"use strict";
const common_vendor = require("../../common/vendor.js");
const api_cart = require("../../api/cart.js");
const api_product = require("../../api/product.js");
const store_index = require("../../store/index.js");
const _sfc_main = {
  data() {
    return {
      id: null,
      product: null,
      lengthInput: 0,
      isWholePiece: false
    };
  },
  computed: {
    isPremium() {
      return store_index.GlobalData.is_premium();
    }
  },
  onLoad(options) {
    if (options == null ? void 0 : options.id) {
      this.id = options.id;
      this.loadProductDetail();
    }
  },
  methods: {
    loadProductDetail() {
      if (this.id) {
        api_product.GetProductById(this.id).then(api_product.newProduct).then((product) => {
          this.product = product;
          this.isWholePiece = !this.product.allow_partial_sale;
          this.lengthInput = this.isWholePiece ? this.product.available_stock : this.product.min_order_stock;
        });
      }
    },
    calculateTotalPrice() {
      if (!this.product) {
        return 0;
      }
      if (this.product.vip_only && !this.isPremium) {
        return 0;
      }
      const price = this.isPremium ? this.product.memberPrice : this.product.price;
      const total = parseFloat((price * this.lengthInput).toFixed(2));
      return total;
    },
    totalPriceDisplay() {
      const price = this.calculateTotalPrice();
      if (!price) {
        return "无法购买";
      } else {
        return `¥${price}`;
      }
    },
    decreaseLength() {
      if (this.isWholePiece)
        return;
      if (!this.product)
        return;
      let currentValue = this.lengthInput;
      if (currentValue > this.product.min_order_stock) {
        currentValue = Math.max(this.product.min_order_stock, parseFloat((currentValue - 0.1).toFixed(1)));
        this.lengthInput = currentValue;
      }
    },
    increaseLength() {
      if (this.isWholePiece)
        return;
      if (!this.product)
        return;
      let currentValue = this.lengthInput;
      if (currentValue < this.product.available_stock) {
        currentValue = Math.min(this.product.available_stock, parseFloat((currentValue + 0.1).toFixed(1)));
        this.lengthInput = currentValue;
      }
    },
    validateLength() {
      var _a;
      if (!this.product) {
        common_vendor.index.showToast({ title: "产品不存在" });
        return;
      }
      if (this.isWholePiece) {
        this.lengthInput = (_a = this.product) == null ? void 0 : _a.available_stock;
        return;
      }
      let value = this.lengthInput;
      if (isNaN(value)) {
        value = this.product.min_order_stock;
      }
      value = Math.max(this.product.min_order_stock, Math.min(this.product.available_stock, value));
      value = Math.round(value * 10) / 10;
      this.lengthInput = parseFloat(value.toFixed(1));
    },
    handleAddToCart() {
      if (!this.product) {
        return;
      }
      if (!this.lengthInput) {
        common_vendor.index.showToast({
          title: "请输入长度",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showLoading({ title: "正在加入购物车" });
      const cartItem = {
        product_id: this.product.id,
        is_partial_sale: !this.isWholePiece,
        stock: (this.isWholePiece ? 0 : this.lengthInput) * 100
      };
      api_cart.AddCartItem(cartItem).then(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "加入购物车成功" });
      });
    },
    handleBuyNow() {
      if (!this.lengthInput) {
        common_vendor.index.showToast({
          title: "请输入长度",
          icon: "none"
        });
        return;
      }
    },
    toggleWholePiece() {
      if (!this.product) {
        return;
      }
      if (!this.product.allow_partial_sale) {
        return;
      }
      this.isWholePiece = !this.isWholePiece;
      if (this.isWholePiece) {
        this.lengthInput = parseFloat(this.product.available_stock.toFixed(1));
        common_vendor.index.showToast({
          title: "已设置为整块购买",
          //icon: 'success'
          icon: "none"
        });
      } else {
        this.lengthInput = parseFloat(this.product.min_order_stock.toFixed(1));
        common_vendor.index.showToast({
          title: "已取消整块购买",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
  return common_vendor.e({
    a: common_vendor.f((_a = $data.product) == null ? void 0 : _a.media, (item, index, i0) => {
      return common_vendor.e({
        a: item.type === "image"
      }, item.type === "image" ? {
        b: item.image.url
      } : {}, {
        c: item.type === "video"
      }, item.type === "video" ? {
        d: item.video.url
      } : {}, {
        e: index
      });
    }),
    b: common_vendor.t((_b = $data.product) == null ? void 0 : _b.name),
    c: common_vendor.t((_c = $data.product) == null ? void 0 : _c.number),
    d: (_d = $data.product) == null ? void 0 : _d.vip_only
  }, ((_e = $data.product) == null ? void 0 : _e.vip_only) ? {} : {}, {
    e: (_f = $data.product) == null ? void 0 : _f.vip_only
  }, ((_g = $data.product) == null ? void 0 : _g.vip_only) ? {
    f: common_vendor.t((_h = $data.product) == null ? void 0 : _h.memberPrice)
  } : common_vendor.e({
    g: $options.isPremium
  }, $options.isPremium ? {
    h: common_vendor.t((_i = $data.product) == null ? void 0 : _i.memberPrice),
    i: common_vendor.t((_j = $data.product) == null ? void 0 : _j.price)
  } : {
    j: common_vendor.t((_k = $data.product) == null ? void 0 : _k.price),
    k: common_vendor.t((_l = $data.product) == null ? void 0 : _l.memberPrice)
  }), {
    l: common_vendor.t((_m = $data.product) == null ? void 0 : _m.order_quantity),
    m: !((_n = $data.product) == null ? void 0 : _n.allow_partial_sale)
  }, !((_o = $data.product) == null ? void 0 : _o.allow_partial_sale) ? {} : {}, {
    n: common_vendor.o((...args) => $options.decreaseLength && $options.decreaseLength(...args)),
    o: $data.isWholePiece ? 1 : "",
    p: common_vendor.o((...args) => $options.validateLength && $options.validateLength(...args)),
    q: $data.isWholePiece,
    r: $data.lengthInput,
    s: common_vendor.o(($event) => $data.lengthInput = $event.detail.value),
    t: common_vendor.o((...args) => $options.increaseLength && $options.increaseLength(...args)),
    v: $data.isWholePiece ? 1 : "",
    w: $data.isWholePiece ? 1 : "",
    x: common_vendor.t((_p = $data.product) == null ? void 0 : _p.min_order_stock),
    y: common_vendor.t((_q = $data.product) == null ? void 0 : _q.available_stock),
    z: $data.isWholePiece ? 1 : "",
    A: common_vendor.o((...args) => $options.toggleWholePiece && $options.toggleWholePiece(...args)),
    B: common_vendor.t($options.totalPriceDisplay()),
    C: common_vendor.t((_r = $data.product) == null ? void 0 : _r.description),
    D: common_vendor.o((...args) => $options.handleAddToCart && $options.handleAddToCart(...args)),
    E: common_vendor.o((...args) => $options.handleBuyNow && $options.handleBuyNow(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8216645a"]]);
wx.createPage(MiniProgramPage);
