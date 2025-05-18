"use strict";
function newCategory(cr) {
  var _a;
  return {
    id: cr.id,
    name: cr.name,
    high_light: cr.high_light,
    icon: ((_a = cr.image.image) == null ? void 0 : _a.url) ?? "",
    categoryId: cr.id
  };
}
exports.newCategory = newCategory;
