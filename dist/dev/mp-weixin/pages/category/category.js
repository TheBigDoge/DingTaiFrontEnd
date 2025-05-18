"use strict";
const api_product = require("../../api/product.js");
const api_category = require("../../api/category.js");
const store_index = require("../../store/index.js");
const common_vendor = require("../../common/vendor.js");
const SearchBar = () => "../../components/search-bar/index.js";
const ProductCard = () => "../../components/product-card/index.js";
const _sfc_main = {
  components: {
    SearchBar,
    ProductCard
  },
  data() {
    return {
      filterTabs: [
        { name: "综合", type: api_product.ProductListSorting.General },
        { name: "价格", type: api_product.ProductListSorting.Price },
        { name: "销量", type: api_product.ProductListSorting.Sell },
        { name: "推荐", type: api_product.ProductListSorting.Recommend }
      ],
      activeTabIndex: 0,
      categoryList: [],
      activeCategoryIndex: 0,
      productList: {},
      // cateogry id to products
      keyword: "",
      fetch_done: false
    };
  },
  onLoad(options) {
    if (options == null ? void 0 : options.search) {
      this.keyword = decodeURIComponent(options.search);
    }
  },
  onShow() {
    this.fetchProductList();
  },
  methods: {
    fetchProductList(force) {
      if (!this.fetch_done || !this.productList || force) {
        api_product.GetProducts(this.keyword, this.filterTabs[this.activeTabIndex].type).then((response) => {
          console.log("products", response);
          this.parseResponse(response.data);
          this.trySwitchToStoreCategory();
        });
        this.fetch_done = true;
      } else {
        this.trySwitchToStoreCategory();
      }
    },
    trySwitchToStoreCategory() {
      const redirectId = store_index.GlobalData.get_redirect_id();
      if (redirectId) {
        console.log("trying to redirect to id", redirectId);
        for (const idx in this.categoryList) {
          console.log(this.categoryList[idx]);
          if (this.categoryList[idx].id === redirectId) {
            console.log("matched");
            this.activeCategoryIndex = parseInt(idx) || 0;
            break;
          }
        }
      }
    },
    parseResponse(data) {
      this.categoryList = data.map((item) => {
        return api_category.newCategory(item.category);
      });
      if (this.activeCategoryIndex < 0 || this.activeCategoryIndex >= this.categoryList.length) {
        this.activeCategoryIndex = 0;
      }
      const newList = {};
      for (const { category, products } of data) {
        const productList = products.map(api_product.newProduct);
        newList[category.id] = productList;
      }
      console.log(newList);
      this.productList = newList;
    },
    handleSearch(keyword) {
      if (this.keyword !== keyword) {
        this.keyword = keyword;
        this.fetchProductList(true);
      }
    },
    handleTabClick(index) {
      console.log("click index", index);
      console.log("current", this.activeTabIndex);
      if (this.activeTabIndex === index) {
        return;
      }
      this.activeTabIndex = index;
      this.fetchProductList(true);
    },
    handleCategoryClick(index) {
      if (this.activeCategoryIndex === index) {
        return;
      }
      this.activeCategoryIndex = index;
      this.fetchProductList(true);
    }
  }
};
if (!Array) {
  const _component_search_bar = common_vendor.resolveComponent("search-bar");
  const _component_product_card = common_vendor.resolveComponent("product-card");
  (_component_search_bar + _component_product_card)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a;
  return {
    a: common_vendor.o($options.handleSearch),
    b: common_vendor.p({
      placeholder: "搜索面料"
    }),
    c: common_vendor.f($data.filterTabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab.name),
        b: tab.type,
        c: $data.activeTabIndex === index ? 1 : "",
        d: common_vendor.o(($event) => $options.handleTabClick(index), tab.type)
      };
    }),
    d: common_vendor.f($data.categoryList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: $data.activeCategoryIndex === index ? 1 : "",
        d: common_vendor.o(($event) => $options.handleCategoryClick(index), index)
      };
    }),
    e: common_vendor.f($data.productList[(_a = $data.categoryList[$data.activeCategoryIndex]) == null ? void 0 : _a.id], (item, index, i0) => {
      return {
        a: "4046d630-1-" + i0,
        b: common_vendor.p({
          product: item
        }),
        c: `c${$data.categoryList[$data.activeCategoryIndex].id}p${item.id}i${index}`
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4046d630"]]);
wx.createPage(MiniProgramPage);
