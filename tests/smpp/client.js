var io = require('socket.io').listen(9501);
// var socket = io.onconnection('http://127.0.0.1');

io.emit('join', {
    email: '6785754166@vtext.com'
});

io.on('new_msg', (data) => {
    alert(data.msg);
});