var path = require('path')
var express = require('express')
var app = express()
var server = require('http').createServer(app)

var __IS_DEV__ = process.env['NODE_ENV'] === 'production'

if (__IS_DEV__) {

  var webpack = require('webpack')
  var config = require('../webpack.config')
  var compiler = webpack(config)

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  }))

  app.use(require('webpack-hot-middleware')(compiler))
}

app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use('/assets', express.static(path.join(__dirname, 'assets')))

// mock api
app.use('/api', require('./api'))

app.get('/login', function (req, res) {
  res.render('login')
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

server.listen(3000, 'localhost', function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://localhost:3000')
})

require('./socket')(server)
