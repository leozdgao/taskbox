var router = require('express').Router()
var bodyParser = require('body-parser')

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

module.exports = router
