var socketIO = require('socket.io')

module.exports = function (server) {
  var io = socketIO(server)

  io.on('connection', function (socket) {
    console.log('user connected')
    socket.on('chat', function (msg) {
      socket.broadcast.emit('chat', msg)
    })
    socket.on('disconnected', function () {
      console.log('user disconnected')
    })

    socket.on('syncTask', function (task) {console.log('sync task');
      socket.broadcast.emit('syncTask', task)
    })

    socket.on('error', function () {
      
    })
  })
}
