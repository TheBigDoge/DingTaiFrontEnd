"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      currentFilter: "all",
      orderList: [],
      allOrders: [],
      // Store all orders for filtering
      loading: false,
      noMore: false
    };
  },
  onLoad(options) {
    this.loadOrdersFromStorage();
    if (options.type) {
      this.currentFilter = options.type;
      this.filterOrdersByType(options.type);
    }
  },
  onShow() {
    this.loadOrdersFromStorage();
  },
  methods: {
    loadOrdersFromStorage() {
      const orderList = common_vendor.index.getStorageSync("orderList") || [];
      console.log("Loading orders from storage:", orderList);
      this.allOrders = orderList;
      this.orderList = [...orderList];
    },
    initializeSampleOrders() {
      const sampleOrders = [
        {
          orderNo: "DT202403150001",
          status: "pending",
          items: [
            {
              id: 1,
              name: "意大利进口羊毛面料",
              image: "/static/images/products/fabric1.jpg",
              color: "深灰色",
              unitPrice: 150,
              length: 2,
              subtotal: 300
            }
          ],
          totalAmount: 300,
          discount: 30,
          shippingFee: 0,
          finalAmount: 270,
          orderTime: "2024-03-15T10:30:00Z"
        },
        {
          orderNo: "DT202403140002",
          status: "shipping",
          items: [
            {
              id: 2,
              name: "英国进口哈里斯粗花呢面料",
              image: "/static/images/products/fabric2.jpg",
              color: "米色",
              unitPrice: 120,
              length: 3,
              subtotal: 360
            }
          ],
          totalAmount: 360,
          discount: 36,
          shippingFee: 0,
          finalAmount: 324,
          orderTime: "2024-03-14T15:45:00Z"
        },
        {
          orderNo: "DT202403130003",
          status: "completed",
          items: [
            {
              id: 3,
              name: "日本进口棉麻混纺面料",
              image: "/static/images/products/fabric3.jpg",
              color: "浅蓝色",
              unitPrice: 80,
              length: 4,
              subtotal: 320
            }
          ],
          totalAmount: 320,
          discount: 32,
          shippingFee: 0,
          finalAmount: 288,
          orderTime: "2024-03-13T09:20:00Z"
        }
      ];
      common_vendor.index.setStorageSync("orderList", sampleOrders);
      console.log("Sample orders saved to storage:", sampleOrders);
      this.allOrders = sampleOrders;
      this.orderList = [...sampleOrders];
    },
    getStatusText(status) {
      const statusMap = {
        pending: "待发货",
        shipping: "待收货",
        completed: "已完成"
      };
      return statusMap[status] || status;
    },
    getTotalItems(order) {
      return order.items.reduce((total, item) => total + item.length, 0);
    },
    goToOrderDetail(order) {
      common_vendor.index.navigateTo({
        url: `/pages/order/detail?orderNo=${order.orderNo}`
      });
    },
    viewLogistics(order) {
      common_vendor.index.navigateTo({
        url: `/pages/order/logistics?orderNo=${order.orderNo}`
      });
    },
    confirmReceive(order) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确认已收到商品？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "确认收货成功",
              icon: "success"
            });
          }
        }
      });
    },
    deleteOrder(order) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除该订单吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "订单已删除",
              icon: "success"
            });
          }
        }
      });
    },
    filterOrdersByType(type) {
      this.currentFilter = type;
      if (type === "all") {
        this.orderList = [...this.allOrders];
      } else {
        this.orderList = this.allOrders.filter((order) => order.status === type);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentFilter === "shipping" ? 1 : "",
    b: common_vendor.o(($event) => $options.filterOrdersByType("shipping")),
    c: $data.currentFilter === "pending" ? 1 : "",
    d: common_vendor.o(($event) => $options.filterOrdersByType("pending")),
    e: $data.currentFilter === "completed" ? 1 : "",
    f: common_vendor.o(($event) => $options.filterOrdersByType("completed")),
    g: $data.currentFilter === "all" ? 1 : "",
    h: common_vendor.o(($event) => $options.filterOrdersByType("all")),
    i: $data.orderList.length > 0
  }, $data.orderList.length > 0 ? {
    j: common_vendor.f($data.orderList, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.orderNo),
        b: common_vendor.t($options.getStatusText(order.status)),
        c: common_vendor.n(order.status),
        d: common_vendor.f(order.items, (item, itemIndex, i1) => {
          return common_vendor.e({
            a: item.image,
            b: common_vendor.t(item.name),
            c: item.color
          }, item.color ? {
            d: common_vendor.t(item.color)
          } : {}, {
            e: common_vendor.t(item.unitPrice),
            f: common_vendor.t(item.length),
            g: common_vendor.t(item.subtotal),
            h: itemIndex
          });
        }),
        e: common_vendor.o(($event) => $options.goToOrderDetail(order), index),
        f: common_vendor.t($options.getTotalItems(order)),
        g: common_vendor.t(Number(order.finalAmount).toFixed(2)),
        h: order.status === "shipping"
      }, order.status === "shipping" ? {
        i: common_vendor.o(($event) => $options.viewLogistics(order), index),
        j: common_vendor.o(($event) => $options.confirmReceive(order), index)
      } : order.status === "completed" ? {
        l: common_vendor.o(($event) => $options.deleteOrder(order), index)
      } : {}, {
        k: order.status === "completed",
        m: index
      });
    })
  } : {
    k: common_assets._imports_0$2
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6495afaf"]]);
wx.createPage(MiniProgramPage);
