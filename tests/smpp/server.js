var io = require('socket.io').listen(9500);

io.sockets.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.email);
  });
});

io.sockets.in('6785754166@vtext.com').emit('new_msg', { 
    msg: 'testing'
});