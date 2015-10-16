var router = require('express').Router()
var bodyParser = require('body-parser')
var contants = require('./constants')

router.use(bodyParser.json())

router.post('/task', function (req, res) {
  setTimeout(function () {
    res.json({ success: true })
  }, 2000)
})

router.post('/check', function (req, res) {
  setTimeout(function () {
    res.json({ isValid: req.body.user !== 'leozdgao' })
  }, 1000)
})

router.get('/logout', function (req, res) {
  var url = contants.LOGOUT_API_URL + '?token=' + req.cookies.token
  var proxy = request.get(url, { json: true, timeout: 5000 })
  proxy.pipe(res)

  proxy.on('error', function () {
    res.status(500).json({ error: 1 })
  })
})

module.exports = router
