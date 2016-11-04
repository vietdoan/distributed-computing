var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var clients = [];
var A = [];
var B = [];
var i, j;
var cnt = 0;
for (i = 0; i < 100; i++) {
  let x = [];
  let y = [];
  for (j = 0; j < 100; j++) {
    var v = Math.floor((Math.random() * 100) + 1);
    x.push(v);
    v = Math.floor((Math.random() * 100) + 1);
    y.push(v);
  }
  A.push(x);
  B.push(y);
}
i = 0;
j = 0;
var sendId = function (socket) {
  if (j > 99) {
    j = 0;
    i++;
  }
  cnt++;
  socket.emit('calculate', A[i], B[j], i, j);
  j++;
}
app.get('/', function (req, res) {
  res.sendfile('index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  clients.push(socket);
  sendId(socket);
  socket.on('disconnect', function () {
    console.log('user disconnected');
    var index = clients.indexOf(socket);
    if (index != -1) {
      clients.splice(index, 1);
      console.info('Client gone (id=' + socket.id + ').');
    }
  });
  socket.on('send me a new piece', function (ii, jj, val) {
    if (cnt == 100 * 100)
      console.log('completed!');
    sendId(socket);
  });

});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
