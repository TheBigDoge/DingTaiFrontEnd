"use strict";
const utils_http = require("../utils/http.js");
function newPremiumStatus(r) {
  return {
    active: r.active,
    start_date: r.start_date ? new Date(r.start_date) : void 0,
    end_date: r.end_date ? new Date(r.end_date) : void 0
  };
}
async function getPremiumStatus() {
  return utils_http.http.get("/api/v1/premium");
}
exports.getPremiumStatus = getPremiumStatus;
exports.newPremiumStatus = newPremiumStatus;
