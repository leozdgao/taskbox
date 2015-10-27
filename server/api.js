var router = require('express').Router()
var bodyParser = require('body-parser')
var request = require('request')
var qs = require('qs')
var contants = require('./constants')

// proxy to rest server
router.use('/rest', function (req, res) {
  var query = req.url.split('?')[1] || ''
  var url = contants.REST_API_URL + req.path + '?' + query + '&token=' + req.cookies.token || '';
  req.pipe(request(url))
    .on('error', function () {
      res.status(500).json({ error: 1 })
    }).pipe(res)
})

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
// router.get('/task', function (req, res) {
//   const tasks = [
//     {
//       id: '0', title: 'Banc of California - Web Document Transfer to Encompass', assignee: [ 20, 21 ],
//       sealed: false,
//       description: 'New project',
//       checklist: {
//         Development: [
//           { title: 'Check react-router', checked: false },
//           { title: 'Emb processOn to project', checked: true },
//           { title: 'Add socket.io', checked: false }
//         ],
//         Test: [
//           { title: 'Write TestReport and Installation', checked: false },
//           { title: 'Upload test case', checked: true }
//         ]
//       },
//       activities: [],
//       type: 'SOW',
//       tags: []
//     },
//     {
//       id: '1', title: 'Task Box improvement', assignee: [ 23, 21 ],
//       description: 'This Statement of Work ("SOW") supplements, is attached to, and is incorporated into the Encompass Agreement (“Agreement”) by and between Ellie Mae, Inc., a Delaware corporation with principal offices at 4420 Rosewood Drive, Suite 500 Pleasanton CA 94588 (“Ellie Mae”), and Banc of California, N. A. (“Customer”), and describes the work to be per formed by Ellie Mae (”Service”) purchased by Customer.   ',
//       checklist: {}
//     }
//   ]
//
//   setTimeout(function () {
//     res.json(tasks)
//   }, 2000)
// })

router.post('/check', function (req, res) {
  setTimeout(function () {
    res.json({ isValid: req.body.user !== 'leozdgao' })
  }, 1000)
})

module.exports = router
