var router = require('express').Router()

router.post('/task', function (req, res) {
  setTimeout(() => {
    res.json({ success: true })
  }, 2000)
})

router.post('/check', function (req, res) {
  setTimeout(() => {
    res.json({ isValid: req.body.user !== 'leozdgao' })
  }, 1000)
})

module.exports = router
