var socketIO = require('socket.io')

module.exports = function (server) {
  var io = socketIO(server)
  var canSync = true, ltr

  io.on('connection', function (socket) {
    console.log('user connected')
    socket.on('chat', function (msg) {
      socket.broadcast.emit('chat', msg)
    })
    socket.on('disconnected', function () {
      console.log('user disconnected')
    })

    socket.on('syncTask', function (task) {
      socket.broadcast.emit('syncTask', task)

      // if (!ltr) {
      //   ltr = setTimeout(() => {
      //     // do sync
      //
      //     ltr = (void 0)
      //   }, 500)
      // }

    })

    socket.on('addTask', function (task) {
      socket.broadcast.emit('addTask', task)
    })

    socket.on('error', function () {

    })
  })
}
