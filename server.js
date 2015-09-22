// import modules
var http = require('http')
var path = require('path')
var express = require('express')
var socketio = require('socket.io')

// init app
var app = express()
var server = http.createServer(app)
var port = 3000

// serve static
app.use('/', express.static(path.join(__dirname, './static')))

// server listen
server.listen(port, function () {
  console.log('Server is listening to port ' + port)
})

// socket io bind
var io = socketio.listen(server)
io.on('connection', function (socket) {
  console.log('user connected')
  // register custom events when connected
  socket.on('chat', function (msg) {
    console.log(msg)
    io.emit('chat', msg)
  })

  // disconnect event
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})
