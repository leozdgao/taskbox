var router = require('express').Router()
var bodyParser = require('body-parser')
var request = require('request')
var contants = require('./constants')

router.get('/', function (req, res) {
  res.render('login')
})

router.use(bodyParser.json())

router.post('/', function (req, res) {
  var proxy = request.post(contants.LOGIN_API_URL, { body: req.body, json: true, timeout: 5000 })
  proxy.pipe(res)

  proxy.on('error', function () {
    res.status(500).json({ error: 1 })
  })
})

module.exports = router
