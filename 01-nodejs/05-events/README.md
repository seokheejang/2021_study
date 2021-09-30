# Events
Node.js 핵심 API의 대부분은 특정 종류의 객체("emitters")가 함수 객체("listeners")를 호출하는 비동기 이벤트 아키텍처 기반으로 구축되어 있다.

이벤트를 발생시키는 모든 객체는 EventEmitter 클래스의 인스턴스이며, 이벤트 객체는 eventEmitter.on() 함수로 받아 들인다. 이벤트 객체를 발생시킬 때 해당 이벤트에 연결된 모든 함수가 동기적으로 호출 된다.

* eventEmitter.on() = 리스너
* eventEmitter.emit() = 트리거
```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
myEmitter.emit('event');
```
## Passing arguments and this to listeners
eventEmitter.emit() 메서드는 인자들을 리스너 함수에 전달 가능하다. 리스너 함수에서의 this 키워드는 해당 리스너가 연결된 EventEmitter 인스턴스를 참조 중이다.
```js
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this, this === myEmitter);
  // Prints:
  //   a b MyEmitter {
  //     domain: null,
  //     _events: { event: [Function] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined } true
});
myEmitter.emit('event', 'a', 'b');
```
ES6 화살표 함수를 리스너도 사용 가능하지만 this 키워드는 작동하지 않는다.
```js
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // Prints: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
## Asynchronous vs. synchronous
emit() 이벤트 트리거는 동기적으로 동작하고 수신되는 리스너 함수는 비동기적으로 작동한다.
```js
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('this happens asynchronously');
  });
});
myEmitter.emit('event', 'a', 'b');
```
## Handling events only once
리스너 eventEmitter.on() 함수는 여러번 호출이 가능하지만 eventEmitter.once()는 딱 한번만 호출이 가능하다.
```js
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
```
## Error events
리스너는 항상 'error' 이벤트에 대해 코드를 작성하는 것을 권장한다. 만약 없다면 Node.js 프로세스 강제 종료.
```js
const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
```
## Capture rejections of promises
async로 이벤트 핸들링에 대한 방법..?

## Class: EventEmitter
### emitter.emit(eventName[, ...args])
이벤트에 대해 등록된 각 리스너를 등록된 순서대로 동기식으로 호출하고 제공된 인수를 각각에 전달한다.
```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```
### emitter.on(eventName, listener)
eventName 이벤트에 대한 리스너 배열의 끝에 리스너 함수를 추가한다. 리스너가 이미 추가되었는지 확인하기 위한 검사는 수행되지 않으며, eventName과 리스너의 동일한 조합을 전달하는 여러 번 호출하면 리스너가 여러 번 추가되고 호출된다.
```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```
기본적으로 이벤트 리스너는 추가된 순서대로 호출되지만 emitter.prependListener() 메서드를 통해 이벤트 리스너를 배열의 시작 부분에 추가하는 대안으로 사용할 수 있다.
```js
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```
### emitter.removeListener(eventName, listener)
eventName이라는 이벤트에 대한 리스너 배열에서 지정된 리스너를 제거한다.
```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```
remove는 단 한번만 실행되고 이벤트 리스너가 여러 개일 경우 여러번 실행해야 한다.
### emitter.setMaxListeners(n)
기본적으로 EventEmitter는 특정 이벤트에 대해 10개 이상의 리스너가 추가되면 경고를 출력, 무한대 까지 설정은 가능 = Infinity (or 0)
## events.errorMonitor
## events.getEventListeners(emitterOrTarget, eventName)
## events.once(emitter, name[, options])
## events.captureRejections
## events.captureRejectionSymbol
## events.listenerCount(emitter, eventName)
## events.on(emitter, eventName[, options])
## events.setMaxListeners(n[, ...eventTargets])
### Awaiting multiple events emitted on process.nextTick()
process.nextTick()는 이벤트 루프 페이즈와 관계없이 다음 페이즈로 넘어가기 전에 최대한 빨리 실행해야 할 콜백들을 저장하고 있다. MicroTaskQueue, NextTickQueue가 우선순위가 높은 작업들이 대기하는 태스크 큐이며 Promise와 같은 비동기 객체들이 있다. 두 큐중에서도 NextTickQueue가 더 높은 우선순위를 가진다. 

NextTickQueue > MicroTaskQueue > setTimeout, HttpRequest, addEventListener와 같은 비동기 함수들이 실행.
```js
const { EventEmitter, once } = require('events');

const myEE = new EventEmitter();

async function foo() {
  await once(myEE, 'bar');
  console.log('bar');

  // This Promise will never resolve because the 'foo' event will
  // have already been emitted before the Promise is created.
  await once(myEE, 'foo');
  console.log('foo');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```

```js
const { EventEmitter, once } = require('events');

const myEE = new EventEmitter();

async function foo() {
  await Promise.all([once(myEE, 'bar'), once(myEE, 'foo')]);
  console.log('foo', 'bar');
}

process.nextTick(() => {
  myEE.emit('bar');
  myEE.emit('foo');
});

foo().then(() => console.log('done'));
```
## EventTarget and Event API
### Node.js EventTarget vs. DOM EventTarget
### NodeEventTarget vs. EventEmitter
### Event listener
### EventTarget error handling
### Class: Event
### Class: EventTarget
### Class: NodeEventTarget