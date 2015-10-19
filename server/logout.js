var request = require('request')
var constants = require('./constants')

module.exports = function (req, res) {
  var token = req.cookies.token || ''
  var url = constants.LOGOUT_API_URL + '?token=' + (token || '')
  request.get(url, { timeout: 5000, json: true }, function (e, r, body) {
    res.redirect('/')
  })
}
