# Net
net 모듈은 스트림 기반 TCP/IPC 서버 및 클라이언트를 생성하기 위한 비동기 네트워크 API
```js
const net = require('net');
```
## IPC support
net 모듈은 Windows에서는 명명된 파이프가 있는 IPC를 지원하고 다른 운영 체제에서는 Unix 도메인 소켓을 지원
### Identifying paths for IPC connections
net.connect(), net.createConnection(), server.listen() 및 socket.connect()는 경로 매개변수를 사용하여 IPC 끝점을 식별한다.
## Class: net.BlockList
BlockList 개체는 일부 네트워크 API와 함께 사용하여 특정 IP 주소, IP 범위 또는 IP 서브넷에 대한 인바운드 또는 아웃바운드 액세스를 비활성화하는 규칙을 지정 가능
```js
const blockList = new net.BlockList();
blockList.addAddress('123.123.123.123');
blockList.addRange('10.0.0.1', '10.0.0.10');
blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

console.log(blockList.check('123.123.123.123'));  // Prints: true
console.log(blockList.check('10.0.0.3'));  // Prints: true
console.log(blockList.check('222.111.111.222'));  // Prints: false

// IPv6 notation for IPv4 addresses works:
console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Prints: true
console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Prints: true
```
## Class: net.SocketAddress
## Class: net.Server
이 클래스는 TCP 또는 IPC 서버를 만드는 데 사용된다.
### new net.Server([options][, connectionListener])
### Event: 'close'
### Event: 'connection'
### Event: 'error'
### Event: 'listening'
### server.address()
### server.close([callback])
### server.connections
### server.getConnections(callback)
### server.listen()
### server.listen(handle[, backlog][, callback])
### server.listen(options[, callback])
### server.listen(path[, backlog][, callback])
### server.listen([port[, host[, backlog]]][, callback])
### server.listening
### server.maxConnections
### server.ref()
### server.unref()
## Class: net.Socket
이 클래스는 TCP 소켓 또는 스트리밍 IPC 끝점의 추상화이다(Windows에서는 명명된 파이프를 사용하고 그렇지 않으면 Unix 도메인 소켓을 사용함). 또한 EventEmitter이다.
### new net.Socket([options])
### Event: 'close'
### Event: 'connect'
### Event: 'data'
### Event: 'drain'
쓰기 버퍼가 비어 있을 때 발생한다. 업로드를 제한하는 데 사용할 수 있다. 참조: socket.write()의 반환 값.
### Event: 'end'
### Event: 'error'
### Event: 'lookup'
### Event: 'ready'
### Event: 'timeout'
### socket.address()
### socket.bufferSize
### socket.bytesRead
### socket.bytesWritten
### socket.connect()
지정된 소켓에서 연결을 시작
### socket.connect(options[, connectListener])
지정된 소켓에서 연결을 시작. 일반적으로 이 메서드는 필요하지 않으며, net.createConnection()을 사용하여 소켓을 만들고 열어야 한다다. 사용자 정의 소켓을 구현할 때만 사용.
```js
const net = require('net');
net.connect({
  port: 80,
  onread: {
    // Reuses a 4KiB Buffer for every read from the socket.
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // Received data is available in `buf` from 0 to `nread`.
      console.log(buf.toString('utf8', 0, nread));
    }
  }
});
```
### socket.connect(path[, connectListener])
주어진 소켓에서 IPC 연결을 시작
### socket.connect(port[, host][, connectListener])
주어진 소켓에서 TCP 연결을 시작
### socket.connecting
### socket.destroy([error])
### socket.destroyed
### socket.end([data[, encoding]][, callback])
### socket.localAddress
### socket.localPort
### socket.pause()
### socket.pending
### socket.ref()
### socket.remoteAddress
### socket.remoteFamily
### socket.remotePort
### socket.resume()
### socket.setEncoding([encoding])
### socket.setKeepAlive([enable][, initialDelay])
### socket.setNoDelay([noDelay])
### socket.setTimeout(timeout[, callback])
```js
socket.setTimeout(3000);
socket.on('timeout', () => {
  console.log('socket timeout');
  socket.end();
});
```
### socket.timeout
socket.setTimeout()에 의해 설정된 소켓 시간 초과(밀리초)이다. 시간 초과가 설정되지 않은 경우 정의되지 않는다.
### socket.unref()
### socket.write(data[, encoding][, callback])
소켓에 데이터를 보낸다. 두 번째 매개변수로 문자열의 경우 인코딩을 지정할 수 있다. (기본값은 UTF8 인코딩)

전체 데이터가 커널 버퍼에 성공적으로 플러시되면 true를 반환된다. 데이터의 전체 또는 일부가 사용자 메모리에 대기 중인 경우 false를 반환한다. 버퍼가 다시 비워지면 'drian'이 발생한다.

### socket.readyState
## net.connect()
net.createConnection()에 대한 별칭
### net.connect(options[, connectListener])
### net.connect(path[, connectListener])
### net.connect(port[, host][, connectListener])
## net.createConnection()
새로운 net.Socket을 생성하는 팩토리 함수는 socket.connect()로 즉시 연결을 시작한 다음 연결을 시작하는 net.Socket을 반환한다.

연결이 설정되면 반환된 소켓에서 'connect' 이벤트가 발생한다. 마지막 매개변수인 connectListener가 제공되면 'connect' 이벤트에 대한 리스너로 한 번 추가된다.
### net.createConnection(options[, connectListener])
```js
const net = require('net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener.
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
```
### net.createConnection(path[, connectListener])
IPC 연결을 시작
### net.createConnection(port[, host][, connectListener])
TCP 연결을 시작
## net.createServer([options][, connectionListener])
새 TCP 또는 IPC 서버를 만든다.

```js
const net = require('net');
const server = net.createServer((c) => {
  // 'connection' listener.
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});
```
### net.isIP(input)
### net.isIPv4(input)
### net.isIPv6(input)