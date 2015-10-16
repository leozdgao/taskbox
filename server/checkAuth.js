var request = require('request')
var constants = require('./constants')

module.exports = function (token) {
  return function (resolve, reject) {
    var url = constants.AUTH_API_URL + '?token=' + (token || '')
    request.get(url, { timeout: 5000, json: true }, function (e, r, body) {
      var isAuthed = !!body.ok
      console.log(isAuthed);
      if (e || !isAuthed) reject()
      else resolve(body)
    })
  }
}
