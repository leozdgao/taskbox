var request = require('request')
var constants = require('./constants')

// var body = { ok: 1, user: { role: 1, name: 'Leo Gao', resourceId: 21 } }

module.exports = function (token) {
  return function (resolve, reject) {
    var url = constants.AUTH_API_URL + '?token=' + (token || '')
    request.get(url, { timeout: 5000, json: true }, function (e, r, body) {
      var isAuthed = !!(body && body.ok)

      if (e || !isAuthed) reject()
      else resolve(body)
    })

    // resolve(body)
    // reject()
  }
}
