var fp = require('path')
var url = require('url')
// var baseOrigin = '10.10.73.208:1339'
var baseOrigin = 'localhost:1339'


function combine(base) {
  return function (path) {
    return url.format({
      protocol: 'http',
      host: baseOrigin,
      pathname: path
    })
  }
}

var combineUrl = combine(baseOrigin)

module.exports = {
  LOGIN_API_URL: combineUrl('/user/login'),
  LOGOUT_API_URL: combineUrl('/user/logout'),
  AUTH_API_URL: combineUrl('/user/isauth'),
  REST_API_URL: combineUrl('/rest')
}
