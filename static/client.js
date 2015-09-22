;(function () {
  // init socket
  var socket = io()
  var input = document.getElementById('m')
  var messages = document.getElementById('messages')
  var form = document.getElementsByTagName('form')[0]
  form.onsubmit = function (e) {
    e.preventDefault()
    
    if (input.value) {
      socket.emit('chat', input.value)
      input.value = ''
    }

    return false
  }
  socket.on('chat', function (msg) {
    var newMessage = document.createElement('li')
    newMessage.textContent = msg
    messages.appendChild(newMessage)
  })
})()
