var router = require('express').Router()

router.post('/task', function (req, res) {
  res.json({ success: true })
})

module.exports = router
