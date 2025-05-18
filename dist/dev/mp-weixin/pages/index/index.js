"use strict";
const common_vendor = require("../../common/vendor.js");
const api_login = require("../../api/login.js");
const api_category = require("../../api/category.js");
const api_product = require("../../api/product.js");
const store_index = require("../../store/index.js");
const SearchBar = () => "../../components/search-bar/index.js";
const ProductCard = () => "../../components/product-card/index.js";
const _sfc_main = {
  components: {
    SearchBar,
    ProductCard
  },
  mounted() {
    api_login.startup().then((res) => {
      this.categoryList = res.high_light_categories.slice(0, 4).map(api_category.newCategory);
      this.productList = res.recommend_products.map(api_product.newProduct);
    });
  },
  data() {
    return {
      // bannerList: [
      //   {
      //     image: '/static/images/banner/banner1.jpg',
      //     title: '精选面料',
      //     subtitle: '臻选优质面料，专业定制体验'
      //   },
      //   {
      //     image: '/static/images/banner/banner2.jpg',
      //     title: '新品上市',
      //     subtitle: '2024春季新品系列'
      //   },
      //   {
      //     image: '/static/images/banner/banner3.jpg',
      //     title: '会员专享',
      //     subtitle: '新人首单立减100元'
      //   }
      // ],
      categoryList: [],
      productList: []
      // searchKeyword: '',
      // showSearchResults: false,
      // searchResults: []
    };
  },
  methods: {
    // handleSearch(keyword) {
    //   this.searchKeyword = keyword;
    //   // Navigate to category page with search tag
    //   uni.switchTab({
    //     url: `/pages/category/category?search=${encodeURIComponent(keyword)}`,
    //     success: () => {
    //       console.log('Successfully navigated to category page with search tag')
    //     },
    //     fail: (err) => {
    //       console.error('Navigation failed:', err)
    //     }
    //   })
    // },
    handleCategoryClick(category) {
      console.log("Navigating to category:", category.name, "with ID:", category.categoryId);
      store_index.GlobalData.set_redirect_id(category.id);
      common_vendor.index.switchTab({
        url: `/pages/category/category`,
        success: () => {
          console.log("Successfully navigated to category page");
        },
        fail: (err) => {
          console.error("Navigation failed:", err);
        }
      });
    },
    handleProductClick(product) {
      common_vendor.index.navigateTo({
        url: `/pages/product/detail?id=${product.id}`
      });
    },
    handleViewMore() {
      common_vendor.index.switchTab({
        url: "/pages/product/list"
      });
    },
    onPullDownRefresh() {
      setTimeout(() => {
        common_vendor.index.stopPullDownRefresh();
      }, 1e3);
    }
  }
};
if (!Array) {
  const _component_ProductCard = common_vendor.resolveComponent("ProductCard");
  _component_ProductCard();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.categoryList, (item, index, i0) => {
      return {
        a: item.icon,
        b: common_vendor.t(item.name),
        c: index,
        d: common_vendor.o(($event) => $options.handleCategoryClick(item), index)
      };
    }),
    b: common_vendor.o((...args) => $options.handleViewMore && $options.handleViewMore(...args)),
    c: common_vendor.f($data.productList, (product, index, i0) => {
      return {
        a: "83a5a03c-0-" + i0,
        b: common_vendor.p({
          product
        }),
        c: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-83a5a03c"]]);
wx.createPage(MiniProgramPage);
