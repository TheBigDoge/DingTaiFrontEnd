"use strict";
const common_vendor = require("../common/vendor.js");
const utils_auth = require("./auth.js");
function newResponse(raw) {
  return {
    ...raw.data,
    raw
  };
}
function handleError(err) {
  console.error("HTTP request error:", err);
  if (err == null ? void 0 : err.message) {
    common_vendor.index.showToast({
      title: `错误: ${err == null ? void 0 : err.message}`,
      icon: "none"
    });
  }
}
function buildQueryString(queries) {
  if (!queries)
    return "";
  const params = /* @__PURE__ */ new Map();
  for (const [key, value] of Object.entries(queries)) {
    if (value !== void 0) {
      params.set(key, value.toString());
    }
  }
  const kv = [];
  for (const [key, value] of params) {
    kv.push(`${key}=${encodeURI(value)}`);
  }
  return kv ? `?${kv.join("&")}` : "";
}
function request(config) {
  return new Promise((resolve, reject) => {
    const token = utils_auth.getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      ...config.header || {},
      ...token ? { Authorization: `Bearer ${token}` } : {}
    };
    common_vendor.index.request({
      url: "https://test-api.dtszdz.com" + config.url,
      method: config.method,
      data: config.data,
      header: headers,
      timeout: config.timeout ?? 15e3,
      success: (res) => {
        const { statusCode, data } = res;
        if (statusCode === 200 && data) {
          resolve(newResponse(data));
        } else {
          const error = {
            message: (data == null ? void 0 : data.message) || `HTTP status ${statusCode}`,
            statusCode,
            code: (data == null ? void 0 : data.code) || "unknown",
            data
          };
          handleError(error);
          reject(error);
        }
      },
      fail: (err) => {
        handleError(err);
        reject(err);
      }
    });
  });
}
async function get(url, queries) {
  const finalUrl = url + buildQueryString(queries);
  return request({
    url: finalUrl,
    method: "GET"
  });
}
async function post(url, payload) {
  return request({
    url,
    method: "POST",
    data: payload
  });
}
async function put(url, payload) {
  return request({
    url,
    method: "PUT",
    data: payload
  });
}
async function del(url) {
  return request({
    url,
    method: "DELETE"
  });
}
const http = {
  get,
  post,
  put,
  delete: del
};
exports.http = http;
