"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "SearchBar",
  props: {
    placeholder: {
      type: String,
      default: "搜索商品"
    },
    showTags: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchText: "",
      searchHistory: []
    };
  },
  created() {
    this.loadSearchHistory();
  },
  methods: {
    handleSearch() {
      this.searchText = this.searchText.trim();
      if (this.searchText) {
        this.addToHistory(this.searchText);
      }
      this.$emit("search", this.searchText);
    },
    selectTag(tag) {
      this.searchText = tag;
      this.handleSearch();
    },
    addToHistory(keyword) {
      this.searchHistory = this.searchHistory.filter((item) => item !== keyword);
      this.searchHistory.unshift(keyword);
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10);
      }
      common_vendor.index.setStorageSync("searchHistory", this.searchHistory);
    },
    clearHistory() {
      this.searchHistory = [];
      common_vendor.index.removeStorageSync("searchHistory");
    },
    loadSearchHistory() {
      this.searchHistory = common_vendor.index.getStorageSync("searchHistory") || [];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.placeholder,
    b: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    c: $data.searchText,
    d: common_vendor.o(($event) => $data.searchText = $event.detail.value),
    e: $props.showTags && $data.searchHistory.length > 0
  }, $props.showTags && $data.searchHistory.length > 0 ? {
    f: common_vendor.o((...args) => $options.clearHistory && $options.clearHistory(...args)),
    g: common_vendor.f($data.searchHistory, (tag, index, i0) => {
      return {
        a: common_vendor.t(tag),
        b: index,
        c: common_vendor.o(($event) => $options.selectTag(tag), index)
      };
    })
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-29e1e77c"]]);
wx.createComponent(Component);
