"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const api_premium = require("../api/premium.js");
const api_user = require("../api/user.js");
class Once {
  constructor() {
    __publicField(this, "data");
    this.data = null;
  }
  set(val) {
    this.data = val;
  }
  get() {
    const val = this.data;
    this.set(null);
    return val;
  }
}
class GlobalDataS {
  constructor() {
    __publicField(this, "user", null);
    __publicField(this, "redirect_id", new Once());
    __publicField(this, "premium_status", null);
  }
  get_user() {
    return this.user;
  }
  set_user(user) {
    this.user = user;
  }
  get_redirect_id() {
    return this.redirect_id.get();
  }
  set_redirect_id(id) {
    this.redirect_id.set(id);
  }
  get_premium_status() {
    return this.premium_status;
  }
  set_premium_status(status) {
    this.premium_status = status;
  }
  is_premium() {
    var _a;
    return ((_a = this.premium_status) == null ? void 0 : _a.active) || false;
  }
  async fetchPremiumStatus() {
    const statusResponse = await api_premium.getPremiumStatus();
    const status = api_premium.newPremiumStatus(statusResponse);
    this.set_premium_status(status);
    return status;
  }
  async fetchUser() {
    const currentUser = this.get_user();
    if (currentUser) {
      return currentUser;
    }
    const userResponse = await api_user.fetchUserInfo();
    const user = api_user.newUser(userResponse);
    this.set_user(user);
    return user;
  }
}
const GlobalData = new GlobalDataS();
exports.GlobalData = GlobalData;
