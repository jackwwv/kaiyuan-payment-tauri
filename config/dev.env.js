/*
 * @Author: hua
 * @Date: 2019-04-26 19:59:52
 * @LastEditors: hua
 * @LastEditTime: 2020-08-27 21:28:09
 */
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_CLIENT_SOCKET: '"http://107.174.137.176:85"',
  VUE_APP_CLIENT_API:'"http://107.174.137.176:5000"',  
  // VUE_APP_CLIENT_SOCKET: '"https://api.hcgzzx.com"',
  // VUE_APP_CLIENT_API:'"https://api.hcgzzx.com"',
  VUE_APP_PUBLIC_KEY: `"-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDOaQO5ImLVJwdyDYx4c/QdOKbgB0bV5k/4n9UQej0RhegR8PAfy9bSTagR/2hxSsE5vaE4YjYGtSmFrsWfoUyQHbcJGIfSUUYkcE2OMq4mmENk5KbrUemWdFEIp0k/Y7DlPMAGUdt2YeRakY1gzUI9kyZOcuA0ZP6vzwe8wnFtMwIDAQAB-----END PUBLIC KEY-----"`,
  PATH_INDEX_PIC: '"http://107.174.137.176:85"',
});
