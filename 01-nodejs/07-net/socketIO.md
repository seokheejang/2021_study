# socket.io 
https://www.npmjs.com/package/socket.io

https://socket.io/docs/v4/

WebSocket 기반의 실시간 통신 구현을 위한 node.js server/client library
* Auto-reconnection support
* Disconnection detection
* Binary support
* Cross-browser
* Multiplexing support
* Room support

Sample code:
```js
io.on('connection', socket => {
  socket.emit('request', /* … */); // emit an event to the socket
  io.emit('broadcast', /* … */); // emit an event to all connected sockets
  socket.on('reply', () => { /* … */ }); // listen to the event
});
```

## How to use
socket.io를 포트 3000에서 수신 대기하는 일반 Node.JS HTTP 서버에 연결 예제
```js
const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});
server.listen(3000);
```
### Standalone
```js
const io = require('socket.io')();
io.on('connection', client => { ... });
io.listen(3000);
```
### In conjunction with Express
```js
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => { /* … */ });
server.listen(3000);
```
