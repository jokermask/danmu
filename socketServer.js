var io = require('socket.io')() ;

io.on('connection',function(socket){
  console.log("socketID: "+socket.id) ;
  var roomId = null ;

  socket.on('message', function (msg) {
    console.log('Message Received: ', msg);
    socket.broadcast.to(roomId).emit('message', msg);
  });

  socket.on('joinRoom',function(data){
    console.log("roomName:"+data) ;
    roomId = data ;
    socket.join(roomId) ;
  });

}) ;

exports.listen = function(server){
  return io.listen(server) ;
}

