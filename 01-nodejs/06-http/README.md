# HTTP
Node.js는 HTTP 통신을 위해 내장 모듈인 HTTP를 사용하여서버를 생성하고 포트로 client와 메시지를 송수신한다.
```js
var http = require('http');
```
Node.js의 HTTP 모듈은 전통적으로 사용하기 어려웠던 프로토콜의 많은 기능을 지원하도록 설계되었다.

HTTP 메시지 헤더 객체 예시
```js
{ 'content-length': '123',
  'content-type': 'text/plain',
  'connection': 'keep-alive',
  'host': 'mysite.com',
  'accept': '*/*' }
```
가능한 HTTP 어플리케이션의 전체 스펙트럼을 지원하기 위해 Node.js HTTP API는 low-level 이다. 여기서는 스트림 handling과 메시지 parsing만 다룬다.

## Class
### Class: http.Agent
Agent는 HTTP client들에 대한 연결 지속성 및 재사용 관리를 담당한다.

http.get(), http.request() 함수에 대한 옵션으로 {agent: false}를 제공하면 기본 옵션이 있는 일회용 agent가 client 연결에 사용된다.
```js
http.get({
  hostname: 'localhost',
  port: 80,
  path: '/',
  agent: false  // Create a new agent just for this one request
}, (res) => {
  // Do stuff with response
});
```
#### new Agent([options])
options: agent 설정에 구성 가능한 옵션 집합
* keepAlive, keepAliveMsecs, maxSockets, maxTotalSockets, maxFreeSockets, scheduling, timeout 
```js
const http = require('http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```
#### agent.createConnection(options[, callback])
HTTP request에 사용할 소켓/스트림을 생성

### Class: http.ClientRequest
이 객체는 내부적으로 생성되고 http.request()에서 반환되고, 헤더가 이미 대기열에 있는 진행 중인 요청을 나타낸다. 헤더는 setHeader(name, value), getHeader(name), removeHeader(name) API를 사용하여 여전히 변경할 수 있다. 실제 헤더는 첫 번째 데이터 청크와 함께 또는 request.end()를 호출할 때 전송된다.

#### Event: 'abort'
client가 요청을 중단했을 때 발생하며 이 이벤트는 abort()에 대한 첫 번째 호출에서만 발생한다.

#### Event: 'connect'
서버가 CONNECT 메서드로 요청에 응답할 때마다 발생. 이 이벤트가 수신되지 않으면 CONNECT 메서드를 수신하는 client 연결이 close.

Server/client 간 'connect' 이벤트 수신 예제
```js
const http = require('http');
const net = require('net');
const { URL } = require('url');

// Create an HTTP tunneling proxy
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
proxy.on('connect', (req, clientSocket, head) => {
  // Connect to an origin server
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// Now that proxy is running
proxy.listen(1337, '127.0.0.1', () => {

  // Make a request to a tunneling proxy
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.google.com:80'
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

    // Make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.google.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

### Class: http.Server

### Class: http.ServerResponse

### Class: http.IncomingMessage

### Class: http.OutgoingMessage

## Non-Class
### http.METHODS

### http.STATUS_CODES

### http.createServer([options][, requestListener])
HTTP 서버 생성 메서드

options에는 IncomingMessage, ServerResponse, insecureHTTPParser, maxHeaderSize

requestListener는 request 이벤트에 자동으로 추가 되는 함수
```js 
// Create a server
http.createServer((request, response)=>{
   
    // Sends a chunk of the response body
    response.write('Hello World!');
   
    // Signals the server that all of
    // the response headers and body 
    // have been sent
  response.end();
})
.listen(3000); // Server listening on port 3000
```
### http.get(options[, callback])

### http.get(url[, options][, callback])

### http.globalAgent

### http.maxHeaderSize

### http.request(options[, callback])
HTTP 모듈을 통해 서버에 요청(request)하기 위한 메서드

HTTP requset를 만들기 위해 서버당 여러 connection을 유지 관리한다.
```js
const postData = JSON.stringify({
  'msg': 'Hello World!'
});

const options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(postData);
req.end();
```
http.request()를 사용하면 데이터가 없더라도 항상 요청의 끝을 나타내기 위해서는 req.end() 호출을 해야한다.
### http.request(url[, options][, callback])

### http.validateHeaderName(name)
res.setHeader(name, value)가 호출될 때 수행되는 제공된 '이름'에 대해 낮은 수준의 유효성 검사를 수행한다.

### http.validateHeaderValue(name, value)


# URL
url 모듈은 URL 확인 및 구문 분석을 위한 유틸리티를 제공한다.
```js
const url = require('url');
```

## URL strings and URL objects
URL 문자열은 의미 있는 여러 구성 요소를 포함하는 구조화된 문자열이다.
```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                              href                                              │
├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
│ protocol │  │        auth         │          host          │           path            │ hash  │
│          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
│          │  │                     │    hostname     │ port │ pathname │     search     │       │
│          │  │                     │                 │      │          ├─┬──────────────┤       │
│          │  │                     │                 │      │          │ │    query     │       │
"  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
│          │  │          │          │    hostname     │ port │          │                │       │
│          │  │          │          ├─────────────────┴──────┤          │                │       │
│ protocol │  │ username │ password │          host          │          │                │       │
├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
│   origin    │                     │         origin         │ pathname │     search     │ hash  │
├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
│                                              href                                              │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
(All spaces in the "" line should be ignored. They are purely for formatting.)
```

## The WHATWG URL API
WHATWG API를 사용한 URL 문자열 구문 파싱
```js
const myURL =
  new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```
레거시 API를 사용한 URL 문자열 구문 파싱
```js
const url = require('url');
const myURL =
  url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
```
### Class: URL
### Class: URLSearchParams
