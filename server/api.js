var router = require('express').Router()
var bodyParser = require('body-parser')
var contants = require('./constants')

router.use(bodyParser.json())

router.get('/logout', function (req, res) {
  var url = contants.LOGOUT_API_URL + '?token=' + req.cookies.token
  var proxy = request.get(url, { json: true, timeout: 5000 })
  proxy.pipe(res)

  proxy.on('error', function () {
    res.status(500).json({ error: 1 })
  })
})

// test, remove lately
router.get('/task', function (req, res) {
  const tasks = [
    {
      id: '0', title: 'task name', assignee: [ 20, 21 ],
      sealed: false,
      description: 'new project',
      checklist: {
        dev: {
          a: 0,
          b: 1,
          c: 0
        },
        test: {
          aa: 0,
          bb: 1
        }
      },
      activities: [],
      tags: []
    },
    {
      id: '1', title: 'task name', assignee: [ 23, 21 ],
      checklist: {}
    }
  ]

  setTimeout(function () {
    res.json(tasks)
  }, 1000)
})

router.post('/check', function (req, res) {
  setTimeout(function () {
    res.json({ isValid: req.body.user !== 'leozdgao' })
  }, 1000)
})

module.exports = router
